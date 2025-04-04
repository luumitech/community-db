import { redirect } from 'next/navigation';
import { GUIDE_ITEMS } from './guide-menu/guide-items';

export default function Tutorial() {
  redirect(GUIDE_ITEMS[0].path);
}
