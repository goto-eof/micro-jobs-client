export default class PaginationUtil {
  static calculatePageNumber = (itemsCount: number) => {
    let count = Math.trunc(itemsCount / 10);
    if (itemsCount > 10 && (itemsCount / 10) % 10 > 0) {
      count += 1;
    }
    return count;
  };
}
