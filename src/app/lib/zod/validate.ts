/** Validation function for checking if number is positive */
export function isPositive(msg?: string) {
  return (val: number) => {
    if (val < 0) {
      return msg ?? 'Must be a positive number';
    }
    return null;
  };
}
