(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name common.factory:C3PageService
   *
   * @description
   *
   */
  angular
    .module('common')
    .factory('C3PageService', C3PageService);

  function C3PageService(R) {
    let C3PageServiceBase = {};

    // init ////////////////////////////////////////////////////////////////////////////////////////////////

    // log :: a -> a
    // let log = R.curry(x => { console.log(x); return x; });

    // wrapSpan :: String -> String
    let wrapSpan = R.compose(R.replace(/\}\}/g, '}}</span>'), R.replace(/\{\{/g, '<span>{{'));

    // convertDOMToString :: DOM -> String
    // 'inner' part is important because with outerHTML, we get infinite loop during $compile
    let convertDOMToString = R.prop('innerHTML'); 


    // c3-text /////////////////////////////////////////////////////////////////////////////////////////////
    
    // hasNgExpressionInInnerText :: Element -> Boolean
    let hasNgExpressionInInnerText = R.and(R.compose(R.gt(R.__, -1), R.indexOf('{{'), R.prop('innerText')), R.compose(R.gt(R.__, -1), R.indexOf('{{'), R.prop('innerText')));

    // hasNoChildren :: Element -> Boolean
    let hasNoChildren = R.pathEq(['children', 'length'], 0);

    // getAllElements :: Element -> [Element]
    let getAllElements = R.curry(element => { return element.querySelectorAll('*'); });

    // getNgExpressionElements :: Element -> [Element]
    // Only gets {{ }} in innerText and excludes {{ }} in attributes; i.e. placeholder="{{ }}"
    let getNgExpressionElements = R.compose(R.filter(hasNgExpressionInInnerText), getAllElements);

    // getInnerMostNgExpressionElements :: Element -> [Element]
    // This is to avoid getting same element multiple times
    // i.e. <p>{{a}} <span>{{b}}</span></p> would return 3 matching ng expressions instead of 2
    let getInnerMostNgExpressionElements = R.compose(R.filter(hasNoChildren), getNgExpressionElements);

    // hasCmsExpressionInInnerText :: Element -> Boolean
    let hasCmsExpressionInInnerText = R.compose(R.gt(R.__, -1), R.indexOf('$cms'), R.prop('innerText'));

    // getCmsExpressionElements :: Element -> [Element]
    let getCmsExpressionElements = R.compose(R.filter(hasCmsExpressionInInnerText), getInnerMostNgExpressionElements);

    // retrieveExpressionModel :: String (angular expression) -> String
    let retrieveExpressionModel = R.compose(R.trim, R.replace('{{', ''), R.replace('}}', ''));

    ////////////
    // IMPURE //
    ////////////

    // setC3ModelAttribute :: Element -> SIDE EFFECT
    let setC3ModelAttribute = R.curry(element => {
      element.setAttribute('c3', '');
      element.setAttribute('c3-model', R.compose(retrieveExpressionModel, R.prop('innerText'))(element));
    });

    // addCmsTextAttribute :: [Element] -> SIDE EFFECT
    let addCmsTextAttribute = R.curry(elements => {
      R.forEach(element => {
        setC3ModelAttribute(element);
        element.setAttribute('style', 'position: relative');
      })(elements);
    });


    // c3-repeat ///////////////////////////////////////////////////////////////////////////////////////////

    // Naming conventions: 
    // ngRepeatValue => 'repeatItem in repeatModel'
    // If array => repeatItem in repeatModel; if obj => (repeatItemKey, repeatItemValue) in RepeatModel
    
    // getNgRepeatElements :: Element -> [Element]
    let getNgRepeatElements = R.curry(element => { return element.querySelectorAll('[ng-repeat]'); });

    // retrieveNgRepeatValue :: Element -> String
    let retrieveNgRepeatValue = R.curry(element => { return element.getAttribute('ng-repeat'); });

    // containsCms :: String -> Boolean
    let containsCms = R.compose(R.gt(R.__, -1), R.indexOf('$cms'));

    // isCmsRepeatElement :: Element -> Boolean
    let isCmsRepeatElement = R.compose(containsCms, retrieveNgRepeatValue);

    // getRootCmsRepeatElements :: Element -> [Element]
    let getRootCmsRepeatElements = R.compose(R.filter(isCmsRepeatElement), getNgRepeatElements);

    // cleanAfterSplit :: [String] -> [String]
    let cleanAfterSplit = R.compose(R.map(R.trim), R.reject(R.isEmpty));

    // retrieveRepeatItemKey :: String (ng-repeat value) -> String
    let retrieveRepeatItemKey = R.compose(R.head, cleanAfterSplit, R.split(','), R.trim, R.replace(')', ''), R.replace('(', ''), R.head, cleanAfterSplit, R.split(' in '));

    // retrieveRepeatItemValue :: String (ng-repeat value) -> String
    let retrieveRepeatItemValue = R.compose(R.last, cleanAfterSplit, R.split(','), R.trim, R.replace(')', ''), R.replace('(', ''), R.head, cleanAfterSplit, R.split(' in '));

    // retrieveRepeatModel :: String (ng-repeat value) -> String
    let retrieveRepeatModel = R.compose(R.trim, R.head, R.reject(R.isEmpty), R.split(' '), R.trim, R.last, R.split(' in '));

    // getNgExpressionElementsWithRepeatItem :: Element (repeat element) -> [Element]
    let getNgExpressionElementsWithRepeatItem = R.curry(repeatElement => {

      let repeatValue = retrieveNgRepeatValue(repeatElement);
      
      let repeatItemKeyString = retrieveRepeatItemKey(repeatValue);
      let repeatItemValueString = retrieveRepeatItemValue(repeatValue);

      // startsWithItemString :: String -> Boolean
      let startsWithItemString = R.either(R.compose(R.equals(0), R.indexOf(repeatItemValueString)), R.compose(R.equals(0), R.indexOf(repeatItemKeyString)));

      // endsWithObjNotationOrSpace :: String -> Boolean
      let endsWithObjNotationOrSpace = R.compose(R.either(R.equals(repeatItemValueString), R.equals(repeatItemKeyString)), R.head, cleanAfterSplit, R.split(/[\s.\[]/));

      // isValidRepeatItemString :: [String] -> Boolean
      let isValidRepeatItemString = R.allPass([R.any(startsWithItemString), R.any(endsWithObjNotationOrSpace)]);

      // handleTernary :: String -> [String]
      let handleTernary = R.compose(cleanAfterSplit, R.split(':'), R.last, cleanAfterSplit, R.split('?'));

      // hasRepeatItem :: Element -> Boolean
      let hasRepeatItem = R.compose(isValidRepeatItemString, cleanAfterSplit, R.chain(R.split(/[+*\-/%=<>^&|]/)), handleTernary, retrieveExpressionModel, R.prop('innerText'));

      return R.compose(R.filter(hasRepeatItem), getInnerMostNgExpressionElements)(repeatElement);

    });

    // isInnerCmsRepeatElement :: String -> Element -> Boolean
    let isInnerCmsRepeatElement = R.curry((outerRepeatElementItemValue, element) => {
      return R.compose(R.equals(outerRepeatElementItemValue), retrieveRepeatModel, retrieveNgRepeatValue)(element);
    });

    // getInnerCmsRepeatElements :: Element -> [Element]
    let getInnerCmsRepeatElements = R.curry(element => {
      let outerRepeatElementItemValue = R.compose(retrieveRepeatItemValue, retrieveNgRepeatValue)(element);
      return R.compose(R.filter(isInnerCmsRepeatElement(outerRepeatElementItemValue)), getNgRepeatElements)(element);
    });

    ////////////
    // IMPURE //
    ////////////

    // setC3RepeatAttribute :: Element -> SIDE EFFECT
    let setC3RepeatAttribute = R.curry((rootCmsRepeatElement, element) => {
      element.setAttribute('c3-root-repeat', R.compose(retrieveRepeatModel, retrieveNgRepeatValue)(rootCmsRepeatElement));
    });

    let cmsRepeatElements = [];

    // addCmsRepeatAttribute :: [Element] -> SIDE EFFECT
    let addCmsRepeatAttribute = R.curry(elements => {
      R.forEach(element => {
        cmsRepeatElements = R.append(element, cmsRepeatElements);
        let ngExpressionElementsWithRepeatItem = getNgExpressionElementsWithRepeatItem(element);
        R.forEach(element => {
          setC3ModelAttribute(element);
          element.setAttribute('style', 'position: relative');
          
          let rootCmsRepeatElement = R.head(cmsRepeatElements);
          setC3RepeatAttribute(rootCmsRepeatElement, element);
        })(ngExpressionElementsWithRepeatItem);

        let innerCmsRepeatElements = getInnerCmsRepeatElements(element);
        if (innerCmsRepeatElements.length > 0) {
          addCmsRepeatAttribute(innerCmsRepeatElements);
        }
      })(elements);
    });

    // getAllCmsElements :: Element (page DOM) -> [Element]
    // let getAllCmsElements = R.curry(element => { return element.querySelectorAll('[c3-model]'); });

    // IMPURE
    // appendInputElements :: Element (page DOM) -> SIDE EFFECT
    // let appendInputElements = R.curry(element => {
    //   let allCmsElements = getAllCmsElements(element);
    //   console.log(allCmsElements);
    //   R.forEach(element => {
    //     var c3Model = R.compose(retrieveExpressionModel, R.prop('innerText'))(element);
    //     var inputElementString = `
    //     `;

    //     element.outerHTML += inputElementString;
    //   })(allCmsElements);
    // });


    // export //////////////////////////////////////////////////////////////////////////////////////////////
    
    C3PageServiceBase = {
      wrapSpan: wrapSpan,
      convertDOMToString: convertDOMToString,
      getNgExpressionElements: getNgExpressionElements,
      getCmsExpressionElements: getCmsExpressionElements,
      addCmsTextAttribute: addCmsTextAttribute,
      getRootCmsRepeatElements: getRootCmsRepeatElements,
      addCmsRepeatAttribute: addCmsRepeatAttribute
      // appendInputElements: appendInputElements
    };

    return C3PageServiceBase;
  }
}());
