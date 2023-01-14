import React, { useState } from "react";
import * as anchor from "@project-serum/anchor";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

import { Button } from "@mui/material";
import { CounterTool } from "../Counter";

interface AnchorProviderBox {
  getProvider: () => Promise<AnchorProvider>;
}

interface CounterToolBox {
  counterTool: CounterTool;
}

function Initialize({ counterTool }: CounterToolBox) {
  const [counterAccountPubkey, setCounterAccountPubkey] = useState<PublicKey>();
  const [counterValue, setCounterValue] = useState<Number>();

  async function initialize() {
    const provider = counterTool.provider;
    const program = counterTool.program;

    const counterAccountKeypair = anchor.web3.Keypair.generate();

    await program.methods
      .initialize()
      .accounts({
        counterAccount: counterAccountKeypair.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([counterAccountKeypair])
      .rpc();

    setCounterAccountPubkey(counterAccountKeypair.publicKey);
    counterTool.setCounterAccounterPubkey(counterAccountKeypair.publicKey);

    const counterAccount = await program.account.counterAccount.fetch(
      counterAccountKeypair.publicKey
    );

    setCounterValue(counterAccount.count.toNumber());
  }

  return (
    <div className="featuredItem">
      <span className="featuredTitle">
        [ A. Counter Contract ] 1. Initialize Counter{" "}
      </span>
      <Button
        style={{ float: "right", marginRight: "0px" }}
        variant="contained"
        onClick={initialize}
      >
        button
      </Button>
      <div className="featuredContentContainer">
        <span className="featuredContent">
          Initial Counter Value :{" "}
          {counterValue == null ? "-" : counterValue.toString()}
        </span>
      </div>
      <span className="featuredSubContent">
        {counterAccountPubkey == null ? "-" : counterAccountPubkey.toString()}
      </span>
    </div>
  );
}

export default Initialize;
