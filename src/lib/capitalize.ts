export default (str: string): string => {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
};
