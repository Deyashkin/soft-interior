/** Склейка CSS-классов: cx('a', flag && 'b') → "a b" */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
