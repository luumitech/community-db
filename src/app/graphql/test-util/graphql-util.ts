import {
  buildHTTPExecutor,
  HTTPExecutorOptions,
} from '@graphql-tools/executor-http';
import { AsyncExecutor, ExecutionRequest } from '@graphql-tools/utils';
import { createYoga } from 'graphql-yoga';
import { pubSub } from '~/graphql/pubsub';
import type { Context } from '../context';
import { schema } from '../schema';

/**
 * Helper test utility class for invoking graphQL query/mutation
 */
export class GraphQLUtil {
  private _executor: AsyncExecutor<unknown, HTTPExecutorOptions>;

  // Default context for graphQL
  private _context: Context = {
    user: {
      uid: '001',
      email: 'jest@email.com',
      name: 'jest tester',
    },
    pubSub,
  };

  constructor() {
    const yoga = createYoga({ schema });
    this._executor = buildHTTPExecutor({ fetch: yoga.fetch });
  }

  /**
   * Convenience method to return apollo context
   */
  get context(): Context {
    return this._context;
  }

  /**
   * Set the authorized user in the context
   */
  setAuthUser(user: Context['user']) {
    this._context = {
      ...this._context,
      user,
    };
  }

  /**
   * Execute the graphql query and expect the result to be
   * non iteratable
   */
  async executeSingle<
    TVariables extends Record<string, unknown> = Record<string, unknown>,
    TRootValue = unknown,
    TReturn = unknown,
  >(
    request: ExecutionRequest<
      TVariables,
      Context,
      TRootValue,
      HTTPExecutorOptions,
      TReturn
    >
  ) {
    const result = await this._executor({
      context: this._context,
      ...request,
    });
    if (Symbol.asyncIterator in result) {
      throw new Error('Expected single value');
    }

    return result;
  }
}
