import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { getClasses } from '@/lib/queries';
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
  photo?: string;
  _count: {
    students: number;
  };
};

interface Props {
  searchParams: {
    page: string;
  };
}

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

const ClassListPage = async ({ searchParams }: Props) => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  if (role === 'student') {
    return notFound();
  }

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  // URL PARAMS CONDITION

  const query: Prisma.ClassWhereInput = {};

  // Measure query execution time
  const startTime = performance.now();
  const { data, count } = await getClasses(queryParams, p);
  const endTime = performance.now();
  const queryTime = (endTime - startTime).toFixed(2);

  console.log(`⏱️ getClasses query took: ${queryTime}ms`);

  const renderRow = (item: Class, index: number) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-gray-50 text-sm hover:bg-purple-100 transition-colors duration-150"
    >
      {/* Serial Number */}
      <td className="gap-4 p-4 text-gray-700 font-semibold">{index + 1}</td>

      {/* Class Name with Grade Avatar */}
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item?.photo ?? '/defaultClass.jpg'}
          alt="Class Avatar"
          width={40}
          height={40}
          className="hidden md:block rounded-full object-cover"
        />
        <span className="text-gray-800 font-medium">{item.name}</span>
      </td>

      {/* Capacity with Tag */}
      <td className="p-4 hidden md:table-cell">
        <span
          className={`px-2 py-1 rounded-full text-sm ${item.capacity > 50
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
            }`}
        >
          {item.capacity}
        </span>
      </td>

      {/* Grade */}
      <td className="p-4 hidden md:table-cell">
        <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
          Grade {item.grade.id}
        </span>
      </td>

      {/* Total Students */}
      <td className="p-4 hidden md:table-cell">
        <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <div className="w-6 h-6 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-700 font-semibold">
            {item._count.students}
          </div>
          {item._count.students === 1 ? 'Student' : 'Students'}
        </span>
      </td>

      {/* Time */}
      <td className="p-4 hidden md:table-cell">
        <span className="px-2 py-1 rounded-md bg-gray-200 text-gray-700 text-sm font-medium">
          {item.time}
        </span>
      </td>

      {/* Actions */}
      <td className="">
        <div className="flex items-center gap-2">
          <Link href={`/list/classes/${item.id}`}>
            <button
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100"
              title="View Details"
            >
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
