import dayjs from 'dayjs';

export const formatLastActiveAt = (timestamp: number | null | undefined) => {
  return dayjs(timestamp).format('MMMM DD, YYYY [at] hh:mm:ss A');
};
