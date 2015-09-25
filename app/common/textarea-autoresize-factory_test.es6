/* global describe, beforeEach, it, expect, inject, module */
'use strict';

describe('TextareaAutoresize', () => {
  let factory;

  beforeEach(module('common'));

  beforeEach(inject((TextareaAutoresize) => {
    factory = TextareaAutoresize;
  }));

  it('should have someValue be TextareaAutoresize', () => {
    expect(factory.someValue).toEqual('TextareaAutoresize');
  });

  it('should have someMethod return TextareaAutoresize', () => {
    expect(factory.someMethod()).toEqual('TextareaAutoresize');
  });
});
