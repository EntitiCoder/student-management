'use client';

import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-700">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold">Access Denied</h1>
      </div>
      <p className="mt-4 text-center text-lg text-gray-600">
        You don't have permission to view this class. Please check with your
        administrator or go back to the classes list.
      </p>
      <button
        onClick={handleGoBack}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Back to Profile
      </button>
    </div>
  );
};

export default NotFound;
