import React, { useState } from "react";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { Drawer } from "@mui/material";
import { Link, NavLink, Router, useNavigate } from "react-router-dom";
import {
  Container,
  SidebarList,
  SidebarListItem,
  SidebarSubListItem,
  SidebarMenu,
  SidebarWrapper,
} from "./styles";

function SideBar() {
  const navigate = useNavigate();
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

  const onClickMenu = (id: Number, url: string) => {
    setMenu((oldMenu) =>
      oldMenu.map((menuElement) => ({
        ...menuElement,
        subMenu: menuElement.subMenu?.map((subMenu) => ({
          ...subMenu,
          active: subMenu.id == id,
        })),
      }))
    );

    navigate(url);
  };

  return (
    <Container>
      <SidebarWrapper>
        <SidebarMenu>
          <SidebarList>
            {menu.map((menuElement, index) => (
              <div>
                <SidebarListItem>{menuElement.label}</SidebarListItem>
                {menuElement.subMenu?.map((subMenu, index) => (
                  <SidebarSubListItem
                    active={subMenu.active}
                    onClick={() => onClickMenu(subMenu.id, subMenu.url)}
                  >
                    {subMenu.label}
                  </SidebarSubListItem>
                ))}
              </div>
            ))}
          </SidebarList>
        </SidebarMenu>
      </SidebarWrapper>
    </Container>
  );
}

export default SideBar;
