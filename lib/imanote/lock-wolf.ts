/**
 * Converts only the number of entered characters into a decorative wolf-peek progress value.
 * The input value itself is deliberately never inspected or retained.
 */
export function getLockWolfPeekProgress(enteredCharacterCount: number) {
  if (!Number.isFinite(enteredCharacterCount) || enteredCharacterCount <= 0) return 0;
  return Math.min(1, 0.5 + Math.floor(enteredCharacterCount) * 0.13);
}
