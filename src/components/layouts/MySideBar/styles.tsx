import { hover } from "@testing-library/user-event/dist/hover";
import styled from "styled-components";

export const Container = styled.div`
  flex: 1;
  height: calc(100vh - 50px);
  background-color: rgb(240, 239, 239);

  position: sticky;
  top: 50px;
`;

export const SidebarWrapper = styled.div`
  padding: 20px;
  color: #555;
`;

export const SidebarMenu = styled.div`
  margin-bottom: 2rem;
`;

export const SidebarList = styled.ul`
  list-style: none;
  padding: 0.5rem;
`;

export const SidebarListItem = styled.li`
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 10px;

  &:active {
  }

  &:hover {
    background-color: rgb(212, 209, 235);
  }
`;

export const SidebarSubListItem = styled.li`
  padding: 5px;
  padding-left: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 10px;

  &:active {
  }

  &:hover {
    background-color: rgb(212, 209, 235);
  }
`;
