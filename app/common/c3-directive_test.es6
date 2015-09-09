/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('c3', () => {
  let scope
    , element;

  beforeEach(module('common', 'common/c3-directive.tpl.html'));

  beforeEach(inject(($compile, $rootScope) => {
    scope = $rootScope.$new();
    element = $compile(angular.element('<c3></c3>'))(scope);
  }));

  it('should have correct text', () => {
    scope.$apply();
    expect(element.isolateScope().c3.name).toEqual('c3');
  });
});
