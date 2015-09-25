/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('C3', () => {
  let factory;

  beforeEach(module('common'));

  beforeEach(inject((C3) => {
    factory = C3;
  }));

  it('should have someValue be C3', () => {
    expect(factory.someValue).toEqual('C3');
  });

  it('should have someMethod return C3', () => {
    expect(factory.someMethod()).toEqual('C3');
  });
});
