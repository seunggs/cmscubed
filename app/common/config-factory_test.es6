/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('Config', () => {
  let factory;

  beforeEach(module('common'));

  beforeEach(inject((Config) => {
    factory = Config;
  }));

  it('should have someValue be Config', () => {
    expect(factory.someValue).toEqual('Config');
  });

  it('should have someMethod return Config', () => {
    expect(factory.someMethod()).toEqual('Config');
  });
});
