export type EnumeratorMember = {
  name: string;
  kind: "property" | "method";
  detail: string;
};

export const stdEnumeratorMembers: EnumeratorMember[] = [
  { name: "Length", kind: "property", detail: "stdEnumerator property" },
  { name: "Item", kind: "property", detail: "stdEnumerator property" },
  { name: "AsCollection", kind: "method", detail: "stdEnumerator method" },
  { name: "AsArray", kind: "method", detail: "stdEnumerator method" },
  { name: "AsArray2D", kind: "method", detail: "stdEnumerator method" },
  { name: "AsDictionary", kind: "method", detail: "stdEnumerator method" },
  { name: "ForEach", kind: "method", detail: "stdEnumerator method" },
  { name: "Map", kind: "method", detail: "stdEnumerator method" },
  { name: "Filter", kind: "method", detail: "stdEnumerator method" },
  { name: "Sort", kind: "method", detail: "stdEnumerator method" },
  { name: "Unique", kind: "method", detail: "stdEnumerator method" },
  { name: "Reverse", kind: "method", detail: "stdEnumerator method" },
  { name: "Concat", kind: "method", detail: "stdEnumerator method" },
  { name: "Join", kind: "method", detail: "stdEnumerator method" },
  { name: "indexOf", kind: "method", detail: "stdEnumerator method" },
  { name: "lastIndexOf", kind: "method", detail: "stdEnumerator method" },
  { name: "includes", kind: "method", detail: "stdEnumerator method" },
  { name: "checkAll", kind: "method", detail: "stdEnumerator method" },
  { name: "checkAny", kind: "method", detail: "stdEnumerator method" },
  { name: "checkNone", kind: "method", detail: "stdEnumerator method" },
  { name: "checkOnlyOne", kind: "method", detail: "stdEnumerator method" },
  { name: "reduce", kind: "method", detail: "stdEnumerator method" },
  { name: "countBy", kind: "method", detail: "stdEnumerator method" },
  { name: "groupBy", kind: "method", detail: "stdEnumerator method" },
  { name: "groupByEx", kind: "method", detail: "stdEnumerator method" },
  { name: "max", kind: "method", detail: "stdEnumerator method" },
  { name: "min", kind: "method", detail: "stdEnumerator method" },
  { name: "sum", kind: "method", detail: "stdEnumerator method" },
  { name: "Flatten", kind: "method", detail: "stdEnumerator method" },
  { name: "Cycle", kind: "method", detail: "stdEnumerator method" },
  { name: "FindFirst", kind: "method", detail: "stdEnumerator method" },
  { name: "First", kind: "method", detail: "stdEnumerator method" }
];
