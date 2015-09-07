/*global describe, beforeEach, it, browser, expect */
'use strict';

import CommonPage from './common.po';

describe('Common page', () => {
  let commonPage;

  beforeEach(() => {
    commonPage = new CommonPage();
    browser.get('/#/common');
  });

  it('should say CommonCtrl', () => {
    expect(commonPage.heading.getText()).toEqual('common');
    expect(commonPage.text.getText()).toEqual('CommonCtrl');
  });
});
