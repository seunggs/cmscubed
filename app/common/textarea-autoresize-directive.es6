(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name common.directive:textareaAutoresize
   * @restrict EA
   * @element
   *
   * @description
   *
   * @example
     <example module="common">
       <file name="index.html">
        <textarea-autoresize></textarea-autoresize>
       </file>
     </example>
   *
   */
  angular
    .module('common')
    .directive('textareaAutoresize', textareaAutoresize);

  function textareaAutoresize($window, R, C, $timeout, TextareaAutoresize) {
    return {
      restrict: 'E',
      scope: {
        c3Model: '=ngModel'
      },
      templateUrl: 'common/textarea-autoresize-directive.tpl.html',
      replace: true,
      require: ['^c3'],
      controllerAs: 'textareaAutoresize',
      controller() {
        let vm = this;
      },
      link(scope, element, attrs, ctrls) {
        /* jshint unused:false */
        /* eslint "no-unused-vars": [2, {"args": "none"}] */

        /* -- CONFIG ------------------------------------------------------------------------------ */

        let c3Ctrl = ctrls[0];

        let keycodes = {
          delete: 8,
          enter: 13,
          esc: 27,
          tab: 9
        };


        /* -- INIT - IMPURE ------------------------------------------------------------------------- */

        let clickedElement = R.compose(TextareaAutoresize.getClickedElement, R.head)(element);
        let bubbleElement = R.compose(TextareaAutoresize.getBubbleElement, R.head)(element);
        let textareaElement = R.compose(TextareaAutoresize.getTextareaElement, R.head)(element);
        let measurementElement = R.compose(TextareaAutoresize.getMeasurementElement, R.head)(element);

        // Set invisible span element text for use in measuring width and height of text in textarea
        // and then set max width for the measurement element
        C.setInnerHTML(scope.ngModel)(measurementElement);
        TextareaAutoresize.setMeasurementElementMaxWidth(measurementElement);

        // if the clicked element is SPAN or P, set medium editor to single line input only
        TextareaAutoresize.setMediumEditorOptions(textareaElement);


        /* -- MAIN - IMPURE ------------------------------------------------------------------------- */
        
        // console.log(element);
        // console.log(textareaElement);

        // Keydown deals with textarea submit events
        angular.element(textareaElement).on('keydown', event => {
          switch (event.which) {
            case keycodes.enter: 
              // submit on cmd + enter
              break;
            case keycodes.esc:
              c3Ctrl.closeBubble();
              scope.$apply();
              break;
          }
        });

        // Adjust textarea width/height on every ng-model change - only when bubble is open
        scope.$watch('$parent.c3.bubbleVisible', (newVal, oldVal) => {
          if (newVal === true) {
            // Timeout required to wait until reflow process ends and getBoundingClientRect is available
            $timeout(() => {
              // Set focus to textarea and put the cursor at the end of the content
              TextareaAutoresize.setCursorToEnd(textareaElement);

              // TODO: click outside the bubble to close the bubble

              scope.$watch('c3Model', (newVal, oldVal) => {
                console.log('watch ran - new val:', newVal);

                // adjust span element text
                TextareaAutoresize.setMeasurementElementInnerHTML(newVal, measurementElement);

                // set width and height of the textarea
                TextareaAutoresize.setTextareaWidth(textareaElement);
                TextareaAutoresize.setTextareaHeight(textareaElement);

                // set bubble position and orientation (including the bubble tip and editor)
                TextareaAutoresize.setRelativeBubblePosition(bubbleElement);
              });
            },0);
          }
        });


      }
    };
  }
}());
