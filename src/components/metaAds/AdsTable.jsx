
import React, {
    useEffect,
    useState
} from "react";

import Table from "@/components/shared/table/Table";
import Dropdown from "@/components/shared/Dropdown";
import Loader from "../loader";

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

const AdsTable = ({
    adSetId,
    ads,
    setAds
}) => {
console.log("Rendering AdsTable component with adSetId:", adSetId);
    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const fetchAds = async () => {

            console.log(
                "Fetching ads for adSetId:",
                adSetId
            );

            try {

                const token =
                    localStorage.getItem("token");

                const url =
                    `https://api-0ggv.onrender.com/api/meta-ads/adsets/${adSetId}/ads`;

                console.log(
                    "Ads API URL:",
                    url
                );

                const res = await fetch(
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

                console.log(
                    "Ads API status:",
                    res.status
                );

                const result =
                    await res.json();

                console.log(
                    "Ads API response:",
                    result
                );

                if (!res.ok) {
                    throw new Error(
                        result?.message ||
                        "Failed to fetch ads"
                    );
                }

                if (result.success) {

                    /*
                     * Backend response:
                     *
                     * {
                     *   success: true,
                     *   data: [...]
                     * }
                     */

                    const list =
                        Array.isArray(result.data)
                            ? result.data
                            : result.data?.data || [];

                    console.log(
                        "Ads list:",
                        list
                    );

                    const mapped =
                        list.map((ad) => ({
                            id: ad.id,

                            name:
                                ad.name ||
                                "Unnamed Ad",

                            creative:
                                ad.creative?.id ||
                                "—",

                            status:
                                ad.status ||
                                "UNKNOWN",

                            createdAt:
                                ad.created_time
                                    ? new Date(
                                        ad.created_time
                                    ).toLocaleDateString()
                                    : "—"
                        }));

                    console.log(
                        "Mapped ads:",
                        mapped
                    );

                    setAds(mapped);

                } else {

                    setAds([]);

                    toast.error(
                        result?.message ||
                        "Failed to fetch ads"
                    );
                }

            } catch (error) {

                console.error(
                    "Fetch Ads Error:",
                    error
                );

                toast.error(
                    error.message ||
                    "Failed to fetch ads"
                );

                setAds([]);

            } finally {

                console.log(
                    "Finished loading ads"
                );

                setLoading(false);
            }
        };

        if (adSetId) {
            fetchAds();
        } else {
            setLoading(false);
        }

    }, [adSetId, setAds]);


    const columns = [

        {
            accessorKey: "id",

            header: ({ table }) => (
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

            cell: ({ row }) => (
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
                headerClassName: "width-30"
            }
        },

        {
            accessorKey: "name",

            header: () => "Ad",

            cell: (info) => {

                const ad =
                    info.row.original;

                return (
                    <div className="hstack gap-3">

                        <div className="avatar-text avatar-md">
                            <FiImage />
                        </div>

                        <span
                            className="fw-semibold cursor-pointer"
                            onClick={() =>
                                navigate(
                                    `/meta-ads/ads/view/${ad.id}`
                                )
                            }
                        >
                            {ad.name}
                        </span>

                    </div>
                );
            }
        },

        {
            accessorKey: "creative",

            header: () => "Creative ID"
        },

        {
            accessorKey: "createdAt",

            header: () => "Created Date"
        },

        {
            accessorKey: "status",

            header: () => "Status",

            cell: (info) => {

                const row =
                    info.row.original;

                return (
                    <select
                        className="form-select"
                        value={row.status}
                        onChange={async (e) => {

                            const status =
                                e.target.value;

                            try {

                                const token =
                                    localStorage.getItem(
                                        "token"
                                    );

                                const res =
                                    await fetch(
                                        `https://api-0ggv.onrender.com/api/meta-ads/ads/${row.id}/status`,
                                        {
                                            method:
                                                "PATCH",

                                            headers: {
                                                Authorization:
                                                    `Bearer ${token}`,

                                                "Content-Type":
                                                    "application/json"
                                            },

                                            body:
                                                JSON.stringify({
                                                    status
                                                })
                                        }
                                    );

                                const result =
                                    await res.json();

                                if (!res.ok) {
                                    throw new Error(
                                        result?.message ||
                                        "Failed to update status"
                                    );
                                }

                                setAds((prev) =>
                                    prev.map(
                                        (item) =>
                                            item.id ===
                                            row.id
                                                ? {
                                                    ...item,
                                                    status
                                                }
                                                : item
                                    )
                                );

                                toast.success(
                                    "Ad status updated"
                                );

                            } catch (error) {

                                console.error(
                                    "Status update error:",
                                    error
                                );

                                toast.error(
                                    error.message ||
                                    "Failed to update status"
                                );
                            }

                        }}
                    >

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="PAUSED">
                            Paused
                        </option>

                    </select>
                );
            }
        },

        {
            accessorKey: "actions",

            header: () => "Actions",

            cell: ({ row }) => {

                const id =
                    row.original.id;

                const actions = [

                    {
                        label: "Edit",

                        icon: <FiEdit3 />,

                        onClick: () =>
                            navigate(
                                `/meta-ads/ads/edit/${id}`
                            )
                    },

                    {
                        label: "Creative",

                        icon: <FiImage />,

                        onClick: () =>
                            navigate(
                                `/meta-ads/ads/${id}/creatives`
                            )
                    }
                ];

                return (
                    <div className="hstack gap-2 justify-content-end">

                        <span className="avatar-text avatar-md">

                            <FiEye
                                className="cursor-pointer"

                                onClick={() =>
                                    navigate(
                                        `/meta-ads/ads/view/${id}`
                                    )
                                }
                            />

                        </span>

                        <Dropdown
                            dropdownItems={
                                actions
                            }

                            triggerClass="avatar-md"

                            triggerPosition="0,21"

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


    return (
        <Table
            data={ads || []}
            columns={columns}
        />
    );
};

export default AdsTable;
