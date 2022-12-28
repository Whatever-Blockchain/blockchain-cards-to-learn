import React, { FC, useMemo, useState } from "react";
import { AnchorProvider, Provider } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { styled } from "@mui/material/styles";
import { Paper, Button, TextField, Container, Box, Grid } from "@mui/material";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

function Balance() {
  const [balance, setBalance] = useState<number>();

  const { publicKey, wallet, signTransaction, signAllTransactions } =
    useWallet();
  if (!wallet || !publicKey || !signTransaction || !signAllTransactions) {
    return (
      <Grid container spacing={1} alignItems="center" direction="column">
        <Grid item xs={12}>
          <h2>wallet is not connected!</h2>
        </Grid>
      </Grid>
    );
  }

  const signerWallet = {
    publicKey: publicKey,
    signTransaction: signTransaction,
    signAllTransactions: signAllTransactions,
  };

  async function getProvider() {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");

    const provider = new AnchorProvider(connection, signerWallet, {
      preflightCommitment: "processed",
    });

    return provider;
  }

  async function airdrop() {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");

    let airdropSignature = await connection.requestAirdrop(
      signerWallet.publicKey,
      LAMPORTS_PER_SOL * 100
    );

    console.log(`txhash: ${airdropSignature}`);

    updatePayerBalance();
  }

  async function updatePayerBalance() {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");

    const amount = await connection.getBalance(signerWallet.publicKey);

    setBalance(amount);
  }

  return (
    <div className="featuredItem">
      <span className="featuredTitle">Payer's Current Balance</span>
      <Button
        style={{ float: "right", marginRight: "0px" }}
        variant="contained"
        onClick={airdrop}
      >
        button
      </Button>
      <div className="featuredContentContainer">
        <span className="featuredContent">{balance == null ? 0 : balance}</span>
      </div>
      <span className="featuredSubContent">
        {signerWallet.publicKey.toString()}
      </span>
    </div>
  );
}

export default Balance;
