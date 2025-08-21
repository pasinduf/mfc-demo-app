export const dayOfWeek = (dayIndex: number) => {
  return (
    [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ][dayIndex - 1] || ''
  );
};
