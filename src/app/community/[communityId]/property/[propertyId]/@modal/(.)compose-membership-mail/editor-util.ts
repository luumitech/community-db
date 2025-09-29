import {
  BeautifulMentionsCssClassNames,
  BeautifulMentionsTheme,
} from 'lexical-beautiful-mentions';
import * as R from 'remeda';
import { InputData } from './use-hook-form';

/** Construct mention values */
export function createMentionValues(
  membershipYear: string,
  toItems: InputData['hidden']['toItems'],
  toEmail: string
) {
  const toEmailList = toEmail.split(',').filter((email) => !!email);
  const toList = toEmailList.map(
    (email) => toItems.find((entry) => entry.email === email)!
  );
  const memberNames = R.pipe(
    toList,
    R.map(({ firstName }) => firstName),
    R.unique(),
    R.join(', ')
  );
  return {
    membershipYear,
    memberNames,
  };
}

/**
 * Construct mention mapping, which contains mapping between menu item that
 * appear in the mention menu, along with its corresponding substitution value
 */
export function createMentionMapping(
  arg?: ReturnType<typeof createMentionValues>
) {
  // Default mention values should have at least one character
  return {
    ['Membership Year']: arg?.membershipYear ?? 'o',
    ['Member Names']: arg?.memberNames ?? 'o',
  };
}

export const mentionClass: BeautifulMentionsCssClassNames = {
  trigger: 'hidden',
  value: 'text-secondary-600',
  container: 'bg-secondary/20 rounded-md h-7 px-1',
  containerFocused: '',
};
export const theme: BeautifulMentionsTheme = {
  '@': mentionClass,
};
