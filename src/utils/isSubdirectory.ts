import { relative } from 'path';

export function isSubDirectory(parent: string, child: string): boolean {
  return relative(child, parent).startsWith('..');
}
