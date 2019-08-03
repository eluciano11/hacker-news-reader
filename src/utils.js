const MONTHS = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December"
};

function formatDate(date) {
  const month = MONTHS[date.getMonth()];
  const minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const hour =
    date.getHours() - 12 > 0 ? date.getHours() - 12 : date.getHours();
  const postfix =
    date.getHours() - 12 >= 0 && Number(minutes) >= 0 ? "pm" : "am";

  return `${month} ${date.getDate()}, ${date.getFullYear()} ${hour}:${minutes}${postfix}`;
}

function convertUnixTimestamp(timestamp) {
  return timestamp * 1000;
}

export { formatDate, convertUnixTimestamp };
