'use client';

import { createSubmission } from '@/lib/actions';
import ImagePreviewModal from '@/components/ImagePreviewModal';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

type SubmissionFormProps = {
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
    setOpen: (open: boolean) => void;
};

export default function SubmissionForm({
    postId,
    studentId,
    existingSubmission,
    setOpen,
}: SubmissionFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<{ url: string; fileName: string } | null>(null);
    const router = useRouter();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);
            const result = await createSubmission(formData);

            if (result.success) {
                toast.success('Submission uploaded successfully!');
                setOpen(false);
                router.refresh();
            } else {
                toast.error(result.message || 'Failed to upload submission');
            }
        } catch (error) {
            toast.error('An error occurred');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if submission is approved (students can't update approved submissions)
    const isApproved = existingSubmission?.status === 'APPROVED';

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">
                {existingSubmission ? (isApproved ? 'Approved Submission' : 'Update Submission') : 'Submit Completion Proof'}
            </h2>

            {/* Display existing submission status */}
            {existingSubmission && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">Current Status:</span>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(existingSubmission.status)}`}
                        >
                            {existingSubmission.status}
                        </span>
                    </div>

                    {existingSubmission.files && existingSubmission.files.length > 0 && (
                        <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Current Files:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {existingSubmission.files.map((file) => {
                                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.fileName);

                                    return isImage ? (
                                        <button
                                            key={file.id}
                                            onClick={() => setPreviewImage({ url: file.url, fileName: file.fileName })}
                                            className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition-colors cursor-pointer"
                                        >
                                            <img
                                                src={file.url}
                                                alt={file.fileName}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                                {file.fileName}
                                            </div>
                                        </button>
                                    ) : (
                                        <a
                                            key={file.id}
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors col-span-2"
                                        >
                                            <span>📎</span>
                                            <span className="text-gray-700 truncate">{file.fileName}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {existingSubmission.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm font-medium text-red-900 mb-1">
                                Rejection Reason:
                            </p>
                            <p className="text-sm text-red-800">
                                {existingSubmission.rejectionReason}
                            </p>
                        </div>
                    )}

                    {existingSubmission.teacherNote && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm font-medium text-blue-900 mb-1">
                                Teacher Note:
                            </p>
                            <p className="text-sm text-blue-800">
                                {existingSubmission.teacherNote}
                            </p>
                        </div>
                    )}

                    {isApproved && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                            <p className="text-sm font-semibold text-green-800">
                                ✅ Your submission has been approved! No further action needed.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Upload form - only show if NOT approved */}
            {!isApproved && (
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="studentId" value={studentId} />
                    <input type="hidden" name="postId" value={postId} />

                    <div className="mb-4">
                        <label
                            htmlFor="files"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Upload Proof Files {existingSubmission ? '(New files will replace old ones)' : '*'}
                        </label>
                        <input
                            type="file"
                            id="files"
                            name="files"
                            multiple
                            accept="image/*,.pdf"
                            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-50 file:text-purple-700
              hover:file:bg-purple-100"
                            required={!existingSubmission}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Accepted formats: Images (JPG, PNG) and PDF. You can select multiple files.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Uploading...' : existingSubmission ? 'Update Submission' : 'Submit'}
                        </button>
                    </div>
                </form>
            )}

            {/* Close button for approved submissions */}
            {isApproved && (
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
                    >
                        Close
                    </button>
                </div>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <ImagePreviewModal
                    imageUrl={previewImage.url}
                    fileName={previewImage.fileName}
                    onClose={() => setPreviewImage(null)}
                />
            )}
        </div>
    );
}
