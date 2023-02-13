/**
 * Transform date obtained from shopify api to string format.
 * @param strDate - Date string from Shopify usually obtains from an order.processedAt
 * @param languageCode - this is the local we get from router. ex : router.locale
 * @param tZ - this is currently just used to pass tests. toLocaleDateString defaults to runtime default time zone
 * @returns Formatted string for date display.
 * @example getFormattedDate('2022-12-15T06:23:53Z', 'EN') // December 15, 2022.
 */

export default function getFormattedDate(
  strDate: string,
  languageCode: string,
  tZ?: string
) {
  const date = new Date(strDate);

  /** curently this is just to pass test cases since 
   toLocaleDateString will default to runtime default time zone */
  if (tZ)
    return date.toLocaleDateString(languageCode, {
      month: 'long',
      year: 'numeric',
      day: 'numeric',
      timeZone: tZ
    });

  return date.toLocaleDateString(languageCode, {
    month: 'long',
    year: 'numeric',
    day: 'numeric'
  });
}
