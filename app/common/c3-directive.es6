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

  function c3() {
    return {
      restrict: 'A',
      scope: {
        c3Model: '='
      },
      templateUrl: 'common/c3-directive.tpl.html',
      replace: false,
      transclude: true,
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

        // let textareaElement = element[0].getElementsByTagName('textarea');
        // textareaElement[0].setAttribute('ng-model', attrs.c3Model);

        // if (attrs.c3RootRepeat !== undefined) {
        //   textareaElement[0].setAttribute('c3-repeat-model', attrs.c3RootRepeat);
        // }
      }
    };
  }
}());
