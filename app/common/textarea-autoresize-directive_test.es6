/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('textareaAutoresize', () => {
  let scope
    , element;

  beforeEach(module('common', 'common/textarea-autoresize-directive.tpl.html'));

  beforeEach(inject(($compile, $rootScope) => {
    scope = $rootScope.$new();
    element = $compile(angular.element('<textarea-autoresize></textarea-autoresize>'))(scope);
  }));

  it('should have correct text', () => {
    scope.$apply();
    expect(element.isolateScope().textareaAutoresize.name).toEqual('textareaAutoresize');
  });
});
