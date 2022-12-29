import React, { useState } from "react";
import * as anchor from "@project-serum/anchor";
import { Button, Grid } from "@mui/material";

import * as token from "@solana/spl-token";
import * as web3 from "@solana/web3.js";

import { EscrowTool } from "../Escrow";

interface EscrowToolBox {
  escrowTool: EscrowTool;
}

function InitMintTo({ escrowTool }: EscrowToolBox) {
  const [initializerTokenAccountABalance, setInitializerTokenAccountABalance] =
    useState<web3.TokenAmount>();
  const [takerTokenAccountBBalance, setTakerTokenAccountBBalance] =
    useState<web3.TokenAmount>();

  if (!escrowTool.initializerMainAccount || !escrowTool.takerMainAccount) {
    return (
      <Grid container spacing={1} alignItems="center" direction="column">
        <Grid item xs={12}>
          <h2>Main Account is not initialized!</h2>
        </Grid>
      </Grid>
    );
  }

  const payer = escrowTool.provider.wallet as anchor.Wallet;
  const provider = escrowTool.provider;

  const initializerAmout = 500;
  const takerAmout = 500;

  async function mintTo() {
    if (
      escrowTool.mintA &&
      escrowTool.initializerTokenAccountA &&
      escrowTool.mintB &&
      escrowTool.takerTokenAccountB
    ) {
      // mint A to InitializerTokenAccount A
      // await token.mintTo(
      //   provider.connection,
      //   escrowTool.initializerMainAccount,
      //   escrowTool.mintA,
      //   escrowTool.initializerTokenAccountA,
      //   escrowTool.mintAuthority, // pubkey 로 하니까 error 남.
      //   initializerAmout
      // );

      const initializerMintATransaction = new web3.Transaction();
      initializerMintATransaction.add(
        token.createMintToInstruction(
          escrowTool.mintA,
          escrowTool.initializerTokenAccountA,
          provider.wallet.publicKey,
          initializerAmout
        )
      );
      initializerMintATransaction.feePayer = payer.publicKey;
      initializerMintATransaction.recentBlockhash = await (
        await provider.connection.getLatestBlockhash()
      ).blockhash;

      const signatureMintA = await provider.wallet.signTransaction(
        initializerMintATransaction
      );
      const serializedTransactionMintA = signatureMintA.serialize();

      await provider.connection.sendRawTransaction(serializedTransactionMintA);

      const initializerATokenAmount =
        await provider.connection.getTokenAccountBalance(
          escrowTool.initializerTokenAccountA
        );
      setInitializerTokenAccountABalance(initializerATokenAmount.value);

      // mint B to TakerTokenAccount B
      const initializerMintBTransaction = new web3.Transaction();
      initializerMintBTransaction.add(
        token.createMintToInstruction(
          escrowTool.mintB,
          escrowTool.takerTokenAccountB,
          provider.wallet.publicKey,
          takerAmout
        )
      );
      initializerMintBTransaction.feePayer = payer.publicKey;
      initializerMintBTransaction.recentBlockhash = await (
        await provider.connection.getLatestBlockhash()
      ).blockhash;

      const signatureMintB = await provider.wallet.signTransaction(
        initializerMintBTransaction
      );
      const serializedTransactionMintB = signatureMintB.serialize();

      await provider.connection.sendRawTransaction(serializedTransactionMintB);

      const takerBTokenAmount =
        await provider.connection.getTokenAccountBalance(
          escrowTool.takerTokenAccountB
        );
      setTakerTokenAccountBBalance(takerBTokenAmount.value);
    } else {
      alert("step 2 or 3 must be finished");
    }
  }

  return (
    <div className="featuredItem">
      <span className="featuredTitle">
        [ A. Init Program State ] 4. Mint to Token Accounts{" "}
      </span>
      <Button
        style={{ float: "right", marginRight: "0px" }}
        variant="contained"
        onClick={mintTo}
      >
        button
      </Button>
      <div className="featuredContentContainer">
        <span className="featuredContent">
          Balance of Initializer Token Account A :{" "}
          {initializerTokenAccountABalance == null
            ? 0
            : initializerTokenAccountABalance.amount}
        </span>
      </div>
      <span className="featuredSubContent">
        {escrowTool.initializerTokenAccountA == null
          ? 0
          : escrowTool.initializerTokenAccountA.toString()}
      </span>
      <div className="featuredContentContainer">
        <span className="featuredContent">
          Balance of Taker Token Account B :{" "}
          {takerTokenAccountBBalance == null
            ? 0
            : takerTokenAccountBBalance.amount}
        </span>
      </div>
      <span className="featuredSubContent">
        {escrowTool.takerTokenAccountB == null
          ? 0
          : escrowTool.takerTokenAccountB.toString()}
      </span>
    </div>
  );
}

export default InitMintTo;
