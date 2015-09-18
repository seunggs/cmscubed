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
    
    // CONFIG ////////////////////////////////////////////////////////////////////////////////////
    
    let baseFontSize = 17.6;

    // MAIN //////////////////////////////////////////////////////////////////////////////////////

    // getWindowObj :: Element -> Window
    let getWindowObj = R.compose(R.path(['ownerDocument', 'defaultView']));

    // getDocumentObj :: Element -> Document
    let getDocumentObj = R.compose(R.prop('document'), getWindowObj);

    // convertEmToPx :: Float -> Float
    let convertEmToPx = R.multiply(baseFontSize);

    // setInnerText :: String -> Element -> Element
    let setInnerText = R.curry((newInnerText, element) => { 
      element.innerText = newInnerText;
      return element; 
    });

    // setInnerHTML :: String -> Element -> Element
    let setInnerHTML = R.curry((newInnerHTML, element) => { 
      element.innerHTML = newInnerHTML;
      return element; 
    });

    // getClosestContainerElementByAttribute :: String (attribute name) -> Element -> Element
    let getClosestContainerElementByAttribute = R.curry((attributeName, element) => {
      console.log(element);
      if (!element.hasAttribute(attributeName)) {
        if (element.parentNode !== null) {
          return getClosestContainerElementByAttribute(attributeName, element.parentNode);
        }
        return null;
      } 
      return element;
    });

    CBase = {
      getWindowObj: getWindowObj,
      getDocumentObj: getDocumentObj,
      convertEmToPx: convertEmToPx,
      setInnerText: setInnerText,
      setInnerHTML: setInnerHTML,
      getClosestContainerElementByAttribute: getClosestContainerElementByAttribute
    };
    return CBase;
  }
}());
