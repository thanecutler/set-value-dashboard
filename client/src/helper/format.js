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

export const commaFormatter = (i) => {
  if (i > 0) {
    return i.toLocaleString("en-US");
  }
  return 0;
};

export const calcPercentChange = (curr, prev) => {
  if (curr && prev) {
    let diff = curr - prev;
    return ((diff / prev) * 100).toFixed(2);
  }
  return 0;
};

export const getPerformance = (t1, t2) => {
  return ((t2 - t1) * 0.001).toFixed(2);
};

export const getColor = (today, yesterday) => {
  if (today > yesterday) {
    return "green";
  }
  if (today === yesterday) {
    return "black";
  }
  return "red";
};

export const calculateAveragePercentChange = (arr, lastNumDays) => {
  let percentages = [];
  let startIndex = lastNumDays ? arr.length - lastNumDays : 0;
  for (let i = startIndex; i < arr.length; i++) {
    let curr = arr[i];
    let next = arr[i + 1];
    if (i + 1 < arr.length) {
      let percentage = (next - curr) / curr;
      percentages.push(percentage);
    }
  }
  return percentages.reduce((sum, a) => sum + a, 0).toFixed(2) * 100;
};

export const convertTZ = (date, tzString) => {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
};
