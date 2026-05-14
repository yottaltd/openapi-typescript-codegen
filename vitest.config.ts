import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

const hbsMock = fileURLToPath(new URL('./src/templates/__mocks__/index.js', import.meta.url));

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
  },
  resolve: {
    alias: [{ find: /^.+\.hbs$/, replacement: hbsMock }],
  },
});
