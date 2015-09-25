/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('Socket', () => {
  let factory;

  beforeEach(module('common'));

  beforeEach(inject((Socket) => {
    factory = Socket;
  }));

  it('should have someValue be Socket', () => {
    expect(factory.someValue).toEqual('Socket');
  });

  it('should have someMethod return Socket', () => {
    expect(factory.someMethod()).toEqual('Socket');
  });
});
