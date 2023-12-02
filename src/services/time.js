export const createDateFromWeekdayAndTime = (weekdayName, time24) => {
  // Mapping of weekday names to day numbers
  const weekdays = {
    "sunday": 0,
    "monday": 1,
    "tuesday": 2,
    "wednesday": 3,
    "thursday": 4,
    "friday": 5,
    "saturday": 6
  };

  // Convert the input weekday name to lowercase for case-insensitive matching
  const lowercaseWeekdayName = weekdayName.toLowerCase();

  // Check if the input weekday name is in the mapping
  if (!(lowercaseWeekdayName in weekdays)) {
    console.error("Invalid weekday name:", weekdayName);
    return null;
  }

  // Split the time string into hours, minutes, and seconds
  const [hours, minutes, seconds] = time24.split(":").map(Number);

  // Create a new Date object and set the day, hours, minutes, and seconds
  const dateObject = new Date();
  dateObject.setHours(hours, minutes, seconds, 0);
  dateObject.setDate(dateObject.getDate() + (weekdays[lowercaseWeekdayName] + 7 - dateObject.getDay()) % 7);

  return dateObject;
}

export const formatTimeRange = (date1, date2) => {
  const optionsWithWeekday = {
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  const optionsWithoutWeekday = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  const formattedDate1 = date1.toLocaleString('en-US', optionsWithWeekday);
  const formattedDate2 = date2.toLocaleString('en-US', optionsWithoutWeekday);

  return `${formattedDate1} - ${formattedDate2}`;
}