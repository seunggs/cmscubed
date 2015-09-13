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

        // getClickedElement :: Element (directive root) -> Element
        let getClickedElement = R.compose(R.invoker(0, 'parent'), R.invoker(0, 'parent'));

        // getTextareaElement :: Element (directive root) -> Element
        let getTextareaElement = R.compose(R.invoker(1, 'querySelectorAll')('.textarea'), R.head);

        // getEditorElement :: Element (directive root) -> Element
        // let getEditorElement = R.compose(R.invoker(1, 'querySelectorAll')('.editor'), R.head);

        // getBubbleElement :: Element -> Element
        let getBubbleElement = R.compose(R.invoker(0, 'parent'));

        // getBubbleOverlayElement :: Element -> Element
        let getBubbleOverlayElement = R.compose(R.invoker(1, 'querySelectorAll')('.bubble-overlay'), R.head, R.invoker(0, 'parent'), R.invoker(0, 'parent'));

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

        // setRelativeBubblePosition :: Element (directive root) -> Element
        // set the position of the bubble relative to clicked element
        let setRelativeBubblePosition = R.curry(element => {
          let bubbleElement = R.compose(R.head, getBubbleElement)(element);
          let clickedElement = R.compose(R.head, getClickedElement)(element);

          let elementQuadrant = getElementQuadrant(clickedElement);
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
        let getMeasurementElement = R.compose(R.invoker(1, 'querySelectorAll')('.measurement'), R.head);

        // getMeasurementElementMaxWidth :: Element (measurement) -> Integer
        let getMeasurementElementMaxWidth = R.compose(R.divide(R.__, 3), getWindowWidth, C.getWindowObj, R.head);

        // setMeasurementElementMaxWidth :: Element (measurement) -> Integer
        let setMeasurementElementMaxWidth = R.curry(element => {
          let maxWidth = getMeasurementElementMaxWidth(element);
          element[0].style.maxWidth = String(maxWidth) + 'px';
          return element;
        });

        // getTextareaTextWidth :: Element (directive root) -> Integer
        let getTextareaTextWidth = R.compose(R.add(textareaPaddingX), R.prop('offsetWidth'), R.head, getMeasurementElement);

        // getTextareaTextMaxWidth :: Element (directive root) -> Integer
        let getTextareaTextMaxWidth = R.compose(R.add(textareaPaddingX), R.divide(R.__, 3), getWindowWidth, C.getWindowObj, R.head);

        // getTextareaTextHeight :: Element (directive root) -> Integer
        let getTextareaTextHeight = R.compose(R.add(textareaPaddingY), R.prop('offsetHeight'), R.head, getMeasurementElement);

        // getTextareaTextMaxHeight :: Element (directive root) -> Integer
        let getTextareaTextMaxHeight = R.compose(R.add(textareaPaddingY), R.divide(R.__, 3), getWindowHeight, C.getWindowObj, R.head);

        // setMeasurementElementInnerText :: Element (directive root) -> Element
        let setMeasurementElementInnerText = R.curry((newInnerText, element) => {
          let measurementElement = R.compose(R.head, getMeasurementElement)(element);
          measurementElement.innerText = newInnerText;
          return element;
        });

        // setTextareaWidth :: Element -> Element
        let setTextareaWidth = R.curry(element => {
          let textareaElement = R.compose(R.head, getTextareaElement)(element);
          let textareaTextWidth = getTextareaTextWidth(element);
          let textareaMaxWidth = getTextareaTextMaxWidth(element);

          textareaElement.style.width = String(textareaTextWidth) + 'px';
          textareaElement.style.maxWidth = String(textareaMaxWidth) + 'px';

          return element;
        });

        // setTextareaHeight :: Element -> Element
        let setTextareaHeight = R.curry(element => {
          let textareaElement = R.compose(R.head, getTextareaElement)(element);
          let textareaTextHeight = getTextareaTextHeight(element);
          let textareaMaxHeight = getTextareaTextMaxHeight(element);

          textareaElement.style.height = String(textareaTextHeight) + 'px';
          textareaElement.style.maxHeight = String(textareaMaxHeight) + 'px';

          return element;
        });


        ////////////
        // editor //
        ////////////

        // moveCaretToEnd :: 

        // getElementTag :: Element -> String
        let getElementTag = R.compose(R.prop('nodeName'), R.head);

        // isSelection :: Element (textarea) -> Boolean
        let isSelection = R.curry(element => {
          let selectionStart = R.prop('selectionStart')(element);
          let selectionEnd = R.prop('selectionEnd')(element);
          return R.compose(R.gt(0), R.subtract(selectionEnd))(selectionStart);
        });

        // getSelection :: Element -> String


        // getSelectionContainerElement :: Element -> Element
        let getSelectionContainerElement = R.compose(R.prop('commonAncestorContainer'), R.invoker(1, 'getRangeAt')(0), R.invoker(0, 'getSelection'), C.getWindowObj);

        // getSelecedElement :: Element -> Element
        let getSelectedElement = R.compose(R.ifElse(R.compose(R.equals(1), R.prop('nodeType')), R.identity, R.prop('parentNode')), getSelectionContainerElement);

        // getCurrentWord :: String -> String


        // wrapWithParagraphTag :: String (selection) -> String
        let wrapWithParagraphTag = R.compose(R.add(R.__, '<p>'), R.add('</p>'));

        // deleteTag :: String -> String

        // removeTag :: String -> String
        

        // isBold :: String -> String

        // wrapWithBoldTag :: String -> String

        // isItalics :: String -> String

        // wrapWithItalicsTag :: String -> String

        // isUnderline :: String -> String

        // wrapWithUnderlineTag :: String -> String

        // isLeftAligned :: String -> String

        // addLeftAlignedStyle :: String -> String

        // isRightAligned :: String -> String

        // addRightAlignedStyle :: String -> String

        // isCenterAligned :: String -> String

        // addCenterAlignedStyle :: String -> String

        // isHyperLink :: String -> String

        // addHyperLink :: String -> String

        








        // INIT - IMPURE //////////////////////////////////////////////////////////////////////////////

        let textareaElement = R.compose(R.head, getTextareaElement)(element);
        let bubbleOverlayElement = R.compose(R.head, getBubbleOverlayElement)(element);
        let bubbleElement = R.compose(R.head, getBubbleElement)(element);

        // Set invisible span element text for use in measuring width and height of text in textarea
        // and then set max width for the measurement element
        R.compose(C.setInnerText(scope.ngModel), R.head, getMeasurementElement)(element);
        R.compose(setMeasurementElementMaxWidth, getMeasurementElement)(element);

        // initialize textarea content
        // i.e. if the tag is not span or p, wrap the content in p tag (unless it's already HTML)
        let elementTag = R.compose(getElementTag, getClickedElement)(element);


        // MAIN - IMPURE //////////////////////////////////////////////////////////////////////////////
        
        // console.log(R.compose(isInLeftHalfOfWindow, R.head, getBubbleElement)(element));
        // console.log(C.getWindowObj(getMeasurementElement(element)[0]));
        // console.log(R.compose(getElementRect, R.head, getClickedElement)(element));
        // console.log(element);
        // console.log(textareaElement);

        // TODO: update the width on paste (or calculate the text width after the paste somehow?)

        // Keyup deals with editor functionality (i.e. selection requires keyup & mouseup)
        angular.element(textareaElement).on('keyup', event => {
          console.log('key entered: ', event.which);
          switch (event.which) {
            case keycodes.enter: 
              // wrapWithParagraphTag
              break;
            case keycodes.delete: 
              break;
          }
        });

        // Keydown deals with textarea submit events
        angular.element(textareaElement).on('keydown', event => {
          // console.log('key entered: ', event.which);
          // console.log('command key: ', event);
          // console.log('start: ', element[0].selectionStart, 'end: ', element[0].selectionEnd);
          switch (event.which) {
            case keycodes.enter: 
              // wrapWithParagraphTag
              break;
            case keycodes.delete: 
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
              // Set focus to textarea
              textareaElement.focus();

              // TODO: click outside the bubble to close the bubble

              scope.$watch('c3Model', (newVal, oldVal) => {
                console.log('watch ran - new val:', newVal);
                // console.log($window.document.getSelection().getRangeAt(0));
                // console.log('selected element nodeType: ', R.compose(R.prop('nodeType'), getSelectionContainerElement)(textareaElement));
                // console.log('selected element: ', getSelectedElement(textareaElement));

                // adjust span element text
                setMeasurementElementInnerText(newVal, element);

                // set width and height of the textarea
                setTextareaWidth(element);
                setTextareaHeight(element);

                // set bubble position and orientation (including the bubble tip and editor)
                setRelativeBubblePosition(element);
              });
            },0);
          }
        });


      }
    };
  }
}());
