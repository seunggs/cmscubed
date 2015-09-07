/*global element, by*/
'use strict';

class CommonPage {
  constructor() {
    this.text = element(by.tagName('p'));
    this.heading = element(by.tagName('h2'));
  }
}

module.exports = CommonPage;
