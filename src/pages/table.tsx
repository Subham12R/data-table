import { useEffect, useState } from "react";
import { fetchTableData } from "../services/api";
import type { TableData } from "../types/tabledata";
import { PrimeReactDataTable } from "../components/PrimeReactDataTable";
const LIMIT = 12;

export function ArtworkPage() {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTableData(currentPage, LIMIT)
      .then((res) => {
        setTableData(res.data);
        setTotalRecords(res.pagination.total);
        })
      .catch((error) => {
        console.error("Error fetching table data:", error);
      });
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

  return (
    <div className="p-4">

        <PrimeReactDataTable
          rows={tableData}
          page={currentPage}
          total={totalRecords}
          limit={LIMIT}
          onPageChange={handlePageChange}
        />
        
    </div>
  );
}