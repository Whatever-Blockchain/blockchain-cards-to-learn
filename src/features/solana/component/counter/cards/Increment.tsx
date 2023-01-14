import React, { useState } from "react";
import * as anchor from "@project-serum/anchor";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

import { IDL, Counter } from "../idl/counter";
import idl from "../idl/idl.json";

import { Button } from "@mui/material";
import { CounterTool } from "../Counter";

const programID = new PublicKey(idl.metadata.address);

interface CounterToolBox {
  counterTool: CounterTool;
}

function Increment({ counterTool }: CounterToolBox) {
  const [counterAccountPubkey, setCounterAccountPubkey] = useState<PublicKey>();
  const [counterValue, setCounterValue] = useState<Number>();

  async function increment() {
    const provider = counterTool.provider;
    const program = counterTool.program;

    if (counterTool.counterAccounterPubkey != null) {
      setCounterAccountPubkey(counterTool.counterAccounterPubkey);

      await program.methods
        .increment()
        .accounts({
          counterAccount: counterTool.counterAccounterPubkey,
        })
        .rpc();

      const counterAccount = await program.account.counterAccount.fetch(
        counterTool.counterAccounterPubkey
      );
      setCounterValue(counterAccount.count.toNumber());
    } else {
      alert("Counter Account is not initialized!");
    }
  }

  return (
    <div className="featuredItem">
      <span className="featuredTitle">
        [ A. Counter Contract ] 2. Increment Count{" "}
      </span>
      <Button
        style={{ float: "right", marginRight: "0px" }}
        variant="contained"
        onClick={increment}
      >
        button
      </Button>
      <div className="featuredContentContainer">
        <span className="featuredContent">
          incremented Counter Value :{" "}
          {counterValue == null ? "-" : counterValue.toString()}
        </span>
      </div>
      <span className="featuredSubContent">
        {counterAccountPubkey == null ? "-" : counterAccountPubkey.toString()}
      </span>
    </div>
  );
}

export default Increment;
