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

    console.log(
      "escrowAccount : " + escrowTool.escrowAccount.publicKey.toString()
    );

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
        console.log("initialize start");

        let _vault = await token.getAccount(
          provider.connection,
          escrowTool.vaultAccountPda
        );

        if (_vault && _vault.owner.equals(escrowTool.vaultAuthorityPda)) {
          // vault가 이미 존재하고 owner로 vaultAuthorityPda가 설정되어 있으면 아래 안해도됨?
          setVaultAddress(escrowTool.vaultAccountPda);
          setVaultOwner(escrowTool.vaultAuthorityPda);
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

          console.log("initialize finished");

          // let _vault = await mintA.getAccountInfo(vault_account_pda);
          _vault = await token.getAccount(
            provider.connection,
            escrowTool.vaultAccountPda
          );

          let _escrowAccount = await program.account.escrowAccount.fetch(
            escrowTool.escrowAccount.publicKey
          );

          console.log("vault address : " + _vault.address.toString());
          console.log(
            "vault_account_pda : " + escrowTool.vaultAccountPda.toString()
          );
          setVaultAddress(escrowTool.vaultAccountPda);
          console.log("vault owner : " + _vault.owner.toString());
          console.log("vault_authority_pda : " + escrowTool.vaultAuthorityPda);
          assert.ok(_vault.owner.equals(escrowTool.vaultAuthorityPda));
          setVaultOwner(escrowTool.vaultAuthorityPda);
        }

        // assert.ok(_escrowAccount.initializerKey.equals(initializerMainAccount.publicKey));
        // assert.ok(_escrowAccount.initializerAmount.toNumber() == initializerAmount);
        // assert.ok(_escrowAccount.takerAmount.toNumber() == takerAmount);
        // assert.ok(_escrowAccount.initializerDepositTokenAccount.equals(initializerTokenAccountA));
        // assert.ok(_escrowAccount.initializerReceiveTokenAccount.equals(initializerTokenAccountB));
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
    </div>
  );
}

export default InitEscrow;
