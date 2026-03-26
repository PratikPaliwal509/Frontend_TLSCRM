import React from 'react'
import { FiEdit, FiPlus, FiX } from 'react-icons/fi'

const NotesTabContent = () => {
    return (
        <div className="tab-pane fade" id="notesTab">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card stretch stretch-full">
                        <div className="card-header d-flex justify-content-between border-bottom-0">
                            <div>
                                <h5>Notes:</h5>
                                <p className="fs-12 text-muted">Notes for this tasks</p>
                            </div>
                            <a href="#">3 Notes </a>
                        </div>
                        <div className="card-body py-0">
                            <textarea className="form-control" rows="5" placeholder="Write note here..."></textarea>
                        </div>
                        <div className="card-footer border-top-0">
                            <a href="#" className="btn btn-primary wd-200">
                                <FiPlus size={16} className='me-2' />
                                <span>Add Note</span>
                            </a>
                        </div>
                    </div>
                </div>
                <UserCard
                    avatarSrc="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z"
                    userName="Alexandra Della"
                    dateTime="2023-02-13 14:20:35"
                    description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nemo, quasi nostrum iure nesciunt dolores in, dolorem sequi quidem accusantium voluptates officia nihil."
                />
                <UserCard
                    avatarSrc="/images/avatar/2.png"
                    userName="Anderson Thomas"
                    dateTime="2023-02-13 14:20:35"
                    description="See resolved goodness felicity shy civility domestic had but Drawings offended yet answered Jennings perceive."
                />
                <UserCard
                    avatarSrc="/images/avatar/3.png"
                    userName="Marianne Audrey"
                    dateTime="2023-02-13 14:20:35"
                    description="See resolved goodness felicity shy civility domestic had but Drawings offended yet answered Jennings perceive."
                />
                <UserCard
                    avatarSrc="/images/avatar/4.png"
                    userName="Marianne Audrey"
                    dateTime="2023-02-13 14:20:35"
                    description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nemo, quasi nostrum iure nesciunt dolores in, dolorem sequi quidem accusantium voluptates officia nihil, ipsa ex voluptatem ratione mollitia alias perferendis omnis?"
                />
            </div>
        </div>
    )
}

export default NotesTabContent

const UserCard = ({ avatarSrc, userName, dateTime, description }) => {
    return (
        <div className="col-lg-6">
            <div className="card stretch stretch-full">
                <div className="card-body d-flex justify-content-between">
                    <div className="d-flex">
                        <a href="#" className="avatar-image me-3">
                            <img src={avatarSrc} className="img-fluid" alt="" />
                        </a>
                        <div>
                            <div className="mb-2">
                                <a href="#" className="mb-1 d-block">{userName}</a>
                                <a href="#" className="fs-11 fw-normal text-uppercase text-muted d-block">{dateTime}</a>
                            </div>
                            <p className="text-muted">{description}</p>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <a href="#" className="avatar-text avatar-sm" data-bs-toggle="tooltip" title="Edit" >
                            <FiEdit />
                        </a>
                        <a href="#" className="avatar-text avatar-sm text-danger" data-bs-toggle="tooltip" title="Delete">
                            <FiX />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
