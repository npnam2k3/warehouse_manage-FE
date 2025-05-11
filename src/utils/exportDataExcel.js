import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const exportToExcel = ({
  data,
  fileName = "ExportData",
  sheetName = "Sheet1",
}) => {
  // Tạo worksheet từ dữ liệu
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Tạo workbook và thêm worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Xuất file Excel
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Tạo blob và tải file
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
};

export default exportToExcel;
