import React, { FC, useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

import { Paper, Button, TextField, Container, Box, Grid } from "@mui/material";

const web3 = require("@solana/web3.js");

function RentExempt() {
  const [rentExempt, setRentExempt] = useState<Number>();
  const [rentPubKey, setRentPubkey] = useState<string>();

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

  async function createNewAccount() {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");

    let newKey = Keypair.generate();

    if (rentPubKey != null) {
      let targetPubKey = new PublicKey(rentPubKey);

      let accountInfo = await connection.getAccountInfo(
        targetPubKey,
        "confirmed"
      );

      if (accountInfo != null) {
        let minimumAmount = await connection.getMinimumBalanceForRentExemption(
          accountInfo?.data.byteLength
        );

        setRentExempt(minimumAmount);
      } else {
      }
    } else {
    }
  }

  async function handleRentPubKeyChange(value: string) {
    setRentPubkey(value);
  }

  return (
    <div className="featuredItem">
      <span className="featuredTitle">Minimal Rent Exempt By Pubkey</span>
      <Button
        style={{ float: "right", marginRight: "0px" }}
        variant="contained"
        onClick={createNewAccount}
      >
        minimal rent exempt
      </Button>
      <div className="featuredMoneyContainer">
        <span className="featuredMoney">
          {rentExempt == null ? 0 : rentExempt.toString()}
        </span>
      </div>
      <span className="featuredSub">
        <TextField
          fullWidth
          size="small"
          onChange={(e) => handleRentPubKeyChange(e.target.value)}
        />
      </span>
    </div>
  );
}

export default RentExempt;
