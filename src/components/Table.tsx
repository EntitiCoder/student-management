const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any, index: number) => React.ReactNode;
  data: any[];
}) => {
  return (
    <div className="overflow-x-auto rounded-md shadow-md mt-4">
      <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100 sticky top-0 shadow-sm">
          <tr className="text-left text-gray-700 text-sm uppercase tracking-wider">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={`py-3 px-4 border-b border-gray-200 ${
                  col.className || ''
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="py-4 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
