import { CustomError } from "models/errror";

export function strCheck(str: unknown) {
  if (typeof str == "string") return str;
  else throw new CustomError("Invalid string", 500);
}

export function strCheckUd(str: unknown) {
  if (typeof str == "string" || typeof str == "undefined") return str;
  else throw new CustomError("Invalid string", 500);
}

export function numCheck(num: unknown) {
  if (typeof num != "string") throw new CustomError("Invalid number", 500);
  if (!Number.parseInt(num)) throw new CustomError("Invalid number", 500);
  return Number.parseInt(num);
}

export function numCheckUd(num: unknown) {
  if (typeof num == "undefined") return undefined;
  if (typeof num != "string") throw new CustomError("Invalid number", 500);
  if (!Number.parseInt(num)) throw new CustomError("Invalid number", 500);
  return Number.parseInt(num);
}

export function notNull(params: string | null) {
  return params !== null ? params : "";
}
