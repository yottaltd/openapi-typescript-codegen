import { resolve } from 'path';
import { describe, expect, it, vi } from 'vitest';

import type { Service } from '../client/interfaces/Service';
import { HttpClient } from '../HttpClient';
import { writeFile } from './fileSystem';
import type { Templates } from './registerHandlebarTemplates';
import { writeClientServices } from './writeClientServices';

vi.mock('./fileSystem');

describe('writeClientServices', () => {
  it('should write to filesystem', async () => {
    const services: Service[] = [
      {
        name: 'MyService',
        operations: [],
        imports: [],
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

    await writeClientServices(services, templates, '/', HttpClient.FETCH, false, false);

    expect(writeFile).toBeCalledWith(resolve('/', 'MyService.ts'), 'service-interface');
    expect(writeFile).toBeCalledWith(resolve('/', 'MyServiceDefault.ts'), 'service-implementation');
  });
});
