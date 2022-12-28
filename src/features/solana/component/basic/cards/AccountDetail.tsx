import React, { FC, useMemo, useState } from "react";

import { styled } from "@mui/material/styles";
import { Paper, Button, TextField, Container, Box, Grid } from "@mui/material";
import { AccountInfo, Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

function AccountDetail() {
  const [accountInfo, setAccountInfo] = useState<AccountInfo<Buffer> | null>();
  const [accountPubKey, setAccountPubkey] = useState<string>();

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

  async function handleAccountPubKeyChange(value: string) {
    setAccountPubkey(value);
  }

  const signerWallet = {
    publicKey: publicKey,
    signTransaction: signTransaction,
    signAllTransactions: signAllTransactions,
  };

  async function getAccountInfo() {
    const network = "http://127.0.0.1:8899";
    const connection = new Connection(network, "processed");

    if (accountPubKey != undefined) {
      const pubkey = new PublicKey(accountPubKey);
      let accountInfo = await connection.getAccountInfo(pubkey, "confirmed");

      console.log(accountInfo);
      console.log(accountInfo?.data.byteLength);

      setAccountInfo(accountInfo);
    }
  }

  return (
    <div className="featuredItem">
      <span className="featuredTitle">Get Account Info</span>
      <Button
        style={{ float: "right", marginRight: "0px" }}
        variant="contained"
        onClick={getAccountInfo}
      >
        button
      </Button>
      <span className="featuredSubContent">
        <p>
          data btye length:{" "}
          <b>
            {accountInfo?.data.byteLength
              ? accountInfo?.data.byteLength
              : "..."}
          </b>
        </p>
        <p>
          executable:{" "}
          <b>{accountInfo?.executable ? accountInfo?.executable : "..."}</b>
        </p>
        <p>
          lamports:{" "}
          <b>
            {accountInfo?.lamports.toString()
              ? accountInfo?.lamports.toString()
              : "..."}
          </b>
        </p>
        <p>
          owner:{" "}
          <b>
            {accountInfo?.owner.toString()
              ? accountInfo?.owner.toString()
              : "..."}
          </b>
        </p>
        <p>
          rentEpoch:{" "}
          <b>
            {accountInfo?.rentEpoch?.toString()
              ? accountInfo?.rentEpoch?.toString()
              : "..."}
          </b>
        </p>
        <TextField
          fullWidth
          size="small"
          onChange={(e) => handleAccountPubKeyChange(e.target.value)}
        />
      </span>
    </div>
  );
}

export default AccountDetail;
