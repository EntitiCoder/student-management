// import BigCalendar from '@/components/BigCalender';
// import Performance from '@/components/Performance';
import CardInfo from '@/components/CardInfo';
import FormPostContainer from '@/components/FormPostContainer';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { formatDateTime } from '@/lib/dateUtils';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Post = {
  createdAt: Date;
  id: number;
  title: string;
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
    className: 'w-[180px]',
  },
  {
    header: 'Title',
    accessor: 'title',
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
  // By ID
  const classData = await prisma.class?.findUnique({
    where: {
      id: classId,
    },
    include: {
      grade: true,
      posts: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          media: {
            select: {
              url: true,
              fileName: true,
              // type: true,
            },
          },
        },
      },
      students: true,
    },
  });

  const studentData = await prisma.student.findUnique({
    where: { id: user?.id },
    select: { classId: true },
  });

  if (
    role == 'student' &&
    (!studentData || studentData.classId !== Number(params.id))
  ) {
    // toast.error('You are not allowed to view this class');
    return notFound();
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
      <td className="py-4 w-[180px] text-gray-600">
        {formatDateTime(item.createdAt)}
      </td>

      {/* Title */}
      <td className="py-4 font-medium text-gray-800">{item.title}</td>

      {/* Description */}
      <td className="py-4">
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
      <td className="py-4">
        {item?.media[0]?.url ? (
          <Link
            href={item?.media[0]?.url}
            rel="noopener noreferrer"
            target="_blank"
            className="text-blue-500 flex items-center gap-2"
          >
            <span className="material-icons text-blue-500">attach_file</span>
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
        </div>
      </td>
    </tr>
  );

  const cardInfoList = [
    {
      data: classData?.students?.length,
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
      data: classData?.posts?.length,
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
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={'/defaultClass.jpg'}
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">{classData?.name}</h1>
              <p className="text-sm text-gray-500">
                Capacity: {classData?.capacity}
                <br />
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </p>
              {/* <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>A+</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>January 2025</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>user@gmail.com</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>+1 234 567</span>
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
        <div className="bg-white p-4 rounded-md flex-1 m-4">
          <h1 className="hidden md:block text-lg font-semibold mb-2">
            All Posts
          </h1>
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
