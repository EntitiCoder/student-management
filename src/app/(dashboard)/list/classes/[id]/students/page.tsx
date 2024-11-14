import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import StudentListPage from '../../../students/page';

const StudentListByClassPage = async ({ params, searchParams }: any) => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  const classId = Number(params.id);
  const { page, ...queryParams } = searchParams;
  const { id } = params;

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

  return (
    <StudentListPage searchParams={{ page }} query={{ classId: Number(id) }} />
  );
};

export default StudentListByClassPage;
