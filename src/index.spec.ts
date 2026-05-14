import { describe, it } from 'vitest';

import * as OpenAPI from './index';

describe('index', () => {
  it('parses v2 without issues', async () => {
    await OpenAPI.generate({
      input: './test/spec/v2.json',
      output: './generated/v2/',
      write: false,
    });
  });

  it('parses v3 without issues', async () => {
    await OpenAPI.generate({
      input: './test/spec/v3.json',
      output: './generated/v3/',
      write: false,
    });
  });
});
