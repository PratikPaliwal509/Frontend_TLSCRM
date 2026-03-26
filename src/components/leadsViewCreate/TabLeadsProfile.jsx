import React from 'react'
import getIcon from '@/utils/getIcon';

const generalInfoData = [
    {
        title: 'Status',
        icon: 'feather-git-commit',
        text: 'Customer',
    },
    {
        title: 'Source',
        icon: 'feather-facebook',
        text: 'Facebook',
    },
    {
        title: 'Default Language',
        icon: 'feather-airplay',
        text: 'System Default',
    },
    {
        title: 'Privacy',
        icon: 'feather-globe',
        text: 'Private',
    },
    {
        title: 'Created',
        icon: 'feather-clock',
        text: '26 MAY, 2023',
    },
    {
        title: 'Assigned',
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z',
        text: 'Alexandra Della',
    },
    {
        title: 'Lead By',
        image: '/images/avatar/5.png',
        text: 'Green Cute - Website design and development',
    },
];

const leadInfoData = [
    {
        title: 'Name',
        content: <a href="#">Alexandra Dell</a>,
    },
    {
        title: 'Position',
        content: <>CEO, Founder at <a href="#">Theme Ocean</a></>,
    },
    {
        title: 'Company',
        content: <a href="#">Theme Ocean</a>,
    },
    {
        title: 'Email',
        content: <a href="#">alex.della@outlook.com</a>,
    },
    {
        title: 'Phone',
        content: <a href="#">+01 (375) 5896 654</a>,
    },
    {
        title: 'Website',
        content: <a href="#">https://themeforest.net/user/theme_ocean</a>,
    },
    {
        title: 'Lead value',
        content: <a href="#">$255.50 USD</a>,
    },
    {
        title: 'Address',
        content: <a href="#">47813 Johnathon Parks Suite 559</a>,
    },
    {
        title: 'City',
        content: <a href="#">Cartermouth</a>,
    },
    {
        title: 'State',
        content: <a href="#">Connecticut</a>,
    },
    {
        title: 'Country',
        content: <a href="#">United Kingdom</a>,
    },
    {
        title: 'Zip Code',
        content: <a href="#">81135-0615</a>,
    },
];

const TabLeadsProfile = () => {
    return (
        <div className="tab-pane fade show active" id="profileTab" role="tabpanel">
            <div className="card card-body lead-info">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">
                        <span className="d-block mb-2">Lead Information :</span>
                        <span className="fs-12 fw-normal text-muted d-block">Following information for your lead</span>
                    </h5>
                    <a href="#" className="btn btn-sm btn-light-brand">Create Invoice</a>
                </div>
                {leadInfoData.map((data, index) => (
                    <Card
                        key={index}
                        title={data.title}
                        content={data.content}
                    />
                ))}
            </div>
            <hr />
            <div className="card card-body general-info">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">
                        <span className="d-block mb-2">General Information :</span>
                        <span className="fs-12 fw-normal text-muted d-block">General information for your lead</span>
                    </h5>
                    <a href="#" className="btn btn-sm btn-light-brand">Edit Lead</a>
                </div>


                {generalInfoData.map((data, index) => (
                    <GeneralCard
                        key={index}
                        title={data.title}
                        icon={data.icon}
                        text={data.text}
                        image={data.image}
                    />
                ))}
                <div className="row mb-4">
                    <div className="col-lg-2 fw-medium">Tags</div>
                    <div className="col-lg-10 hstack gap-1"><a href="#" className="badge bg-soft-primary text-primary">VIP</a><a href="#" className="badge bg-soft-success text-success">High Rated</a><a href="#" className="badge bg-soft-warning text-warning">Promotions</a><a href="#" className="badge bg-soft-danger text-danger">Team</a><a href="#" className="badge bg-soft-teal text-teal">Updates</a></div>
                </div>
                <div className="row mb-4">
                    <div className="col-lg-2 fw-medium">Description</div>
                    <div className="col-lg-10 hstack gap-1">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae, nulla veniam, ipsam nemo autem fugit earum accusantium reprehenderit recusandae in minima harum vitae doloremque quasi aut dolorum voluptate. Minima, deleniti.Lorem ipsum, dolor sit amet consectetur adipisicing elit. Molestiae, nulla veniam, ipsam nemo autem fugit earum accusantium reprehenderit recusandae in minima harum vitae doloremque quasi aut dolorum voluptate.</div>
                </div>
            </div>
        </div>
    )
}

export default TabLeadsProfile

const Card = ({ title, content }) => {
    return (
        <div className="row mb-4">
            <div className="col-lg-2 fw-medium">{title}</div>
            <div className="col-lg-10">{content}</div>
        </div>
    );
};

const GeneralCard = ({ title, icon, text, image }) => {
    return (
        <div className="row mb-4">
            <div className="col-lg-2 fw-medium">{title}</div>
            <div className="col-lg-10 hstack gap-1">
                <a href="#" className="hstack gap-2">
                    {icon && (
                        <div className="avatar-text avatar-sm">
                            {getIcon(icon)}
                        </div>
                    )}
                    {image && (
                        <div className="avatar-image avatar-sm">
                            <img src={image} alt="" className="img-fluid" />
                        </div>
                    )}
                    <span>{text}</span>
                </a>
            </div>
        </div>
    );
};
