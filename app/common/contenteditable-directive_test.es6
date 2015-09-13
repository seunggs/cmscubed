/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('contenteditable', () => {
  let scope
    , element;

  beforeEach(module('common', 'common/contenteditable-directive.tpl.html'));

  beforeEach(inject(($compile, $rootScope) => {
    scope = $rootScope.$new();
    element = $compile(angular.element('<contenteditable></contenteditable>'))(scope);
  }));

  it('should have correct text', () => {
    scope.$apply();
    expect(element.isolateScope().contenteditable.name).toEqual('contenteditable');
  });
});
