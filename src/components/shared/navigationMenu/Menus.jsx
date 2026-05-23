import React, { Fragment, useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { menuList } from "@/utils/fackData/menuList";
import getIcon from "@/utils/getIcon";
import Loader from "@/components/loader";

const Menus = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [openSubDropdown, setOpenSubDropdown] = useState(null);
    const [activeParent, setActiveParent] = useState("");
    const [activeChild, setActiveChild] = useState("");
    const [permissions, setPermissions] = useState(null);
    const [loading, setLoading] = useState(true);

    const pathName = useLocation().pathname;

    // ✅ FETCH PERMISSIONS
    useEffect(() => {
        const cached = localStorage.getItem("permissions");

        if (cached) {
            setPermissions(JSON.parse(cached));
            setLoading(false);
        }

        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const json = await res.json();
                const perms = json?.data?.role?.permissions || {};

                // ✅ SAVE TO LOCALSTORAGE
                localStorage.setItem("permissions", JSON.stringify(perms));

                setPermissions(perms);
            } catch (err) {
                console.error("Failed to fetch user", err);
                setPermissions({});
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // ✅ PERMISSION CHECK
    const canAccess = (perm, action) => {
        if (!perm) return false;

        if (action === "view") {
            return perm.view === true || typeof perm.view === "string";
        }

        return perm[action] === true;
    };

    // ✅ FILTER MENU
    const filterMenuByPermissions = (menuList, permissions) => {
        return menuList
            .map(menu => {
                const parentPerm = permissions?.[menu.permissionKey];

                // If parent has permissionKey → must have view
                if (menu.permissionKey && !parentPerm?.view) return null;

                const filteredChildren = (menu.dropdownMenu || []).filter(item => {
                    if (!item.permissionKey) return true;

                    const perm = permissions?.[item.permissionKey];
                    return canAccess(perm, item.permissionAction);
                });

                // ❗ DO NOT REMOVE PARENT — just empty children
                return {
                    ...menu,
                    dropdownMenu: filteredChildren
                };
            })
            .filter(Boolean);
    };

    // ✅ HANDLE MENU OPEN/CLOSE
    const handleMainMenu = (name) => {
        setOpenDropdown(prev => (prev === name ? null : name));
    };

    const handleDropdownMenu = (e, name) => {
        e.stopPropagation();
        setOpenSubDropdown(prev => (prev === name ? null : name));
    };

    // ✅ ACTIVE MENU TRACKING
    useEffect(() => {
        if (pathName !== "/") {
            const parts = pathName.split("/");
            setActiveParent(parts[1]);
            setActiveChild(parts[2]);
            setOpenDropdown(parts[1]);
            setOpenSubDropdown(parts[2]);
        } else {
            setActiveParent("dashboards");
            setOpenDropdown("dashboards");
        }
    }, [pathName]);

    // ✅ FALLBACK: show full menu until permissions load
    const filteredMenus =
        permissions !== null
            ? filterMenuByPermissions(menuList, permissions)
            : menuList;

    // ✅ DEBUG (optional)
    useEffect(() => {
        // console.log("Permissions:", permissions);
    }, [permissions]);

    if (loading) return <Loader />;

    return (
        <>
            {filteredMenus.map(({ dropdownMenu, id, name, path, icon }) => (
                <li
                    key={id}
                    onClick={() => handleMainMenu(name)}
                    className={`nxl-item nxl-hasmenu ${
                        activeParent === name ? "active nxl-trigger" : ""
                    }`}
                >
                    <Link to={path} className="nxl-link text-capitalize">
                        <span className="nxl-micon">{getIcon(icon)}</span>
                        <span className="nxl-mtext" style={{ paddingLeft: "2.5px" }}>
                            {name}
                        </span>
                        <span className="nxl-arrow fs-16">
                            <FiChevronRight />
                        </span>
                    </Link>

                    <ul
                        className={`nxl-submenu ${
                            openDropdown === name
                                ? "nxl-menu-visible"
                                : "nxl-menu-hidden"
                        }`}
                    >
                        {(dropdownMenu || []).map(
                            ({ id, name, path, subdropdownMenu }) => (
                                <Fragment key={id}>
                                    {subdropdownMenu?.length ? (
                                        <li
                                            className={`nxl-item nxl-hasmenu ${
                                                activeChild === name ? "active" : ""
                                            }`}
                                            onClick={(e) =>
                                                handleDropdownMenu(e, name)
                                            }
                                        >
                                            <Link
                                                to={path}
                                                className="nxl-link text-capitalize"
                                            >
                                                <span className="nxl-mtext">
                                                    {name}
                                                </span>
                                                <span className="nxl-arrow">
                                                    <FiChevronRight />
                                                </span>
                                            </Link>

                                            <ul
                                                className={`nxl-submenu ${
                                                    openSubDropdown === name
                                                        ? "nxl-menu-visible"
                                                        : "nxl-menu-hidden"
                                                }`}
                                            >
                                                {subdropdownMenu.map(
                                                    ({ id, name, path }) => (
                                                        <li
                                                            key={id}
                                                            className={`nxl-item ${
                                                                pathName === path
                                                                    ? "active"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <Link
                                                                className="nxl-link text-capitalize"
                                                                to={path}
                                                            >
                                                                {name}
                                                            </Link>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </li>
                                    ) : (
                                        <li
                                            className={`nxl-item ${
                                                pathName === path ? "active" : ""
                                            }`}
                                        >
                                            <Link
                                                className="nxl-link text-capitalize"
                                                to={path}
                                            >
                                                {name}
                                            </Link>
                                        </li>
                                    )}
                                </Fragment>
                            )
                        )}
                    </ul>
                </li>
            ))}
        </>
    );
};

export default Menus;