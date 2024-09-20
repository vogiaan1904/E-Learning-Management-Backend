export const generateVerificationCode = (codeLength = 6) => {
  const code = Array.from({ length: codeLength }, () =>
    Math.floor(Math.random() * 10),
  ).join("");
  return code;
};
