import React, { useState } from 'react'
import CardHeader from '@/components/shared/CardHeader'
import Pagination from '@/components/shared/Pagination'
import CardLoader from '@/components/shared/CardLoader'
import useCardTitleActions from '@/hooks/useCardTitleActions'
import { taskStatusOptions } from '@/utils/options'
import SelectDropdown from '@/components/shared/SelectDropdown'
import { FiAlertOctagon, FiArchive, FiClock, FiEdit3, FiPrinter, FiTrash2 } from 'react-icons/fi'
import Dropdown from '@/components/shared/Dropdown'
import getIcon from '@/utils/getIcon'

const actionOptions = [
    { icon: <FiEdit3 />, label: 'Edit' },
    { icon: <FiPrinter />, label: 'Print' },
    { icon: <FiClock />, label: 'Remind' },
    { type: "divider" },
    { icon: <FiArchive />, label: 'Archive' },
    { icon: <FiAlertOctagon />, label: 'Report Spam' },
    { icon: <FiTrash2 />, label: 'Delete' }
]
const summaryData = [
    { invoiceNumber: '#896574', avatar: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z', name: 'Alexandra Della', email: 'alex@outlook.com', code: 'SU56HD246K', date: '28-02-2023', icon: 'fa-cc-visa', cardType: 'Visa', status: taskStatusOptions },
    { invoiceNumber: '#478523', avatar: '/images/avatar/2.png', name: 'Green Cute', email: 'green.cute@hotmail.com', code: 'SU56HD246K', date: '28-02-2023', icon: 'fa-cc-mastercard', cardType: 'Mastercard', status: taskStatusOptions },
    { invoiceNumber: '#568745', avatar: '/images/avatar/3.png', name: 'Marianne Audrey', email: 'marianne.audrey@live.com', code: 'SU56HD246K', date: '28-02-2023', icon: 'fa-cc-paypal', cardType: 'Paypal', status: taskStatusOptions },
    { invoiceNumber: '#852369', avatar: '/images/avatar/4.png', name: 'Holland Scott', email: 'holland.scott@gmail.com', code: 'SU56HD246K', date: '28-02-2023', icon: 'fa-cc-paypal', cardType: 'Paypal', status: taskStatusOptions },
    { invoiceNumber: '#558746', avatar: '/images/avatar/5.png', name: 'Gregory Miller', email: 'gregory.miller@live.com', code: 'SU56HD246K', date: '28-02-2023', icon: 'fa-cc-mastercard', cardType: 'Mastercard', status: taskStatusOptions },
];
const InvoiceSummary = ({ title }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

    if (isRemoved) {
        return null;
    }

    const defaultStatusList = ["completed", "rejected", "completed", "pending", "completed"]

    return (
        <div className="col-xxl-12">
            <div className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />

                <div className="card-body custom-card-action p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Invoice</th>
                                    <th>Customer</th>
                                    <th>Coupon</th>
                                    <th>Date</th>
                                    <th>Payment</th>
                                    <th className="wd-250">Status</th>
                                    <th className="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {summaryData.map(({ avatar, icon, cardType, code, date, email, invoiceNumber, name, status }, index) => {
                                    const statusValue = status.find((v) => v.value === defaultStatusList[index])
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <a href="#">{invoiceNumber}</a>
                                            </td>
                                            <td>
                                                <div className="hstack gap-3">
                                                    <div className="avatar-image">
                                                        <img src={avatar} alt="" className="img-fluid" />
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{name}</div>
                                                        <div className="fs-12 text-muted">{email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge text-success border border-success border-dashed">{code}</span>
                                            </td>
                                            <td>{date}</td>
                                            <td><i className={`me-1 fs-18`}>{getIcon(icon)}</i>{cardType}</td>
                                            <td>
                                                <SelectDropdown
                                                    options={status}
                                                    selectedOption={selectedOption}
                                                    defaultSelect={statusValue?.value}
                                                    onSelectOption={(option) => setSelectedOption(option)}
                                                />
                                            </td>
                                            <td>
                                                <Dropdown dropdownItems={actionOptions} triggerClass='avatar-md ms-auto' triggerPosition={"0,28"} />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card-footer"> <Pagination /></div>
                <CardLoader refreshKey={refreshKey} />
            </div>
        </div>
    )
}

export default InvoiceSummary
