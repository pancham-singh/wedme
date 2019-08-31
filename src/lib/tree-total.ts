export interface TreeTotal {
  operation: 'add' | 'multiply';
  left: TreeTotal | string;
  right: TreeTotal | string;
}

const getFieldValue = (values: any, field: string, operation: 'add' | 'multiply') =>
  values[field] ? Number(values[field]) : operation === 'multiply' ? 1 : 0;

export const treeHasField = (t: TreeTotal, field: string) => {
  const isLeft = typeof t.left === 'string' ? t.left === field : treeHasField(t.left, field);
  const isRight = typeof t.right === 'string' ? t.right === field : treeHasField(t.right, field);

  return isLeft || isRight;
};

export const calculateTreeTotal = (t: TreeTotal, values: any): number => {
  const left =
    typeof t.left === 'string'
      ? getFieldValue(values, t.left, t.operation)
      : calculateTreeTotal(t.left, values);
  const right =
    typeof t.right === 'string'
      ? getFieldValue(values, t.right, t.operation)
      : calculateTreeTotal(t.right, values);

  return t.operation === 'multiply' ? left * right : left + right;
};
