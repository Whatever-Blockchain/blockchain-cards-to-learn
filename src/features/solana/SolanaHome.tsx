import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import React, { useState } from "react";
import BasicInfo from "./component/basic/BasicInfo";
import { Box, Grid, Paper } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Escrow from "./component/escrow/Escrow";

import type { Menu } from "./SolanaBoard";

function SolanaHome({name}: Menu) {
    
    let isWalletConnected = false;
    const wallet = useAnchorWallet();
    const { publicKey, signTransaction, signAllTransactions } = useWallet();
    if (!wallet || !publicKey || !signTransaction || !signAllTransactions) {
        isWalletConnected = false;
    } else {
        isWalletConnected = true;
    }

    type compType = {
        [key: string]: any;
    }
    const Components: compType = {
        'basic': <BasicInfo />,
        'escrow': <Escrow />,
    };

    if (!isWalletConnected) {
        return (
            <Grid container spacing={1} alignItems="center">
                <div style={{ display: 'flex', margin: '10px 20px 10px'}}>
                    <WalletMultiButton />
                    <WalletDisconnectButton />
                </div>
            </Grid>
        )
    } else {
        return (
            <Grid container spacing={1} alignItems="center">
                { Components[name] }
            </Grid>
        )
    }

}

export default SolanaHome;