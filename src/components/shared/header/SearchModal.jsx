import React from 'react'
import { FiAirplay, FiChevronRight, FiCommand, FiDownload, FiFilePlus, FiSearch, FiUserPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const tags = ["Projects", "Leads", "Contacts", "Inbox", "Invoices", "Tasks", "Customers", "Notes", "Affiliate", "Storage", "Calendar"]
const recnetSearch = [
    {
        id: 1,
        search_title: "CRM dashboard redesign",
        path: "Home / project / crm",
        icon: <FiAirplay />,
        badge: "/"
    },
    {
        id: 2,
        search_title: "Create new document",
        path: "Home / tasks / docs",
        icon: <FiFilePlus />,
        badge: "N /"
    },
    {
        id: 3,
        search_title: "Invite project colleagues",
        path: "Home / project / invite",
        icon: <FiUserPlus />,
        badge: "P /"
    },

]
const userSearch = [
    {
        id: 1,
        name: "Alexandra Della",
        email: "alex.della@outlook.com",
        src: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z",
    },
    {
        id: 2,
        name: "Green Cute",
        email: "green.cute@outlook.com",
        src: "/images/avatar/2.png",
    },
    {
        id: 3,
        name: "Malanie Hanvey",
        email: "malanie.anvey@outlook.com",
        src: "/images/avatar/3.png",
    },
    {
        id: 4,
        name: "Kenneth Hune",
        email: "kenth.hune@outlook.com",
        src: "/images/avatar/4.png",
    },
    {
        id: 5,
        name: "Archie Cantones",
        email: "archie.cones@outlook.com",
        src: "/images/avatar/5.png",
    },

]
const filesList = [
    {
        id: 1,
        file_name: "Project Style CSS",
        size: "05.74 MB",
        src: "/images/file-icons/css.png"
    },
    {
        id: 2,
        file_name: "Dashboard Project Zip",
        size: "46.83 MB",
        src: "/images/file-icons/zip.png"
    },
    {
        id: 3,
        file_name: "Project Document PDF",
        size: "12.85 MB",
        src: "/images/file-icons/pdf.png"
    },

]
const SearchModal = () => {
    return (
        <div className="dropdown nxl-h-item nxl-header-search">
            <div className="nxl-head-link me-0" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                <FiSearch size={20} />
            </div>
            <div className="dropdown-menu dropdown-menu-end nxl-h-dropdown nxl-search-dropdown">
                <div className="input-group search-form">
                    <span className="input-group-text">
                        <i className="fs-6 text-muted"><FiSearch /></i>
                    </span>
                    <input type="text" className="form-control search-input-field" placeholder="Search...." />
                    <span className="input-group-text">
                        <button type="button" className="btn-close"></button>
                    </span>
                </div>
                <div className="dropdown-divider mt-0"></div>
                <div className="search-items-wrapper">
                    <div className="searching-for px-4 py-2">
                        <p className="fs-11 fw-medium text-muted">I'm searching for...</p>
                        <div className="d-flex flex-wrap gap-1">
                            {
                                tags.map((tag, index) => <Link key={index} className="flex-fill border rounded py-1 px-2 text-center fs-11 fw-semibold">{tag}</Link>)
                            }
                        </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="recent-result px-4 py-2">
                        <Title name={"Recnet"} number={"3"} />
                        {
                            recnetSearch.map(({ search_title, id, path, icon, badge }) => <Card key={id} icon={icon} subTitle={path} title={search_title} badge={badge} isImg={false} />)
                        }
                    </div>
                    <div className="dropdown-divider my-3"></div>
                    <div className="users-result px-4 py-2">
                        <Title name={"Users"} number={"5"} />
                        {
                            userSearch.map(({ name, id, email, src }) => <Card key={id} src={src} subTitle={email} title={name} badge={<FiChevronRight size={12} />} />)
                        }
                    </div>
                    <div className="dropdown-divider my-3"></div>
                    <div className="file-result px-4 py-2">
                        <Title name={"Files"} number={"3"} />
                        {
                            filesList.map(({ file_name, id, size, src }) => <Card key={id} src={src} subTitle={size} title={file_name} badge={<FiDownload size={12} />} />)
                        }
                    </div>
                    <div className="dropdown-divider mt-3 mb-0"></div>
                    <Link to={"#"} className="p-3 fs-10 fw-bold text-uppercase text-center d-block">Loar More</Link>
                </div>
            </div>
        </div>
    )
}

export default SearchModal


const Title = ({ name, number }) => {
    return (
        <h4 className="fs-13 fw-normal text-gray-600 mb-3">{name} <span className="badge small bg-gray-200 rounded ms-1 text-dark">{number}</span></h4>
    )
}

const Card = ({ src, icon, title, subTitle, badge }) => {
    return (
        <div className="d-flex align-items-center justify-content-between hr-card">
            <div className="d-flex align-items-center gap-3">
                {
                    icon ?
                        <div className="avatar-text rounded">
                            {icon}
                        </div>
                        :
                        <div className="avatar-image bg-gray-200 rounded">
                            <img src={src} alt="" className="img-fluid" />
                        </div>
                }

                <div>
                    <Link to={"#"} className="font-body fw-bold d-block mb-1">{title}</Link>
                    <p className="fs-11 text-muted mb-0">{subTitle}</p>
                </div>
            </div>
            {
                icon ?
                    <Link to={"#"} className="badge border rounded text-dark">{badge}<i className="ms-1 fs-10"><FiCommand /></i></Link>
                    :
                    <Link to={"#"} className="avatar-text avatar-md"> {badge} </Link>
            }

        </div>
    )
}