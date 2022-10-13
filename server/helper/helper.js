module.exports = {
  calcPercentChange: (curr, prev) => {
    if (curr && prev) {
      let diff = curr - prev;
      return parseFloat(((diff / prev) * 100).toFixed(2));
    }
    return 0;
  },
  getToday: () => {
    let todayNewDate = new Date();
    let todayToLocale = todayNewDate
      .toLocaleString("en-US", {
        timeZone: "America/Chicago",
      })
      .split(",")[0];
    let today = new Date(todayToLocale);
    today.setUTCHours(0, 0, 0, 0);

    return today;
  },
};
