/**
 * Given a map in the form id (number) to an array return the array associated
 * with the id (initialize to empty array if it is empty)
 *
 * @param map Input map (from id to array)
 * @param id Id to retrieve
 * @returns
 */
export function getMapValue<T>(map: Map<number, T[]>, id: number) {
  let list = map.get(id);
  if (!list) {
    list = [];
    map.set(id, list);
  }
  return list;
}
