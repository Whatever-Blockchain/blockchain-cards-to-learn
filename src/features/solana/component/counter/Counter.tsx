import Grid from "@mui/material/Grid";
import { AnchorProvider } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import React from "react";
import Initialize from "./cards/Initialize";

function Counter() {
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

  return (
    <div className="featured">
      <Initialize getProvider={getProvider} />
    </div>
  );
}

export default Counter;
