import React, { useState } from "react";
import * as anchor from '@project-serum/anchor';
import { Button, Grid } from "@mui/material";

import * as token from "@solana/spl-token";
import { EscrowTool } from '../Escrow';
import * as web3 from "@solana/web3.js";
import { PublicKey, Transaction } from "@solana/web3.js";

interface EscrowToolBox {
    escrowTool: EscrowTool
}

function InitMintTo({escrowTool}: EscrowToolBox) {
    const [ initializerTokenAccountABalance, setInitializerTokenAccountABalance ] = useState<web3.TokenAmount>();
    const [ takerTokenAccountBBalance, setTakerTokenAccountBBalance ] = useState<web3.TokenAmount>();

    if(!escrowTool.initializerMainAccount || !escrowTool.takerMainAccount ) {
        return(
            <Grid container spacing={1} alignItems="center" direction='column'>
                <Grid item xs={12}>
                    <h2>Main Account is not initialized!</h2>
                </Grid>
            </Grid>
        )
    }

    const payer = escrowTool.provider.wallet as anchor.Wallet;
    const provider = escrowTool.provider;

    const initializerAmout = 500;
    const takerAmout = 500;

    async function mintTo() {

        if(escrowTool.mintA && escrowTool.initializerTokenAccountA && escrowTool.mintB && escrowTool.takerTokenAccountB ) {
            await token.mintTo(
                provider.connection,
                escrowTool.initializerMainAccount,
                escrowTool.mintA,
                escrowTool.initializerTokenAccountA,
                escrowTool.mintAuthority,  // pubkey 로 하니까 error 남.
                initializerAmout
            );

            const initializerATokenAmount = await provider.connection.getTokenAccountBalance(escrowTool.initializerTokenAccountA);
            setInitializerTokenAccountABalance(initializerATokenAmount.value);

            await token.mintTo(
                provider.connection,
                escrowTool.takerMainAccount,
                escrowTool.mintB,
                escrowTool.takerTokenAccountB,
                escrowTool.mintAuthority,  // pubkey 로 하니까 error 남.
                takerAmout
            );

            const takerBTokenAmount = await provider.connection.getTokenAccountBalance(escrowTool.takerTokenAccountB);
            setTakerTokenAccountBBalance(takerBTokenAmount.value);
        } else {
            alert("step 2 or 3 must be finished");
        }
    }

    return(
        <div className="featuredItem">
            <span className="featuredTitle">[ A. Init Program State ] 4. Mint to Token Accounts </span>
            <Button style={{float: 'right', marginRight: '0px'}} variant="contained" onClick={mintTo}>
                button
            </Button>
            <div className="featuredMoneyContainer">
                <span className="featuredMoney"> 
                    Balance of Initializer Token Account A : {initializerTokenAccountABalance == null ? 0 : initializerTokenAccountABalance.amount}
                </span>
            </div>
            <span className="featuredSub">
                {escrowTool.initializerTokenAccountA == null ? 0 : escrowTool.initializerTokenAccountA.toString()}
            </span>
            <div className="featuredMoneyContainer">
                <span className="featuredMoney"> 
                    Balance of Initializer Token Account B : {takerTokenAccountBBalance == null ? 0 : takerTokenAccountBBalance.amount}
                </span>
            </div>
            <span className="featuredSub">
                {escrowTool.takerTokenAccountB == null ? 0 : escrowTool.takerTokenAccountB.toString()}
            </span>
        </div>
    )
}

export default InitMintTo;