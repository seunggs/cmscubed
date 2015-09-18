/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('C3CoreService', () => {
  let factory;

  beforeEach(module('common'));

  beforeEach(inject((C3CoreService) => {
    factory = C3CoreService;
  }));

  it('should have someValue be C3CoreService', () => {
    expect(factory.someValue).toEqual('C3CoreService');
  });

  it('should have someMethod return C3CoreService', () => {
    expect(factory.someMethod()).toEqual('C3CoreService');
  });
});
