import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('getHeaders templates', () => {
  it.each(['fetch', 'node', 'xhr'])('%s/getHeaders.hbs exports getHeaders', (client) => {
    const content = readFileSync(resolve(__dirname, 'core', client, 'getHeaders.hbs'), 'utf8');
    expect(content).toMatch(/^export async function getHeaders/);
  });
});
