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

  function c3(R, C3, C, C3Page, Socket) {
    return {
      restrict: 'A',
      scope: {
        c3Model: '=?',
      },
      templateUrl: 'common/c3-directive.tpl.html',
      controllerAs: 'c3',
      controller($element, $scope) {
        /* jshint unused:false */
        /* eslint "no-unused-vars": [2, {"args": "none"}] */
        
        let vm = this;

        /* -- INIT - IMPURE ------------------------------------------------------------------ */

        let c3PageName = R.compose(C3Page.getC3PageName, R.head)($element);


        /* -- MAIN - IMPURE ------------------------------------------------------------------ */

        vm.openBubble = () => { vm.bubbleVisible = true; };
        vm.closeBubble = () => { vm.bubbleVisible = false; };

        vm.submit = val => {
          let fieldData = R.compose(C3.getC3FieldData(c3PageName, val), R.head)($element);
          // console.log('fieldData: ', fieldData);
          Socket.emit('field update', fieldData);
          vm.closeBubble();
        };

      },
      link(scope, element, attrs) {
        /* jshint unused:false */
        /* eslint "no-unused-vars": [2, {"args": "none"}] */

        /* -- INIT --------------------------------------------------------------------------- */
        
        let originalScopeValueElement = R.compose(C3.getOriginalScopeValueElement, R.head)(element);


        /* -- MAIN - IMPURE ------------------------------------------------------------------ */

        if (!scope.c3Model) { return; }

        scope.$watch('c3Model', (newVal, oldVal) => {
          angular.element(originalScopeValueElement).html(newVal);
        });

      }
    };
  }
}());
