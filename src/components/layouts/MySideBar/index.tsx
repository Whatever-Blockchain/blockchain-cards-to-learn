import React, { useState } from "react";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Drawer } from "@mui/material";
import { NavLink, Router } from "react-router-dom";
import {
  Container,
  SidebarList,
  SidebarListItem,
  SidebarSubListItem,
  SidebarMenu,
  SidebarWrapper,
} from "./styles";

function SideBar() {
  const [menu, setMenu] = useState([
    {
      id: 1,
      active: true,
      label: "Solana",
      url: "/solana",
      subMenu: [
        { id: 11, active: false, label: "Basic", url: "/solana/basic" },
        { id: 12, active: false, label: "Counter", url: "/solana/counter" },
        { id: 13, active: false, label: "Escrow", url: "/solana/escrow" },
      ],
    },
    { id: 2, active: false, label: "CosmWasm", url: "/cosmwasm" },
    { id: 3, active: false, label: "Ethereum", url: "/ethereum" },
  ]);

  const onClickMenu = (id: Number) => {
    setMenu((oldMenu) =>
      oldMenu.map((menuElement) => ({
        ...menuElement,
        active: menuElement.id == id,
      }))
    );
  };

  return (
    <Container>
      <SidebarWrapper>
        <SidebarMenu>
          <SidebarList>
            {menu.map((menuElement, index) => (
              <NavLink to={menuElement.url!}>
                <SidebarListItem className={menuElement.active ? "active" : ""}>
                  {menuElement.label}
                </SidebarListItem>
                {menuElement.subMenu?.map((subMenu, index) => (
                  <NavLink to={subMenu.url!}>
                    <SidebarSubListItem
                      className={subMenu.active ? "active" : ""}
                      onClick={() => onClickMenu(subMenu.id)}
                    >
                      {subMenu.label}
                    </SidebarSubListItem>
                  </NavLink>
                ))}
              </NavLink>
            ))}
          </SidebarList>
        </SidebarMenu>
      </SidebarWrapper>
    </Container>
  );
}

export default SideBar;
