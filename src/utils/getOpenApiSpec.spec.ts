import { describe, expect, it, vi, type MockedFunction } from 'vitest';
import { exists, readFile } from './fileSystem';
import { getOpenApiSpec } from './getOpenApiSpec';

vi.mock('./fileSystem');

const existsMocked = exists as MockedFunction<typeof exists>;
const readFileMocked = readFile as MockedFunction<typeof readFile>;

function mockPromise<T>(value: T): Promise<T> {
  return new Promise<T>((resolve) => resolve(value));
}

describe('getOpenApiSpec', () => {
  it('should read the json file', async () => {
    existsMocked.mockReturnValue(mockPromise(true));
    readFileMocked.mockReturnValue(mockPromise('{"message": "Hello World!"}'));
    const spec = await getOpenApiSpec('spec.json');
    expect(spec.message).toEqual('Hello World!');
  });

  it('should read the yaml file', async () => {
    existsMocked.mockReturnValue(mockPromise(true));
    readFileMocked.mockReturnValue(mockPromise('message: "Hello World!"'));
    const spec = await getOpenApiSpec('spec.yaml');
    expect(spec.message).toEqual('Hello World!');
  });
});
