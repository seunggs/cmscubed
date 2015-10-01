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

  function c3Page($injector, $templateCache, $window, R, $compile, $timeout, C3Page, $rootScope, C) {
    return {
      restrict: 'A',
      scope: {},
      templateUrl: 'common/c3-page-directive.tpl.html',
      controllerAs: 'c3Page',
      controller($element, $scope) {
        /* jshint unused:false */
        /* eslint "no-unused-vars": [2, {"args": "none"}] */

        let vm = this;

        /* -- INIT - IMPURE ------------------------------------------------------------------- */

        // TODO: add loading and page block with overlay until vm.pageReady is true (which happens when content is loaded from DB)
        vm.pageReady = false;

        let c3PageName = R.compose(C3Page.getC3PageName, R.head)($element);
        let c3PageControllerName = C3Page.getC3PageControllerName($injector);

        // TODO: save the page's entire scope if the entry doesn't already exist in DB
        C3Page.initC3PageContent($injector, c3PageName, R.head($element))
          .then(dbRes => {
            console.log('init page dbRes: ', dbRes);
          })
          .catch(C.printError);


        /* -- MAIN - IMPURE ------------------------------------------------------------------- */

        // Load content from DB
        C3Page.getC3PageContent(c3PageName)
          .then(res => {
            let pageContent = angular.fromJson(res).data[0];
            console.log('pageContent: ', pageContent);
            
            if (!R.isNil(pageContent)) {
              // TODO: Is this the best way to handle this? Will using $parent work on nested controllers (i.e. ng-include)?
              // overwrite the page scope with content from db
              $scope.$parent[c3PageControllerName] = pageContent.content[c3PageControllerName];
            }

            vm.pageReady = true;
          })
          .catch(C.printError);

      },
      compile(tElement, tAttrs) {
        /* jshint unused:false */
        /* eslint "no-unused-vars": [2, {"args": "none"}] */

        /* -- INIT - IMPURE ------------------------------------------------------------------- */

        // Get html of this state's template from cache
        // This is required to grab the expression scope names from markup
        let pageHtml = C3Page.getPageHtml($templateCache, $injector);
        if (pageHtml === null) { return; }
        // console.log(pageHtml);

        // parse the html into DOM to make it easier to manipulate the markup
        let DOMParser = new $window.DOMParser();
        let pageDOM = DOMParser.parseFromString(pageHtml, 'text/html').documentElement.childNodes[1].childNodes[0];

        // Put span around every {{ }} in innerText so we can select it as elements later
        // Excludes expressions in attributes; i.e. placeholder="{{ }}"
        let ngExpressionElements = C3Page.getNgExpressionElements(pageDOM);
        R.forEach(element => {
          element.innerHTML = C3Page.wrapSpan(element.innerHTML);
        })(ngExpressionElements);


        /* -- MAIN - IMPURE ------------------------------------------------------------------- */

        /////////////
        // c3-text //
        /////////////

        let c3ExpressionElements = C3Page.getCmsExpressionElements(pageDOM);
        c3ExpressionElements.forEach(element => {
          C3Page.addCmsTextAttribute(element);
        });
        // console.log(C3Page.getCmsExpressionElements(pageDOM));


        ///////////////
        // c3-repeat //
        ///////////////

        let rootCmsRepeatElements = C3Page.getRootCmsRepeatElements(pageDOM);
        rootCmsRepeatElements.forEach(element => {
          C3Page.setC3RootRepeatAttribute(element);
          C3Page.addCmsRepeatAttribute(element);
        });
        // console.log(rootCmsRepeatElements);


        //////////////////
        // compile page //
        //////////////////

        let finalPageHtml = C3Page.convertDOMToString(pageDOM);
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
