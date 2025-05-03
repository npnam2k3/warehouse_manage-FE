import moment from "moment-timezone";
import dayjs from "dayjs";

export const formattedDateTime = (dateFromDb) =>
  moment(dateFromDb).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY - HH:mm");

export function formatVietnameseDate(isoString) {
  return dayjs(isoString).format("Ngày DD [tháng] MM [năm] YYYY");
}
