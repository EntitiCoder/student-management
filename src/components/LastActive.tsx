import { ClockIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';

// Function to format timestamp
const formatLastActiveAt = (timestamp: number | null | undefined) => {
  return dayjs(timestamp).format('MMMM DD, YYYY [at] hh:mm:ss A');
};

// Last Active Component
const LastActive = ({ time }: { time: number | null | undefined }) => {
  return (
    <div className="flex items-center space-x-2 text-gray-600">
      <ClockIcon className="w-5 h-5 text-blue-500" />
      <span className="font-medium">Last Active:</span>
      <span className="text-gray-700">{formatLastActiveAt(time)}</span>
    </div>
  );
};

export default LastActive;
