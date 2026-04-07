import React, { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";

const TaskDateRange = ({ initialStartDate, initialEndDate, onChange }) => {
    const [startDate, setStartDate] = useState(initialStartDate || null);
    const [endDate, setEndDate] = useState(initialEndDate || null);

    // Update state when props change (e.g., when task data loads)
    useEffect(() => {
//         console.log('initialStartDate:', initialStartDate);
//         const formatDate = (date) => {
//     if (!date) return '';
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, '0');
//     const month = String(d.getMonth() + 1).padStart(2, '0');
//     const year = d.getFullYear();
//     return `${day}/${month}/${year}`;
// };
//         console.log('initialStartDate:', formatDate(initialStartDate));
        setStartDate(initialStartDate || null);
        setEndDate(initialEndDate || null);
        // setStartDate(initialStartDate || null);
        // setEndDate(initialEndDate || null);
    }, [initialStartDate, initialEndDate]);

    return (
        <div className="col-12 mt-4">
            {/* <label className="form-label">Date Range:</label> */}

            <div className="input-group">
                <span className="input-group-text">Start Date</span>
                <DatePicker
                    placeholderText="Start date..."
                    selected={startDate}
                     dateFormat="dd/MM/yyyy"
                    showPopperArrow={false}
                    className="form-control"
                    popperPlacement="bottom-start"
                    // onChange={(date) => {
                    //     setStartDate(date)
                    //     onChange?.(
                    //         date ? new Date(date).toISOString() : null,
                    //         endDate ? new Date(endDate).toISOString() : null
                    //     )
                    // }}
                />

                <span className="input-group-text">End Date</span>

                <DatePicker
                    placeholderText="End date..."
                    selected={endDate}
                    showPopperArrow={false}
                    initialStartDate
                     dateFormat="dd/MM/yyyy"
                    className="form-control"
                    popperPlacement="bottom-start"
                    // onChange={(date) => {
                    //     setEndDate(date)
                    //     onChange?.(
                    //         startDate ? new Date(startDate).toISOString() : null,
                    //         date ? new Date(date).toISOString() : null
                    //     )
                    // }}
                />
            </div>
        </div>
    )
}

export default TaskDateRange
