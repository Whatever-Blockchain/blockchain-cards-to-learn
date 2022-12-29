import React, { useState } from "react";
import * as anchor from "@project-serum/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { SystemProgram, Transaction } from "@solana/web3.js";
import { Button, Grid } from "@mui/material";

import * as token from "@solana/spl-token";
import { EscrowTool } from "../Escrow";

interface EscrowToolBox {
  escrowTool: EscrowTool;
}

function InitMint({ escrowTool }: EscrowToolBox) {
  const [mintAPubkey, setMintAPubkey] = useState<web3.PublicKey>();
  const [mintBPubkey, setMintBPubkey] = useState<web3.PublicKey>();

  const { connection } = useConnection();
  const payer = escrowTool.provider.wallet as anchor.Wallet;
  const provider = escrowTool.provider;

  if (!escrowTool.initializerMainAccount || !escrowTool.takerMainAccount) {
    return (
      <Grid container spacing={1} alignItems="center" direction="column">
        <Grid item xs={12}>
          <h2>Main Account is not initialized!</h2>
        </Grid>
      </Grid>
    );
  }

  // 2. create mintA and mintB
  async function createMints() {
    const lamportsForMint = await token.getMinimumBalanceForRentExemptMint(
      provider.connection
    );
    const programId = token.TOKEN_PROGRAM_ID;
    const program = escrowTool.program;

    // let mintAPubkey = null;
    // let mintBPubkey = null;

    const escrowAccounts = await program.account.escrowAccount.all();
    if (escrowAccounts.length > 0 && escrowAccounts[0]) {
      escrowTool.setEscrowAccountInfo(escrowAccounts[0]);

      const initializerDepositTokenAccountInfo = await token.getAccount(
        provider.connection,
        escrowTool.escrowAccountInfo.account.initializerDepositTokenAccount
      );
      const mintAPubkey = initializerDepositTokenAccountInfo.mint;

      const initializerReceiveTokenAccountInfo = await token.getAccount(
        provider.connection,
        escrowTool.escrowAccountInfo.account.initializerReceiveTokenAccount
      );
      const mintBPubkey = initializerReceiveTokenAccountInfo.mint;

      setMintAPubkey(mintAPubkey);
      escrowTool.setMintA(mintAPubkey);

      setMintBPubkey(mintBPubkey);
      escrowTool.setMintB(mintBPubkey);
    } else {
      const mintAKeypair = web3.Keypair.generate();
      const mintBKeypair = web3.Keypair.generate();

      // MintA
      const transactionMintA = new Transaction();
      transactionMintA.add(
        SystemProgram.createAccount({
          fromPubkey: payer.publicKey,
          newAccountPubkey: mintAKeypair.publicKey,
          space: token.MINT_SIZE,
          lamports: lamportsForMint,
          programId,
        }),
        token.createInitializeMintInstruction(
          mintAKeypair.publicKey,
          0,
          // escrowTool.mintAuthority.publicKey,
          provider.wallet.publicKey,
          null,
          programId
        )
      );
      transactionMintA.feePayer = payer.publicKey;
      transactionMintA.recentBlockhash = await (
        await connection.getLatestBlockhash()
      ).blockhash;
      transactionMintA.sign(mintAKeypair); // mintA의 keypair도 필요하다

      const signatureMintA = await provider.wallet.signTransaction(
        transactionMintA
      );
      const serializedTransactionMintA = signatureMintA.serialize();

      await provider.connection.sendRawTransaction(serializedTransactionMintA);

      setMintAPubkey(mintAKeypair.publicKey);
      escrowTool.setMintA(mintAKeypair.publicKey);

      // MintB
      const transactionMintB = new Transaction();
      transactionMintB.add(
        SystemProgram.createAccount({
          fromPubkey: payer.publicKey,
          newAccountPubkey: mintBKeypair.publicKey,
          space: token.MINT_SIZE,
          lamports: lamportsForMint,
          programId,
        }),
        token.createInitializeMintInstruction(
          mintBKeypair.publicKey,
          0,
          // escrowTool.mintAuthority.publicKey,
          provider.wallet.publicKey,
          null,
          programId
        )
      );
      transactionMintB.feePayer = payer.publicKey;
      transactionMintB.recentBlockhash = await (
        await connection.getLatestBlockhash()
      ).blockhash;
      transactionMintB.sign(mintBKeypair); // mintA의 keypair도 필요하다

      const signatureMintB = await provider.wallet.signTransaction(
        transactionMintB
      );
      const serializedTransactionMintB = signatureMintB.serialize();

      await provider.connection.sendRawTransaction(serializedTransactionMintB);

      setMintBPubkey(mintBKeypair.publicKey);
      escrowTool.setMintB(mintBKeypair.publicKey);
    }
  }

  return (
    <div className="featuredItem">
      <span className="featuredTitle">
        [ A. Init Program State ] 2. Mint A and B{" "}
      </span>
      <Button
        style={{ float: "right", marginRight: "0px" }}
        variant="contained"
        onClick={createMints}
      >
        button
      </Button>
      <div className="featuredContentContainer">
        <span className="featuredContent">MintA's Pubkey</span>
      </div>
      <span className="featuredSubContent">
        {mintAPubkey == null ? "Not Initialized" : mintAPubkey.toString()}
      </span>
      <div className="featuredContentContainer">
        <span className="featuredContent">MintB's Pubkey</span>
      </div>
      <span className="featuredSubContent">
        {mintBPubkey == null ? "Not Initialized" : mintBPubkey.toString()}
      </span>
    </div>
  );
}

export default InitMint;
