/**
 * Create a copy of an array with deleted item on a certain index.
 */
export function deleteItemImmutable<T>(arr: T[], i: number) {
  return [...arr.slice(0, i), ...arr.slice(i + 1)];
}

/**
 * Create a copy of an array with replaced item on a certain index.
 */
export function updateItemImmutable<T>(arr: T[], item: T, i: number): T[] {
  return [...arr.slice(0, i), item, ...arr.slice(i + 1)];
}

/**
 * Create a copy of an array with item moved from position `fr` to position `to`.
 */
export function fromtoItemImmutable<T>(arr: T[], fr: number, to: number): T[] {
  const res = Array.from(arr);
  const [e] = res.splice(fr, 1);
  res.splice(to, 0, e);

  return res;
}
