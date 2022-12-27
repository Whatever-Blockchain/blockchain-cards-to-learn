import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 50px;
  background-color: white;

  position: sticky;
  top: 0;
  z-index: 999;
`;

export const TopBarWrapper = styled.div`
  height: 100%;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Logo = styled.span`
  font-weight: bold;
  font-size: 30px;
  color: black;
  cursor: pointer;
`;

export const TopRight = styled.div`
  display: flex;
  align-items: center;
`;

export const TopLeft = styled.div``;

export const TopbarIconContainer = styled.div`
  position: relative;
  margin-right: 15px;
  color: #555;
`;

/**
 * .topbar {
    width: 100%;
    height: 50px;
    background-color: white;

    position: sticky;
    top: 0;
    z-index: 999;
}

.topbarWrapper {
    height: 100%;
    padding: 0px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    font-weight: bold;
    font-size: 30px;
    color: black;
    cursor: pointer;
}

.topbarIconContainer {
    position: relative;
    margin-right: 15px;
    color: #555;
}

.topIconBadge {
    position: absolute;
    top: -5px;
    right: 5px;

    background-color: red;
    border-radius: 50%;
    height: 15px;
    width: 15px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 13px;
    color: white;
}

.topRight {
    display: flex;
    align-items: center;
}
 */
