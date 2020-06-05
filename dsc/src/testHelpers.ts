import { strict as a } from "assert"

export const cellEqual = (n0: any, n1: any) => {
  a.equal(n0.value, n1.value);
  a.equal(n0.kind, n1.kind);
}
