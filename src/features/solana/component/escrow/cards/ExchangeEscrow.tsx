import React, { useState } from "react";
import * as anchor from "@project-serum/anchor";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

import { Button } from "@mui/material";

import { EscrowTool } from "../Escrow";

interface EscrowToolBox {
  escrowTool: EscrowTool;
}

function ExchangeEscrow({ escrowTool }: EscrowToolBox) {
  const [initializerTokenAAmount, setInitializerTokenAAmount] =
    useState<Number>();
  const [initializerTokenBAmount, setInitializerTokenBAmount] =
    useState<Number>();
  const [takerTokenAAmount, setTakerTokenAAmount] = useState<Number>();
  const [takerTokenBAmount, setTakerTokenBAmount] = useState<Number>();

  const provider = escrowTool.provider;
  const program = escrowTool.program;

  async function exchangeEscrow() {
    if (
      escrowTool.mintA &&
      escrowTool.initializerTokenAccountA &&
      escrowTool.initializerTokenAccountB &&
      escrowTool.takerTokenAccountA &&
      escrowTool.takerTokenAccountB
    ) {
      if (
        escrowTool.vaultAccountPda &&
        escrowTool.vaultAccountBump &&
        escrowTool.vaultAuthorityPda
      ) {
        await program.methods
          .exchange()
          .accounts({
            taker: escrowTool.takerMainAccount.publicKey,
            takerDepositTokenAccount: escrowTool.takerTokenAccountB,
            takerReceiveTokenAccount: escrowTool.takerTokenAccountA,
            initializerDepositTokenAccount:
              escrowTool.escrowAccountInfo.account
                .initializerDepositTokenAccount,
            initializerReceiveTokenAccount:
              escrowTool.escrowAccountInfo.account
                .initializerReceiveTokenAccount,
            initializer: escrowTool.escrowAccountInfo.account.initializerKey,
            escrowAccount: escrowTool.escrowAccountInfo.publicKey,
            vaultAccount: escrowTool.vaultAccountPda,
            vaultAuthority: escrowTool.vaultAuthorityPda,
            tokenProgram: token.TOKEN_PROGRAM_ID,
          })
          .signers([escrowTool.takerMainAccount])
          .rpc();

        let _takerTokenAccountA = await token.getAccount(
          provider.connection,
          escrowTool.takerTokenAccountA
        );
        let _takerTokenAccountB = await token.getAccount(
          provider.connection,
          escrowTool.takerTokenAccountB
        );
        let _initializerTokenAccountA = await token.getAccount(
          provider.connection,
          escrowTool.initializerTokenAccountA
        );
        let _initializerTokenAccountB = await token.getAccount(
          provider.connection,
          escrowTool.initializerTokenAccountB
        );

        setInitializerTokenAAmount(Number(_initializerTokenAccountA.amount));
        setInitializerTokenBAmount(Number(_initializerTokenAccountB.amount));
        setTakerTokenAAmount(Number(_takerTokenAccountA.amount));
        setTakerTokenBAmount(Number(_takerTokenAccountB.amount));
      } else {
        alert("vault account or authority is not initialized");
      }
    } else {
      alert("step A is not finished");
    }
  }

  return (
    <div className="featuredItem">
      <span className="featuredTitle">[ B. Escrow ] 2. Exchange Escrow </span>
      <Button
        style={{ float: "right", marginRight: "0px" }}
        variant="contained"
        onClick={exchangeEscrow}
      >
        button
      </Button>
      <div className="featuredContentContainer">
        <span className="featuredContent">initializerTokenAAmount</span>
      </div>
      <span className="featuredSubContent">
        {initializerTokenAAmount == null
          ? "-"
          : initializerTokenAAmount.toString()}
      </span>

      <div className="featuredContentContainer">
        <span className="featuredContent">initializerTokenBAmount</span>
      </div>
      <span className="featuredSubContent">
        {initializerTokenBAmount == null
          ? "-"
          : initializerTokenBAmount.toString()}
      </span>

      <div className="featuredContentContainer">
        <span className="featuredContent">takerTokenAAmount</span>
      </div>
      <span className="featuredSubContent">
        {takerTokenAAmount == null ? "-" : takerTokenAAmount.toString()}
      </span>

      <div className="featuredContentContainer">
        <span className="featuredContent">takerTokenBAmount</span>
      </div>
      <span className="featuredSubContent">
        {takerTokenBAmount == null ? "-" : takerTokenBAmount.toString()}
      </span>
    </div>
  );
}

export default ExchangeEscrow;
