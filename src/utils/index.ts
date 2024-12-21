export function converToNumber(text: string | undefined) {
  try {
    if (text) {
      return parseInt(text);
    }
  } catch {}

  return 0;
}

export function converToDateElementString(
  date: Date | undefined
): string | undefined {
  try {
    if (date) {
      const month = converToNumberString(date.getMonth() + 1);
      const day = converToNumberString(date.getDate());

      return date.getFullYear().toString() + "-" + month + "-" + day;
    }
  } catch {}

  return undefined;
}

export function converTotString(date: Date | undefined): string | undefined {
  try {
    if (date) {
      const month = converToNumberString(date.getMonth() + 1);
      const day = converToNumberString(date.getDate());

      return month + "/" + day + "/" + date.getFullYear().toString();
    }
  } catch {}

  return undefined;
}

export function convertToLongDateString(date: Date) {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${weekDays[date.getDay()]}, ${converToNumberString(date.getDate())} ${
    months[date.getMonth()]
  }`;
}

//#region LocalFunctions
function converToNumberString(no: number) {
  return no > 9 ? no.toString() : "0" + no.toString();
}
////#endregion
