(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name common.directive:contenteditable
   * @restrict EA
   * @element
   *
   * @description
   *
   * @example
     <example module="common">
       <file name="index.html">
        <contenteditable></contenteditable>
       </file>
     </example>
   *
   */
  angular
    .module('common')
    .directive('contenteditable', contenteditable);

  function contenteditable($sce) {
    return {
      restrict: 'A',
      require: '?ngModel',
      link(scope, element, attrs, ngModelCtrl) {
        /* jshint unused:false */
        /* eslint "no-unused-vars": [2, {"args": "none"}] */

        // Write data to the model
        let read = () => { 
          var html = element.html();
          console.log('html: ', element[0].innerHTML);
          // console.log('html parsed: ', html.);
          // When we clear the content editable the browser leaves a <br> behind
          // If strip-br attribute is provided then we strip this out
          if (attrs.stripBr && html === '<br>') {
            html = '';
          }
          ngModelCtrl.$setViewValue(html);
        };

        // Specify how UI should be updated
        ngModelCtrl.$render = () => {
          element.html($sce.getTrustedHtml(ngModelCtrl.$viewValue || ''));
        };

        // Listen for change events to enable binding
        element.on('blur keyup change', function() {
          scope.$apply(read);
        });
      }
    };
  }
}());
