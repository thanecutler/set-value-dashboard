export const formatSpace = (text) => {
  return text.replace(" ", "%20");
};

export const formatDate = (timestamp) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = timestamp.split("T")[0];
  return `${months[date.split("-")[1] - 1]} ${date.split("-")[2]}, ${
    date.split("-")[0]
  }`;
};

export const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const calcPercentChange = (curr, prev) => {
  if (curr && prev) {
    let diff = curr - prev;
    return ((diff / curr) * 100).toFixed(2);
  }
  return 0;
};

export const getPerformance = (t1, t2) => {
  return ((t2 - t1) * 0.001).toFixed(2);
};
