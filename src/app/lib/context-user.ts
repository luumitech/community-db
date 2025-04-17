import { GraphQLError } from 'graphql';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '~/api/auth/[...nextauth]/auth-options';

export interface ContextUser {
  /** Email address used to sign in */
  email: string;
  /** Full name of logged in user */
  name?: string | null | undefined;
  /** Avatar (source URL) */
  image?: string | null | undefined;
}

export async function contextUser(): Promise<ContextUser> {
  const session = await getServerSession(authOptions);

  // All graphQL operations require user to be authenticated
  if (!session) {
    throw new GraphQLError('You are not authenticated');
  }

  const { user } = session;
  if (!user) {
    throw new GraphQLError('Auth: Missing user context');
  }
  const { email } = user;
  if (!email) {
    throw new GraphQLError('Auth: Missing email in user context');
  }

  return {
    email,
    name: user.name,
    image: user.image,
  };
}
