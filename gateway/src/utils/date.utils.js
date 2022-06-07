

const getWeekNumber = function (_date) {
  const date = new Date(_date.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
    - 3 + (week1.getDay() + 6) % 7) / 7);
};

const getDateFromTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()} ${date.getUTCHours()}:00:00`;
};

const getMonthName = (monthNumber) => {
  monthNumber = Array.isArray(monthNumber) ? monthNumber : [monthNumber-1];

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  return monthNumber.length > 1 ? `${months[monthNumber[0]]}-${months[monthNumber[1]]}` : months[monthNumber[0]];
};

const getDayOfWeekName = (dowNumber) => {
  const dow = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dow[dowNumber];
};

module.exports = { getDateFromTimestamp, getMonthName, getDayOfWeekName };