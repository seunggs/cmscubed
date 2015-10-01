(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name common.factory:C3
   *
   * @description
   *
   */
  angular
    .module('common')
    .factory('C3', C3);

  function C3(R, C, C3Page) {
    let C3Base = {};

    /* -- COMMON ----------------------------------------------------------------------- */

    // getOriginalScopeValueElement :: Element (directive root) -> Element
    // get the new element where original scope value is placed
    let getOriginalScopeValueElement = R.invoker(1, 'querySelectorAll')('.c3-original-scope-value');


    /* -- c3-text ---------------------------------------------------------------------- */

    // hasC3TextAttr :: Element -> Boolean
    let hasC3TextAttr = R.compose(R.not, R.isNil, R.invoker(1, 'getAttribute')('c3-text'));

    // getC3TextModelName :: Element -> String
    let getC3TextModelName = R.compose(R.invoker(1, 'getAttribute')('c3-model'));

    // getC3TextModelPath :: Element -> [a]
    let getC3TextModelPath = R.compose(R.split('.'), getC3TextModelName);

    // createC3TextFieldObj :: a -> Element -> {a}
    let createC3TextFieldObj = R.curry((val, element) => {
      console.log(val);
      let value = val;
      let path = getC3TextModelPath(element);
      return C.createDeepObj(value, path);
    });


    /* -- c3-repeat -------------------------------------------------------------------- */

    // hasC3RootRepeatModelAttr :: Element -> Boolean
    let hasC3RootRepeatModelAttr = R.compose(R.not, R.isNil, R.invoker(1, 'getAttribute')('c3-root-repeat-model'));

    // getC3RootRepeatModelName :: Element -> String
    // i.e. home.$cms.list
    let getC3RootRepeatModelName = R.compose(R.invoker(1, 'getAttribute')('c3-root-repeat-model'));

    // getC3RootRepeatModelNamePath :: Element -> [a]
    let getC3RootRepeatModelNamePath = R.compose(R.split('.'), getC3RootRepeatModelName);

    // getC3RootRepeatElement :: Element -> Element
    let getC3RootRepeatElement = C.getClosestContainerElementByAttribute('c3-root-repeat');

    // getOldC3RootRepeatModelValue :: Element -> a
    let getOldC3RootRepeatModelValue = R.curry(element => {
      let c3RootRepeatModelNamePath = getC3RootRepeatModelNamePath(element);
      return R.compose(R.path(c3RootRepeatModelNamePath), C.getElementScope, getC3RootRepeatElement)(element);
    });

    // getC3RepeatCurrentIndex :: Element -> Integer
    // Retrieve the index of the current repeat element if array or key if obj
    let getC3RepeatCurrentIndex = R.compose(R.ifElse(R.has('key'), R.prop('key'), R.prop('$index')), C.getElementScope);

    // isParentRepeatElement :: Element -> Element -> Boolean
    let isParentRepeatElement = R.curry((childElement, thisElement) => {
      // if thisElement is null, it means it's the outermost element so return false
      if (R.isNil(thisElement)) { return false; }

      let childNgRepeatValue = C3Page.retrieveNgRepeatValue(childElement);
      let thisNgRepeatValue = C3Page.retrieveNgRepeatValue(thisElement);

      // if childNgRepeatValue is null, it means it's the innermost element so give it a pass
      if (R.isNil(childNgRepeatValue)) { return true; } 

      return C3Page.retrieveRepeatModel(childNgRepeatValue) === C3Page.retrieveRepeatItemValue(thisNgRepeatValue);
    });

    // getParentRepeatElement :: Element -> Element
    let getParentRepeatElement = R.curry(element => {
      return R.compose(R.ifElse(isParentRepeatElement(element), R.identity, R.always(null)), C.getClosestContainerElementByAttribute('ng-repeat'))(element);
    });

    // getC3RepeatItemPath :: Element -> [a]
    // Get the path of the individual entry inside nested repeat elements; i.e. ['a', 0]
    let c3RepeatCurrentIndexList = [];
    let getC3RepeatItemPath = R.curry(element => {      
      let parentRepeatElement = getParentRepeatElement(element);
      if (R.isNil(parentRepeatElement)) { return c3RepeatCurrentIndexList; }

      let c3RepeatCurrentIndex = getC3RepeatCurrentIndex(parentRepeatElement);
      c3RepeatCurrentIndexList = R.prepend(c3RepeatCurrentIndex, c3RepeatCurrentIndexList);

      return getC3RepeatItemPath(parentRepeatElement);
    });

    // getNewC3RootRepeatModelValue :: a -> Element -> *
    let getNewC3RootRepeatModelValue = R.curry((val, element) => {
      let c3RepeatItemPath = getC3RepeatItemPath(element);
      return R.compose(C.assocMixedPath(c3RepeatItemPath, val), getOldC3RootRepeatModelValue)(element);
    });

    // createC3RootRepeatFieldObj :: a -> Element -> {a}
    // Only the specific path to the root repeat scope obj (i.e. home.cms$.list)
    let createC3RootRepeatFieldObj = R.curry((val, element) => {
      let value = getNewC3RootRepeatModelValue(val, element);
      let path = getC3RootRepeatModelNamePath(element);
      return C.createDeepObj(value, path);
    });


    /* -- c3 content ------------------------------------------------------------------- */

    // getC3FieldContent :: a -> Element -> {a}
    let getC3FieldContent = R.curry((val, element) => {
      return R.cond([
        [hasC3TextAttr, createC3TextFieldObj(val)],
        [hasC3RootRepeatModelAttr, createC3RootRepeatFieldObj(val)]
      ])(element);
    });

    // getC3FieldData :: String -> a -> Element -> {a}
    // Compose an object to be uploaded to the DB
    let getC3FieldData = R.curry((page, val, element) => {
      return {
        page: page,
        content: getC3FieldContent(val, element)
      };
    });


    /* -- EXPORT ----------------------------------------------------------------------- */

    C3Base = {
      getOriginalScopeValueElement: getOriginalScopeValueElement,
      getC3FieldData: getC3FieldData
    };

    return C3Base;
  }
}());
