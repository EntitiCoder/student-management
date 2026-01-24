'use client';

import { approveSubmission, rejectSubmission } from '@/lib/actions';
import ImagePreviewModal from '@/components/ImagePreviewModal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

type ApprovalModalProps = {
    submission: {
        id: number;
        status: string;
        submittedAt: Date;
        student: {
            id: string;
            name: string;
            surname: string;
            username: string;
            photo: string;
        };
        files: Array<{
            id: number;
            url: string;
            fileName: string;
        }>;
        reviewedAt?: Date | null;
        rejectionReason?: string | null;
        teacherNote?: string | null;
        finalPoints?: number | null;
        reviewer?: {
            id: string;
            name: string;
            surname: string;
        } | null;
    };
    teacherId: string;
    onClose: () => void;
};

export default function ApprovalModal({
    submission,
    teacherId,
    onClose,
}: ApprovalModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [action, setAction] = useState<'approve' | 'reject' | null>(null);
    const [teacherNote, setTeacherNote] = useState('');
    const [finalPoints, setFinalPoints] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [previewImage, setPreviewImage] = useState<{ url: string; fileName: string } | null>(null);
    const router = useRouter();

    const handleApprove = async () => {
        setIsProcessing(true);
        try {
            const result = await approveSubmission(
                submission.id,
                teacherId,
                teacherNote || undefined,
                finalPoints ? parseInt(finalPoints) : undefined
            );

            if (result.success) {
                toast.success('Submission approved successfully!');
                router.refresh();
                onClose();
            } else {
                toast.error(result.message || 'Failed to approve submission');
            }
        } catch (error) {
            toast.error('An error occurred');
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error('Rejection reason is required');
            return;
        }

        setIsProcessing(true);
        try {
            const result = await rejectSubmission(
                submission.id,
                teacherId,
                rejectionReason,
                teacherNote || undefined
            );

            if (result.success) {
                toast.success('Submission rejected');
                router.refresh();
                onClose();
            } else {
                toast.error(result.message || 'Failed to reject submission');
            }
        } catch (error) {
            toast.error('An error occurred');
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

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

    const isPending = submission.status === 'PENDING';

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Review Submission</h2>

            {/* Student Info */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg flex items-center gap-4">
                <Image
                    src={submission.student.photo || '/avatar.png'}
                    alt={submission.student.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <p className="font-medium text-gray-900">
                        {submission.student.name} {submission.student.surname}
                    </p>
                    <p className="text-sm text-gray-600">@{submission.student.username}</p>
                </div>
                <div className="ml-auto">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}
                    >
                        {submission.status}
                    </span>
                </div>
            </div>

            {/* Submitted Files */}
            <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Submitted Files:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {submission.files.map((file) => {
                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.fileName);

                        return isImage ? (
                            <button
                                key={file.id}
                                onClick={() => setPreviewImage({ url: file.url, fileName: file.fileName })}
                                className="group relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-md cursor-pointer"
                            >
                                <img
                                    src={file.url}
                                    alt={file.fileName}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                                    <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                                        🔍 View Full
                                    </span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-2 truncate">
                                    {file.fileName}
                                </div>
                            </button>
                        ) : (
                            <a
                                key={file.id}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm transition-colors col-span-2"
                            >
                                <span className="text-2xl">📎</span>
                                <span className="text-blue-700 underline truncate">{file.fileName}</span>
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* Submission Date */}
            <p className="text-sm text-gray-600 mb-4">
                Submitted: {new Date(submission.submittedAt).toLocaleString()}
            </p>

            {/* Existing Review Info (if already reviewed) */}
            {!isPending && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Review Details:</p>
                    {submission.reviewer && (
                        <p className="text-sm text-gray-600 mb-1">
                            Reviewed by: {submission.reviewer.name} {submission.reviewer.surname}
                        </p>
                    )}
                    {submission.reviewedAt && (
                        <p className="text-sm text-gray-600 mb-1">
                            Reviewed on: {new Date(submission.reviewedAt).toLocaleString()}
                        </p>
                    )}
                    {submission.rejectionReason && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm font-medium text-red-900">Rejection Reason:</p>
                            <p className="text-sm text-red-800">{submission.rejectionReason}</p>
                        </div>
                    )}
                    {submission.teacherNote && (
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
                            <p className="text-sm font-medium text-blue-900">Teacher Note:</p>
                            <p className="text-sm text-blue-800">{submission.teacherNote}</p>
                        </div>
                    )}
                    {submission.finalPoints !== null && (
                        <p className="text-sm text-gray-600 mt-2">
                            Final Points: <span className="font-semibold">{submission.finalPoints}</span>
                        </p>
                    )}
                </div>
            )}

            {/* Action Selection (only for pending submissions) */}
            {isPending && !action && (
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => setAction('approve')}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                    >
                        ✓ Approve
                    </button>
                    <button
                        onClick={() => setAction('reject')}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                    >
                        ✗ Reject
                    </button>
                </div>
            )}

            {/* Approve Form */}
            {action === 'approve' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-3">Approve Submission</h3>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Final Points (Optional)
                        </label>
                        <input
                            type="number"
                            value={finalPoints}
                            onChange={(e) => setFinalPoints(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Enter points"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teacher Note (Optional)
                        </label>
                        <textarea
                            value={teacherNote}
                            onChange={(e) => setTeacherNote(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows={3}
                            placeholder="Add any comments..."
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleApprove}
                            disabled={isProcessing}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            {isProcessing ? 'Processing...' : 'Confirm Approval'}
                        </button>
                        <button
                            onClick={() => setAction(null)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Reject Form */}
            {action === 'reject' && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-medium text-red-900 mb-3">Reject Submission</h3>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rejection Reason *
                        </label>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows={3}
                            placeholder="Explain why this submission is being rejected..."
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Additional Note (Optional)
                        </label>
                        <textarea
                            value={teacherNote}
                            onChange={(e) => setTeacherNote(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows={2}
                            placeholder="Add any additional comments..."
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleReject}
                            disabled={isProcessing}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                            {isProcessing ? 'Processing...' : 'Confirm Rejection'}
                        </button>
                        <button
                            onClick={() => setAction(null)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Close button for already reviewed submissions */}
            {!isPending && (
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
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
