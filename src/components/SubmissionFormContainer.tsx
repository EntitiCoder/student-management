'use client';

import SubmissionForm from '@/components/forms/SubmissionForm';
import Image from 'next/image';
import { useState } from 'react';

interface SubmissionFormContainerProps {
    postId: number;
    studentId: string;
    existingSubmission?: {
        id: number;
        status: string;
        files: Array<{
            id: number;
            url: string;
            fileName: string;
        }>;
        rejectionReason?: string | null;
        teacherNote?: string | null;
        reviewedAt?: Date | null;
    } | null;
}

const SubmissionFormContainer = ({
    postId,
    studentId,
    existingSubmission,
}: SubmissionFormContainerProps) => {
    const [open, setOpen] = useState(false);

    const getStatusBadge = () => {
        if (!existingSubmission) {
            return (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    Not Submitted
                </span>
            );
        }

        const statusColors = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            APPROVED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800',
        };

        return (
            <span
                className={`px-2 py-1 rounded text-xs ${statusColors[existingSubmission.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'}`}
            >
                {existingSubmission.status}
            </span>
        );
    };

    return (
        <div>
            <button
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 rounded-md text-sm font-medium text-purple-700 transition-colors"
                onClick={() => setOpen(true)}
            >
                {existingSubmission ? (
                    <>
                        <span>📋</span>
                        <span>View/Update</span>
                        {getStatusBadge()}
                    </>
                ) : (
                    <>
                        <span>📤</span>
                        <span>Submit</span>
                    </>
                )}
            </button>

            {open && (
                <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto">
                        <SubmissionForm
                            postId={postId}
                            studentId={studentId}
                            existingSubmission={existingSubmission}
                            setOpen={setOpen}
                        />
                        <div
                            className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => setOpen(false)}
                        >
                            <Image src="/close.png" alt="Close" width={14} height={14} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionFormContainer;
