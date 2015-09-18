/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('c3Text', () => {
  let scope
    , element;

  beforeEach(module('common', 'common/c3-text-directive.tpl.html'));

  beforeEach(inject(($compile, $rootScope) => {
    scope = $rootScope.$new();
    element = $compile(angular.element('<c3-text></c3-text>'))(scope);
  }));

  it('should have correct text', () => {
    scope.$apply();
    expect(element.isolateScope().c3Text.name).toEqual('c3Text');
  });
});
