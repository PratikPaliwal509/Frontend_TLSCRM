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
    const pathName = useLocation().pathname;
    const [permissions, setPermissions] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const cached = localStorage.getItem("permissions");

        if (cached) {
            setPermissions(JSON.parse(cached));
            setLoading(false);
            return;
        }
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                const json = await res.json();
                setPermissions(json?.data?.role?.permissions || {});
            } catch (err) {
                console.error("Failed to fetch user", err);
                setPermissions({});
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const canAccess = (perm, action) => {
        if (!perm) return false;

        // view can be true | agency | own | assigned
        if (action === "view") {
            return Boolean(perm.view);
        }

        // create/edit/delete must be true
        return perm[action] === true;
    };

    const filterMenuByPermissions = (menuList, permissions) => {
        return menuList
            .map(menu => {
                const parentPerm = permissions[menu.permissionKey];

                // Parent must have at least VIEW permission
                if (menu.permissionKey && !parentPerm?.view) return null;

                const filteredChildren = menu.dropdownMenu?.filter(item => {
                    if (!item.permissionKey) return true;

                    const perm = permissions[item.permissionKey];
                    return canAccess(perm, item.permissionAction);
                });

                if (menu.dropdownMenu && filteredChildren.length === 0) {
                    return null;
                }

                return {
                    ...menu,
                    dropdownMenu: filteredChildren
                };
            })
            .filter(Boolean);
    };


    const handleMainMenu = (e, name) => {
        if (openDropdown === name) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(name);
        }
    };

    const handleDropdownMenu = (e, name) => {
        e.stopPropagation();
        if (openSubDropdown === name) {
            setOpenSubDropdown(null);
        } else {
            setOpenSubDropdown(name);
        }
    };

    useEffect(() => {
        if (pathName !== "/") {
            const x = pathName.split("/");
            setActiveParent(x[1]);
            setActiveChild(x[2]);
            setOpenDropdown(x[1]);
            setOpenSubDropdown(x[2]);
        } else {
            setActiveParent("dashboards");
            setOpenDropdown("dashboards");
        }
    }, [pathName]);
    const filteredMenus = permissions
        ? filterMenuByPermissions(menuList, permissions)
        : [];

    if (loading) {
        return (
            <Loader />
        );
    }

    return (
        <>
            {filteredMenus.map(({ dropdownMenu, id, name, path, icon }) => {
                return (
                    <li
                        key={id}
                        onClick={(e) => handleMainMenu(e, name)}
                        className={`nxl-item nxl-hasmenu ${activeParent === name ? "active nxl-trigger" : ""}`}
                    >
                        <Link to={path} className="nxl-link text-capitalize">
                            <span className="nxl-micon"> {getIcon(icon)} </span>
                            <span className="nxl-mtext" style={{ paddingLeft: "2.5px" }}>
                                {name}
                            </span>
                            <span className="nxl-arrow fs-16">
                                <FiChevronRight />
                            </span>
                        </Link>
                        <ul
                            className={`nxl-submenu ${openDropdown === name ? "nxl-menu-visible" : "nxl-menu-hidden"}`}
                        >
                            {dropdownMenu.map(({ id, name, path, subdropdownMenu }) => {
                                const x = name;
                                return (
                                    <Fragment key={id}>
                                        {subdropdownMenu.length ? (
                                            <li
                                                className={`nxl-item nxl-hasmenu ${activeChild === name ? "active" : ""
                                                    }`}
                                                onClick={(e) => handleDropdownMenu(e, x)}
                                            >
                                                <Link to={path} className={`nxl-link text-capitalize`}>
                                                    <span className="nxl-mtext">{name}</span>
                                                    <span className="nxl-arrow">
                                                        <i>
                                                            {" "}
                                                            <FiChevronRight />
                                                        </i>
                                                    </span>
                                                </Link>
                                                {subdropdownMenu.map(({ id, name, path }) => {
                                                    return (
                                                        <ul
                                                            key={id}
                                                            className={`nxl-submenu ${openSubDropdown === x
                                                                ? "nxl-menu-visible"
                                                                : "nxl-menu-hidden "
                                                                }`}
                                                        >
                                                            <li
                                                                className={`nxl-item ${pathName === path ? "active" : ""
                                                                    }`}
                                                            >
                                                                <Link
                                                                    className="nxl-link text-capitalize"
                                                                    to={path}
                                                                >
                                                                    {name}
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    );
                                                })}
                                            </li>
                                        ) : (
                                            <li
                                                className={`nxl-item ${pathName === path ? "active" : ""
                                                    }`}
                                            >
                                                <Link className="nxl-link" to={path}>
                                                    {name}
                                                </Link>
                                            </li>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </ul>
                    </li>
                );
            })}
        </>
    );
};

export default Menus;
