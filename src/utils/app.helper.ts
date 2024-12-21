const AppHelper = {
  convertToDate(date: Date) {
    const dateString = date.toString();

    const year = dateString.substring(0, 4);
    const month = dateString.substring(5, 7);
    const day = dateString.substring(8, 10);

    const newDateString = month + "/" + day + "/" + year;

    const convertedDate = new Date(newDateString);

    return convertedDate;
  },
};

export default AppHelper;
