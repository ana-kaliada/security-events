const dateTimeFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const formatDateTime = (timestamp: number) => {
  return dateTimeFormatter.format(timestamp);
};
