export default class CachePolicy {
  private static maxAgeInDays = 3

  private constructor() {}

  static validate(timestamp: string | Date, date: Date) {
    const maxDate = new Date(timestamp)
    maxDate.setDate(maxDate.getDate() + this.maxAgeInDays)

    return maxDate > date
  }
}