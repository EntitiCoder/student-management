'use client';

import ApprovalModal from '@/components/ApprovalModal';
import ImagePreviewModal from '@/components/ImagePreviewModal';
import Image from 'next/image';
import { useState } from 'react';

type SubmissionListProps = {
    classId: number;
    postId: number;
    students: Array<{
        id: string;
        name: string;
        surname: string;
        username: string;
        photo: string;
        submissions: Array<{
            id: number;
            status: string;
            submittedAt: Date;
            reviewedAt?: Date | null;
            rejectionReason?: string | null;
            teacherNote?: string | null;
            finalPoints?: number | null;
            files: Array<{
                id: number;
                url: string;
                fileName: string;
            }>;
            reviewer?: {
                id: string;
                name: string;
                surname: string;
            } | null;
        }>;
    }>;
    teacherId: string;
};

export default function SubmissionList({
    classId,
    postId,
    students,
    teacherId,
}: SubmissionListProps) {
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'notsubmitted'>('all');
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [previewImage, setPreviewImage] = useState<{ url: string; fileName: string } | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const filteredStudents = students.filter((student) => {
        const submission = student.submissions[0];

        if (filter === 'all') return true;
        if (filter === 'notsubmitted') return !submission;
        if (filter === 'pending') return submission?.status === 'PENDING';
        if (filter === 'approved') return submission?.status === 'APPROVED';
        if (filter === 'rejected') return submission?.status === 'REJECTED';

        return true;
    });

    const stats = {
        total: students.length,
        submitted: students.filter(s => s.submissions[0]).length,
        pending: students.filter(s => s.submissions[0]?.status === 'PENDING').length,
        approved: students.filter(s => s.submissions[0]?.status === 'APPROVED').length,
        rejected: students.filter(s => s.submissions[0]?.status === 'REJECTED').length,
        notSubmitted: students.filter(s => !s.submissions[0]).length,
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Student Submissions</h2>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-xs text-gray-600">Total</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-900">{stats.submitted}</p>
                    <p className="text-xs text-blue-600">Submitted</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
                    <p className="text-xs text-yellow-600">Pending</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
                    <p className="text-xs text-green-600">Approved</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
                    <p className="text-xs text-red-600">Rejected</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-900">{stats.notSubmitted}</p>
                    <p className="text-xs text-gray-600">Not Yet</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    All ({stats.total})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'pending'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                >
                    Pending ({stats.pending})
                </button>
                <button
                    onClick={() => setFilter('approved')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'approved'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                >
                    Approved ({stats.approved})
                </button>
                <button
                    onClick={() => setFilter('rejected')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'rejected'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                >
                    Rejected ({stats.rejected})
                </button>
                <button
                    onClick={() => setFilter('notsubmitted')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'notsubmitted'
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Not Submitted ({stats.notSubmitted})
                </button>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="p-3 text-left text-sm font-medium text-gray-700">Student</th>
                            <th className="p-3 text-left text-sm font-medium text-gray-700">Status</th>
                            <th className="p-3 text-left text-sm font-medium text-gray-700">Files</th>
                            <th className="p-3 text-left text-sm font-medium text-gray-700">Submitted</th>
                            <th className="p-3 text-left text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => {
                            const submission = student.submissions[0];

                            return (
                                <tr
                                    key={student.id}
                                    className="border-b hover:bg-gray-50 transition-colors"
                                >
                                    {/* Student Info */}
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={student.photo || '/avatar.png'}
                                                alt={student.name}
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {student.name} {student.surname}
                                                </p>
                                                <p className="text-xs text-gray-500">@{student.username}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="p-3">
                                        {submission ? (
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}
                                            >
                                                {submission.status}
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                Not Submitted
                                            </span>
                                        )}
                                    </td>

                                    {/* Files */}
                                    <td className="p-3">
                                        {submission && submission.files.length > 0 ? (
                                            <div className="flex items-center gap-2">
                                                {submission.files.slice(0, 2).map((file) => {
                                                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.fileName);
                                                    return isImage ? (
                                                        <button
                                                            key={file.id}
                                                            onClick={() => setPreviewImage({ url: file.url, fileName: file.fileName })}
                                                            className="w-10 h-10 object-cover rounded border border-gray-300 hover:border-purple-500 cursor-pointer transition-colors"
                                                        >
                                                            <img
                                                                src={file.url}
                                                                alt={file.fileName}
                                                                className="w-full h-full object-cover rounded"
                                                            />
                                                        </button>
                                                    ) : (
                                                        <div
                                                            key={file.id}
                                                            className="w-10 h-10 bg-gray-100 rounded border border-gray-300 flex items-center justify-center text-xs"
                                                        >
                                                            📄
                                                        </div>
                                                    );
                                                })}
                                                {submission.files.length > 2 && (
                                                    <span className="text-xs text-gray-500">
                                                        +{submission.files.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">—</span>
                                        )}
                                    </td>

                                    {/* Submitted Date */}
                                    <td className="p-3">
                                        {submission ? (
                                            <span className="text-sm text-gray-600">
                                                {new Date(submission.submittedAt).toLocaleDateString()}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-400">—</span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="p-3">
                                        {submission ? (
                                            <button
                                                onClick={() =>
                                                    setSelectedSubmission({ ...submission, student })
                                                }
                                                className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                                            >
                                                Review
                                            </button>
                                        ) : (
                                            <span className="text-sm text-gray-400">—</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredStudents.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No students match the selected filter
                    </div>
                )}
            </div>

            {/* Approval Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto">
                        <ApprovalModal
                            submission={selectedSubmission}
                            teacherId={teacherId}
                            onClose={() => setSelectedSubmission(null)}
                        />
                        <div
                            className="absolute top-4 right-4 cursor-pointer"
                            onClick={() => setSelectedSubmission(null)}
                        >
                            <Image src="/close.png" alt="Close" width={14} height={14} />
                        </div>
                    </div>
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
