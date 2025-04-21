import { useSession } from '~/custom-hooks/auth';

/** Extract the first letter of each word */
function acronym(input?: string | null) {
  if (!input) {
    return '';
  }
  return input
    .split(/\s/)
    .reduce((response, word) => (response += word.slice(0, 1)), '');
}

/**
 * Construct short name from a fullname or email
 *
 * - If fullname is available, get first name
 * - Otherwise, get prefix of email (before @)
 */
export function getShortName(
  fullName?: string | null,
  email?: string | null
): string {
  const firstName = fullName?.split(' ')?.[0];
  const emailPrefix = email?.split('@')?.[0];
  return firstName ?? emailPrefix ?? '';
}

interface UserEntry {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

/**
 * Helper hook for obtaining user related information
 *
 * - Full name (if available)
 * - Short name (either first name, or prefix of email)
 * - Name initial
 * - Email
 * - Image
 */
export function useUserInfo() {
  const { data } = useSession();

  const user: UserEntry = data?.user ?? {};

  return {
    fullName: user.name ?? '',
    shortName: getShortName(user.name, user.email),
    initial: acronym(user.name),
    email: user.email ?? '',
    image: user.image,
  };
}
