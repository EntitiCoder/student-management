import Announcements from '@/components/Announcements';
import FormModal from '@/components/FormModal';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
// import BigCalendar from '@/components/BigCalender';
// import Performance from '@/components/Performance';
import Image from 'next/image';
import Link from 'next/link';

const SingleStudentPage = async ({ params }: any) => {
  const handleEditStudent: any = () => {
    console.log('Edit Student');
  };

  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  const studentId = params.id;
  // By ID
  const student = await prisma.student?.findUnique({
    where: {
      id: studentId,
    },
    include: {
      // grade: true,
      class: {
        include: {
          posts: true,
        },
      },
    },
  });

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={student?.photo}
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">
                {student?.name} {student?.surname}
              </h1>
              {/* <button
                className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold"
                onClick={handleEditStudent}
              >
                Edit Student Info
              </button> */}
              <div className="bg-black w-fit">
                {role === 'admin' && (
                  // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                  //   <Image src="/plus.png" alt="" width={14} height={14} />
                  // </button>
                  <FormModal table="student" type="update" />
                )}
              </div>

              <p className="text-sm text-gray-500">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{student?.address}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>
                    {student?.birthday?.toISOString().substring(0, 10)}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{student?.email}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{student?.phone}</span>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src={'/singleAttendance.png'}
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">6th</h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">
                  {student?.class?.posts?.length}
                </h1>
                <span className="text-sm text-gray-400">Posts in Class</span>
              </div>
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">{student?.class.name}</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        {/* <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          <BigCalendar />
        </div> */}
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link
              className="p-3 rounded-md bg-[#f0f0f0]"
              href={`/list/classes/${student?.classId}`}
            >
              Student&apos;s Class
            </Link>
            {/* <Link className="p-3 rounded-md bg-lamaPurpleLight" href="/">
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
            </Link> */}
          </div>
        </div>
        {/* <Performance /> */}
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
