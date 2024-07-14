/**
 * Sort an array of data based on a specified key.
 *
 * @param {Array} data - The array of data to sort.
 * @param {string} key - The key to sort the data by. If the array contains primitive values (e.g., numbers or strings), pass an empty string.
 * @param {boolean} [ascending=true] - Whether to sort in ascending order. Defaults to true.
 * @returns {Array} The sorted array.
 */
export const sortArray = (data: any[], key = "", ascending = true) => {
  if (!Array.isArray(data)) {
    throw new Error("The first argument must be an array");
  }

  const compareFunction = (a: any, b: any) => {
    let valueA = key ? a[key] : a;
    let valueB = key ? b[key] : b;

    if (valueA < valueB) {
      return ascending ? -1 : 1;
    }
    if (valueA > valueB) {
      return ascending ? 1 : -1;
    }
    return 0;
  };

  return data.sort(compareFunction);
};
