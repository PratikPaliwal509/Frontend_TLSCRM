import React from 'react'

const TablePagination = ({ table }) => {
    return (
        <div className="row gy-2">
            <div className="col-sm-12 col-md-5 p-0">
                <div className="dataTables_info text-lg-start text-center">
                    Showing{" "}
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                    {" "}to{" "}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}
                    {" "}of {table.getFilteredRowModel().rows.length} entries
                </div>
            </div>

            <div className="col-sm-12 col-md-7 p-0">
                <div className="dataTables_paginate paging_simple_numbers">
                    <ul className="pagination mb-0 justify-content-md-end justify-content-center">

                        {/* PREVIOUS */}
                        <li className={`page-item ${!table.getCanPreviousPage() ? "disabled" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </button>
                        </li>

                        {/* CURRENT PAGE */}
                        <li className="page-item active">
                            <span className="page-link">
                                {table.getState().pagination.pageIndex + 1}
                            </span>
                        </li>

                        {/* NEXT */}
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