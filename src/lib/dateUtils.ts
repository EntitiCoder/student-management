import dayjs from 'dayjs';

export const formatLastActiveAt = (timestamp: number | null | undefined) => {
  return dayjs(timestamp).format('MMMM DD, YYYY [at] hh:mm:ss A');
};

export const formatDateTime = (timestamp: Date) => {
  return dayjs(timestamp).format('DD-MM-YYYY hh:mm:ss A');
};

export const formateDayOnly = (timestamp: Date) => {
  return dayjs(timestamp).format('DD-MM-YYYY');
};
