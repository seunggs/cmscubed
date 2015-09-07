(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name common.directive:c3Page
   * @restrict EA
   * @element
   *
   * @description
   *
   * @example
     <example module="common">
       <file name="index.html">
        <c3-page></c3-page>
       </file>
     </example>
   *
   */
  angular
    .module('common')
    .directive('c3Page', c3Page);

  function c3Page($state, $templateCache, $window, R, $compile, $timeout) {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'common/c3-page-directive.tpl.html',
      replace: false,
      compile(tElement, tAttrs) {
        /* jshint unused:false */
        /* eslint "no-unused-vars": [2, {"args": "none"}] */

        // HELPER FUNCTIONS ///////////////////////////////////////////////////////////////////////

        // TODO: do null checks - if no elements are found, it shouldn't error out

        //////////
        // init //
        //////////

        // log :: a -> a
        let log = R.curry(x => { console.log(x); return x; });

        // wrapSpan :: String -> String
        let wrapSpan = R.compose(R.replace(/\}\}/g, '}}</span>'), R.replace(/\{\{/g, '<span>{{'));

        // convertDOMToString :: DOM -> String
        // 'inner' part is important because with outerHTML, we get infinite loop during $compile
        let convertDOMToString = R.prop('innerHTML'); 


        /////////////
        // c3-text //
        /////////////

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

        // IMPURE
        // addCmsTextAttribute :: [Element] -> SIDE EFFECT
        // get all angular expressions that contains $cms on the page
        
        let addCmsTextAttribute = R.curry(elements => {
          R.forEach(element => {
            element.setAttribute('c3-model', retrieveExpressionModel(element.innerText));
          })(elements);
        });


        ///////////////
        // c3-repeat //
        ///////////////

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
          let hasRepeatItem = R.compose(isValidRepeatItemString, log, cleanAfterSplit, R.chain(R.split(/[+*\-/%=<>^&|]/)), handleTernary, retrieveExpressionModel, R.prop('innerText'));

          return R.compose(R.filter(hasRepeatItem), getInnerMostNgExpressionElements)(repeatElement);

        });

        // IMPURE
        // addCmsRepeatAttribute :: [element] -> SIDE EFFECT
        let addCmsRepeatAttribute = R.curry(elements => {
          R.forEach(element => {
            element.setAttribute('c3-model', R.compose(retrieveExpressionModel, R.prop('innerText'))(element));
          })(elements);
        });

        // isInnerCmsRepeatElement :: Element -> Boolean
        let isInnerCmsRepeatElement;

        // getInnerCmsRepeatElements :: Element -> [Element]
        let getInnerCmsRepeatElements = R.compose(R.filter(isCmsRepeatElement), getNgRepeatElements);









        // INIT - IMPURE //////////////////////////////////////////////////////////////////////////

        // get html of this state's template from cache
        let pageHtml = $templateCache.get($state.current.templateUrl);
        pageHtml = pageHtml[0] === 200 ? pageHtml[1] : null;
        if (pageHtml === null) { return; }
        // console.log(pageHtml);

        // parse the html into DOM
        let DOMParser = new $window.DOMParser();
        let pageDOM = DOMParser.parseFromString(pageHtml, 'text/html').documentElement.childNodes[1].childNodes[0];

        // put span around every {{ }} in innerText so we can select it as elements later
        // Excludes expressions in attributes; i.e. placeholder="{{ }}"
        let ngExpressionElements = getNgExpressionElements(pageDOM);
        R.forEach(element => {
          element.innerHTML = wrapSpan(element.innerHTML);
        })(ngExpressionElements);


        // MAIN - IMPURE //////////////////////////////////////////////////////////////////////////

        /////////////
        // c3-text //
        /////////////

        let cmsExpressionElements = getCmsExpressionElements(pageDOM);
        addCmsTextAttribute(cmsExpressionElements);
        // console.log(getCmsExpressionElements(pageDOM));


        ///////////////
        // c3-repeat //
        ///////////////

        var rootCmsRepeatElements = getRootCmsRepeatElements(pageDOM);
        // console.log(rootCmsRepeatElements[2]);
        // console.log(getInnerMostNgExpressionElements(rootCmsRepeatElements[2]));
        console.log(getNgExpressionElementsWithRepeatItem(rootCmsRepeatElements[3]));

        // let cmsRepeatElements = getUnnestedCmsRepeatElements(pageDOM);
        // cmsRepeatElements.forEach(element => {
        //   element.setAttribute('c3-model', retrieveCmsRepeatModel(element) + '[{{$index}}]');
        // });

        // console.log(cmsRepeatElements);

        

        //////////////////
        // compile page //
        //////////////////

        let finalPageHtml = convertDOMToString(pageDOM);
        // console.log(finalPageHtml);

        return {
          pre(scope, element, attrs) {
            let compiled = $compile(finalPageHtml)(scope.$parent);
            element.append(compiled);
          },
          post(scope, element, attrs) {
            $timeout(() => {
              // console.log(element[0].innerHTML);
            }, 0);
          }
        };
      }
    };

  }
}());
