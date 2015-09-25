/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('Cmscubed', () => {
  let factory;

  beforeEach(module('home'));

  beforeEach(inject((Cmscubed) => {
    factory = Cmscubed;
  }));

  it('should have someValue be Cmscubed', () => {
    expect(factory.someValue).toEqual('Cmscubed');
  });

  it('should have someMethod return Cmscubed', () => {
    expect(factory.someMethod()).toEqual('Cmscubed');
  });
});
