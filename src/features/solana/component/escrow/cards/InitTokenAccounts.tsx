import React, { useState } from "react";
import * as anchor from "@project-serum/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Button, Grid } from "@mui/material";

import * as token from "@solana/spl-token";
import { EscrowTool } from "../Escrow";
import * as web3 from "@solana/web3.js";
import { PublicKey, Transaction } from "@solana/web3.js";

interface EscrowToolBox {
  escrowTool: EscrowTool;
}

function InitTokenAccounts({ escrowTool }: EscrowToolBox) {
  const [initializerTokenAccountAPubkey, setInitializerTokenAccountAPubkey] =
    useState<PublicKey>();
  const [initializerTokenAccountBPubkey, setInitializerTokenAccountBPubkey] =
    useState<PublicKey>();
  const [takerTokenAccountAPubkey, setTakerTokenAccountAPubkey] =
    useState<PublicKey>();
  const [takerTokenAccountBPubkey, setTakerTokenAccountBPubkey] =
    useState<PublicKey>();

  const payer = escrowTool.provider.wallet as anchor.Wallet;
  const provider = escrowTool.provider;
  const program = escrowTool.program;

  console.log("payer" + payer.publicKey.toString());

  if (!escrowTool.initializerMainAccount || !escrowTool.takerMainAccount) {
    return (
      <Grid container spacing={1} alignItems="center" direction="column">
        <Grid item xs={12}>
          <h2>Main Account is not initialized!</h2>
        </Grid>
      </Grid>
    );
  }

  async function initTokenAccounts() {
    if (escrowTool.mintA && escrowTool.mintB) {
      // minA info
      let accountMintA = await token.getMint(
        provider.connection,
        escrowTool.mintA
      );
      const spaceMintA = token.getAccountLenForMint(accountMintA);
      const lamportsMintA =
        await provider.connection.getMinimumBalanceForRentExemption(spaceMintA);

      // mintB info
      let accountMintB = await token.getMint(
        provider.connection,
        escrowTool.mintB
      );
      const spaceMintB = token.getAccountLenForMint(accountMintB);
      const lamportsMintB =
        await provider.connection.getMinimumBalanceForRentExemption(spaceMintB);

      // 1. create initializerTokenAccountA
      const initializerTokenAccountA = await web3.Keypair.generate();
      const transactionTokenAccountA = new Transaction();
      transactionTokenAccountA.add(
        web3.SystemProgram.createAccount({
          fromPubkey: escrowTool.initializerMainAccount.publicKey,
          newAccountPubkey: initializerTokenAccountA.publicKey,
          space: spaceMintA,
          lamports: lamportsMintA,
          programId: token.TOKEN_PROGRAM_ID,
        }),
        token.createInitializeAccountInstruction(
          initializerTokenAccountA.publicKey,
          escrowTool.mintA,
          escrowTool.initializerMainAccount.publicKey,
          token.TOKEN_PROGRAM_ID
        )
      );
      transactionTokenAccountA.feePayer =
        escrowTool.initializerMainAccount.publicKey;
      transactionTokenAccountA.recentBlockhash = await (
        await provider.connection.getLatestBlockhash()
      ).blockhash;
      transactionTokenAccountA.sign(
        escrowTool.initializerMainAccount,
        initializerTokenAccountA
      );

      // console.log(escrowTool.initializerMainAccount.publicKey.toString());
      // console.log(initializerTokenAccountA.publicKey.toString());

      // console.log(transactionTokenAccountA);
      // console.log(transactionTokenAccountA.instructions[0].keys[0].pubkey.toString())
      // console.log(transactionTokenAccountA.instructions[0].keys[1].pubkey.toString())

      const signatureInitializerTokenAccountA =
        transactionTokenAccountA.serialize();
      await provider.connection.sendRawTransaction(
        signatureInitializerTokenAccountA
      );
      setInitializerTokenAccountAPubkey(initializerTokenAccountA.publicKey);
      escrowTool.setInitializerTokenAccountA(
        initializerTokenAccountA.publicKey
      );

      // 2. create initializerTokenAccountB
      const initializerTokenAccountB = await web3.Keypair.generate();
      const transactionTokenAccountB = new Transaction();
      transactionTokenAccountB.add(
        web3.SystemProgram.createAccount({
          fromPubkey: escrowTool.initializerMainAccount.publicKey,
          newAccountPubkey: initializerTokenAccountB.publicKey,
          space: spaceMintB,
          lamports: lamportsMintB,
          programId: token.TOKEN_PROGRAM_ID,
        }),
        token.createInitializeAccountInstruction(
          initializerTokenAccountB.publicKey,
          escrowTool.mintB,
          escrowTool.initializerMainAccount.publicKey,
          token.TOKEN_PROGRAM_ID
        )
      );
      transactionTokenAccountB.feePayer =
        escrowTool.initializerMainAccount.publicKey;
      transactionTokenAccountB.recentBlockhash = await (
        await provider.connection.getLatestBlockhash()
      ).blockhash;
      transactionTokenAccountB.sign(
        escrowTool.initializerMainAccount,
        initializerTokenAccountB
      );

      const signatureInitializerTokenAccountB =
        transactionTokenAccountB.serialize();
      await provider.connection.sendRawTransaction(
        signatureInitializerTokenAccountB
      );
      setInitializerTokenAccountBPubkey(initializerTokenAccountB.publicKey);
      escrowTool.setInitializerTokenAccountB(
        initializerTokenAccountB.publicKey
      );

      // 3. create takerTokenAccountA
      const takerTokenAccountA = await web3.Keypair.generate();
      const transactionTakerTokenAccountA = new Transaction();
      transactionTakerTokenAccountA.add(
        web3.SystemProgram.createAccount({
          fromPubkey: escrowTool.takerMainAccount.publicKey,
          newAccountPubkey: takerTokenAccountA.publicKey,
          space: spaceMintA,
          lamports: lamportsMintA,
          programId: token.TOKEN_PROGRAM_ID,
        }),
        token.createInitializeAccountInstruction(
          takerTokenAccountA.publicKey,
          escrowTool.mintA,
          escrowTool.takerMainAccount.publicKey,
          token.TOKEN_PROGRAM_ID
        )
      );
      transactionTakerTokenAccountA.feePayer =
        escrowTool.takerMainAccount.publicKey;
      transactionTakerTokenAccountA.recentBlockhash = await (
        await provider.connection.getLatestBlockhash()
      ).blockhash;
      transactionTakerTokenAccountA.sign(
        escrowTool.takerMainAccount,
        takerTokenAccountA
      );

      const signatureTakerTokenAccountA =
        transactionTakerTokenAccountA.serialize();
      await provider.connection.sendRawTransaction(signatureTakerTokenAccountA);
      setTakerTokenAccountAPubkey(takerTokenAccountA.publicKey);
      escrowTool.setTakerTokenAccountA(takerTokenAccountA.publicKey);

      // 4. create takerTokenAccountB
      const takerTokenAccountB = await web3.Keypair.generate();
      const transactionTakerTokenAccountB = new Transaction();
      transactionTakerTokenAccountB.add(
        web3.SystemProgram.createAccount({
          fromPubkey: escrowTool.takerMainAccount.publicKey,
          newAccountPubkey: takerTokenAccountB.publicKey,
          space: spaceMintB,
          lamports: lamportsMintB,
          programId: token.TOKEN_PROGRAM_ID,
        }),
        token.createInitializeAccountInstruction(
          takerTokenAccountB.publicKey,
          escrowTool.mintB,
          escrowTool.takerMainAccount.publicKey,
          token.TOKEN_PROGRAM_ID
        )
      );
      transactionTakerTokenAccountB.feePayer =
        escrowTool.takerMainAccount.publicKey;
      transactionTakerTokenAccountB.recentBlockhash = await (
        await provider.connection.getLatestBlockhash()
      ).blockhash;
      transactionTakerTokenAccountB.sign(
        escrowTool.takerMainAccount,
        takerTokenAccountB
      );

      const signatureTakerTokenAccountB =
        transactionTakerTokenAccountB.serialize();
      await provider.connection.sendRawTransaction(signatureTakerTokenAccountB);
      setTakerTokenAccountBPubkey(takerTokenAccountB.publicKey);
      escrowTool.setTakerTokenAccountB(takerTokenAccountB.publicKey);
    } else {
      alert("Token is not minted");
    }
  }

  return (
    <div className="featuredItem">
      <span className="featuredTitle">
        [ A. Init Program State ] 3. create Token Account{" "}
      </span>
      <Button
        style={{ float: "right", marginRight: "0px" }}
        variant="contained"
        onClick={initTokenAccounts}
      >
        button
      </Button>
      <div className="featuredMoneyContainer">
        <span className="featuredMoney">initializerTokenAccountA</span>
      </div>
      <span className="featuredSub">
        {initializerTokenAccountAPubkey == null
          ? 0
          : initializerTokenAccountAPubkey.toString()}
      </span>
      <div className="featuredMoneyContainer">
        <span className="featuredMoney">initializerTokenAccountB</span>
      </div>
      <span className="featuredSub">
        {initializerTokenAccountBPubkey == null
          ? 0
          : initializerTokenAccountBPubkey.toString()}
      </span>

      <div className="featuredMoneyContainer">
        <span className="featuredMoney">takerTokenAccountA</span>
      </div>
      <span className="featuredSub">
        {takerTokenAccountAPubkey == null
          ? 0
          : takerTokenAccountAPubkey.toString()}
      </span>

      <div className="featuredMoneyContainer">
        <span className="featuredMoney">takerTokenAccountB</span>
      </div>
      <span className="featuredSub">
        {takerTokenAccountBPubkey == null
          ? 0
          : takerTokenAccountBPubkey.toString()}
      </span>
    </div>
  );
}

export default InitTokenAccounts;
