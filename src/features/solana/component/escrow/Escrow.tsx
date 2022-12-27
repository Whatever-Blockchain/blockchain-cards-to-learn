import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { AnchorEscrow } from "./idl/anchor_escrow";
import { IDL } from "./idl/anchor_escrow";
import idl from "./idl/idl.json";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Box, Grid, Paper, Button } from '@mui/material';
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import InitUserAccounts from "./cards/InitUserAccounts";
import InitMint from "./cards/InitMint";
import InitTokenAccounts from "./cards/InitTokenAccounts";
import { TOKEN_PROGRAM_ID, createMint, createAccount, mintTo, getAccount } from "@solana/spl-token";
import InitMintTo from "./cards/InitMintTo";


const programID = new PublicKey(idl.metadata.address);

export interface EscrowTool {
    provider: AnchorProvider,
    program: Program<AnchorEscrow>,
    mintA : PublicKey | null,
    setMintA: (value: PublicKey) => void,
    mintB : PublicKey | null,
    setMintB: (value: PublicKey) => void,
    initializerTokenAccountA : PublicKey | null,
    setInitializerTokenAccountA : (value: PublicKey) => void,
    initializerTokenAccountB : PublicKey | null,
    setInitializerTokenAccountB : (value: PublicKey) => void,
    takerTokenAccountA : PublicKey | null,
    setTakerTokenAccountA : (value: PublicKey) => void,
    takerTokenAccountB : PublicKey | null,
    setTakerTokenAccountB : (value: PublicKey) => void,
    vaultAccountPda : PublicKey | null,
    setVaultAccountPda : (value: PublicKey) => void,
    vaultAccountBump : PublicKey | null,
    setVaultAccountBump : (value: PublicKey) => void,
    vaultAuthorityPda : PublicKey | null,
    setVaultAuthorityPda : (value: PublicKey) => void,

    takerAmount : Number,
    initalizerAmount : Number,
    initializerMainAccount : Keypair, // A 토큰 사용자
    takerMainAccount : Keypair, // B 토큰 사용자

    escrowAccount : Keypair,
    mintAuthority : Keypair,
}


function Escrow() {

    // const wallet = useAnchorWallet();
    const { publicKey, wallet, signTransaction, signAllTransactions } = useWallet();
    if (!wallet || !publicKey || !signTransaction || !signAllTransactions) {
        return(
            <Grid container spacing={1} alignItems="center" direction='column'>
                <Grid item xs={12}>
                    <h2>wallet is not connected!</h2>
                </Grid>
            </Grid>
        )
    }
    
    const signerWallet = {
        publicKey: publicKey,
        signTransaction: signTransaction,
        signAllTransactions: signAllTransactions,
    }

    function getProvider() {
        const network = "http://127.0.0.1:8899";
        const connection = new Connection(network, 'processed');

        const provider = new AnchorProvider(connection, signerWallet, {
            preflightCommitment: "processed",
        });

        return provider;
    }

    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, 'processed');

    const provider = new AnchorProvider(connection, signerWallet, {
        preflightCommitment: "processed",
    });

    // const provider = getProvider();
    // const program = new Program<AnchorEscrow>(IDL, programID, provider);

    const escrowTool: EscrowTool = {
        provider: provider,
        program: new Program<AnchorEscrow>(IDL, programID, provider),
        mintA : null,
        setMintA: setMintA,
        mintB : null,
        setMintB: setMintB,
        initializerTokenAccountA : null,
        setInitializerTokenAccountA: setInitializerTokenAccountA,
        initializerTokenAccountB : null,
        setInitializerTokenAccountB: setInitializerTokenAccountB,
        takerTokenAccountA : null,
        setTakerTokenAccountA: setTakerTokenAccountA,
        takerTokenAccountB : null,
        setTakerTokenAccountB: setTakerTokenAccountB,
        vaultAccountPda : null,
        setVaultAccountPda: setVaultAccountPda,
        vaultAccountBump : null,
        setVaultAccountBump: setVaultAccountBump,
        vaultAuthorityPda : null,
        setVaultAuthorityPda: setVaultAccountPda,

        takerAmount : 500,
        initalizerAmount : 500,
        initializerMainAccount : anchor.web3.Keypair.generate(), // A 토큰 사용자
        takerMainAccount : anchor.web3.Keypair.generate(), // B 토큰 사용자

        escrowAccount : anchor.web3.Keypair.generate(),
        mintAuthority : anchor.web3.Keypair.generate()
    }

    function setMintA(value: PublicKey) {
        escrowTool.mintA = value;
    }

    function setMintB(value: PublicKey){
        escrowTool.mintB = value;
    }

    function setInitializerTokenAccountA(value: PublicKey){
        escrowTool.initializerTokenAccountA = value;
    }

    function setInitializerTokenAccountB(value: PublicKey) {
        escrowTool.initializerTokenAccountB = value;
    }

    function setTakerTokenAccountA(value: PublicKey) {
        escrowTool.takerTokenAccountA = value;
    }

    function setTakerTokenAccountB(value: PublicKey) {
        escrowTool.takerTokenAccountB = value;
    }

    function setVaultAccountPda(value: PublicKey) {
        escrowTool.vaultAccountPda = value;
    }

    function setVaultAccountBump(value: PublicKey) {
        escrowTool.vaultAccountBump = value;
    }
    
    function setVaultAuthorityPda(value: PublicKey) {
        escrowTool.vaultAuthorityPda = value;
    }
    

    return (
        <div className="featured">
            <InitUserAccounts escrowTool={escrowTool} />
            <InitMint escrowTool={escrowTool} />
            <InitTokenAccounts escrowTool={escrowTool} />
            <InitMintTo escrowTool={escrowTool} />
        </div>
    )
}

export default Escrow;
