/**
 * Format the provided date object using the locale of the browser.
 *
 * @example August 2, 2019, 3:00pm
 *
 * @param {Object} date - Date information.
 * @return {string} Formatted date.
 */
function formatDate(date) {
  if (date && date instanceof Date) {
    return new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    }).format(date);
  }

  return "";
}

/**
 * Conver the provided unix timestamp to milliseconds
 * @param {*} timestamp
 */
function convertToMilliseconds(timestamp = 0) {
  if (isNaN(timestamp)) {
    return 0;
  }

  return timestamp * 1000;
}

export { formatDate, convertToMilliseconds };
