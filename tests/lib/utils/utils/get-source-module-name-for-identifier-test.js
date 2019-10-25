'use strict';

const babelEslint = require('babel-eslint');
const { getSourceModuleNameForIdentifier } = require('../../../../lib/utils/utils');

/**
 * Builds a fake ESLint context object that's enough to satisfy the contract
 * expected by `getSourceModuleNameForIdentifier`
 */
class FauxContext {
  constructor(code) {
    const { ast } = babelEslint.parseForESLint(code);

    this.ast = ast;
  }

  /**
   * Does not build the full tree of "parents" for the identifier, but
   * we only care about the first one; the Program node
   */
  getAncestors() {
    return [this.ast];
  }
}

test('when the identifier is not imported', () => {
  const context = new FauxContext(`
    Foo;
  `);

  const node = { name: 'Foo' };

  expect(getSourceModuleNameForIdentifier(context, node)).toEqual(undefined);
});

describe('when the identifier is imported', () => {
  test('as a default export', () => {
    const context = new FauxContext(`
      import Foo from 'bar';

      Foo;
    `);

    const node = { name: 'Foo' };

    expect(getSourceModuleNameForIdentifier(context, node)).toEqual('bar');
  });

  test('as a named export', () => {
    const context = new FauxContext(`
      import { Foo } from 'bar';

      Foo;
    `);

    const node = { name: 'Foo' };

    expect(getSourceModuleNameForIdentifier(context, node)).toEqual('bar');
  });

  test('when aliasing a named export', () => {
    const context = new FauxContext(`
      import { SomeOtherThing as Foo } from 'bar';

      Foo;
    `);

    const node = { name: 'Foo' };

    expect(getSourceModuleNameForIdentifier(context, node)).toEqual('bar');
  });
});
