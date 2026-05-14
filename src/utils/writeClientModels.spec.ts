import { resolve } from 'path';
import { describe, expect, it, vi } from 'vitest';

import type { Model } from '../client/interfaces/Model';
import { HttpClient } from '../HttpClient';
import { writeFile } from './fileSystem';
import type { Templates } from './registerHandlebarTemplates';
import { writeClientModels } from './writeClientModels';

vi.mock('./fileSystem');

describe('writeClientModels', () => {
  it('should write to filesystem', async () => {
    const models: Model[] = [
      {
        export: 'interface',
        name: 'MyModel',
        type: 'MyModel',
        base: 'MyModel',
        template: null,
        link: null,
        description: null,
        isDefinition: true,
        isReadOnly: false,
        isRequired: false,
        isNullable: false,
        imports: [],
        enum: [],
        enums: [],
        properties: [],
      },
    ];

    const templates: Templates = {
      exports: {
        model: () => 'model',
        schema: () => 'schema',
        serviceImplementation: () => 'service-implementation',
        serviceInterface: () => 'service-interface',
      },
      core: {
        settings: () => 'settings',
        apiRequestOptions: () => 'apiRequestOptions',
        apiResult: () => 'apiResult',
        request: () => 'request',
      },
    };

    await writeClientModels(models, templates, '/', HttpClient.FETCH, false);

    expect(writeFile).toBeCalledWith(resolve('/', 'MyModel.ts'), 'model');
  });
});
