(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name common.directive:c3
   * @restrict EA
   * @element
   *
   * @description
   *
   * @example
     <example module="common">
       <file name="index.html">
        <c3></c3>
       </file>
     </example>
   *
   */
  angular
    .module('common')
    .directive('c3', c3);

  function c3(R) {
    return {
      restrict: 'A',
      scope: {
        c3Model: '=?',
        c3RepeatModel: '=?'
      },
      templateUrl: 'common/c3-directive.tpl.html',
      controllerAs: 'c3',
      controller() {
        /* jshint unused:false */
        /* eslint "no-unused-vars": [2, {"args": "none"}] */
        let vm = this;

        vm.openBubble = () => { vm.bubbleVisible = true; };
        vm.closeBubble = () => { vm.bubbleVisible = false; };
      },
      link(scope, element, attrs) {
        /* jshint unused:false */
        /* eslint "no-unused-vars": [2, {"args": "none"}] */

        // PURE /////////////////////////////////////////////////////////////////////////////////

        // getOriginalScopeValueElement :: Element (directive root) -> Element
        // get the new element where original scope value is placed
        let getOriginalScopeValueElement = R.compose(R.invoker(1, 'querySelectorAll')('.c3-original-scope-value'), R.head);


        // INIT /////////////////////////////////////////////////////////////////////////////////
        
        let originalScopeValueElement = getOriginalScopeValueElement(element);


        // MAIN /////////////////////////////////////////////////////////////////////////////////

        if (!scope.c3Model) { return; }

        scope.$watch('c3Model', (newVal, oldVal) => {
          angular.element(originalScopeValueElement).html(newVal);
        });
        
        // console.log('scope.c3Model: ', scope.c3Model);

      }
    };
  }
}());
