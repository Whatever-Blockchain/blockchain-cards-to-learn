export type AnchorEscrow = {
  version: "0.1.0";
  name: "anchor_escrow";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "initializer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "mint";
          isMut: false;
          isSigner: false;
        },
        {
          name: "vaultAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "initializerDepositTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "initializerReceiveTokenAccount";
          isMut: false;
          isSigner: false;
        },
        {
          name: "escrowAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "rent";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "valutAcccountBump";
          type: "u8";
        },
        {
          name: "initializerAmount";
          type: "u64";
        },
        {
          name: "takerAmount";
          type: "u64";
        }
      ];
    },
    {
      name: "cancel";
      accounts: [
        {
          name: "initializer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "vaultAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vaultAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "initializerDepositTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrowAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "exchange";
      accounts: [
        {
          name: "taker";
          isMut: false;
          isSigner: true;
        },
        {
          name: "takerDepositTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "takerReceiveTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "initializerDepositTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "initializerReceiveTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "initializer";
          isMut: true;
          isSigner: false;
        },
        {
          name: "escrowAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vaultAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vaultAuthority";
          isMut: false;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "escrowAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "initializerKey";
            type: "publicKey";
          },
          {
            name: "initializerDepositTokenAccount";
            type: "publicKey";
          },
          {
            name: "initializerReceiveTokenAccount";
            type: "publicKey";
          },
          {
            name: "initializerAmount";
            type: "u64";
          },
          {
            name: "takerAmount";
            type: "u64";
          }
        ];
      };
    }
  ];
};

export const IDL: AnchorEscrow = {
  version: "0.1.0",
  name: "anchor_escrow",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "initializer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "mint",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "initializerDepositTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "initializerReceiveTokenAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "escrowAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "valutAcccountBump",
          type: "u8",
        },
        {
          name: "initializerAmount",
          type: "u64",
        },
        {
          name: "takerAmount",
          type: "u64",
        },
      ],
    },
    {
      name: "cancel",
      accounts: [
        {
          name: "initializer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "initializerDepositTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrowAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "exchange",
      accounts: [
        {
          name: "taker",
          isMut: false,
          isSigner: true,
        },
        {
          name: "takerDepositTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "takerReceiveTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "initializerDepositTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "initializerReceiveTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "initializer",
          isMut: true,
          isSigner: false,
        },
        {
          name: "escrowAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "escrowAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "initializerKey",
            type: "publicKey",
          },
          {
            name: "initializerDepositTokenAccount",
            type: "publicKey",
          },
          {
            name: "initializerReceiveTokenAccount",
            type: "publicKey",
          },
          {
            name: "initializerAmount",
            type: "u64",
          },
          {
            name: "takerAmount",
            type: "u64",
          },
        ],
      },
    },
  ],
};
