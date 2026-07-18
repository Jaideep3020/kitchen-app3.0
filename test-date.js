const date = '2026-07-28';
const dateObj = new Date(date);
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
console.log(days[dateObj.getDay()]);
