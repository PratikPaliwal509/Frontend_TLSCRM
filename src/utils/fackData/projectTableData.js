// import { projectStatusOptions, taskAssigneeOptions } from '@/utils/options';

import { projectStatusOptions, taskAssigneeOptions } from "../options"

const status = projectStatusOptions
const assigned = taskAssigneeOptions

export const projectTableData = [
    {
        "id": 1,
        "project-name": {
            "title": "Spark: This name could work well for a project related to innovation, creativity, or inspiration.",
            "img": "/images/brand/app-store.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "customer": {
            "name": "Alexandra Della",
            "img": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z"
        },
        "start-date": "2023-04-05",
        "end-date": "2023-04-10",
        "assigned": { assigned, defaultSelect: 'arcie.tones@gmail.com' },
        "status": { status, defaultSelect: 'in-projress' }
    },
    {
        "id": 2,
        "project-name": {
            "title": "Nexus: This name could work well for a project related to connectivity, bringing different people or ideas together, or solving complex problems.",
            "img": "/images/brand/dropbox.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "customer": {
            "name": "Green Cute",
            "img": "/images/avatar/2.png"
        },
        "start-date": "2023-04-05",
        "end-date": "2023-04-10",
        "assigned": { assigned, defaultSelect: 'jon.tones@gmail.com' },
        "status": { status, defaultSelect: 'not-started' }
    },
    {
        "id": 3,
        "project-name": {
            "title": "Velocity: This name could work well for a project related to speed, efficiency, or productivity.",
            "img": "/images/brand/facebook.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "customer": {
            "name": "Nancy Elliot",
            "img": ""
        },
        "start-date": "2023-04-05",
        "end-date": "2023-04-10",
        "assigned": { assigned, defaultSelect: 'lanie.nveyn@gmail.com' },
        "status": { status, defaultSelect: 'on-hold' }
    },
    {
        "id": 4,
        "project-name": {
            "title": "Catalyst: This name could work well for a project related to driving change or transformation.",
            "img": "/images/brand/figma.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "customer": {
            "name": "Henry Leach",
            "img": ""
        },
        "start-date": "2023-04-05",
        "end-date": "2023-04-10",
        "assigned": { assigned, defaultSelect: 'nneth.une@gmail.com' },
        "status": { status, defaultSelect: 'declined' }
    },
    {
        "id": 5,
        "project-name": {
            "title": "Odyssey: This name could work well for a project related to exploration, adventure, or discovery.",
            "img": "/images/brand/github.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "customer": {
            "name": "Marianne Audrey",
            "img": "/images/avatar/3.png"
        },
        "start-date": "2023-04-05",
        "end-date": "2023-04-10",
        "assigned": { assigned, defaultSelect: 'erna.serpa@outlook.com' },
        "status": { status, defaultSelect: 'finished' }
    },
    {
        "id": 6,
        "project-name": {
            "title": "Synergy: This name could work well for a project related to collaboration or teamwork, where multiple parts come together to create a greater whole.",
            "img": "/images/brand/gitlab.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "customer": {
            "name": "Cute Green",
            "img": "/images/avatar/4.png"
        },
        "start-date": "2023-04-05",
        "end-date": "2023-04-10",
        "assigned": { assigned, defaultSelect: 'mar.audrey@gmail.com' },
        "status": { status, defaultSelect: 'in-projress' }
    },
    {
        "id": 7,
        "project-name": {
            "title": "Zenith: This name could work well for a project related to achieving the highest point or peak of success.",
            "img": "/images/brand/gmail.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "customer": {
            "name": "Leach Henry",
            "img": ""
        },
        "start-date": "2023-04-05",
        "end-date": "2023-04-10",
        "assigned": { assigned, defaultSelect: 'nancy.elliot@outlook.com' },
        "status": { status, defaultSelect: 'not-started' }
    },
    {
        "id": 8,
        "project-name": {
            "title": "Momentum: This name could work well for a project related to maintaining forward motion and progress.",
            "img": "/images/brand/instagram.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "customer": {
            "name": "Audrey Marianne",
            "img": "/images/avatar/5.png"
        },
        "start-date": "2023-04-05",
        "end-date": "2023-04-10",
        "assigned": { assigned, defaultSelect: 'arcie.tones@gmail.com' },
        "status": { status, defaultSelect: 'on-hold' }
    },
    {
        "id": 9,
        "project-name": {
            "title": "Horizon: This name could work well for a project related to exploring new frontiers or expanding into new areas.",
            "img": "/images/brand/paypal.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "customer": {
            "name": "Elliot Nancy",
            "img": ""
        },
        "start-date": "2023-04-05",
        "end-date": "2023-04-10",
        "assigned": { assigned, defaultSelect: 'jon.tones@gmail.com' },
        "status": { status, defaultSelect: 'declined' }
    },
    {
        "id": 10,
        "project-name": {
            "title": "Zenith: This name could work well for a project related to achieving the highest point or peak of success.",
            "img": "/images/brand/google-drive.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "customer": {
            "name": "Della Henry",
            "img": "/images/avatar/7.png"
        },
        "start-date": "2023-04-05",
        "end-date": "2023-04-10",
        "assigned": { assigned, defaultSelect: 'lanie.nveyn@gmail.com' },
        "status": { status, defaultSelect: 'finished' }
    },
    {
        "id": 11,
        "project-name": {
            "title": "Momentum: This name could work well for a project related to maintaining forward motion and progress.",
            "img": "/images/brand/instagram.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "customer": {
            "name": "Nancy Della",
            "img": "/images/avatar/8.png"
        },
        "start-date": "2023-04-05",
        "end-date": "2023-04-10",
        "assigned": { assigned, defaultSelect: 'nneth.une@gmail.com' },
        "status": { status, defaultSelect: 'in-projress' }
    },
    {
        "id": 12,
        "project-name": {
            "title": "Synergy: This name could work well for a project related to collaboration or teamwork, where multiple parts come together to create a greater whole.",
            "img": "/images/brand/gitlab.png",
            "description": "Lorem ipsum dolor, sit amet consectetur adipisicing elit."
        },
        "customer": {
            "name": "Jon Audrey",
            "img": "/images/avatar/9.png"
        },
        "start-date": "2023-04-05",
        "end-date": "2023-04-10",
        "assigned": { assigned, defaultSelect: 'jon.tones@gmail.com' },
        "status": { status, defaultSelect: 'not-started' }
    },
]