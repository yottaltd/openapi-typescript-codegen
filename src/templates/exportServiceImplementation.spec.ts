import Handlebars from 'handlebars';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const TEMPLATES_DIR = resolve(__dirname);

function readTemplate(rel: string): string {
  return readFileSync(join(TEMPLATES_DIR, rel), 'utf8');
}

describe('exportServiceImplementation template', () => {
  let template: Handlebars.TemplateDelegate;

  beforeAll(() => {
    // The `equals` helper that several partials transitively depend on.
    Handlebars.registerHelper(
      'equals',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Handlebars idiom for the current template context
      function (this: any, a: string, b: string, options: Handlebars.HelperOptions): string {
        return a === b ? options.fn(this) : options.inverse(this);
      },
    );

    const partialNames = [
      'base',
      'exportComposition',
      'exportEnum',
      'exportInterface',
      'exportType',
      'header',
      'isNullable',
      'isReadOnly',
      'isRequired',
      'parameters',
      'result',
      'schema',
      'schemaArray',
      'schemaComposition',
      'schemaDictionary',
      'schemaEnum',
      'schemaGeneric',
      'schemaInterface',
      'type',
      'typeArray',
      'typeDictionary',
      'typeEnum',
      'typeGeneric',
      'typeInterface',
      'typeIntersection',
      'typeReference',
      'typeUnion',
    ];
    for (const name of partialNames) {
      Handlebars.registerPartial(name, readTemplate(`partials/${name}.hbs`));
    }

    template = Handlebars.compile(readTemplate('exportServiceImplementation.hbs'));
  });

  function makeContext(parameterNames: string[], useOptions: boolean): Record<string, unknown> {
    const parameters = parameterNames.map((name) => ({
      name,
      prop: name,
      in: 'path',
      isRequired: true,
      isReadOnly: false,
      isNullable: false,
      base: 'string',
      type: 'string',
    }));
    return {
      name: 'ItemService',
      imports: [],
      operations: [
        {
          name: 'getById',
          method: 'GET',
          path: '/items/{id}',
          parameters,
          imports: [],
          errors: [],
          results: [{ base: 'string', type: 'string' }],
        },
      ],
      useOptions,
      httpClient: 'fetch',
    };
  }

  describe('wrapper body call site', () => {
    it('emits positional call when useOptions is false (single param)', () => {
      const output = template(makeContext(['id'], false));
      expect(output).toMatch(/this\.getByIdApiRequestOptions\(\s*id,?\s*\)/);
      expect(output).not.toMatch(/this\.getByIdApiRequestOptions\(\s*\{/);
    });

    it('emits positional call when useOptions is false (multiple params)', () => {
      const output = template(makeContext(['id', 'tag'], false));
      expect(output).toMatch(/this\.getByIdApiRequestOptions\(\s*id,\s*tag,?\s*\)/);
      expect(output).not.toMatch(/this\.getByIdApiRequestOptions\(\s*\{/);
    });

    it('emits object call when useOptions is true (single param)', () => {
      const output = template(makeContext(['id'], true));
      expect(output).toMatch(/this\.getByIdApiRequestOptions\(\s*\{\s*id,?\s*\}\s*\)/);
    });

    it('emits object call when useOptions is true (multiple params)', () => {
      const output = template(makeContext(['id', 'tag'], true));
      expect(output).toMatch(/this\.getByIdApiRequestOptions\(\s*\{\s*id,\s*tag,?\s*\}\s*\)/);
    });

    it('emits empty call when there are no parameters', () => {
      const output = template(makeContext([], false));
      expect(output).toMatch(/this\.getByIdApiRequestOptions\(\s*\)/);
    });
  });
});
