import {
  BeautifulMentionsCssClassNames,
  BeautifulMentionsTheme,
} from 'lexical-beautiful-mentions';
import { InputData } from './use-hook-form';

/**
 * Construct mention mapping, which contains mapping between menu item that
 * appear in the mention menu, along with its corresponding substitution value
 */
export function createMentionMapping(
  membershipYear: string,
  toItems: InputData['hidden']['toItems'],
  toEmail: string
) {
  const toEmailList = toEmail.split(',');
  const toList = toEmailList.map(
    (email) => toItems.find((entry) => entry.email === email)!
  );
  const memberNames = toList.map(({ firstName }) => firstName).join(', ');
  return {
    ['Member Names']: memberNames,
    ['Membership Year']: membershipYear,
  };
}

export const mentionClass: BeautifulMentionsCssClassNames = {
  trigger: 'hidden',
  value: 'text-secondary-600',
  container: 'bg-secondary/20 rounded-full h-7 px-1',
  containerFocused: '',
};
export const theme: BeautifulMentionsTheme = {
  '@': mentionClass,
};
