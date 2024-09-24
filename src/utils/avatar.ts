export const generateCustomAvatarUrl = (
  firstName: string,
  lastName: string,
) => {
  return `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`;
};
