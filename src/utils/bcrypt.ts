import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hashData = (data: string) => {
  return bcrypt.hashSync(data, SALT_ROUNDS);
};

export const compareHashData = (data: string, hashData: string) => {
  return bcrypt.compareSync(data, hashData);
};
