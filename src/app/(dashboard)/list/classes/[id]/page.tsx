// import BigCalendar from '@/components/BigCalender';
// import Performance from '@/components/Performance';
import CardInfo from '@/components/CardInfo';
import FormContainer from '@/components/FormContainer';
import FormPostContainer from '@/components/FormPostContainer';
import SubmissionFormContainer from '@/components/SubmissionFormContainer';
import SubmissionList from '@/components/SubmissionList';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { formatDateTime } from '@/lib/dateUtils';
import {
  getClassStudentsWithSubmissionStatus,
  getSingleClass,
  getStudentClassId,
  getStudentSubmission,
} from '@/lib/queries';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostType } from '@prisma/client';

type Post = {
  createdAt: Date;
  id: number;
  title: string;
  type: PostType;
  dueAt: Date;
  description: string;
  classId: number;
  media: any[];
};

const columns = [
  {
    header: 'No',
    accessor: 'no',
    className: 'w-[60px]',
  },
  {
    header: 'Created At',
    accessor: 'createdAt',
    className: 'w-[180px] hidden md:table-cell ',
  },
  {
    header: 'Title',
    accessor: 'title',
  },
  {
    header: 'Type',
    accessor: 'type',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Deadline',
    accessor: 'dueAt',
    className: 'hidden lg:table-cell',
  },
  {
    header: 'Description',
    accessor: 'description',
  },
  // Link
  {
    header: 'Media File',
    accessor: 'media',
  },
  {
    header: 'Actions',
    accessor: 'actions',
  },
];

const SingleClassPage = async ({ params }: any) => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  const classId = Number(params.id);

  // Use centralized query functions
  const [classData, studentData] = await Promise.all([
    getSingleClass(classId),
    user?.id ? getStudentClassId(user.id) : null,
  ]);

  if (
    role == 'student' &&
    (!studentData || studentData.classId !== Number(params.id))
  ) {
    // toast.error('You are not allowed to view this class');
    return notFound();
  }

  // Fetch student submissions if user is a student
  let studentSubmissions: Record<number, any> = {};
  if (role === 'student' && user?.id && classData?.posts) {
    const submissions = await Promise.all(
      classData.posts.map(post =>
        getStudentSubmission(post.id, user.id)
      )
    );

    submissions.forEach((submission: any, index: number) => {
      if (submission) {
        studentSubmissions[classData.posts![index].id] = submission;
      }
    });
  }

  const renderRow = (item: Post, index: number) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-gray-50 text-sm hover:bg-purple-100 transition-colors duration-150"
    >
      {/* Serial Number */}
      <td className="p-4 text-center text-gray-700 font-medium">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold">
          {index + 1}
        </span>
      </td>

      {/* Created Date */}
      <td className="hidden md:table-cell py-4 w-[180px] text-gray-600">
        {formatDateTime(item.createdAt)}
      </td>

      {/* Title */}
      <td className="p-4 font-medium text-gray-800">{item.title}</td>

      {/* Type */}
      <td className="hidden md:table-cell p-4">
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${item.type === 'HOMEWORK' ? 'bg-red-100 text-red-700' :
          item.type === 'VOCAB' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
          {item.type === 'HOMEWORK' ? '📝 Homework' :
            item.type === 'VOCAB' ? '📚 Vocab' :
              '📢 Announcement'}
        </span>
      </td>

      {/* Deadline */}
      <td className="hidden lg:table-cell p-4 text-sm">
        {item.type === 'HOMEWORK' && item.dueAt ? (
          <div className="flex flex-col">
            <span className={`font-medium ${new Date(item.dueAt) < new Date() ? 'text-red-600' : 'text-gray-700'
              }`}>
              {formatDateTime(item.dueAt)}
            </span>
            {new Date(item.dueAt) < new Date() && (
              <span className="text-xs text-red-500">Overdue</span>
            )}
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>

      {/* Description */}
      <td className="p-4">
        <Link
          href={item?.description}
          rel="noopener noreferrer"
          target="_blank"
          className="text-blue-500 flex items-center gap-2"
        >
          <span className="underline hover:text-blue-700 transition-colors duration-150">
            {item.description || 'View Description'}
          </span>
        </Link>
      </td>

      {/* Media */}
      <td className="p-4">
        {item?.media[0]?.url ? (
          <Link
            href={item?.media[0]?.url}
            rel="noopener noreferrer"
            target="_blank"
            className="text-blue-500 flex items-center gap-2"
          >
            {/* <span className="material-icons text-blue-500">attach_file</span> */}
            <span className="underline hover:text-blue-700 transition-colors duration-150">
              {item?.media[0]?.fileName || 'Media File'}
            </span>
          </Link>
        ) : (
          <span className="text-gray-400 italic">No Media</span>
        )}
      </td>

      {/* Actions */}
      <td className="py-4">
        <div className="flex items-center gap-2">
          {role === 'student' && user?.id && (
            <SubmissionFormContainer
              postId={item.id}
              studentId={user.id}
              existingSubmission={studentSubmissions[item.id] || null}
            />
          )}
          {(role === 'admin' || role === 'teacher') && (
            <>
              <Link
                href={`/list/classes/${classId}/posts/${item.id}`}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md text-sm font-medium text-blue-700 transition-colors"
              >
                📊 Submissions
              </Link>
              {role === 'admin' && (
                <>
                  <FormPostContainer
                    data={item}
                    type="update"
                    id={item.id}
                    classId={classId}
                  />
                  <FormPostContainer
                    data={item}
                    type="delete"
                    id={item.id}
                    classId={classId}
                  />
                </>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );

  const cardInfoList = [
    {
      data: classData?._count?.students,
      title: 'Total Students',
      icon: (
        <Image
          src="/singleBranch.png"
          alt=""
          width={24}
          height={24}
          className="w-6 h-6"
        />
      ),
      linkTo: `/list/students?classId=${classId}`,
    },
    {
      data: classData?.grade?.id,
      title: 'Grade',
      icon: (
        <Image
          src="/singleClass.png"
          alt=""
          width={24}
          height={24}
          className="w-6 h-6"
        />
      ),
    },
    {
      data: classData?._count?.posts,
      title: 'Posts',
      icon: (
        <Image
          src="/singleLesson.png"
          alt=""
          width={24}
          height={24}
          className="w-6 h-6"
        />
      ),
    },

    {
      data: classData?.time,
      title: 'Schedule',
      icon: (
        <Image
          src="/singleClass.png"
          alt=""
          width={24}
          height={24}
          className="w-6 h-6"
        />
      ),
    },
  ];

  return (
    <div className="flex-1 p-4 flex flex-col gap-4">
      {/* LEFT */}
      <div className="w-full">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-col md:flex-row bg-lamaSky py-6 px-6 rounded-lg flex gap-6">
            <div className="w-full md:w-1/3 flex flex-1 flex-col items-center">
              <Image
                src={classData?.photo ?? '/defaultClass.jpg'}
                alt="Class Photo"
                width={144}
                height={144}
                className="w-40 h-40 rounded-md object-cover mb-4"
              />
            </div>
            <div className="w-full md:w-2/3 flex flex-1 flex-col justify-between gap-6">
              <h1 className="text-2xl flex gap-2 font-semibold text-gray-800">
                {classData?.name}{' '}
                {role === 'admin' && (
                  <>
                    <FormContainer
                      table="class"
                      type="update"
                      data={classData}
                    />
                  </>
                )}
              </h1>
              {/*  description of class */}
              <p className="text-gray-500">
                Chào mừng đến với lớp học của Miss Thùy Class
              </p>
              {/* Additional Information (if needed) */}
              {/* Uncomment if you want to add more info */}
              {/* <div className="flex items-center justify-between gap-4 text-xs font-medium text-gray-500">



              {/* Additional Information (if needed) */}
              {/* Uncomment if you want to add more info */}
              {/* <div className="flex items-center justify-between gap-4 text-xs font-medium text-gray-500">
      <div className="flex items-center gap-2">
        <Image src="/blood.png" alt="Blood Type" width={14} height={14} />
        <span>A+</span>
      </div>
      <div className="flex items-center gap-2">
        <Image src="/date.png" alt="Date" width={14} height={14} />
        <span>January 2025</span>
      </div>
    </div> */}
            </div>
          </div>

          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {cardInfoList.map((cardInfo, index) => (
              <CardInfo
                key={index}
                data={cardInfo.data}
                title={cardInfo.title}
                icon={cardInfo.icon}
                linkTo={cardInfo.linkTo}
              />
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-md flex-1 my-4">
          <h1 className="text-lg font-semibold mb-2">All Posts</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {role === 'admin' && (
                <FormPostContainer type="create" classId={classId} />
              )}
            </div>
          </div>
          <Table
            columns={columns}
            renderRow={renderRow}
            data={classData?.posts as any[]}
          />
          {/* <Pagination page={p} count={count} /> */}
        </div>
      </div>
      {/* <StudentListPage searchParams={{ page: '1' }} query={{ classId }} /> */}
      {/* RIGHT */}
      {/* <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
              Student&apos;s Lessons
            </Link>
            <Link className="p-3 rounded-md bg-lamaPurpleLight" href="/">
              Student&apos;s Teachers
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href="/">
              Student&apos;s Exams
            </Link>
            <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
              Student&apos;s Assignments
            </Link>
            <Link className="p-3 rounded-md bg-lamaYellowLight" href="/">
              Student&apos;s Results
            </Link>
          </div>
        </div>
        <Announcements />
      </div> */}
    </div>
  );
};

export default SingleClassPage;
