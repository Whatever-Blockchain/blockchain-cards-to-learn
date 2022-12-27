import React from "react"

import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';

import {
    Container, Logo, TopbarIconContainer, TopBarWrapper, TopLeft, TopRight
} from "./styles"



const TopBar = () => {
    return (
        <Container>
            <TopBarWrapper >
                <TopLeft>
                    <Logo>Blockchain Cards to learn</Logo>
                </TopLeft>
                <TopRight>
                    <TopbarIconContainer>
                        <WifiIcon />
                    </TopbarIconContainer>
                    <TopbarIconContainer>
                        <WifiOffIcon />
                    </TopbarIconContainer>
                </TopRight>
            </TopBarWrapper>
        </Container>
    );
}

export default TopBar;