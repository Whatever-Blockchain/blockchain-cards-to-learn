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

function CancelEscrow({ escrowTool }: EscrowToolBox) {
  const [initializerTokenAAmount, setInitializerTokenAAmount] =
    useState<Number>();
  const [initializerTokenBAmount, setInitializerTokenBAmount] =
    useState<Number>();
  const [takerTokenAAmount, setTakerTokenAAmount] = useState<Number>();
  const [takerTokenBAmount, setTakerTokenBAmount] = useState<Number>();

  const provider = escrowTool.provider;
  const program = escrowTool.program;

  const initializerAmount = 500;
  const takerAmount = 500;

  async function cancelEscrow() {
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
      escrowTool.takerTokenAccountB &&
      escrowTool.escrowAccountInfo
    ) {
      console.log(
        escrowTool.escrowAccountInfo.account.initializerKey.toString()
      );

      await program.methods
        .cancel()
        .accounts({
          initializer: escrowTool.escrowAccountInfo.account.initializer_key,
          initializerDepositTokenAccount:
            escrowTool.escrowAccountInfo.account.initializerDepositTokenAccount,
          vaultAccount: _vault_account_pda,
          vaultAuthority: _vault_authority_pda,
          escrowAccount: escrowTool.escrowAccountInfo.publicKey,
          tokenProgram: token.TOKEN_PROGRAM_ID,
        })
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

      // assert.ok(
      //   _initializerTokenAccountA.owner.equals(
      //     escrowTool.initializerMainAccount.publicKey
      //   )
      // );
    }
  }

  return (
    <div className="featuredItem">
      <span className="featuredTitle">[ B. Escrow ] 3. Cancel Escrow </span>
      <Button
        style={{ float: "right", marginRight: "0px" }}
        variant="contained"
        onClick={cancelEscrow}
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

export default CancelEscrow;
