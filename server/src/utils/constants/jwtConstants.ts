import { envs } from "index";

export const secretToken = {
  access: envs.ACCESS_TOKEN_SECRET ?? "jwtAccess",
  refresh: envs.REFRESH_TOKEN_SECRET ?? "jwtRefresh",
};

export const expireToken = {
  access: Number.parseInt(envs.ACCESS_TOKEN_EXPIRE ?? "") || 15 * 60,
  refresh: Number.parseInt(envs.REFRESH_TOKEN_EXPIRE ?? "") || 24 * 60 * 60,
};

export const expireMiliToken = {
  access: expireToken.access * 1000,
  refresh: expireToken.refresh * 1000,
};
