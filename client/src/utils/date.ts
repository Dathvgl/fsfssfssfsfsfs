import moment from "moment";

export const nowISO = () => new Date(Date.now()).toISOString();

export const durationUTC = (duration: number, format: string = "mm:ss") =>
  moment
    .utc(moment.duration(duration, "seconds").asMilliseconds())
    .format(format);
