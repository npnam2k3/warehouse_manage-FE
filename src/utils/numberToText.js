export function convertCurrencyToWords(number) {
  if (!Number.isInteger(number) || number < 0) {
    return "Số tiền phải là số nguyên không âm";
  }

  if (number === 0) {
    return "Không đồng";
  }

  const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];
  const numbers = [
    "không",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];

  function convertThreeDigits(num) {
    let result = "";
    let hundred = Math.floor(num / 100);
    let ten = Math.floor((num % 100) / 10);
    let one = num % 10;

    if (hundred > 0) {
      result += numbers[hundred] + " trăm";
      if (ten > 0 || one > 0) result += " ";
    }

    if (ten === 1) {
      result += "mười";
      if (one > 0) {
        if (one === 5) {
          result += " lăm";
        } else if (one === 1) {
          result += " một";
        } else {
          result += " " + numbers[one];
        }
      }
    } else if (ten > 1) {
      result += numbers[ten] + " mươi";
      if (one > 0) {
        if (one === 5) {
          result += " lăm";
        } else if (one === 1) {
          result += " mốt";
        } else {
          result += " " + numbers[one];
        }
      }
    } else if (one > 0) {
      result += numbers[one];
    }

    return result.trim();
  }

  let result = "";
  let unitIndex = 0;
  let num = number;

  while (num > 0) {
    let threeDigits = num % 1000;
    if (threeDigits > 0) {
      let threeDigitsText = convertThreeDigits(threeDigits);
      if (unitIndex > 0) {
        result =
          threeDigitsText +
          " " +
          units[unitIndex] +
          (result ? " " + result : "");
      } else {
        result = threeDigitsText;
      }
    }
    num = Math.floor(num / 1000);
    unitIndex++;
  }

  return result.trim() + " đồng";
}

// Ví dụ sử dụng:
// console.log(convertCurrencyToWords(123456789));
// Output: "một trăm hai mươi ba triệu bốn trăm năm mươi sáu nghìn bảy trăm tám mươi chín đồng"
