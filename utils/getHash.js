import bcrypt from "bcrypt";

/**
 * hash password
 * @param {string} password
 * @returns hashedPassword
 */
export const getHash = (password) => {
  return bcrypt.hash(password, +process.env.HASH_SALT);
};

/**
 * compare password with hashed password
 * @param {string} password
 * @param {string} hashedPassword
 * @returns
 */
export const hashMatch = (pass, hash) => {
  return bcrypt.compare(pass, hash);
};
