/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('C', () => {
  let factory;

  beforeEach(module('common'));

  beforeEach(inject((C) => {
    factory = C;
  }));

  it('should have someValue be C', () => {
    expect(factory.someValue).toEqual('C');
  });

  it('should have someMethod return C', () => {
    expect(factory.someMethod()).toEqual('C');
  });
});
