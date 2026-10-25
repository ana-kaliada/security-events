const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const formatDateTime = (timestamp: number) => {
  return dateTimeFormatter.format(timestamp);
};
