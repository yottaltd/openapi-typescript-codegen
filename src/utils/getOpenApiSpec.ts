import { load } from 'js-yaml';
import RefParser from 'json-schema-ref-parser';
import { extname } from 'path';

import { readSpec } from './readSpec';

/**
 * Load and parse te open api spec. If the file extension is ".yml" or ".yaml"
 * we will try to parse the file as a YAML spec, otherwise we will fallback
 * on parsing the file as JSON.
 * @param input
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw parsed OpenAPI doc, shape unknown until v2/v3 dispatch
export async function getOpenApiSpec(input: string): Promise<any> {
  const extension = extname(input).toLowerCase();
  const content = await readSpec(input);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- raw parsed OpenAPI doc, shape unknown until v2/v3 dispatch
  let rootObject: any;
  switch (extension) {
    case '.yml':
    case '.yaml':
      try {
        rootObject = load(content);
      } catch {
        throw new Error(`Could not parse OpenApi YAML: "${input}"`);
      }
      break;

    default:
      try {
        rootObject = JSON.parse(content);
      } catch {
        throw new Error(`Could not parse OpenApi JSON: "${input}"`);
      }
      break;
  }
  return await RefParser.bundle(rootObject);
}
