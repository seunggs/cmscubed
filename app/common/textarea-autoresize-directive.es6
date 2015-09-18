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

  function textareaAutoresize($window, R, C, $timeout) {
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
        
        vm.doSomething = () => { console.log('done!'); };
      },
      link(scope, element, attrs, ctrls) {
        /* jshint unused:false */
        /* eslint "no-unused-vars": [2, {"args": "none"}] */

        // CONFIG /////////////////////////////////////////////////////////////////////////////////////

        let c3Ctrl = ctrls[0];

        let textareaPaddingX = C.convertEmToPx(1.6); // px
        let textareaPaddingY = C.convertEmToPx(1.2); // px
        let textareaButtonGroupWidth = C.convertEmToPx(6); // px

        let keycodes = {
          delete: 8,
          enter: 13,
          esc: 27,
          tab: 9
        };


        // PURE ///////////////////////////////////////////////////////////////////////////////////////

        let log = x => { console.log(x); return x; };

        ////////////
        // bubble //
        ////////////

        // getC3RootElement :: Element -> Element
        let getC3RootElement = R.compose(R.ifElse(R.isNil, R.always(null), R.identity), C.getClosestContainerElementByAttribute('c3-root'));

        // getClickedElement :: Element -> Element
        let getClickedElement = R.compose(R.prop('parentNode'), getC3RootElement);

        // getTextareaElement :: Element -> Element
        let getTextareaElement = R.compose(R.head, R.invoker(1, 'querySelectorAll')('.textarea'), getC3RootElement);

        // getEditorElement :: Element -> Element
        // let getEditorElement = R.compose(R.invoker(1, 'querySelectorAll')('.editor'), R.head);

        // getBubbleElement :: Element -> Element
        let getBubbleElement = R.compose(R.head, R.invoker(1, 'querySelectorAll')('.bubble'), getC3RootElement);

        // getBubbleOverlayElement :: Element -> Element
        // let getBubbleOverlayElement = R.compose(R.invoker(1, 'querySelectorAll')('.bubble-overlay'), R.head, R.invoker(0, 'parent'), R.invoker(0, 'parent'));

        // getWindowWidth :: Window -> Integer
        let getWindowWidth = R.compose(R.prop('innerWidth'));

        // getWindowHeight :: Window -> Integer
        let getWindowHeight = R.compose(R.prop('innerHeight'));

        // getElementRect :: Element -> {a}
        let getElementRect = R.compose(R.invoker(0, 'getBoundingClientRect'));

        // getElementTopPosition :: Element -> Integer
        let getElementTopPosition = R.compose(R.prop('top'), getElementRect);

        // getElementRightPosition :: Element -> Integer
        let getElementRightPosition = R.compose(R.prop('right'), getElementRect);

        // getElementBottomPosition :: Element -> Integer
        let getElementBottomPosition = R.compose(R.prop('bottom'), getElementRect);

        // getElementLeftPosition :: Element -> Integer
        let getElementLeftPosition = R.compose(R.prop('left'), getElementRect);

        // getElementWidth :: Element -> Integer
        let getElementWidth = R.compose(R.prop('width'), getElementRect);

        // getElementHeight :: Element -> Integer
        let getElementHeight = R.compose(R.prop('height'), getElementRect);

        // getElementHorizontalCenterPosition :: Element -> Integer
        let getElementHorizontalCenterPosition = R.curry(element => {
          let elementWidth = getElementWidth(element);
          return R.compose(R.add(R.divide(elementWidth, 2)), getElementLeftPosition)(element);
        });

        // getElementVerticalCenterPosition :: Element -> Integer
        let getElementVerticalCenterPosition = R.curry(element => {
          let elementHeight = getElementHeight(element);
          return R.compose(R.add(R.divide(elementHeight, 2)), getElementTopPosition)(element);
        });

        // getWindowHorizontalCenter :: Window -> Integer
        let getWindowHorizontalCenter = R.compose(R.divide(R.__, 2), getWindowWidth);

        // getWindowVerticalCenter :: Window -> Integer
        let getWindowVerticalCenter = R.compose(R.divide(R.__, 2), getWindowHeight);

        // isInLeftHalfOfWindow :: Element (bubble) -> Boolean
        let isInLeftHalfOfWindow = R.curry(element => {
          let windowHorizontalCenter = R.compose(getWindowHorizontalCenter, C.getWindowObj)(element);
          return R.compose(R.lt(R.__, windowHorizontalCenter), getElementHorizontalCenterPosition)(element);
        });

        // isInTopHalfOfWindow :: Element (bubble) -> Boolean
        let isInTopHalfOfWindow = R.curry(element => {
          let windowVerticalCenter = R.compose(getWindowVerticalCenter, C.getWindowObj)(element);
          return R.compose(R.lt(R.__, windowVerticalCenter), getElementVerticalCenterPosition)(element);
        });

        // getElementQuadrant :: Element (bubble) -> String
        let getElementQuadrant = R.curry(element => {
          let inLeftHalf = isInLeftHalfOfWindow(element);
          let inTopHalf = isInTopHalfOfWindow(element);

          if (inLeftHalf && inTopHalf) { return 'topLeft'; } 
          else if (!inLeftHalf && inTopHalf) { return 'topRight'; } 
          else if (inLeftHalf && !inTopHalf) { return 'bottomLeft'; } 
          else if (!inLeftHalf && !inTopHalf) { return 'bottomRight'; } 
        });

        // setRelativeBubblePosition :: Element (bubble) -> Element
        // set the position of the bubble relative to c3 root element
        let setRelativeBubblePosition = R.curry(element => {
          console.log(element);
          let bubbleElement = element;
          let c3RootElement = getC3RootElement(element);

          let elementQuadrant = getElementQuadrant(c3RootElement);
          let bubbleTipClasses = ['bubble--top-left', 'bubble--top-right', 'bubble--bottom-left', 'bubble--bottom-right'];

          // first reset the classList
          bubbleElement.classList.remove(bubbleTipClasses[0], bubbleTipClasses[1], bubbleTipClasses[2], bubbleTipClasses[3]);
          
          switch (elementQuadrant) {
            case 'topLeft':
              bubbleElement.style.top = String(36) + 'px';
              bubbleElement.style.left = String(-20) + 'px';
              bubbleElement.classList.add(bubbleTipClasses[0]);
              break;
            case 'topRight':
              bubbleElement.style.top = String(36) + 'px';
              bubbleElement.style.right = String(-20) + 'px';
              bubbleElement.classList.add(bubbleTipClasses[1]);
              break;
            case 'bottomLeft':
              bubbleElement.style.top = String(-(8 + getElementHeight(bubbleElement))) + 'px';
              bubbleElement.style.left = String(-20) + 'px';
              bubbleElement.classList.add(bubbleTipClasses[2]);
              break;
            case 'bottomRight':
              bubbleElement.style.top = String(-(8 + getElementHeight(bubbleElement))) + 'px';
              bubbleElement.style.right = String(-20) + 'px';
              bubbleElement.classList.add(bubbleTipClasses[3]);
              break;
          }
          return element;
        });

        // // getMouseXRelativeToViewport :: Mouse Event -> Integer
        // let getMouseXRelativeToViewport = R.compose(R.prop('clientX'));

        // // getMouseYRelativeToViewport :: Mouse Event -> Integer
        // let getMouseYRelativeToViewport = R.compose(R.prop('clientY'));

        // // checkMouseXOutsideBubble :: Element (directive root) -> Mouse Event -> Boolean
        // let checkMouseXOutsideBubble = R.curry((element, mouseEvent) => {
        //   let bubbleElement = R.compose(R.head, getBubbleElement)(element);
        //   let bubbleLeftPosition = getElementLeftPosition(bubbleElement);
        //   let bubbleRightPosition = getElementRightPosition(bubbleElement);
        //   console.log('bubbleLeftPos: ', bubbleLeftPosition);
        //   console.log('bubbleRightPos: ', bubbleRightPosition);
        //   return R.compose(R.and(R.lt(bubbleLeftPosition), R.gt(bubbleRightPosition)), getMouseXRelativeToViewport)(mouseEvent);
        // });

        // // checkMouseYOutsideBubble :: Element (directive root) -> Mouse Event -> Boolean
        // let checkMouseYOutsideBubble = R.curry((element, mouseEvent) => {
        //   let bubbleElement = R.compose(R.head, getBubbleElement)(element);
        //   let bubbleBottomPosition = getElementBottomPosition(bubbleElement);
        //   console.log('editorTopPos: ', editorTopPosition);
        //   console.log('bubbleBottomPos: ', bubbleBottomPosition);
        //   return R.compose(R.and(R.lt(editorTopPosition), R.gt(bubbleBottomPosition)), getMouseXRelativeToViewport)(mouseEvent);
        // });

        // // mouseClickOutsideBubble :: Element (directive root) -> Mouse Event -> Boolean
        // let mouseClickOutsideBubble = R.and(checkMouseXOutsideBubble, checkMouseYOutsideBubble);


        //////////////
        // textarea //
        //////////////

        // getMeasurementElement :: Element (directive root) -> Element
        let getMeasurementElement = R.compose(R.head, R.invoker(1, 'querySelectorAll')('.measurement'), getC3RootElement);

        // getMeasurementElementMaxWidth :: Element (measurement) -> Integer
        let getMeasurementElementMaxWidth = R.compose(R.divide(R.__, 3), getWindowWidth, C.getWindowObj);

        // setMeasurementElementMaxWidth :: Element (measurement) -> Integer
        let setMeasurementElementMaxWidth = R.curry(element => {
          let maxWidth = getMeasurementElementMaxWidth(element);
          element.style.maxWidth = String(maxWidth) + 'px';
          return element;
        });

        // getTextareaTextWidth :: Element (measurement) -> Integer
        let getTextareaTextWidth = R.compose(R.add(textareaPaddingX), R.prop('offsetWidth'));

        // getTextareaTextMaxWidth :: Element (measurement) -> Integer
        let getTextareaTextMaxWidth = R.compose(R.add(textareaPaddingX), R.divide(R.__, 3), getWindowWidth, C.getWindowObj);

        // getTextareaTextHeight :: Element (measurement) -> Integer
        let getTextareaTextHeight = R.compose(R.prop('offsetHeight'));

        // getTextareaTextMaxHeight :: Element (measurement) -> Integer
        let getTextareaTextMaxHeight = R.compose(R.add(textareaPaddingY), R.divide(R.__, 3), getWindowHeight, C.getWindowObj);

        // setMeasurementElementInnerHTML :: Element (measurement) -> Element
        let setMeasurementElementInnerHTML = R.curry((newInnerHTML, element) => {
          element.innerHTML = newInnerHTML;
          return element;
        });

        // setTextareaWidth :: Element (textarea) -> Element
        let setTextareaWidth = R.curry(element => {
          let measurementElement = getMeasurementElement(element);
          let textareaTextWidth = getTextareaTextWidth(measurementElement);
          let textareaMaxWidth = getTextareaTextMaxWidth(measurementElement);

          element.style.width = String(textareaTextWidth) + 'px';
          element.style.maxWidth = String(textareaMaxWidth) + 'px';

          return element;
        });

        // setTextareaHeight :: Element (textarea) -> Element
        let setTextareaHeight = R.curry(element => {
          let measurementElement = getMeasurementElement(element);
          let textareaTextHeight = getTextareaTextHeight(measurementElement);
          let textareaMaxHeight = getTextareaTextMaxHeight(measurementElement);

          element.style.height = String(textareaTextHeight) + 'px';
          element.style.maxHeight = String(textareaMaxHeight) + 'px';

          return element;
        });

        ///////////////////
        // medium editor //
        ///////////////////

        // getElementTag :: Element -> String
        let getElementTag = R.prop('nodeName');

        // setMediumEditorOptionToSingleLine :: Element (textarea) -> Element
        let setMediumEditorOptionToSingleLine = R.curry(element => {
          element.setAttribute('data-disable-return', 'true');
          return element;
        });

        // setMediumEditorOptions :: Element (textarea) -> Element
        let setMediumEditorOptions = R.curry(element => {
          let clickedElement = getClickedElement(element);
          let elementTag = getElementTag(clickedElement);
          if (elementTag === 'SPAN' || elementTag === 'P') {
            setMediumEditorOptionToSingleLine(element);
          }
        });

        // getRange :: Element -> Element
        let getRange = R.compose(R.invoker(0, 'createRange'), C.getDocumentObj);

        // getSelection :: Element -> Element
        let getSelection = R.compose(R.invoker(0, 'getSelection'), C.getWindowObj);

        // setCursorToEnd :: Element (textarea) -> Element
        let setCursorToEnd = R.curry(element => {
          let range = getRange(element);
          let selection = getSelection(element);
          range.setStart(element, 1);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
          element.focus();
          return element;
        });




        // INIT - IMPURE //////////////////////////////////////////////////////////////////////////////

        let clickedElement = R.compose(getClickedElement, R.head)(element);
        let bubbleElement = R.compose(getBubbleElement, R.head)(element);
        let textareaElement = R.compose(getTextareaElement, R.head)(element);
        let measurementElement = R.compose(getMeasurementElement, R.head)(element);

        // Set invisible span element text for use in measuring width and height of text in textarea
        // and then set max width for the measurement element
        C.setInnerHTML(scope.ngModel)(measurementElement);
        setMeasurementElementMaxWidth(measurementElement);

        // if the clicked element is SPAN or P, set medium editor to single line input only
        setMediumEditorOptions(textareaElement);


        // MAIN - IMPURE //////////////////////////////////////////////////////////////////////////////
        
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
              setCursorToEnd(textareaElement);

              // TODO: click outside the bubble to close the bubble

              scope.$watch('c3Model', (newVal, oldVal) => {
                console.log('watch ran - new val:', newVal);

                // adjust span element text
                setMeasurementElementInnerHTML(newVal, measurementElement);

                // set width and height of the textarea
                setTextareaWidth(textareaElement);
                setTextareaHeight(textareaElement);

                // set bubble position and orientation (including the bubble tip and editor)
                setRelativeBubblePosition(bubbleElement);
              });
            },0);
          }
        });


      }
    };
  }
}());
