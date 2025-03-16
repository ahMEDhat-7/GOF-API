import moment from "moment-timezone";

const momentNow = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss");
};
const formattedDate = (min) => {
  return moment().add(min, "minutes").format("YYYY-MM-DD HH:mm:ss");
};

export default { formattedDate, momentNow };
