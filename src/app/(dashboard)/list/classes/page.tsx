import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { currentUser } from '@clerk/nextjs/server';
import { Prisma } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ViewIcon from '../../../../../public/icons/ViewIcon';

type Class = {
  id: number;
  name: string;
  capacity: number;
  grade: Grade;
  supervisor: string;
  time: string;
  students: any[];
};

interface Props {
  searchParams: {
    page: string;
  };
}

const ClassListPage = async ({ searchParams }: Props) => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;

  const columns = [
    {
      header: 'No',
      accessor: 'no',
    },
    {
      header: 'Class Name',
      accessor: 'name',
    },
    {
      header: 'Capacity',
      accessor: 'capacity',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Grade',
      accessor: 'grade',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Total Students',
      accessor: 'students',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Time',
      accessor: 'time',
      className: 'hidden md:table-cell',
    },
    {
      header: 'Actions',
      accessor: 'action',
    },
  ];

  if (role === 'student') {
    return notFound();
  }

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  // URL PARAMS CONDITION

  const query: Prisma.ClassWhereInput = {};

  // if (queryParams) {
  //   for (const [key, value] of Object.entries(queryParams)) {
  //     if (value !== undefined) {
  //       switch (key) {
  //         case "supervisorId":
  //           query.supervisorId = value;
  //           break;
  //         case "search":
  //           query.name = { contains: value, mode: "insensitive" };
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  //   }
  // }

  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: {
        // supervisor: true,
        grade: {
          select: {
            id: true,
          },
        },
        students: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.class.count({ where: query }),
  ]);

  const renderRow = (item: Class, index: number) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight "
    >
      <td className="gap-4 p-4">{index + 1}</td>
      <td className="flex items-center gap-4 p-4">{item.name}</td>
      <td className="flex items-center gap-4 p-4 hidden md:table-cell">
        {item.capacity}
      </td>
      <td className="flex items-center gap-4 p-4 hidden md:table-cell">
        {item.grade.id}
      </td>
      <td className="flex items-center gap-4 p-4 hidden md:table-cell">
        {item.students.length}
      </td>
      <td className="flex items-center gap-4 p-4 hidden md:table-cell">
        {item.time}
      </td>
      <td className="">
        <div className="flex items-center gap-2">
          <Link href={`/list/classes/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-[#fff]">
              <ViewIcon />
            </button>
          </Link>
          {role === 'admin' && (
            <>
              <FormContainer table="class" type="update" data={item} />
              <FormContainer table="class" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Classes</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === 'admin' && <FormContainer table="class" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default ClassListPage;
