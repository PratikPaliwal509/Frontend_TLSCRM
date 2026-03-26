const status = [
    { value: 'active', label: 'Active', color: '#17c666' },
    { value: 'inactive', label: 'Inactive', color: '#ffa21d' },
    { value: 'declined', label: 'Declined', color: '#ea4d4d' },
];

export const leadTableData = [
    {
        "id": 1,
        "customer": {
            "name": "AAlexandra Della",
            "img": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z"
        },
        "email": "alex.della@outlook.com",
        "source": {
            "media": "facebook",
            "icon": "feather-facebook"
        },
        "phone": "+1 (375) 9632 548",
        "date": "2023-04-25, 03:42PM",
        "status": { status, defaultSelect: 'active' }
    },
    {
        "id": 2,
        "customer": {
            "name": "Nancy Elliot",
            "img": ""
        },
        "email": "nancy.elliot@outlook.com",
        "source": {
            "media": "facebook",
            "icon": "feather-facebook"
        },
        "phone": "(375) 8523 456",
        "date": "2023-04-06, 02:52PM",
        "status": { status, defaultSelect: 'active' }
    },
    {
        "id": 3,
        "customer": {
            "name": "Green Cute",
            "img": "/images/avatar/2.png"
        },
        "email": "green.cute@outlook.com",
        "source": {
            "media": "Twitter",
            "icon": "feather-twitter"
        },
        "phone": "(845) 9632 874",
        "date": "2023-04-08, 08:34PM",
        "status": { status, defaultSelect: 'active' }
    },
    {
        "id": 4,
        "customer": {
            "name": "Henry Leach",
            "img": "/images/avatar/3.png"
        },
        "email": "henry.leach@outlook.com",
        "source": {
            "media": "Linkedin",
            "icon": "feather-linkedin"
        },
        "phone": "(258) 9514 657",
        "date": "2023-04-10, 05:25PM",
        "status": { status, defaultSelect: 'inactive' }
    },
    {
        "id": 5,
        "customer": {
            "name": "Marianne Audrey",
            "img": "/images/avatar/7.png"
        },
        "email": "marine.adrey@outlook.com",
        "source": {
            "media": "Instagram",
            "icon": "feather-instagram"
        },
        "phone": "(456) 6547 524",
        "date": "2023-04-12, 12:02PM",
        "status": { status, defaultSelect: 'active' }
    },
    {
        "id": 6,
        "customer": {
            "name": "Alexandra Della",
            "img": "/images/avatar/4.png"
        },
        "email": "alex.della@outlook.com",
        "source": {
            "media": "Github",
            "icon": "feather-github"
        },
        "phone": "(375) 8523 456",
        "date": "2023-04-15, 02:40PM",
        "status": { status, defaultSelect: 'active' }
    },
    {
        "id": 7,
        "customer": {
            "name": "Nancy Elliot",
            "img": "/images/avatar/5.png"
        },
        "email": "nancy.elliot@outlook.com",
        "source": {
            "media": "facebook",
            "icon": "feather-facebook"
        },
        "phone": "(632) 5486 662",
        "date": "2023-04-25, 03:42PM",
        "status": { status, defaultSelect: 'active' }
    },
    {
        "id": 8,
        "customer": {
            "name": "Green Cute",
            "img": "/images/avatar/6.png"
        },
        "email": "green.cute@outlook.com",
        "source": {
            "media": "Linkedin",
            "icon": "feather-linkedin"
        },
        "phone": "(951) 5478 884",
        "date": "2023-04-14, 03:32PM",
        "status": { status, defaultSelect: 'declined' }
    },
    {
        "id": 9,
        "customer": {
            "name": "Henry Leach",
            "img": ""
        },
        "email": "henry.leach@outlook.com",
        "source": {
            "media": "Twitter",
            "icon": "feather-twitter"
        },
        "phone": "(556) 2457 586",
        "date": "2023-04-20, 01:47PM",
        "status": { status, defaultSelect: 'active' }
    },
    {
        "id": 10,
        "customer": {
            "name": "Alexandra Della",
            "img": "/images/avatar/4.png"
        },
        "email": "alex.della@outlook.com",
        "source": {
            "media": "Github",
            "icon": "feather-github"
        },
        "phone": "(554) 2478 663",
        "date": "2023-04-22, 02:12PM",
        "status": { status, defaultSelect: 'active' }
    },
    {
        "id": 11,
        "customer": {
            "name": "Alexandra Della",
            "img": ""
        },
        "email": "alex.della@outlook.com",
        "source": {
            "media": "Instagram",
            "icon": "feather-instagram"
        },
        "phone": " (654) 2478 665",
        "date": "2023-04-25, 03:42PM",
        "status": { status, defaultSelect: 'declined' }
    },
    {
        "id": 12,
        "customer": {
            "name": "Elliot Nancy",
            "img": "/images/avatar/9.png"
        },
        "email": "elliot.nancy@outlook.com",
        "source": {
            "media": "Instagram",
            "icon": "feather-instagram"
        },
        "phone": "(554) 2478 663",
        "date": "2023-04-25, 03:42PM",
        "status": { status, defaultSelect: 'inactive' }
    },
]