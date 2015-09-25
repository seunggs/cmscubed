/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('C3Page', () => {
  let factory;

  beforeEach(module('common'));

  beforeEach(inject((C3Page) => {
    factory = C3Page;
  }));

  it('should have someValue be C3Page', () => {
    expect(factory.someValue).toEqual('C3Page');
  });

  it('should have someMethod return C3Page', () => {
    expect(factory.someMethod()).toEqual('C3Page');
  });
});
