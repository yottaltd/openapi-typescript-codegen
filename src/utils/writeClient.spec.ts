import { describe, expect, it, vi } from 'vitest';

import type { Client } from '../client/interfaces/Client';
import { HttpClient } from '../HttpClient';
import { mkdir, rmdir, writeFile } from './fileSystem';
import type { Templates } from './registerHandlebarTemplates';
import { writeClient } from './writeClient';

vi.mock('./fileSystem');

describe('writeClient', () => {
  it('should write to filesystem', async () => {
    const client: Client = {
      server: 'http://localhost:8080',
      version: 'v1',
      models: [],
      services: [],
    };

    const templates: Templates = {
      exports: {
        model: () => 'model',
        schema: () => 'schema',
        serviceImplementation: () => 'service implementation',
        serviceInterface: () => 'service interface',
      },
      core: {
        settings: () => 'settings',
        apiRequestOptions: () => 'apiRequestOptions',
        apiResult: () => 'apiResult',
        request: () => 'request',
      },
    };

    await writeClient(
      client,
      templates,
      './dist',
      HttpClient.FETCH,
      false,
      false,
      true,
      true,
      true,
      true,
    );

    expect(rmdir).toBeCalled();
    expect(mkdir).toBeCalled();
    expect(writeFile).toBeCalled();
  });
});
