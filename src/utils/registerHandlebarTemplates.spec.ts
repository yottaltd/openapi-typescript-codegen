import { describe, expect, it } from 'vitest';
import { HttpClient } from '../HttpClient';
import { registerHandlebarTemplates } from './registerHandlebarTemplates';

describe('registerHandlebarTemplates', () => {
  it('should return correct templates', () => {
    const templates = registerHandlebarTemplates({
      httpClient: HttpClient.FETCH,
      useOptions: false,
      useUnionTypes: false,
    });
    expect(templates.exports.model).toBeDefined();
    expect(templates.exports.schema).toBeDefined();
    expect(templates.exports.serviceImplementation).toBeDefined();
    expect(templates.exports.serviceInterface).toBeDefined();
    expect(templates.core.settings).toBeDefined();
    expect(templates.core.apiRequestOptions).toBeDefined();
    expect(templates.core.apiResult).toBeDefined();
    expect(templates.core.request).toBeDefined();
  });
});
