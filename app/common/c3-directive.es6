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

  function c3(R, C3, C, Socket) {
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

        let c3PageName = R.compose(C3.getC3PageName, C.getDocumentObj, R.head)($element);
        let c3FieldName = R.compose(C3.getC3FieldName, R.head)($element);

        C3.loadContent(c3PageName, c3FieldName)
          .then(res => {
            console.log(res);
            // TODO: If it's an array element it needs to populate the whole array
            // TODO: This breaks if the returned res has nothing in it
            let initialContent = angular.fromJson(res).data[0].content;
            $scope.c3Model = initialContent;
          })
          .catch(C.printError);

        let fieldData = R.compose(C3.getC3FieldData(c3PageName, c3FieldName), R.head)($element);


        /* -- MAIN - IMPURE ------------------------------------------------------------------ */

        vm.openBubble = () => { vm.bubbleVisible = true; };
        vm.closeBubble = () => { vm.bubbleVisible = false; };

        vm.submit = () => {
          fieldData = R.compose(C3.getC3FieldData(c3PageName, c3FieldName), R.head)($element);
          console.log('fieldData: ', fieldData);
          Socket.emit('field update', fieldData);          
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
