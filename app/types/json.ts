/* eslint-disable @typescript-eslint/no-explicit-any */
// types/json.ts

export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | JSONArray;

export interface JSONObject {
  [key: string]: JSONValue;
}

export type JSONArray = JSONValue[];

function mapToObject(map: Map<string, JSONValue>): JSONObject {
  const obj: JSONObject = {};
  for (const [key, value] of map) {
    obj[key] = value instanceof Map ? mapToObject(value) : value;
  }
  return obj;
}

export function convertToJSON(
  data: Record<string, JSONValue | Map<string, JSONValue>>
): JSONObject {
  const result: JSONObject = {};
  for (const key in data) {
    const value = data[key];
    if (value instanceof Map) {
      result[key] = mapToObject(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
