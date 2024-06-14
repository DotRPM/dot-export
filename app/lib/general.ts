export function getNestedProperty<T>(obj: T, key: string): any {
  const property = key
    .split(".")
    .reduce((o, i) => (o ? (o as any)[i] : undefined), obj);
  if (Array.isArray(property)) return property.join(", ");
  else return property;
}

export function truncateString(str: string, length: number) {
  if (str.length > length) {
    return str.slice(0, length) + "...";
  } else {
    return str;
  }
}

export function capitalizeFirstLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1, str.length);
}
