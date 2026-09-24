import React, { useEffect, useState } from "react";
import Table from "@/components/shared/table/Table";
import Dropdown from "@/components/shared/Dropdown";
import Loader from "../loader";

import {
    FiEdit3,
    FiEye,
    FiMoreHorizontal,
    FiTarget,
    FiLayers
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CampaignsTable = ({
    campaigns,
    setCampaigns
}) => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {

        const fetchCampaigns = async () => {

            try {

                const token = localStorage.getItem("token");

                const res = await fetch(
                    "https://api-0ggv.onrender.com/api/meta-ads/campaigns",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                const result = await res.json();

                if (result.success) {

                    const list =
                        result.data?.data ||
                        result.data ||
                        [];

                    const mapped = list.map((campaign) => ({
                        id: campaign.id,
                        name: campaign.name,
                        objective:
                            campaign.objective || "—",
                        status:
                            campaign.status || "UNKNOWN",
                        createdAt:
                            campaign.created_time
                                ? new Date(
                                    campaign.created_time
                                ).toLocaleDateString()
                                : "—"
                    }));

                    setCampaigns(mapped);
                }

            } catch (error) {

                console.error(
                    "Failed to fetch campaigns",
                    error
                );

                toast.error(
                    "Failed to fetch campaigns"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchCampaigns();

    }, [setCampaigns]);

    const handleStatusUpdate = async (
        campaignId,
        status
    ) => {

        const confirmUpdate = window.confirm(
            `Are you sure you want to change campaign status to ${status}?`
        );

        if (!confirmUpdate) return;

        try {

            setUpdatingId(campaignId);

            const token =
                localStorage.getItem("token");

            const res = await fetch(
                `https://api-0ggv.onrender.com/api/meta-ads/campaigns/${campaignId}/status`,
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

            if (!res.ok) {
                throw new Error(
                    "Status update failed"
                );
            }

            setCampaigns((prev) =>
                prev.map((campaign) =>
                    campaign.id === campaignId
                        ? {
                            ...campaign,
                            status
                        }
                        : campaign
                )
            );

            toast.success(
                "Campaign status updated successfully"
            );

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to update campaign status"
            );

        } finally {

            setUpdatingId(null);

        }
    };

    const StatusCell = ({ row }) => {

        if (updatingId === row.id) {
            return (
                <div className="d-flex justify-content-center">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />
                </div>
            );
        }

        return (
            <select
                value={row.status}
                onChange={(e) =>
                    handleStatusUpdate(
                        row.id,
                        e.target.value
                    )
                }
                className="form-select"
            >
                <option value="ACTIVE">
                    Active
                </option>

                <option value="PAUSED">
                    Paused
                </option>

                <option value="ARCHIVED">
                    Archived
                </option>
            </select>
        );
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

            header: () => "Campaign",

            cell: (info) => {

                const row =
                    info.row.original;

                return (
                    <div className="hstack gap-3">

                        <div className="avatar-text avatar-md">
                            <FiTarget />
                        </div>

                        <span
                            className="cursor-pointer fw-semibold"
                            onClick={() =>
                                navigate(
                                    `/meta-ads/campaigns/view/${row.id}`
                                )
                            }
                        >
                            {row.name}
                        </span>

                    </div>
                );
            }
        },

        {
            accessorKey: "objective",

            header: () => "Objective"
        },

        {
            accessorKey: "id",

            header: () => "Campaign ID",

            cell: (info) => (
                <div
                    style={{
                        maxWidth: "180px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }}
                >
                    {info.getValue()}
                </div>
            )
        },

        {
            accessorKey: "createdAt",

            header: () => "Created Date"
        },

        {
            accessorKey: "status",

            header: () => "Status",

            cell: (info) => (
                <StatusCell
                    row={info.row.original}
                />
            )
        },

        {
            accessorKey: "actions",

            header: () => "Actions",

            cell: ({ row }) => {

                const campaignId =
                    row.original.id;

                const rowActions = [
                    {
                        label: "Edit",
                        icon: <FiEdit3 />,
                        onClick: () =>
                            navigate(
                                `/meta-ads/campaigns/edit/${campaignId}`
                            )
                    },

                    {
                        label: "Ad Sets",
                        icon: <FiLayers />,
                        onClick: () =>
                            navigate(
                                `/meta-ads/campaigns/${campaignId}/adsets`
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
                                        `/meta-ads/campaigns/view/${campaignId}`
                                    )
                                }
                            />

                        </span>

                        <Dropdown
                            dropdownItems={
                                rowActions
                            }
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

    if (loading) {
        return <Loader />;
    }

    return (
        <Table
            data={campaigns}
            columns={columns}
        />
    );
};

export default CampaignsTable;