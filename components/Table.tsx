const Table = ({
  headers,
  data,
  cellFormat
}: {
  headers: {
    header: string;
    accessor: string;
  }[];
  data: any;
  cellFormat?: any;
}) => (
  <div className="flex flex-col">
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div className="overflow-scroll border-b border-gray-200 shadow sm:rounded-lg">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {headers.map((header) => (
                  <th
                    key={'header-' + header.accessor}
                    scope="col"
                    className="px-6 py-3 text-sm font-medium text-left text-gray-500"
                  >
                    {header.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row: any, index: any) => (
                <tr key={'row-' + index}>
                  {headers.map((cell: any, index: any) => (
                    <td
                      key={'cell-' + cell.accessor}
                      className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap"
                    >
                      {cellFormat
                        ? cellFormat[cell.accessor]
                          ? cellFormat[cell.accessor](row[cell.accessor])
                          : row[cell.accessor]
                        : row[cell.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default Table;
