import React, { FC, useMemo, useState } from "react";
import { AnchorProvider, Provider } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { styled } from "@mui/material/styles";
import { Paper, Button, TextField, Container, Box, Grid } from "@mui/material";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

interface AnchorProviderBox {
  getProvider: () => Promise<AnchorProvider>;
}

function Initialize({ getProvider }: AnchorProviderBox) {
  const [balance, setBalance] = useState<number>();

  async function initialize() {
    const provider = getProvider();
  }

  return (
    <div className="featuredItem">
      <span className="featuredTitle">
        [ A. Init Program State ] 1. Initialize Counter{" "}
      </span>
      <Button
        style={{ float: "right", marginRight: "0px" }}
        variant="contained"
        onClick={initialize}
      >
        button
      </Button>
      <div className="featuredContentContainer">
        <span className="featuredContent">Initial Counter Value</span>
      </div>
      <span className="featuredSubContent">
        {/* {mintAPubkey == null ? "Not Initialized" : mintAPubkey.toString()} */}
        -
      </span>
    </div>
  );
}

export default Initialize;
