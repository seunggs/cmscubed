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

  function C3(R, C, $http, Config) {
    let C3Base = {};

    /* -- COMMON ----------------------------------------------------------------------- */

    // getOriginalScopeValueElement :: Element (directive root) -> Element
    // get the new element where original scope value is placed
    let getOriginalScopeValueElement = R.invoker(1, 'querySelectorAll')('.c3-original-scope-value');

    // getC3PageName :: Document -> String
    let getC3PageName = R.compose(R.invoker(1, 'getAttribute')('c3-page'), R.head, R.invoker(1, 'querySelectorAll')('[c3-page]'));

    // getC3PageElement :: Element -> Element
    let getC3PageElement = R.compose(R.head, R.invoker(1, 'querySelectorAll')('[c3-page]'), C.getDocumentObj);

    // getC3PageScope :: Element -> {a}
    let getC3PageScope = R.compose(R.invoker(0, 'scope'), R.apply(angular.element), R.of, getC3PageElement);


    /* -- c3-text ---------------------------------------------------------------------- */

    // hasC3TextAttr :: Element -> Boolean
    let hasC3TextAttr = R.compose(R.not, R.isNil, R.invoker(1, 'getAttribute')('c3-text'));

    // getC3TextModelName :: Element -> String
    let getC3TextModelName = R.compose(R.invoker(1, 'getAttribute')('c3-model'));

    // getC3TextModelPath :: Element -> String
    let getC3TextModelPath = R.compose(R.split('.'), getC3TextModelName);

    // getC3TextModelValue :: Element -> a
    let getC3TextModelValue = R.curry(element => {
      let c3TextModelPath = getC3TextModelPath(element);
      return R.compose(R.path(c3TextModelPath), getC3PageScope)(element);
    });


    /* -- c3-repeat -------------------------------------------------------------------- */

    // hasC3RootRepeatModelAttr :: Element -> Boolean
    let hasC3RootRepeatModelAttr = R.compose(R.not, R.isNil, R.invoker(1, 'getAttribute')('c3-root-repeat-model'));

    // getC3RootRepeatModelName :: Element -> String
    let getC3RootRepeatModelName = R.compose(R.invoker(1, 'getAttribute')('c3-root-repeat-model'));

    // // getC3RootRepeatElement :: Element -> Element
    // let getC3RootRepeatElement = C.getClosestContainerElementByAttribute('c3-root-repeat');

    // getC3RootRepeatModelPath :: Element -> [a]
    let getC3RootRepeatModelPath = R.compose(R.split('.'), getC3RootRepeatModelName);

    // getC3RootRepeatModelValue :: Element -> {a} || [a] 
    // Get root repeat element's scope value to use as field content (i.e. instead of individual values, get the root array)
    let getC3RootRepeatModelValue = R.curry(element => {
      let c3RootRepeatModelPath = getC3RootRepeatModelPath(element);
      return R.compose(R.path(c3RootRepeatModelPath), getC3PageScope)(element);
    });


    /* -- c3 content ------------------------------------------------------------------- */

    // getC3ModelName = Element -> String
    let getC3ModelName = R.curry(element => {
      return R.cond([
        [hasC3TextAttr, getC3TextModelName],
        [hasC3RootRepeatModelAttr, getC3RootRepeatModelName]
      ])(element);
    });

    // getC3FieldName :: Element -> String
    // Take out $cms prefix and whatever is before it - i.e. home.$cms.text -> text
    let getC3FieldName = R.compose(R.last, R.split('$cms.'), getC3ModelName);

    // getC3FieldContent :: Element -> a
    let getC3FieldContent = R.curry(element => {
      return R.cond([
        [hasC3TextAttr, getC3TextModelValue],
        [hasC3RootRepeatModelAttr, getC3RootRepeatModelValue]
      ])(element);
    });

    // getC3FieldData :: String -> String -> Element -> {a}
    // Compose an object to be uploaded to the DB
    let getC3FieldData = R.curry((page, field, element) => {
      return {
        page: page,
        field: field,
        content: getC3FieldContent(element)
      };
    });

    // loadContent :: String -> String -> Promise
    let loadContent = R.curry((page, field) => {
      return $http.get(Config.hostName + '/api/content/' + page + '/' + field);
    });


    /* -- EXPORT ----------------------------------------------------------------------- */

    C3Base = {
      getOriginalScopeValueElement: getOriginalScopeValueElement,
      getC3PageName: getC3PageName,
      getC3FieldName: getC3FieldName,
      getC3FieldData: getC3FieldData,
      loadContent: loadContent
    };

    return C3Base;
  }
}());
