import React, { useEffect, useState } from "react";
import Table from "@/components/shared/table/Table";
import Dropdown from "@/components/shared/Dropdown";
import Loader from "../loader";

import {
    FiEdit3,
    FiEye,
    FiMoreHorizontal,
    FiFileText
} from "react-icons/fi";

import {
    useNavigate
} from "react-router-dom";

import { toast } from "react-toastify";

const AdSetsTable = ({
    campaignId,
    adSets,
    setAdSets
}) => {

    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(true);

    const [updatingId, setUpdatingId] =
        useState(null);

    useEffect(() => {

        const fetchAdSets = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                const res = await fetch(
                    `https://api-0ggv.onrender.com/api/meta-ads/${campaignId}/adsets`,
                    {
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

                if (result.success) {

                    const list =
                        result.data?.data ||
                        result.data ||
                        [];

                    const mapped =
                        list.map((adSet) => ({
                            id: adSet.id,
                            name: adSet.name,
                            budget:
                                adSet.daily_budget ||
                                adSet.lifetime_budget ||
                                "—",
                            optimization:
                                adSet.optimization_goal ||
                                "—",
                            status:
                                adSet.status ||
                                "UNKNOWN",
                            createdAt:
                                adSet.created_time
                                    ? new Date(
                                        adSet.created_time
                                    ).toLocaleDateString()
                                    : "—"
                        }));

                    setAdSets(mapped);
                }

            } catch (error) {

                console.error(error);

                toast.error(
                    "Failed to fetch ad sets"
                );

            } finally {

                setLoading(false);

            }
        };

        if (campaignId) {
            fetchAdSets();
        }

    }, [campaignId, setAdSets]);

    const handleStatusUpdate =
        async (id, status) => {

            try {

                setUpdatingId(id);

                const token =
                    localStorage.getItem("token");

                const res = await fetch(
                    `https://api-0ggv.onrender.com/api/meta-ads/adsets/${id}/status`,
                    {
                        method: "PATCH",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            status
                        })
                    }
                );

                if (!res.ok)
                    throw new Error();

                setAdSets((prev) =>
                    prev.map((item) =>
                        item.id === id
                            ? {
                                ...item,
                                status
                            }
                            : item
                    )
                );

                toast.success(
                    "Ad Set status updated"
                );

            } catch (error) {

                toast.error(
                    "Failed to update status"
                );

            } finally {

                setUpdatingId(null);

            }
        };

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

            header: () => "Ad Set",

            cell: (info) => {

                const item =
                    info.row.original;

                return (
                    <div className="hstack gap-3">

                        <div className="avatar-text avatar-md">
                            <FiFileText />
                        </div>

                        <span
                            className="fw-semibold cursor-pointer"
                            onClick={() =>
                                navigate(
                                    `/meta-ads/adsets/view/${item.id}`
                                )
                            }
                        >
                            {item.name}
                        </span>

                    </div>
                );
            }
        },

        {
            accessorKey: "budget",
            header: () => "Budget"
        },

        {
            accessorKey: "optimization",
            header: () => "Optimization"
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

                if (updatingId === row.id) {
                    return (
                        <div className="spinner-border text-primary" />
                    );
                }

                return (
                    <select
                        className="form-select"
                        value={row.status}
                        onChange={(e) =>
                            handleStatusUpdate(
                                row.id,
                                e.target.value
                            )
                        }
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
                                `/meta-ads/adsets/edit/${id}`
                            )
                    },
                    {
                        label: "Ads",
                        icon: <FiFileText />,
                        onClick: () =>
                            navigate(
                                `/meta-ads/adsets/${id}/ads`
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
                                        `/meta-ads/adsets/view/${id}`
                                    )
                                }
                            />
                        </span>

                        <Dropdown
                            dropdownItems={actions}
                            triggerClass="avatar-md"
                            triggerPosition={"0,21"}
                            triggerIcon={
                                <FiMoreHorizontal />
                            }
                        />

                    </div>
                );
            },

            meta: {
                headerClassName: "text-end"
            }
        }
    ];

    if (loading)
        return <Loader />;

    return (
        <Table
            data={adSets}
            columns={columns}
        />
    );
};

export default AdSetsTable;