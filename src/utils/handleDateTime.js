import moment from "moment-timezone";

export const formattedDateTime = (dateFromDb) =>
  moment(dateFromDb).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY - HH:mm");
