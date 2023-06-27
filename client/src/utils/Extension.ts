import moment from "moment";

export function capitalize(str?: string) {
  if (!str) return;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function fromNow(str?: string) {
  if (!str) return;
  return moment(str).fromNow();
}
