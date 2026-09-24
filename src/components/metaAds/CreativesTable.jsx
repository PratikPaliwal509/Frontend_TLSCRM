
import React, {
    useEffect,
    useState
} from "react";

import Table
    from "@/components/shared/table/Table";

import Dropdown
    from "@/components/shared/Dropdown";

import Loader
    from "../loader";

import {
    FiEdit3,
    FiEye,
    FiMoreHorizontal,
    FiImage
} from "react-icons/fi";

import {
    useNavigate
} from "react-router-dom";

import {
    toast
} from "react-toastify";

const CreativesTable = ({
    adId,
    creatives,
    setCreatives
}) => {

    const navigate = useNavigate();

    const [
        loading,
        setLoading
    ] = useState(true);

    useEffect(() => {

        const fetchCreatives = async () => {

            try {

                setLoading(true);

                const token =
                    localStorage.getItem(
                        "token"
                    );

                const url =
                    `https://api-0ggv.onrender.com/api/meta-ads/ads/${adId}/creatives`;

                console.log(
                    "Fetching creatives:",
                    url
                );

                const res =
                    await fetch(
                        url,
                        {
                            method: "GET",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,

                                "Content-Type":
                                    "application/json"
                            }
                        }
                    );

                const result =
                    await res.json();

                console.log(
                    "Creatives API response:",
                    result
                );

                if (!res.ok) {

                    throw new Error(
                        result?.message ||
                        "Failed to fetch creatives"
                    );
                }

                if (
                    result.success
                ) {

                    /*
                     * Supports both:
                     *
                     * {
                     *   success: true,
                     *   data: [...]
                     * }
                     *
                     * and Meta-style:
                     *
                     * {
                     *   success: true,
                     *   data: {
                     *      data: [...]
                     *   }
                     * }
                     */

                    const list =
                        Array.isArray(
                            result.data
                        )
                            ? result.data
                            : result.data?.data ||
                              [];

                    const mapped =
                        list.map(
                            (creative) => ({
                                id:
                                    creative.id,

                                name:
                                    creative.name ||
                                    "Unnamed Creative",

                                status:
                                    creative.status ||
                                    "ACTIVE",

                                title:
                                    creative.title ||
                                    creative.object_story_spec
                                        ?.link_data
                                        ?.name ||
                                    "—",

                                body:
                                    creative.body ||
                                    creative.object_story_spec
                                        ?.link_data
                                        ?.message ||
                                    "—",

                                imageUrl:
                                    creative.image_url ||
                                    creative.thumbnail_url ||
                                    creative.object_story_spec
                                        ?.link_data
                                        ?.picture ||
                                    null,

                                createdAt:
                                    creative.created_time
                                        ? new Date(
                                            creative.created_time
                                        ).toLocaleDateString()
                                        : "—"
                            })
                        );

                    setCreatives(
                        mapped
                    );

                } else {

                    setCreatives([]);

                    toast.error(
                        result?.message ||
                        "Failed to fetch creatives"
                    );
                }

            } catch (error) {

                console.error(
                    "Fetch Creatives Error:",
                    error
                );

                setCreatives([]);

                toast.error(
                    error.message ||
                    "Failed to fetch creatives"
                );

            } finally {

                setLoading(false);

            }
        };

        if (adId) {

            fetchCreatives();

        } else {

            console.error(
                "Ad ID is undefined"
            );

            setLoading(false);
        }

    }, [adId, setCreatives]);


    const columns = [

        {
            accessorKey: "id",

            header: ({
                table
            }) => (

                <input
                    type="checkbox"
                    className="custom-table-checkbox"

                    checked={
                        table.getIsAllRowsSelected()
                    }

                    onChange={
                        table.getToggleAllRowsSelectedHandler()
                    }
                />

            ),

            cell: ({
                row
            }) => (

                <input
                    type="checkbox"
                    className="custom-table-checkbox"

                    checked={
                        row.getIsSelected()
                    }

                    onChange={
                        row.getToggleSelectedHandler()
                    }
                />

            ),

            meta: {
                headerClassName:
                    "width-30"
            }
        },

        {
            accessorKey: "name",

            header: () => "Creative",

            cell: (info) => {

                const creative =
                    info.row.original;

                return (

                    <div className="hstack gap-3">

                        <div className="avatar-text avatar-md">

                            <FiImage />

                        </div>

                        <div>

                            <div
                                className="fw-semibold cursor-pointer"

                                onClick={() =>
                                    navigate(
                                        `/meta-ads/creatives/view/${creative.id}`
                                    )
                                }
                            >
                                {
                                    creative.name
                                }
                            </div>

                            <div className="fs-11 text-muted">
                                ID: {
                                    creative.id
                                }
                            </div>

                        </div>

                    </div>

                );
            }
        },

        {
            accessorKey: "title",

            header: () => "Title",

            cell: (info) => (

                <span>
                    {
                        info.getValue()
                    }
                </span>

            )
        },

        {
            accessorKey: "imageUrl",

            header: () => "Preview",

            cell: (info) => {

                const image =
                    info.getValue();

                if (!image) {

                    return (
                        <div className="avatar-text avatar-md">
                            <FiImage />
                        </div>
                    );
                }

                return (

                    <img
                        src={image}
                        alt="Creative"
                        style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "6px"
                        }}
                    />

                );
            }
        },

        {
            accessorKey: "status",

            header: () => "Status",

            cell: (info) => {

                const status =
                    info.getValue();

                return (

                    <span
                        className={
                            `badge ${
                                status === "ACTIVE"
                                    ? "bg-soft-success text-success"
                                    : "bg-soft-warning text-warning"
                            }`
                        }
                    >
                        {
                            status
                        }
                    </span>

                );
            }
        },

        {
            accessorKey: "createdAt",

            header: () => "Created Date"
        },

        {
            accessorKey: "actions",

            header: () => "Actions",

            cell: ({
                row
            }) => {

                const id =
                    row.original.id;

                const actions = [

                    {
                        label: "Edit",

                        icon:
                            <FiEdit3 />,

                        onClick: () =>
                            navigate(
                                `/meta-ads/creatives/edit/${id}`
                            )
                    }

                ];

                return (

                    <div className="hstack gap-2 justify-content-end">

                        <span
                            className="avatar-text avatar-md"
                        >

                            <FiEye
                                className="cursor-pointer"

                                onClick={() =>
                                    navigate(
                                        `/meta-ads/creatives/view/${id}`
                                    )
                                }
                            />

                        </span>

                        <Dropdown
                            dropdownItems={
                                actions
                            }

                            triggerClass="avatar-md"

                            triggerPosition={
                                "0,21"
                            }

                            triggerIcon={
                                <FiMoreHorizontal />
                            }
                        />

                    </div>

                );
            },

            meta: {
                headerClassName:
                    "text-end"
            }
        }
    ];


    if (loading) {

        return <Loader />;

    }


    if (!creatives?.length) {

        return (

            <div className="card-body">

                <div className="text-center py-5">

                    <div className="avatar-text avatar-lg mx-auto mb-3">

                        <FiImage
                            size={24}
                        />

                    </div>

                    <h6 className="fw-bold">
                        No Creatives Found
                    </h6>

                    <p className="text-muted fs-12 mb-0">
                        No creatives are associated
                        with this ad.
                    </p>

                </div>

            </div>

        );
    }


    return (

        <Table
            data={
                creatives
            }

            columns={
                columns
            }
        />

    );
};

export default CreativesTable;
