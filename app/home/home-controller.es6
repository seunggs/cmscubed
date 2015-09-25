(() => {
  'use strict';

  class HomeCtrl {
    constructor() {

      let vm = this;

      vm.$cms = {};
      vm.$cms.wrap = {};

      vm.$cms.wrap.text = 'text example';
      vm.$cms.wrap.text2 = 'text example 2';
      
      vm.$cms.list = [1, 2, 3, 4, 5];
      vm.$cms.list2 = ['a', 'b', 'c'];
      
      vm.$cms.obj = {
        a: 1, 
        b: 2, 
        c: 3, 
        d: 4, 
        e: 5
      };

      vm.$cms.matrix = [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15]
      ];

      vm.$cms.matrixObj = {
        a: [1, 2, 3, 4, 5],
        b: [6, 7, 8, 9, 10],
        c: [11, 12, 13, 14, 15]
      };

      vm.$cms.something = 'blah';

    }
  }

  /**
   * @ngdoc object
   * @name home.controller:HomeCtrl
   *
   * @description
   *
   */
  angular
    .module('home')
    .controller('HomeCtrl', HomeCtrl);
}());
