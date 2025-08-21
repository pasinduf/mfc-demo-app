export const createObjectWithoutEmptyValues = <T>(object: T): T => {
  const objectWithoutEmptyValues: any = { ...object };

  Object.keys(objectWithoutEmptyValues).forEach((key: string) => {
    if (
      objectWithoutEmptyValues[key as keyof object] === '' ||
      objectWithoutEmptyValues[key as keyof object] === null
    ) {
      delete objectWithoutEmptyValues[key as keyof object];
    }
  });

  return objectWithoutEmptyValues;
};
