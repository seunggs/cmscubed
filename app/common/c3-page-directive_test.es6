/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('c3Page', () => {
  let scope
    , element;

  beforeEach(module('common', 'common/c3-page-directive.tpl.html'));

  beforeEach(inject(($compile, $rootScope) => {
    scope = $rootScope.$new();
    element = $compile(angular.element('<c3-page></c3-page>'))(scope);
  }));

  it('should have correct text', () => {
    scope.$apply();
    expect(element.isolateScope().c3Page.name).toEqual('c3Page');
  });
});
