const propsalRelatedOptions = [
    { value: 'lead', label: 'Lead', icon: "feather-at-sign" },
    { value: 'coustomer', label: 'Coustomer', icon: "feather-users" },
]
const propsalDiscountOptions = [
    { value: 'no-discount', label: 'No Discount' },
    { value: 'before-tax', label: 'Before Tax' },
    { value: 'after-tax', label: 'After Tax' },
]
const propsalVisibilityOptions = [
    { value: 'public', label: 'Public', icon: "feather-globe" },
    { value: 'private', label: 'Private', icon: "feather-lock" },
    { value: 'personal', label: 'Personal', icon: "feather-user" },
    { value: 'customs', label: 'Customs', icon: "feather-settings" },
]
const propasalLeadOptions = [
    { value: 'web', label: 'Alexandra Della - Website design and development', img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z" },
    { value: 'ui', label: 'Curtis Green - User experience (UX) and user interface (UI) design', img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z" },
    { value: 'mobile', label: 'Marianne Audrey - Responsive and mobile design', img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z" },
    { value: 'ecommerce', label: 'Holland Scott - E-commerce website design and development', img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z" },
    { value: 'ecommerce', label: 'Olive Delarosa - Custom graphics and icon design', img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAmgMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAABQYHBAEC/8QANRAAAgIBAgIHBQcFAQAAAAAAAAECAwQFEQYxEiFBQlFhsSKBkaHBExQjUnFy0TIzYoLhJf/EABYBAQEBAAAAAAAAAAAAAAAAAAABAv/EABYRAQEBAAAAAAAAAAAAAAAAAAARAf/aAAwDAQACEQMRAD8A1IAGmQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAABAAAAAAAAAAAAAAAAAARU+K9enVKWBhWdGW341kea37q+pRKanxHg6fJ19KV9yezhVs9n5vsIiXGk+l7OBHo+dr39Cp+4FSr1g8XYN8lDJrsxpPq6T64/HmvgWCEozgpwkpRkt1KL3TRkpM8O65Zplyquk5Ykn7UX3P8AJfUK0IHiakk4tOL6012npAABAAAAAAAAAAAAAAcmq5iwNOvytt3CPsp9sn1L5szCUpTk5zbcpPdt9rL1xvNx0eMVyldFP4NlELhoACoD9AAL1wXnPJ02WNN7yxmkv2vl9UWEpHAs2tSvguUqd37mv5LuRQAEAAAAAAAAAAAAABA8aV9PReku5bFv5r6ooRqOpYizsC/Flt+JBpb9j5r5pGYWQlXOULIuM4ycZJ9jRcTXyACgAALNwJXvnZNnZGpL4v8A4XUgeDcJ4ulu6cdp5L6fX+Xu/V+8niKAAgAAAAAAAAAAAAABWuJeHnmzeZgpfeO/Xy6fmvMsoKMnuqsosdd1c65ruzjsz4NWvxqMmPRyKK7Y+E4pnG9C0ltt6fQn5Lb5CkZqut7Lm+wsegcNXZNkL9QrdWOutQl1Ss8OrsRb8bAw8Z742JTW/wA0IJP4nSKR4kkkkkkuxHoBAAAAAAAAAAAAAAACK1zW6NJr2e1mTJbwqT+b8EUSORfTjVO3ItjVWucpvZFczuMMetuODQ7n+ebcY/Dn6FVz9QydQu+1yrXN9i5Rj+iOUQqayOKdWufsWwpj4QrXq9zmeu6s3v8Af7vcyOBUS9PEurVPd5X2iXdshFp/LclcLjKSajnYqa/PS+X+r/kqYBWoYGpYmoQcsW6M9uceTX6o6zJ6bbKLI2U2Srsj1xlF7NFz4f4ljluOLqHRhfyhYuqM/J+D9SRasoHIAAAQAAAAAAAfry8QI7XNUhpWFK1pStl7NUPGX8IznIvtyb53X2Oyyct5Sfad3EOovUtSssi/wYexUvJdvvI00gAAAAAAAAAALxwnrbzK/uWVNvIrW8JPvxXj5osZlGPfZjX130y6NlclKL8GjT9Py4Z2FTlV9UbI77b8n2r4k1cdAAIAAAAAARfEmW8PR8icXtOa+zjt59XpuShVePLdqMOld6cpP3JJepRTgAVAAAAAAAAAAAC48C5bdWThyl/S1ZBeT6n89n7ynE1wfa69dqj2WQlB/Df6BcaCADIAAAAABTuPf7+F+yfqgC4KqACoAAAAAAAAAAASnDD/APfwv3v0YAXGj9gAMgAAP//Z" },
]
const propsalStatusOptions = [
    { value: 'sent', label: 'Sent', color: "#41b2c4" },
    { value: 'draft', label: 'Draft', color: "#64748b" },
    { value: 'open', label: 'Open', color: "#3454d1" },
    { value: 'revised', label: 'Revised', color: "#ffa21d" },
    { value: 'declined', label: 'Declined', color: "#ea4d4d" },
    { value: 'accepted', label: 'Accepted', color: "#17c666" },
]

const customerViewOptions = [
    { value: "sms", label: "SMS", icon: "feather-smart-phone" },
    { value: "push", label: "Push", icon: "feather-bell" },
    { value: "email", label: "Email", icon: "feather-mail" },
    { value: "repeat", label: "Repeat", icon: "feather-repeat" },
    { value: "deactivate", label: "Deactivate", icon: "feather-bell-off" },
    { value: "sms-push", label: "SMS + Push", icon: "feather-smart-phone" },
    { value: "email-push", label: "Email + Push", icon: "feather-mail" },
    { value: "sms-email", label: "SMS + Email", icon: "feather-smart-phone" },
    { value: "sms-push-email", label: "SMS + Push + Email", icon: "feather-smart-phone" },
]

const customerListTagsOptions = [
    { value: 'vip', label: 'VIP', color: '#17c666' },
    { value: 'bugs', label: 'Bugs', color: '#3dc7be' },
    { value: 'team', label: 'Team', color: '#3454d1' },
    { value: 'updates', label: 'Updates', color: '#17c666' },
    { value: 'personal', label: 'Personal', color: '#ffa21d' },
    { value: 'promotions', label: 'Promotions', color: '#ea4d4d' },
    { value: 'high-budget', label: 'High Budget', color: '#41b2c4' },
    { value: 'customs', label: 'Customs', color: '#6610f2' },
    { value: 'low-budget', label: 'Low Budget', color: '#ea4d4d' },
    { value: 'wholesale', label: 'Wholesale', color: '#3454d1' },
    { value: 'primary', label: 'Primary', color: '#41b2c4' },
];
const customerListStatusOptions = [
    { value: 'active', label: 'Active', color: '#17c666' },
    { value: 'inactive', label: 'Inactive', color: '#ffa21d' },
    { value: 'declined', label: 'Declined', color: '#ea4d4d' },
];
const customerCreatePrivacyOptions = [
    { value: 'onlyme', label: 'Only Me', icon: 'feather-lock' },
    { value: 'everyone', label: 'Everyone', icon: 'feather-globe' },
    { value: 'anonymous', label: 'Anonymous', icon: 'feather-users' },
    { value: 'ifollow', label: 'People I Follow', icon: 'feather-user-check' },
    { value: 'followme', label: 'People Follow Me', icon: 'feather-eye' },
    { value: 'customselectever', label: 'Custom Select Ever', icon: 'feather-settings' }
];
const leadsGroupsOptions = [
    { value: "group-a", label: "Group-A", color: "#17c666" },
    { value: "group-b", label: "Group-B", color: "#283c50" },
    { value: "group-c", label: "Group-C", color: "#3454d1" },
    { value: "group-d", label: "Group-D", color: "#41b2c4" },
    { value: "group-e", label: "Group-E", color: "#17c666" },
    { value: "group-f", label: "Group-F", color: "#ffa21d" },
    { value: "group-g", label: "Group-G", color: "#ea4d4d" },
    { value: "group-h", label: "Group-H", color: "#6610f2" },
    { value: "group-i", label: "Group-I", color: "#3454d1" },
    { value: "group-j", label: "Group-J", color: "#ea4d4d" },
    { value: "group-k", label: "Group-K", color: "#41b2c4" },
]

const taskStatusOptions = [
    { value: 'to_do', label: 'To Do', color: '#f59e0b' },
    { value: 'inprogress', label: 'Inprogress', color: '#3454d1' },
    { value: 'pending', label: 'Pending', color: '#64748b' },
    { value: 'completed', label: 'Completed', color: '#17c666' },
    { value: 'rejected', label: 'Rejected', color: '#ea4d4d' },
    { value: 'upcoming', label: 'Upcoming', color: '#ffa21d' },
    { value: 'auto', label: 'Auto', color: '#283c50' },
];

const taskPriorityOptions = [
    { value: 'low', label: 'Low', color: '#3454d1' },
    { value: 'normal', label: 'Normal', color: '#64748b' },
    { value: 'medium', label: 'Medium', color: '#17c666' },
    { value: 'high', label: 'High', color: '#ffa21d' },
    { value: 'urgent', label: 'Urgent', color: '#ea4d4d' },
];

const taskLabelsOptions = [
    { value: 'team', label: 'Team', color: '#3454d1' },
    { value: 'primary', label: 'Primary', color: '#41b2c4' },
    { value: 'updates', label: 'Updates', color: '#17c666' },
    { value: 'personal', label: 'Personal', color: '#ffa21d' },
    { value: 'promotions', label: 'Promotions', color: '#ea4d4d' },
    { value: 'customs', label: 'Customs', color: '#6610f2' },
];
const taskTypeOptions = [
        { label: 'Content Creation', value: 'content creation', color: '#3454d1' },
        { label: 'Design', value: 'design', color: '#41b2c4' },
        { label: 'SEO', value: 'seo', color: '#17c666' },
        { label: 'Social Media', value: 'social media', color: '#ffa21d' },
        { label: 'Reporting', value: 'reporting', color: '#ea4d4d' },
        { label: 'Feature', value: 'feature', color: '#6f42c1' },
        { label: 'Bug', value: 'bug', color: '#dc3545' },
        { label: 'Meeting', value: 'meeting', color: '#20c997' },
        { label: 'Review', value: 'review', color: '#0dcaf0' },
        { label: 'Deployment', value: 'deployment', color: '#fd7e14' },
        { label: 'Support', value: 'support', color: '#198754' }

    // { value: 'new', label: 'New', color: '#3454d1' },
    // { value: 'pending', label: 'Pending', color: '#41b2c4' },
    // { value: 'progress', label: 'Progress', color: '#17c666' },
    // { value: 'completed', label: 'Completed', color: '#ffa21d' },
    // { value: 'everythings', label: 'Everythings', color: '#ea4d4d' },
];


const taskAssigneeOptions = [
    {
        img: "/images/avatar/2.png",
        label: "arcie.tones@gmail.com",
        value: "arcie.tones@gmail.com",
    },

    {
        img: "/images/avatar/3.png",
        label: "jon.tones@gmail.com",
        value: "jon.tones@gmail.com",
    },
    {
        img: "/images/avatar/4.png",
        label: "lanie.nveyn@gmail.com",
        value: "lanie.nveyn@gmail.com",
    },
    {
        img: "/images/avatar/5.png",
        label: "nneth.une@gmail.com",
        value: "nneth.une@gmail.com",
    },
    {
        img: "/images/avatar/6.png",
        label: "erna.serpa@outlook.com",
        value: "erna.serpa@outlook.com",
    },
    {
        img: "/images/avatar/7.png",
        label: "mar.audrey@gmail.com",
        value: "mar.audrey@gmail.com",
    },
    {
        img: "/images/avatar/8.png",
        label: "nancy.elliot@outlook.com",
        value: "nancy.elliot@outlook.com",
    },
]

const leadsStatusOptions = [
    { value: "new", label: "New", color: "#3454d1" },
    { value: "contacted", label: "Contacted", color: "#41b2c4" },
    { value: "working", label: "Working", color: "#ffa21d" },
    { value: "qualified", label: "Qualified", color: "#17c666" },
    { value: "declined", label: "Declined", color: "#ea4d4d" },
    { value: "customer", label: "Customer", color: "#6610f2" },
]

const leadsSourceOptions = [
    { value: "facebook", label: "Facebook", icon: "feather-facebook" },
    { value: "twitter", label: "Twitter", icon: "feather-twitter" },
    { value: "instagram", label: "Instagram", icon: "feather-instagram" },
    { value: "linkedin", label: "Linkedin", icon: "feather-linkedin" },
    { value: "search-engine", label: "Search Engine", icon: "feather-search" },
    { value: "others", label: "Others", icon: "feather-compass" },

]

const projectStatusOptions = [
    { value: "in-projress", label: "In Projress", color: "#3454d1" },
    { value: "not-started", label: "Not Started", color: "#ffa21d" },
    { value: "on-hold", label: "On Hold", color: "#17c666" },
    { value: "declined", label: "Declined", color: "#ea4d4d" },
    { value: "finished", label: "Finished", color: "#41b2c4" },
    { value: 'active', label: 'Active', color: '#17c666' }
]
const projectBillingOptions = [
    { value: "fixed-rate", label: "Fixed Rate", color: "#3454d1" },
    { value: "tasks-hours", label: "Tasks Hours", color: "#ffa21d" },
    { value: "project-hours", label: "Project Hours", color: "#17c666" },
]
const projectNotificationsOptions = [
    { value: "specific-contacts", label: "Specific Contacts", icon: "feather-user" },
    { value: "dont-send", label: "Don't send notification", icon: "feather-bell-off" },
    { value: "all", label: "All contact with notification", icon: "feather-bell" },
]
const projectRoalOptions = [
    { value: "admin", label: "Admin", color: "#3454d1" },
    { value: "guest", label: "Guest", color: "#41b2c4" },
    { value: "editor", label: "Editor", color: "#ea4d4d" },
    { value: "owner", label: "Owner", color: "#ffa21d" },
    { value: "customer", label: "Customer", color: "#17c666" }
]
export {
    propsalRelatedOptions,
    propsalDiscountOptions,
    propsalVisibilityOptions,
    propasalLeadOptions,
    propsalStatusOptions,
    customerViewOptions,
    customerListTagsOptions,
    customerListStatusOptions,
    customerCreatePrivacyOptions,
    leadsGroupsOptions,
    taskStatusOptions,
    taskPriorityOptions,
    taskLabelsOptions,
    taskAssigneeOptions,
    leadsStatusOptions,
    leadsSourceOptions,
    projectStatusOptions,
    projectBillingOptions,
    projectNotificationsOptions,
    projectRoalOptions,
    taskTypeOptions
}