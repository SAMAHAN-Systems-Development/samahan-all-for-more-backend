export function isEmpty(array: any[]): boolean {
  return !array || array.length === 0;
}

export function createMessagePart(
  count: number,
  type: string,
  singularLabel: string,
  pluralLabel: string,
): string {
  return count > 0
    ? `${type} ${count} ${count === 1 ? singularLabel : pluralLabel}`
    : '';
}
