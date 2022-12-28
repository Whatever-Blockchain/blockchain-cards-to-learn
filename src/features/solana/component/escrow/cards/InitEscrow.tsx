import React, { useState } from "react";
import * as anchor from "@project-serum/anchor";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

import { Button, toolbarClasses } from "@mui/material";

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
        let _vault = await token.getAccount(
          provider.connection,
          escrowTool.vaultAccountPda
        );

        if (_vault && _vault.owner.equals(escrowTool.vaultAuthorityPda)) {
          // vault가 이미 존재하고 owner로 vaultAuthorityPda가 설정되어 있으면 아래 안해도됨?
          setVaultAddress(escrowTool.vaultAccountPda);
          setVaultOwner(escrowTool.vaultAuthorityPda);

          const escrowAccounts = await program.account.escrowAccount.all();
          const _escrowAccount = escrowAccounts[0].account; // only one in the Escrow Contract

          setEscrowInitializerKey(_escrowAccount.initializerKey);
          setEscrowInitializerDepositTokenAccount(
            _escrowAccount.initializerDepositTokenAccount
          );
          setEscrowInitializerReceiveTokenAccount(
            _escrowAccount.initializerReceiveTokenAccount
          );
          setEscrowInitializerAmount(
            _escrowAccount.initializerAmount.toNumber()
          );
          setEscrowTakerAmount(_escrowAccount.takerAmount.toNumber());
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

          let _escrowAccount = await program.account.escrowAccount.fetch(
            escrowTool.escrowAccount.publicKey
          );

          setVaultAddress(escrowTool.vaultAccountPda);
          setVaultOwner(escrowTool.vaultAuthorityPda);
          setEscrowInitializerKey(_escrowAccount.initializerKey);
          setEscrowInitializerDepositTokenAccount(
            _escrowAccount.initializerDepositTokenAccount
          );
          setEscrowInitializerReceiveTokenAccount(
            _escrowAccount.initializerReceiveTokenAccount
          );
          setEscrowInitializerAmount(
            _escrowAccount.initializerAmount.toNumber()
          );
          setEscrowTakerAmount(_escrowAccount.takerAmount.toNumber());
        }
      } else {
        alert("vault account or authority is not initialized");
      }
    } else {
      alert("step A is not finished");
    }
  }

  return (
    <div className="featuredItem">
      <span className="featuredTitle">[ B. Init Escrow ] 1. Init Escrow </span>
      <Button
        style={{ float: "right", marginRight: "0px" }}
        variant="contained"
        onClick={initEscrow}
      >
        button
      </Button>
      <div className="featuredMoneyContainer">
        <span className="featuredMoney">Vault Address</span>
      </div>
      <span className="featuredSub">
        {vaultAddress == null ? 0 : vaultAddress.toString()}
      </span>

      <div className="featuredMoneyContainer">
        <span className="featuredMoney">Vault Owner</span>
      </div>
      <span className="featuredSub">
        {vaultOwner == null ? 0 : vaultOwner.toString()}
      </span>

      <div className="featuredMoneyContainer">
        <span className="featuredMoney">InitializerKey</span>
      </div>
      <span className="featuredSub">
        {escrowInitializerKey == null ? 0 : escrowInitializerKey.toString()}
      </span>

      <div className="featuredMoneyContainer">
        <span className="featuredMoney">initializerDepositTokenAccount</span>
      </div>
      <span className="featuredSub">
        {escrowInitializerDepositTokenAccount == null
          ? 0
          : escrowInitializerDepositTokenAccount.toString()}
      </span>

      <div className="featuredMoneyContainer">
        <span className="featuredMoney">initializerReceiveTokenAccount</span>
      </div>
      <span className="featuredSub">
        {escrowInitializerReceiveTokenAccount == null
          ? 0
          : escrowInitializerReceiveTokenAccount.toString()}
      </span>

      <div className="featuredMoneyContainer">
        <span className="featuredMoney"> initializerAmount</span>
      </div>
      <span className="featuredSub">
        {escrowinitializerAmount == null
          ? 0
          : escrowinitializerAmount.toString()}
      </span>

      <div className="featuredMoneyContainer">
        <span className="featuredMoney">takerAmount</span>
      </div>
      <span className="featuredSub">
        {escrowtakerAmount == null ? 0 : escrowtakerAmount.toString()}
      </span>
    </div>
  );
}

export default InitEscrow;
