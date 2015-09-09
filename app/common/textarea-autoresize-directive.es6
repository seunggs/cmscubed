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

  function textareaAutoresize($window, R) {
    return {
      restrict: 'A',
      scope: {
        ngModel: '='
      },
      templateUrl: 'common/textarea-autoresize-directive.tpl.html',
      replace: true,
      require: 'ngModel',
      controllerAs: 'textareaAutoresize',
      controller() {
        let vm = this;
        vm.name = 'textareaAutoresize';
      },
      link(scope, element, attrs) {
        /* jshint unused:false */
        /* eslint "no-unused-vars": [2, {"args": "none"}] */

        // CONFIG /////////////////////////////////////////////////////////////////////////////////////

        let maxTextareaWidth = 20;
        let maxTextareaHeight = 15;
        let textareaPaddingX = 40; // px
        // let textareaPaddingY = 20; // px

        // PURE ///////////////////////////////////////////////////////////////////////////////////////

        let log = x => { console.log(x); return x; };

        // getMeasurementElement :: Element -> Element
        let getMeasurementElement = R.compose(R.head, R.invoker(0, 'next'));

        // getWindowWidth :: Window -> Integer
        let getWindowWidth = R.compose(R.prop('innerWidth'));

        // getWindowHeight :: Window -> Integer
        let getWindowHeight = R.compose(R.prop('innerHeight'));

        // getElementRect :: Element -> {a}
        let getElementRect = R.compose(R.invoker(0, 'getBoundingClientRect'), R.head);

        // getElementTopPosition :: Element -> Integer
        let getElementTopPosition = R.compose(R.prop('top'), getElementRect);

        // getElementLeftPosition :: Element -> Integer
        let getElementLeftPosition = R.compose(R.prop('left'), getElementRect);

        // getTextareaTextMaxWidth :: Window -> Integer
        // let getTextareaTextMaxWidth = R.compose(R.prop('innerWidth'));

        // getTextareaTextMaxHeight :: Window -> Integer
        // let getTextareaTextMaxHeight = R.compose(R.prop('innerHeight'));

        // getTextareaTextWidth :: Element (measurement element) -> Integer
        let getTextareaTextWidth = R.compose(R.add(textareaPaddingX), R.prop('offsetWidth'), getMeasurementElement);

        // getTextareaTextHeight :: Element (measurement element) -> Integer
        let getTextareaTextHeight = R.curry(element => {
          // calculate # of lines based on span width and textarea max-width
          // 2 * lines = height
          return 
        });


        // IMPURE /////////////////////////////////////////////////////////////////////////////////////

        // setMeasurementElementInnerText :: Element -> SIDE EFFECT
        let setMeasurementElementInnerText = R.curry((newInnerText, element) => {
          let measurementElement = getMeasurementElement(element);
          measurementElement.innerText = newInnerText;
        });

        // setTextareaSize :: Element -> SIDE EFFECT
        let setTextareaSize = R.curry(element => {
          let textareaTextWidth = getTextareaTextWidth(element);
          let textareaTextHeight = getTextareaTextHeight(element);
          // console.log(textareaTextWidth);
          // element[0].setAttribute('style', 'width: ' + textareaTextWidth + 'px; ' + 'height: 2em');
          element[0].style.width = String(textareaTextWidth) + 'px';
          element[0].style.height = String(textareaTextHeight) + 'em';
        });


        // INIT - IMPURE //////////////////////////////////////////////////////////////////////////////
  
        // add an invisible span element to use in measuring width and height of text in textarea
        let measurementElement = $window.document.createElement('span');
        measurementElement.setAttribute('style', 'position: absolute; visibility: hidden; white-space: nowrap');
        measurementElement.innerText = scope.ngModel;
        element[0].parentNode.insertBefore(measurementElement, element[0].nextSibling);


        // MAIN - IMPURE //////////////////////////////////////////////////////////////////////////////
        
        console.log(element[0].getBoundingClientRect());
        console.log(getElementLeftPosition(element));

        // initialize width and height of the textarea
        setTextareaSize(element);

        // adjust width and height of the textarea when input changes
        let watchCounter = 0;

        scope.$watch('ngModel', (newVal, oldVal) => {
          watchCounter++;

          // don't fire the first time
          if (watchCounter > 1) {
            // adjust span element text
            setMeasurementElementInnerText(newVal, element);

            // set width and height of the textarea
            setTextareaSize(element);
          }
        });

      }
    };
  }
}());
