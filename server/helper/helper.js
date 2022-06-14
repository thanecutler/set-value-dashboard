module.exports = {
  calcPercentChange: (curr, prev) => {
    if (curr && prev) {
      let diff = curr - prev;
      return parseFloat(((diff / prev) * 100).toFixed(2));
    }
    return 0;
  },
};
