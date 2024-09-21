export const validateEmail = (email: string) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email.trim());
};
