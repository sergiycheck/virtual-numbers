export function mergeArrs<T extends { id: any }>(arr1: T[], arr2: T[]) {
  const dict1 = arr1.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
  const dict2 = arr2.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
  const dict = {
    ...dict2,
    ...dict1,
  };
  return Object.values(dict) as T[];
}
