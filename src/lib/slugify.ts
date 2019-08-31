export default (s: string) =>
  s
    .split(' ')
    .filter((x) => !!x)
    .map((x) => x.toLocaleLowerCase())
    .join('-');
