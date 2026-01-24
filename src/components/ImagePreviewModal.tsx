'use client';

import Image from 'next/image';
import { useState } from 'react';

type ImagePreviewModalProps = {
    imageUrl: string;
    fileName: string;
    onClose: () => void;
};

export default function ImagePreviewModal({
    imageUrl,
    fileName,
    onClose,
}: ImagePreviewModalProps) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="relative max-w-7xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                >
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Image */}
                <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        </div>
                    )}
                    <img
                        src={imageUrl}
                        alt={fileName}
                        className="max-w-full max-h-[80vh] w-auto h-auto mx-auto"
                        onLoad={() => setIsLoading(false)}
                    />

                    {/* Filename and download link */}
                    <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-700 font-medium truncate flex-1">
                            {fileName}
                        </p>
                        <a
                            href={imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4 px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Open in New Tab
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
