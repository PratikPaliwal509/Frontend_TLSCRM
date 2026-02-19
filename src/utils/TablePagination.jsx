import React from 'react'

const TablePagination = ({ table }) => {

    const { pageIndex, pageSize } = table.getState().pagination
    const totalRows = table.getFilteredRowModel().rows.length

    const start = totalRows === 0 ? 0 : pageIndex * pageSize + 1
    const end = Math.min((pageIndex + 1) * pageSize, totalRows)

    return (
        <div className="row gy-2">
            {/* Left Side Info */}
            <div className="col-sm-12 col-md-5 p-0">
                <div
                    className="dataTables_info text-lg-start text-center"
                    role="status"
                    aria-live="polite"
                >
                    Showing {start} to {end} of {totalRows} entries
                </div>
            </div>

            {/* Right Side Pagination */}
            <div className="col-sm-12 col-md-7 p-0">
                <div className="dataTables_paginate paging_simple_numbers">
                    <ul className="pagination mb-0 justify-content-md-end justify-content-center">

                        {/* Previous */}
                        <li className={`page-item ${!table.getCanPreviousPage() ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </button>
                        </li>

                        {/* Current Page */}
                        <li className="page-item active">
                            <button className="page-link">
                                {pageIndex + 1}
                            </button>
                        </li>

                        {/* Next */}
                        <li className={`page-item ${!table.getCanNextPage() ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </button>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default TablePagination
