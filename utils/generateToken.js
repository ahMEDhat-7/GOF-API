import JWT from "jsonwebtoken";
export default (payload, exp = "1d") => {
  return JWT.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: exp,
  });
};
