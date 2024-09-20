import _ from "lodash";

export const removeFieldsFromObject = <T extends object>(
  data: T,
  keys: Array<keyof T>,
): Omit<T, keyof T> => {
  return _.omit(data, keys) as Omit<T, keyof T>;
};

export const pickFieldsFromObject = <T extends object>(
  data: T,
  keys: Array<keyof T>,
): Pick<T, keyof T> => {
  return _.pick(data, keys) as Pick<T, keyof T>;
};

export const getValueFromObject = <T extends object>(
  data: object,
  key: string,
): T => {
  return _.get(data, key) as T;
};
