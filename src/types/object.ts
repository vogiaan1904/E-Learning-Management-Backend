export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type OmitAndPartial<T, K extends keyof T> = Partial<Omit<T, K>>;
