import { GraphQLError } from 'graphql';
import { getServerSession } from '~/api/auth/[...better]/auth';
import { isProduction } from '~/lib/env-var';
import { Logger } from '~/lib/logger';

const logger = Logger('lib/context-user');

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
      throw new GraphQLError('You are not authenticated');
    }

    const { user } = session;
    if (!user) {
      throw new GraphQLError('Auth: Missing user context');
    }
    const { email, emailVerified } = user;
    if (!email) {
      throw new GraphQLError('Auth: Missing email in user context');
    }
    if (isProduction() && !emailVerified) {
      // During testing, we allow user account to be created without
      // verifying email address
      throw new GraphQLError('Auth: email is not verified');
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
    throw new GraphQLError('Auth: getServerSession() failed');
  }
}
