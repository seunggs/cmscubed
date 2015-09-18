/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('c3Repeat', () => {
  let scope
    , element;

  beforeEach(module('common', 'common/c3-repeat-directive.tpl.html'));

  beforeEach(inject(($compile, $rootScope) => {
    scope = $rootScope.$new();
    element = $compile(angular.element('<c3-repeat></c3-repeat>'))(scope);
  }));

  it('should have correct text', () => {
    scope.$apply();
    expect(element.isolateScope().c3Repeat.name).toEqual('c3Repeat');
  });
});
