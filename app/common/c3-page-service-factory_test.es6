/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('C3PageService', () => {
  let factory;

  beforeEach(module('common'));

  beforeEach(inject((C3PageService) => {
    factory = C3PageService;
  }));

  it('should have someValue be C3PageService', () => {
    expect(factory.someValue).toEqual('C3PageService');
  });

  it('should have someMethod return C3PageService', () => {
    expect(factory.someMethod()).toEqual('C3PageService');
  });
});
