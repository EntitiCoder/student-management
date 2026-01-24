import SubmissionList from '@/components/SubmissionList';
import { formatDateTime } from '@/lib/dateUtils';
import { getClassStudentsWithSubmissionStatus } from '@/lib/queries';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type PageProps = {
    params: {
        id: string;
        postId: string;
    };
};

export default async function PostSubmissionsPage({ params }: PageProps) {
    const user = await currentUser();
    const role = user?.publicMetadata.role as string;
    const classId = Number(params.id);
    const postId = Number(params.postId);

    // Only teachers and admins can view this page
    if (role !== 'teacher' && role !== 'admin') {
        return notFound();
    }

    // Fetch post data
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
        include: {
            media: {
                select: {
                    url: true,
                    fileName: true,
                },
            },
            class: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    if (!post || post.classId !== classId) {
        return notFound();
    }

    // Fetch all students with their submission status
    const students = await getClassStudentsWithSubmissionStatus(classId, postId);

    return (
        <div className="flex-1 p-4 flex flex-col gap-4">
            {/* Breadcrumb / Navigation */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Link
                    href="/list/classes"
                    className="hover:text-purple-600 transition-colors"
                >
                    Classes
                </Link>
                <span>›</span>
                <Link
                    href={`/list/classes/${classId}`}
                    className="hover:text-purple-600 transition-colors"
                >
                    {post.class.name}
                </Link>
                <span>›</span>
                <span className="text-gray-900 font-medium">{post.title}</span>
            </div>

            {/* Post Details Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h1>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Description:</p>
                        <p className="text-gray-800">{post.description}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600 mb-1">Posted:</p>
                        <p className="text-gray-800">{formatDateTime(post.createdAt)}</p>
                    </div>
                </div>

                {post.media && post.media.length > 0 && (
                    <div>
                        <p className="text-sm text-gray-600 mb-2">Attached Files:</p>
                        <div className="flex flex-wrap gap-2">
                            {post.media.map((file, index) => (
                                <a
                                    key={index}
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 rounded-md text-sm transition-colors"
                                >
                                    <span>📎</span>
                                    <span className="text-purple-700">{file.fileName}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Submissions List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <SubmissionList
                    classId={classId}
                    postId={postId}
                    students={students as any}
                    teacherId={user!.id}
                />
            </div>

            {/* Back Button */}
            <div className="flex justify-start">
                <Link
                    href={`/list/classes/${classId}`}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                    ← Back to Class
                </Link>
            </div>
        </div>
    );
}
