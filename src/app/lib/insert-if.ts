/**
 * Helper utility for conditionally insert one or more objects into an array
 *
 * @example
 * const arr = [
 *    ...insertIf(true, 'a'),
 *    'b',
 * ]
 * expect(arr).toBe(['a', 'b']);
 */
export function insertIf<T>(condition: boolean, ...elements: T[]) {
  return condition ? elements : [];
}
