import React, { useState } from "react";
import * as anchor from "@project-serum/anchor";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

import { IDL, Counter } from "../idl/counter";
import idl from "../idl/idl.json";

import { Button } from "@mui/material";

const programID = new PublicKey(idl.metadata.address);

interface AnchorProviderBox {
  getProvider: () => Promise<AnchorProvider>;
}

function Initialize({ getProvider }: AnchorProviderBox) {
  const [counterAccountPubkey, setCounterAccountPubkey] = useState<PublicKey>();
  const [counterValue, setCounterValue] = useState<Number>();

  async function initialize() {
    const provider = await getProvider();
    const program = new Program<Counter>(IDL, programID, provider);

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

    const counterAccount = await program.account.counterAccount.fetch(
      counterAccountKeypair.publicKey
    );

    setCounterValue(counterAccount.count.toNumber());
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
