export function isNull(v: any): null {
  if (v !== null) {
    throw new Error(`${v} is not a null`);
  }
  return null;
}

export function isUndefined(v: any): undefined {
  if (typeof v !== "undefined") {
    throw new Error(`${v} is not undefined`);
  }
  return void 0;
}

export function isNumber(v: any): number {
  if (typeof v !== "number") {
    throw new Error(`${v} is not a number`);
  }
  return v;
}

export function isString(v: any): string {
  if (typeof v !== "string") {
    throw new Error(`${v} is not a string`);
  }
  return v;
}

export function isBoolean(v: any): boolean {
  if (typeof v !== "boolean") {
    throw new Error(`${v} is not a boolean`);
  }
  return v;
}
