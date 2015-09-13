(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name common.factory:C
   *
   * @description
   * Common helper functions
   */
  angular
    .module('common')
    .factory('C', C);

  function C(R) {
    let CBase = {};
    
    // CONFIG ////////////////////////////////////////////////////////////////////////////////////
    
    let baseFontSize = 17.6;

    // MAIN //////////////////////////////////////////////////////////////////////////////////////

    // getWindowObj :: Element -> Window
    let getWindowObj = R.compose(R.path(['ownerDocument', 'defaultView']));

    // convertEmToPx :: Float -> Float
    let convertEmToPx = R.multiply(baseFontSize);

    // setInnerText :: String -> Element -> Element
    let setInnerText = R.curry((newInnerText, element) => { 
      element.innerText = newInnerText;
      return element; 
    });

    CBase = {
      getWindowObj: getWindowObj,
      convertEmToPx: convertEmToPx,
      setInnerText: setInnerText
    };
    return CBase;
  }
}());
