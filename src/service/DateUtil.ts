export default class DateUtil {
  public static transformDate(createdDate: Date | undefined): string | null {
    if (createdDate) {
      return new Date(createdDate).toLocaleDateString([], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    }
    return '-';
  }
}
