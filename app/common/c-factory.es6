(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name common.factory:C
   *
   * @description
   * Common helper functions
   */
  angular
    .module('common')
    .factory('C', C);

  function C(R) {
    let CBase = {};
    
    /* -- CONFIG ----------------------------------------------------------------------------- */
    
    let baseFontSize = 16 * 1.1;


    /* -- MAIN ------------------------------------------------------------------------------- */

    // log :: a -> a
    let log = R.curry(x => { console.log('log: ', x); return x; });

    // printError :: String -> String
    let printError = err => { console.log('Something went wrong: ', err); return err; };

    // getWindowObj :: Element -> Window
    let getWindowObj = R.compose(R.path(['ownerDocument', 'defaultView']));

    // getDocumentObj :: Element -> Document
    let getDocumentObj = R.compose(R.prop('document'), getWindowObj);

    // getState :: {a} ($injector) -> {a} (Angular Service)
    let getState = R.curry(injector => {
      if (injector.has('$route')) { 
        // if using ng-router
        return injector.get('$route'); 
      } else if (injector.has('$state')) { 
        // if using ui-router
        return injector.get('$state'); 
      }
    });

    // getCurrentState :: {a} ($injector) -> {a} (current $state)
    let getCurrentState = R.compose(R.prop('current'), getState);

    // convertEmToPx :: Float -> Float
    let convertEmToPx = R.multiply(baseFontSize);

    // getInnerText :: Element -> a
    let getInnerText = R.prop('innerText');

    // setInnerText :: String -> Element -> Element
    let setInnerText = R.curry((newInnerText, element) => { 
      element.innerText = newInnerText;
      return element; 
    });

    // getInnerHTML :: Element -> a
    let getInnerHTML = R.prop('innerHTML');

    // setInnerHTML :: String -> Element -> Element
    let setInnerHTML = R.curry((newInnerHTML, element) => { 
      element.innerHTML = newInnerHTML;
      return element; 
    });

    // getElementScope :: Element -> {a}
    let getElementScope = R.compose(R.invoker(0, 'scope'), R.apply(angular.element), R.of);

    // getClosestContainerElementByAttribute :: String -> Element -> Element
    let getClosestContainerElementByAttribute = R.curry((attributeName, element) => {
      let parentElement = element.parentNode;
      
      // return null if parent element doesn't exist or is a Document obj
      if (R.isNil(parentElement) || R.equals(9, parentElement.nodeType)) { return null; }

      if (parentElement.hasAttribute(attributeName)) { return parentElement; }

      return getClosestContainerElementByAttribute(attributeName, parentElement);
    });

    // createDeepObj :: a -> [b] -> {*}
    // This one creates a deep obj with the given value (final value at the end) and path
    let createDeepObj = R.curry((value, path) => {
      return R.compose(R.assocPath(path, value), R.reduceRight(R.flip(R.createMapEntry), {}))(path);
    });

    // mixedPath :: [a] -> {k:v} || [v] -> v || undefined
    // Same as R.path but the nodes could be a mix of array and object
    let mixedPath = R.curry((path, objOrArr) => {
      return R.reduce((prev, curr) => {
        return prev[curr];
      }, objOrArr, path);
    });

    // assocMixedPath :: [a] -> a -> {k:v} || [v] -> v || undefined
    // Same as R.assocPath but the nodes could be a mix of array and object
    let assocMixedPath = R.curry((path, val, objOrArr) => {
      let clonedObjOrArr = R.clone(objOrArr);
      R.reduce((prev, curr) => {
        if (curr !== path[path.length-1]) { return prev[curr]; }
        return prev[curr] = val;
      }, clonedObjOrArr, path);
      return clonedObjOrArr;
    });


    /* -- EXPORT ----------------------------------------------------------------------------- */

    CBase = {
      log: log,
      printError: printError,
      getWindowObj: getWindowObj,
      getDocumentObj: getDocumentObj,
      getState: getState,
      getCurrentState: getCurrentState,
      convertEmToPx: convertEmToPx,
      getInnerText: getInnerText,
      setInnerText: setInnerText,
      getInnerHTML: getInnerHTML,
      setInnerHTML: setInnerHTML,
      getElementScope: getElementScope,
      getClosestContainerElementByAttribute: getClosestContainerElementByAttribute,
      createDeepObj: createDeepObj,
      mixedPath: mixedPath,
      assocMixedPath: assocMixedPath
    };

    return CBase;
  }
}());
