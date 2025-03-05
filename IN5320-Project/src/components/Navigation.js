import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";
import {AddSchoolIcon} from "./icons/AddSchoolIcon";
import {SwapIcon} from "./icons/SwapIcon";
import {DashboardIcon} from "./icons/DashboardIcon";
import {ProfileIcon} from "./icons/ProfileIcon";

export function Navigation(props) {
  return (
    <Menu className="navmenu">
      <MenuItem
          aria-role={"Navigation"}
            className={"navitem"}
            icon={<ProfileIcon size={40} />}
            label="My profile"
            active={props.activePage === "Profile"}
            onClick={() => props.activePageHandler("Profile")}
      />
        <MenuItem
            aria-role={"Navigation"}
            className={"navitem"}
            icon={<DashboardIcon size={40}/>}
            label="Dashboard"
            active={props.activePage === "Dashboard"}
            onClick={() => props.activePageHandler("Dashboard")}
      />
      <MenuItem
          aria-role={"Navigation"}
            className={"navitem"}
            icon={ <AddSchoolIcon large/> }
            label="Add school"
            active={props.activePage === "AddSchool"}
            onClick={() => props.activePageHandler("AddSchool")}
      />
        <MenuItem
            aria-role={"Navigation"}
            className={"navitem"}
            icon={ <SwapIcon size={40} />}
            label="Change cluster"
            active={props.activePage === "ChangeCluster"}
            onClick={() => props.activePageHandler("ChangeCluster")}
        />
    </Menu>
  );
}