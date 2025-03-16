import STATUS from "../utils/STATUS.js";

const notFoundHandler = (req, res) => {
  return res.status(404).json({
    status: STATUS.ERROR,
    message: "resource not found",
  });
};

export default {
  notFoundHandler,
};
