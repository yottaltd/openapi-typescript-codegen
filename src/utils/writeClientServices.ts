import { resolve } from 'path';
import type { Service } from '../client/interfaces/Service';
import type { HttpClient } from '../HttpClient';
import { writeFile } from './fileSystem';
import { format } from './format';
import type { Templates } from './registerHandlebarTemplates';

const VERSION_TEMPLATE_STRING = 'this.config.version';

/**
 * Generate Services using the Handlebar template and write to disk.
 * @param services Array of Services to write
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 * @param httpClient The selected httpClient (fetch, xhr or node)
 * @param useUnionTypes Use union types instead of enums
 * @param useOptions Use options or arguments functions
 */
export async function writeClientServices(
  services: Service[],
  templates: Templates,
  outputPath: string,
  httpClient: HttpClient,
  useUnionTypes: boolean,
  useOptions: boolean,
): Promise<void> {
  for (const service of services) {
    const fileImplementation = resolve(outputPath, `${service.name}Default.ts`);
    const fileInterface = resolve(outputPath, `${service.name}.ts`);

    const useVersion = service.operations.some((operation) =>
      operation.path.includes(VERSION_TEMPLATE_STRING),
    );
    const templateResultImplementation = templates.exports.serviceImplementation({
      ...service,
      httpClient,
      useUnionTypes,
      useVersion,
      useOptions,
      serviceImplementation: true,
    });
    await writeFile(fileImplementation, format(templateResultImplementation));

    const templateResultInterface = templates.exports.serviceInterface({
      ...service,
      httpClient,
      useUnionTypes,
      useVersion,
      useOptions,
    });
    await writeFile(fileInterface, format(templateResultInterface));
  }
}
