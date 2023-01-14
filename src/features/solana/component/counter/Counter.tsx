import Grid from "@mui/material/Grid";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import React from "react";
import Increment from "./cards/Increment";
import Initialize from "./cards/Initialize";

import { IDL, Counter as CounterContract } from "./idl/counter";
import idl from "./idl/idl.json";

const programID = new PublicKey(idl.metadata.address);

export interface CounterTool {
  provider: AnchorProvider;
  program: Program<CounterContract>;
  counterAccounterPubkey: PublicKey | null;
  setCounterAccounterPubkey: (value: PublicKey) => void;
}

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

  const network = "http://127.0.0.1:8899";
  const connection = new Connection(network, "processed");

  const provider = new AnchorProvider(connection, signerWallet, {
    preflightCommitment: "processed",
  });

  const program = new Program<CounterContract>(IDL, programID, provider);

  const counterTool: CounterTool = {
    provider: provider,
    program: program,
    counterAccounterPubkey: null,
    setCounterAccounterPubkey: setCounterAccounterPubkey,
  };

  function setCounterAccounterPubkey(value: PublicKey) {
    counterTool.counterAccounterPubkey = value;
  }

  return (
    <div className="featured">
      <Initialize counterTool={counterTool} />
      <Increment counterTool={counterTool} />
    </div>
  );
}

export default Counter;
