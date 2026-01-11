
import { useEffect, useState } from 'react';
import type { TableData } from '../types/tabledata';
import { fetchTableData } from '../services/api';

export const PrimeReactDataTable = () => {
  const [rows, setRows] = useState<TableData[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(12);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<number>>(new Set());
  const [deselectedRowIds, setDeselectedRowIds] = useState<Set<number>>(new Set());

  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayValue, setOverlayValue] = useState('');

  const toggleRow = (id: number) => {
    setSelectedRowIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setDeselectedRowIds(deselected => {
          const d = new Set(deselected);
          d.add(id);
          return d;
        });
      } else {
        next.add(id);
        setDeselectedRowIds(deselected => {
          const d = new Set(deselected);
          d.delete(id);
          return d;
        });
      }
      return next;
    });
  };

  const toggleSelectAllPage = () => {
    setSelectedRowIds(prev => {
      const next = new Set(prev);
      const allSelected = rows.length > 0 && rows.every(r => next.has(r.id));
      setDeselectedRowIds(deselected => {
        const d = new Set(deselected);
        rows.forEach(r => {
          if (allSelected) {
            d.add(r.id);
          } else {
            d.delete(r.id);
          }
        });
        return d;
      });
      rows.forEach(r => {
        if (allSelected) {
          next.delete(r.id);
        } else {
          next.add(r.id);
        }
      });
      return next;
    });
  };

  const handleOverlaySelect = () => {
    const num = parseInt(overlayValue, 10);
    if (isNaN(num) || num <= 0) return;
    // Only select up to available rows on current page
    const ids = rows.slice(0, num).map((row) => row.id);
    setSelectedRowIds(new Set(ids));
    setDeselectedRowIds(new Set(rows.filter(row => !ids.includes(row.id)).map(row => row.id)));
    setShowOverlay(false);
    setOverlayValue('');
  };

  const allSelectedOnPage = rows.length > 0 && rows.every(r => selectedRowIds.has(r.id));

  useEffect(() => {
   
    fetchTableData(page, limit)
      .then((data) => {
        setRows(data.data);
        setTotal(data.pagination.total);
        setLimit(data.pagination.limit);
      })
      .catch((error) => {
        console.error('Error fetching table data:', error);
      })
  }, [page, limit]);

  const totalPages = Math.ceil(total / limit);
  return (
    <div className='flex flex-col mt-20'>

    
    <div className=''>{
    
      <div className='flex items-center justify-between px-2 py-2'>
        <span className="text-sm text-zinc-700 font-bold">
            <span className='text-blue-500 mr-1'>
                {selectedRowIds.size }
            </span>
           rows selected
        </span>
      </div>
          
     
    } </div>
       <div className="w-full  bg-zinc-100 h-full rounded-md border border-zinc-400 overflow-hidden">
      <table className="w-full h-full border-collapse rounded-md overflow-hidden">
        <thead className="bg-zinc-200 border-b border-zinc-400">
          <tr>
            <th className="w-12 px-4 py-2 text-center align-middle">
              <div className="flex items-center justify-center gap-2 relative">
                <input
                  type="checkbox"
                  className="align-middle cursor-pointer accent-blue-600"
                  checked={allSelectedOnPage}
                  onChange={toggleSelectAllPage}
                  aria-label="Select all on page"
                />
                <button
                  type="button"
                  className="absolute right-0 rounded hover:bg-zinc-200 focus:outline-none "
                  onClick={() => setShowOverlay((v) => !v)}
                  aria-label="Open select multiple overlay"
                  title="Select multiple rows"
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-zinc-600">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeWidth="2" d="M8 12h8M12 8v8" />
                  </svg>
                </button>
                {showOverlay && (
                  <div className="absolute left-0 top-8 z-50 w-64 rounded-lg border border-zinc-200 bg-white shadow-lg p-4 animate-fade-in">
                    <h4 className="font-semibold text-sm mb-1">Select Multiple Rows</h4>
                    <p className="text-xs text-zinc-500 mb-2">
                      Enter number of rows to select on this page
                    </p>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="number"
                        placeholder="e.g., 5"
                        value={overlayValue}
                        onChange={(e) => setOverlayValue(e.target.value)}
                        className="w-full border rounded px-2 py-1 text-sm"
                        min={1}
                        max={rows.length}
                      />
                      <button
                        onClick={handleOverlaySelect}
                        className="bg-blue-600 text-white px-3 rounded text-sm hover:bg-blue-700"
                      >
                        Select
                      </button>
                    </div>
                    <button
                      onClick={() => setShowOverlay(false)}
                      className="absolute top-2 right-2 text-xs text-zinc-400 hover:text-zinc-700"
                      aria-label="Close overlay"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </th>
            
            <th className="w-1/6 px-4 py-2 text-left font-medium tracking-tighter align-middle text-sm">Title</th>
            <th className="w-1/6 px-4 py-2 text-left font-medium tracking-tighter align-middle text-sm">Place of Origin</th>
            <th className="w-1/6 px-4 py-2 text-left font-medium tracking-tighter align-middle text-sm">Artist</th>
            <th className="w-1/4 px-4 py-2 text-left font-medium tracking-tighter align-middle text-sm">Inscriptions</th>
            <th className="w-1/12 px-4 py-2 text-left font-medium tracking-tighter align-middle text-sm">Start Date</th>
            <th className="w-1/12 px-4 py-2 text-left font-medium tracking-tighter align-middle text-sm">End Date</th>
          </tr>
        </thead>
        <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-6 text-zinc-500">No data available</td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr className="border-b border-zinc-200 bg-white hover:bg-zinc-100 transition-colors" key={row.id} >
              <td className="w-12 px-2 py-3 text-center align-middle">
                <input
                  type="checkbox"
                  className="align-middle accent-blue-600"
                  checked={selectedRowIds.has(row.id)}
                  onChange={() => toggleRow(row.id)}
                  aria-label={`Select row ${row.id}`}
                />
              </td>
              <td className="w-1/6 px-4 py-3 text-left align-middle text-sm">{row.title  || "N/A"}</td>
              <td className="w-1/6 px-4 py-3 text-left align-middle text-sm">{row.place_of_origin || "N/A"}</td>
              <td className="w-1/6 px-4 py-3 text-left align-middle text-sm">{row.artist_title || "N/A"}</td>
              <td className="w-1/4 px-4 py-3 text-left align-middle text-sm">{row.inscriptions || "N/A"}</td>
              <td className="w-1/12 px-4 py-3 text-left align-middle text-sm">{row.date_start || "N/A"}</td>
              <td className="w-1/12 px-4 py-3 text-left align-middle text-sm">{row.date_end || "N/A"}</td>
            </tr>
          ))
        )}
        </tbody>
      </table>
      <div className="flex  items-center justify-end mt-4 text-sm px-2 pb-2 gap-2">
         <div className="px-4 py-2">
            <p className='text-zinc-500'>
              Showing <span className='text-bold text-zinc-900'>{(page - 1) * limit + (rows.length > 0 ? 1 : 0)}</span>
              {' '}to <span className='text-bold text-zinc-900'>{(page - 1) * limit + rows.length}</span>
              {' '}from <span className='text-bold text-zinc-900'>{total}</span> entries.
            </p>
               
            </div>
        <button className="px-2 py-1 border rounded disabled:opacity-40"  disabled={page===1} onClick={()=>setPage(page-1)}>Prev</button>
        <div className='border border-zinc-400 rounded flex overflow-x-auto'>
          {(() => {
            const maxButtons = 5;
            let start = Math.max(1, page - Math.floor(maxButtons / 2));
            let end = start + maxButtons - 1;
            if (end > totalPages) {
              end = totalPages;
              start = Math.max(1, end - maxButtons + 1);
            }
            return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-2 py-1 min-w-[2rem] border-r last:border-r-0 border-zinc-300 ${
                  page === p ? "bg-blue-600 text-white" : "hover:bg-zinc-200"
                }`}
                aria-current={page === p ? "page" : undefined}
              >
                {p}
              </button>
            ));
          })()}
        </div>
        <button className="px-2 py-1 border rounded disabled:opacity-40"  disabled={page===totalPages} onClick={()=>setPage(page+1)}>Next</button>
      </div>

    </div> 
    </div>
  )
}
