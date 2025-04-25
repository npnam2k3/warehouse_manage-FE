import * as yup from "yup";
// Schema validate với yup
export const schema = yup.object().shape({
  name: yup
    .string()
    .required("Tên sản phẩm là bắt buộc")
    .min(3, "Tên sản phẩm tối thiểu 3 ký tự")
    .max(80, "Tên sản phẩm tối đa 80 ký tự"),
  purchase_price: yup
    .number()
    .typeError("Giá nhập phải là số")
    .required("Giá nhập là bắt buộc")
    .min(1, "Giá nhập tối thiểu là 1")
    .max(100000000, "Giá nhập tối đa 100.000.000"),
  sell_price: yup
    .number()
    .typeError("Giá bán phải là số")
    .required("Giá bán là bắt buộc")
    .min(1, "Giá bán tối thiểu là 1")
    .max(100000000, "Giá bán tối đa 100.000.000"),
  category: yup
    .number()
    .typeError("Vui lòng chọn danh mục")
    .required("Vui lòng chọn danh mục"),
  unit: yup
    .number()
    .typeError("Vui lòng chọn đơn vị tính")
    .required("Vui lòng chọn đơn vị tính"),
  description: yup.string().max(500, "Mô tả tối đa 500 ký tự"),
  image: yup
    .mixed()
    .nullable()
    .test(
      "fileType",
      "Chỉ chấp nhận ảnh JPEG hoặc PNG",
      (value) => !value || ["image/jpeg", "image/png"].includes(value.type)
    )
    .test(
      "fileSize",
      "Dung lượng ảnh không được vượt quá 5MB",
      (value) => !value || value.size <= 5 * 1024 * 1024
    ),
});

// export const schemaUpdate = yup.object().shape({
//   name: yup
//     .string()
//     .test(
//       "not-empty-if-exists",
//       "Tên sản phẩm không được để trống",
//       (value, context) => {
//         const original = context.options.context?.original?.name;
//         return !original || (value && value.trim().length > 0);
//       }
//     )
//     .min(3, "Tên sản phẩm tối thiểu 3 ký tự")
//     .max(80, "Tên sản phẩm tối đa 80 ký tự"),
//   purchase_price: yup
//     .number()
//     .typeError("Giá nhập phải là số")
//     .test(
//       "not-empty-if-exists",
//       "Giá nhập không được để trống",
//       (value, context) => {
//         const original = context.options.context?.original?.purchase_price;
//         return !original || value !== undefined;
//       }
//     )
//     .min(1, "Giá nhập tối thiểu là 1")
//     .max(100000000, "Giá nhập tối đa 100.000.000"),
//   sell_price: yup
//     .number()
//     .typeError("Giá bán phải là số")
//     .test(
//       "not-empty-if-exists",
//       "Giá bán không được để trống",
//       (value, context) => {
//         const original = context.options.context?.original?.sell_price;
//         return !original || value !== undefined;
//       }
//     )
//     .min(1, "Giá bán tối thiểu là 1")
//     .max(100000000, "Giá bán tối đa 100.000.000"),
//   category: yup
//     .number()
//     .typeError("Vui lòng chọn danh mục")
//     .test(
//       "not-empty-if-exists",
//       "Danh mục không được để trống",
//       (value, context) => {
//         const original = context.options.context?.original?.category?.id;
//         return !original || value !== null;
//       }
//     ),
//   unit: yup
//     .number()
//     .typeError("Vui lòng chọn đơn vị tính")
//     .test(
//       "not-empty-if-exists",
//       "Đơn vị tính không được để trống",
//       (value, context) => {
//         const original = context.options.context?.original?.unit?.id;
//         return !original || value !== null;
//       }
//     ),
//   description: yup.string().max(500, "Mô tả tối đa 500 ký tự"),
//   image: yup
//     .mixed()
//     .nullable()
//     .test(
//       "fileType",
//       "Chỉ chấp nhận ảnh JPEG hoặc PNG",
//       (value) => !value || ["image/jpeg", "image/png"].includes(value.type)
//     )
//     .test(
//       "fileSize",
//       "Dung lượng ảnh không được vượt quá 5MB",
//       (value) => !value || value.size <= 5 * 1024 * 1024
//     ),
// });

export const schemaUpdate = yup.object().shape({
  name: yup
    .string()
    .test(
      "not-empty-if-exists",
      "Tên sản phẩm không được để trống",
      (value, context) => {
        const original = context.options.context?.original?.name;
        return !original || (value && value.trim().length > 0);
      }
    )
    .min(3, "Tên sản phẩm tối thiểu 3 ký tự")
    .max(80, "Tên sản phẩm tối đa 80 ký tự"),
  purchase_price: yup
    .mixed()
    .test(
      "is-number",
      "Giá nhập phải là số",
      (value) => value === undefined || value === "" || !isNaN(value)
    )
    .test(
      "not-empty-if-exists",
      "Giá nhập không được để trống",
      (value, context) => {
        const original = context.options.context?.original?.purchase_price;
        return !original || (value !== undefined && value !== "");
      }
    )
    .test(
      "min",
      "Giá nhập tối thiểu là 1",
      (value) => value === undefined || value === "" || value >= 1
    )
    .test(
      "max",
      "Giá nhập tối đa 100.000.000",
      (value) => value === undefined || value === "" || value <= 100000000
    ),
  sell_price: yup
    .mixed()
    .test(
      "is-number",
      "Giá bán phải là số",
      (value) => value === undefined || value === "" || !isNaN(value)
    )
    .test(
      "not-empty-if-exists",
      "Giá bán không được để trống",
      (value, context) => {
        const original = context.options.context?.original?.sell_price;
        return !original || (value !== undefined && value !== "");
      }
    )
    .test(
      "min",
      "Giá bán tối thiểu là 1",
      (value) => value === undefined || value === "" || value >= 1
    )
    .test(
      "max",
      "Giá bán tối đa 100.000.000",
      (value) => value === undefined || value === "" || value <= 100000000
    ),
  category: yup
    .number()
    .nullable()
    .test(
      "not-empty-if-exists",
      "Danh mục không được để trống",
      (value, context) => {
        const original = context.options.context?.original?.category?.id;
        // Nếu sản phẩm gốc có category, value không được null
        return original === undefined || original === null || value !== null;
      }
    ),
  unit: yup
    .number()
    .nullable()
    .test(
      "not-empty-if-exists",
      "Đơn vị tính không được để trống",
      (value, context) => {
        const original = context.options.context?.original?.unit?.id;
        // Nếu sản phẩm gốc có unit, value không được null
        return original === undefined || original === null || value !== null;
      }
    ),
  description: yup.string().max(500, "Mô tả tối đa 500 ký tự"),
  image: yup
    .mixed()
    .nullable()
    .test(
      "fileType",
      "Chỉ chấp nhận ảnh JPEG hoặc PNG",
      (value) => !value || ["image/jpeg", "image/png"].includes(value.type)
    )
    .test(
      "fileSize",
      "Dung lượng ảnh không được vượt quá 5MB",
      (value) => !value || value.size <= 5 * 1024 * 1024
    ),
});
