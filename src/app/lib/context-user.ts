import { GraphQLError } from 'graphql';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { getServerSession } from '~/api/auth/[...better]/auth';
import { isProduction } from '~/lib/env-var';
import { Logger } from '~/lib/logger';

const logger = Logger('lib/context-user');

class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: getReasonPhrase(StatusCodes.UNAUTHORIZED),
        http: {
          status: StatusCodes.UNAUTHORIZED,
        },
      },
    });
    this.name = 'AuthenticationError';
  }
}

export interface ContextUser {
  /** Email address used to sign in */
  email: string;
  /** Full name of logged in user */
  name?: string | null | undefined;
  /** Avatar (source URL) */
  image?: string | null | undefined;
}

export async function contextUser(headers: Headers): Promise<ContextUser> {
  try {
    const session = await getServerSession(headers);

    // All graphQL operations require user to be authenticated
    if (!session) {
      throw new AuthenticationError('You are not authenticated');
    }

    const { user } = session;
    if (!user) {
      throw new AuthenticationError('Auth: Missing user context');
    }
    const { email, emailVerified } = user;
    if (!email) {
      throw new AuthenticationError('Auth: Missing email in user context');
    }
    if (isProduction() && !emailVerified) {
      // During testing, we allow user account to be created without
      // verifying email address
      throw new AuthenticationError('Auth: email is not verified');
    }

    return {
      email,
      name: user.name,
      image: user.image,
    };
  } catch (err) {
    // This shouldn't happen, but it indicates something wrong with
    // the `getServerSession` call
    logger.error(err, 'Unable to get session');
    throw new AuthenticationError('Auth: getServerSession() failed');
  }
}
