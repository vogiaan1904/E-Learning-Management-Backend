import _ from "lodash";

export const removeFieldsFromObject = <T extends object, K extends keyof T>(
  data: T,
  keys: Array<K>,
): Omit<T, K> => {
  return _.omit(data, keys) as Omit<T, K>;
};

export const pickFieldsFromObject = <T extends object, K extends keyof T>(
  data: T,
  keys: Array<K>,
): Pick<T, K> => {
  return _.pick(data, keys) as Pick<T, K>;
};

export const getValueFromObject = <T extends object>(
  data: object,
  key: string,
): T => {
  return _.get(data, key) as T;
};
