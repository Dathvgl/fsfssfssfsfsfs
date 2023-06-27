import { ProjectionMongo } from "types/mongo/mongoDB";

export function parseIProjection<T>(array: (keyof T)[]) {
  try {
    const projection: ProjectionMongo = {};
    array.forEach((item) => {
      projection[item as string] = 1;
    });
    return projection;
  } catch (error) {
    return {};
  }
}

export function parseIArray<T>(array: (keyof T)[]) {
  try {
    return array;
  } catch (error) {
    return [];
  }
}
