import moment from "moment-timezone";

const getTimeNow = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss");
};
const calculateEndDate = (min) => {
  return moment().add(min, "minutes").format("YYYY-MM-DD HH:mm:ss");
};

export { calculateEndDate, getTimeNow };
