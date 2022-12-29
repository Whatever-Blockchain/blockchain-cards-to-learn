import React, { useState } from "react";
import * as anchor from "@project-serum/anchor";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

import { Button } from "@mui/material";

import { EscrowTool } from "../Escrow";
import assert from "assert";

interface EscrowToolBox {
  escrowTool: EscrowTool;
}

function InitEscrow({ escrowTool }: EscrowToolBox) {
  const [vaultAddress, setVaultAddress] = useState<web3.PublicKey>();
  const [vaultOwner, setVaultOwner] = useState<web3.PublicKey>();
  const [escrowInitializerKey, setEscrowInitializerKey] =
    useState<web3.PublicKey>();
  const [
    escrowInitializerDepositTokenAccount,
    setEscrowInitializerDepositTokenAccount,
  ] = useState<web3.PublicKey>();
  const [
    escrowInitializerReceiveTokenAccount,
    setEscrowInitializerReceiveTokenAccount,
  ] = useState<web3.PublicKey>();
  const [escrowinitializerAmount, setEscrowInitializerAmount] =
    useState<Number>();
  const [escrowtakerAmount, setEscrowTakerAmount] = useState<Number>();

  const provider = escrowTool.provider;
  const program = escrowTool.program;

  const initializerAmount = 500;
  const takerAmount = 500;

  async function initEscrow() {
    const [_vault_account_pda, _vault_account_bump] =
      await web3.PublicKey.findProgramAddress(
        [Buffer.from(anchor.utils.bytes.utf8.encode("token-seed"))],
        program.programId
      );
    escrowTool.setVaultAccountPda(_vault_account_pda);
    escrowTool.setVaultAccountBump(_vault_account_bump);

    const [_vault_authority_pda, _vault_authority_bump] =
      await web3.PublicKey.findProgramAddress(
        [Buffer.from(anchor.utils.bytes.utf8.encode("escrow"))],
        program.programId
      );
    escrowTool.setVaultAuthorityPda(_vault_authority_pda);

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
        let _vault = null;

        try {
          _vault = await token.getAccount(
            provider.connection,
            escrowTool.vaultAccountPda
          );
        } catch (error) {
          console.log(error);
        }

        if (_vault && _vault.owner.equals(escrowTool.vaultAuthorityPda)) {
          setVaultAddress(escrowTool.vaultAccountPda);
          setVaultOwner(escrowTool.vaultAuthorityPda);

          const escrowAccounts = await program.account.escrowAccount.all();
          const _escrowAccount = escrowAccounts[0]; // only one in the Escrow Contract
          escrowTool.setEscrowAccountInfo(_escrowAccount);

          setEscrowInitializerKey(_escrowAccount.account.initializerKey);
          setEscrowInitializerDepositTokenAccount(
            _escrowAccount.account.initializerDepositTokenAccount
          );
          setEscrowInitializerReceiveTokenAccount(
            _escrowAccount.account.initializerReceiveTokenAccount
          );
          setEscrowInitializerAmount(
            _escrowAccount.account.initializerAmount.toNumber()
          );
          setEscrowTakerAmount(_escrowAccount.account.takerAmount.toNumber());
        } else {
          await program.methods
            .initialize(
              _vault_account_bump,
              new anchor.BN(initializerAmount),
              new anchor.BN(takerAmount)
            )
            .accounts({
              initializer: escrowTool.initializerMainAccount.publicKey,
              mint: escrowTool.mintA,
              vaultAccount: escrowTool.vaultAccountPda,
              initializerDepositTokenAccount:
                escrowTool.initializerTokenAccountA,
              initializerReceiveTokenAccount:
                escrowTool.initializerTokenAccountB,
              escrowAccount: escrowTool.escrowAccount.publicKey,
              systemProgram: anchor.web3.SystemProgram.programId,
              rent: anchor.web3.SYSVAR_RENT_PUBKEY,
              tokenProgram: token.TOKEN_PROGRAM_ID,
            })
            .preInstructions([
              await program.account.escrowAccount.createInstruction(
                escrowTool.escrowAccount
              ),
            ])
            .signers([
              escrowTool.escrowAccount,
              escrowTool.initializerMainAccount,
            ])
            .rpc();

          _vault = await token.getAccount(
            provider.connection,
            escrowTool.vaultAccountPda
          );

          // let _escrowAccount = await program.account.escrowAccount.fetch(
          //   escrowTool.escrowAccount.publicKey
          // );
          const escrowAccounts = await program.account.escrowAccount.all();
          const _escrowAccount = escrowAccounts[0];

          escrowTool.setEscrowAccountInfo(_escrowAccount);

          setVaultAddress(escrowTool.vaultAccountPda);
          setVaultOwner(escrowTool.vaultAuthorityPda);
          setEscrowInitializerKey(_escrowAccount.account.initializerKey);
          setEscrowInitializerDepositTokenAccount(
            _escrowAccount.account.initializerDepositTokenAccount
          );
          setEscrowInitializerReceiveTokenAccount(
            _escrowAccount.account.initializerReceiveTokenAccount
          );
          setEscrowInitializerAmount(
            _escrowAccount.account.initializerAmount.toNumber()
          );
          setEscrowTakerAmount(_escrowAccount.account.takerAmount.toNumber());
        }

        // await exchangeEscrow();
      } else {
        alert("vault account or authority is not initialized");
      }
    } else {
      alert("step A is not finished");
    }
  }

  return (
    <div className="featuredItem">
      <span className="featuredTitle">[ B. Escrow ] 1. Init Escrow </span>
      <Button
        style={{ float: "right", marginRight: "0px" }}
        variant="contained"
        onClick={initEscrow}
      >
        button
      </Button>
      <div className="featuredContentContainer">
        <span className="featuredContent">Vault Address</span>
      </div>
      <span className="featuredSubContent">
        {vaultAddress == null ? 0 : vaultAddress.toString()}
      </span>

      <div className="featuredContentContainer">
        <span className="featuredContent">Vault Owner</span>
      </div>
      <span className="featuredSubContent">
        {vaultOwner == null ? 0 : vaultOwner.toString()}
      </span>

      <div className="featuredContentContainer">
        <span className="featuredContent">InitializerKey</span>
      </div>
      <span className="featuredSubContent">
        {escrowInitializerKey == null ? 0 : escrowInitializerKey.toString()}
      </span>

      <div className="featuredContentContainer">
        <span className="featuredContent">initializerDepositTokenAccount</span>
      </div>
      <span className="featuredSubContent">
        {escrowInitializerDepositTokenAccount == null
          ? 0
          : escrowInitializerDepositTokenAccount.toString()}
      </span>

      <div className="featuredContentContainer">
        <span className="featuredContent">initializerReceiveTokenAccount</span>
      </div>
      <span className="featuredSubContent">
        {escrowInitializerReceiveTokenAccount == null
          ? 0
          : escrowInitializerReceiveTokenAccount.toString()}
      </span>

      <div className="featuredContentContainer">
        <span className="featuredContent"> initializerAmount</span>
      </div>
      <span className="featuredSubContent">
        {escrowinitializerAmount == null
          ? 0
          : escrowinitializerAmount.toString()}
      </span>

      <div className="featuredContentContainer">
        <span className="featuredContent">takerAmount</span>
      </div>
      <span className="featuredSubContent">
        {escrowtakerAmount == null ? 0 : escrowtakerAmount.toString()}
      </span>
    </div>
  );
}

export default InitEscrow;
