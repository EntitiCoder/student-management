import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { formateDayOnly } from '@/lib/dateUtils';
import { renderNo } from '@/lib/numUtils';
import { getStudents } from '@/lib/queries';
import { currentUser } from '@clerk/nextjs/server';
import { Prisma, Student } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import ViewIcon from '../../../../../public/icons/ViewIcon';

// type Student = {
//   id: number;
//   studentId: string;
//   name: string;
//   email?: string;
//   photo: string;
//   phone?: string;
//   grade: number;
//   class: string;
//   address: string;
// };

type StudentList = Student & { class: { name: string; time: string } };

interface Props {
  searchParams: {
    page: string;
  };
  params: any;
}

const columns = [
  {
    header: 'No',
    accessor: 'no',
  },
  {
    header: 'Info',
    accessor: 'info',
  },
  {
    header: 'Student ID',
    accessor: 'studentId',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Grade',
    accessor: 'grade',
    className: 'hidden md:table-cell',
  },
  {
    header: 'Phone',
    accessor: 'phone',
    className: 'hidden lg:table-cell',
  },
  {
    header: 'Birthday',
    accessor: 'birthday',
    className: 'hidden lg:table-cell',
  },
  {
    header: 'Address',
    accessor: 'address',
    className: 'hidden lg:table-cell',
  },
  {
    header: 'Actions',
    accessor: 'action',
  },
];

const StudentListPage = async ({ searchParams, params }: Props) => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const { id: classId } = params;
  const query: Prisma.StudentWhereInput = {};

  // Measure query execution time
  const startTime = performance.now();
  const { data, count } = await getStudents(queryParams, p);
  const endTime = performance.now();
  const queryTime = (endTime - startTime).toFixed(2);

  console.log(`⏱️ getStudents query took: ${queryTime}ms`);

  const renderRow = (item: StudentList, index: number) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight transition-all duration-300"
    >
      {/* Student No */}
      <td className="py-4 text-center">{renderNo(index, p)}</td>
      {/* Student Photo & Info */}
      <td className="flex items-center gap-4 py-4">
        <Image
          src={item.photo}
          alt=""
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover border-2 border-lamaSky shadow-md"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold text-lg text-gray-800">
            {item.name} {item.surname}
          </h3>
          <p className="text-xs text-gray-500">{item?.class.name}</p>
        </div>
      </td>

      {/* Additional Info */}
      <td className="hidden md:table-cell ">{item.id}</td>
      <td className="hidden md:table-cell text-center">{item.gradeId}</td>
      <td className="hidden md:table-cell text-center">{item.phone}</td>
      <td className="hidden md:table-cell text-center">
        {formateDayOnly(item.birthday)}
      </td>
      <td className="hidden md:table-cell text-center">{item.address}</td>

      {/* Actions */}
      <td className="text-center">
        <div className="flex items-center justify-center gap-3">
          <Link href={`/list/students/${item.id}`}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaSky hover:bg-lamaPurple transition-all duration-200 shadow-md">
              <ViewIcon />
            </button>
          </Link>

          {role === 'admin' && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>
            <FormContainer table="student" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="hidden md:block text-lg font-semibold">
            All Students
          </h1>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === 'admin' && (
              <FormContainer table="student" type="create" />
            )}
          </div>
        </div>
      </div>
      <div className="italic py-2 text-slate-500 rounded-md font-medium">
        Showing <b>{count}</b> students
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default StudentListPage;
