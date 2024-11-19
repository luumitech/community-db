import { Coerce } from './coerce';
import { String } from './string';
export { z } from 'zod';

class ZZ {
  /** Coercion utility */
  coerce = new Coerce();

  /** String validation utility */
  string = new String();
}

/**
 * Zod custom extensions
 *
 * - Coerce input to a specific type
 * - Common validation utility
 */
export const zz = new ZZ();
