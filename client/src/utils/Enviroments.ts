import { Envs } from "~/types/env";

export const envs: Envs = JSON.parse(JSON.stringify(import.meta.env));
