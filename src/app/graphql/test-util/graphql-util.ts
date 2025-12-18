import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { print, type ExecutionResult } from 'graphql';
import { createYoga } from 'graphql-yoga';
import type { Context } from '~/graphql/context';
import { pubSub } from '~/graphql/pubsub';
import { schema } from '~/graphql/schema';
import { type ContextUser } from '~/lib/context-user';

interface ExecuteSingle<TResult, TVariables> {
  document: TypedDocumentNode<TResult, TVariables>;
  variables?: TVariables;
}

/** Helper test utility class for invoking graphQL query/mutation */
export class GraphQLUtil {
  #yoga = createYoga({ schema });

  // Default context for graphQL
  #context: Context = {
    user: {
      email: process.env.AUTH_TEST_EMAIL!,
    },
    pubSub,
    clientIp: '127.0.0.1',
  };

  /** Convenience method to return apollo context */
  get context(): Context {
    return this.#context;
  }

  /** Set the authorized user in the context */
  setAuthUser(user: ContextUser) {
    this.#context = { ...this.#context, user };
  }

  /** Execute the graphql query */
  async executeSingle<TResult, TVariables>(
    arg: ExecuteSingle<TResult, TVariables>
  ): Promise<ExecutionResult<TResult>> {
    const result = await this.#yoga.fetch(
      'http://yoga/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: print(arg.document),
          variables: arg.variables,
        }),
      },
      this.#context
    );
    return result.json();
  }
}
