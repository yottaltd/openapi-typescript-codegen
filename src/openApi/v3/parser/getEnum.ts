import type { Enum } from '../../../client/interfaces/Enum';
import { isDefined } from '../../../utils/isDefined';

export function getEnum(values?: (string | number)[]): Enum[] {
  if (Array.isArray(values)) {
    return values
      .filter((value, index, arr) => {
        return arr.indexOf(value) === index;
      })
      .filter(isDefined)
      .map((value) => {
        if (typeof value === 'number') {
          return {
            name: `'_${value}'`,
            value: String(value),
            type: 'number',
            description: null,
          };
        }
        return {
          name: String(value)
            .replace(/\W+/g, '')
            .replace(/^(\d+)/g, '_$1'),
          value: `'${value}'`,
          type: 'string',
          description: null,
        };
      });
  }
  return [];
}
