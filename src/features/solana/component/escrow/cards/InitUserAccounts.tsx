import React, { useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { useConnection } from "@solana/wallet-adapter-react";
import { SystemProgram, Transaction} from "@solana/web3.js";
import { Button, Grid } from "@mui/material";

import { EscrowTool } from '../Escrow';

interface EscrowToolBox {
    escrowTool: EscrowTool
}

function InitUserAccounts({escrowTool}: EscrowToolBox) {
    const [ initializerSol, setInitializerSol ] = useState<number>();
    const [ takerSol, setTakerSol ] = useState<number>();

    const { connection } = useConnection();
    const payer = escrowTool.provider.wallet as anchor.Wallet;
    const provider = escrowTool.provider;
    const program = escrowTool.program;

    console.log("payer" + payer.publicKey.toString())

    if(!escrowTool.initializerMainAccount || !escrowTool.takerMainAccount ) {
        return(
            <Grid container spacing={1} alignItems="center" direction='column'>
                <Grid item xs={12}>
                    <h2>Main Account is not initialized!</h2>
                </Grid>
            </Grid>
        )
    }

    const initializerMainAccount = escrowTool.initializerMainAccount;
    const takerMainAccount = escrowTool.takerMainAccount;

    // 1. AirDrop 1 SOL to Initializer's and Taker's Main Account 
    async function airdropMainAccounts() {
        const transaction = new Transaction();
        transaction.add(
            SystemProgram.transfer({
                fromPubkey: payer.publicKey,
                toPubkey: initializerMainAccount.publicKey,
                lamports: 1000000000,
            }),
            SystemProgram.transfer({
                fromPubkey: payer.publicKey,
                toPubkey: takerMainAccount.publicKey,
                lamports: 1000000000,
            })
        );
        transaction.feePayer = payer.publicKey;
        transaction.recentBlockhash = await (await provider.connection.getLatestBlockhash()).blockhash;
        

        const signature = await provider.wallet.signTransaction(transaction);
        console.log(signature);
        const serializedTransaction = signature.serialize();
        await provider.connection.sendRawTransaction(serializedTransaction);
        
        const initializerBalance = await provider.connection.getBalance(initializerMainAccount.publicKey);
        setInitializerSol(initializerBalance);

        const takerBalance = await provider.connection.getBalance(takerMainAccount.publicKey);
        setTakerSol(takerBalance);

    }

    return(
        <div className="featuredItem">
            <span className="featuredTitle">[ A. Init Program State ] 1. Init </span>
            <Button style={{float: 'right', marginRight: '0px'}} variant="contained" onClick={airdropMainAccounts}>
                button
            </Button>
            <div className="featuredMoneyContainer">
                <span className="featuredMoney"> 
                    Initializer : {initializerSol == null ? 0 : initializerSol}
                </span>
            </div>
            <span className="featuredSub">
                {initializerMainAccount == null ? 0 : initializerMainAccount.publicKey.toString()}
            </span>
            <div className="featuredMoneyContainer">
                <span className="featuredMoney"> 
                    Taker : {takerSol == null ? 0 : takerSol}
                </span>
            </div>
            <span className="featuredSub">
                {takerMainAccount == null ? 0 : takerMainAccount.publicKey.toString()}
            </span>
        </div>
    )
    
}

export default InitUserAccounts;