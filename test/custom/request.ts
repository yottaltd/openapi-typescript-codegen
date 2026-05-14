/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';

export async function request(options: ApiRequestOptions): Promise<ApiResult> {
  const url = `${options.baseUrl}${options.path}`;

  // Do your request...

  return {
    url,
    ok: true,
    status: 200,
    statusText: 'dummy',
    body: {
      ...options,
    },
  };
}
