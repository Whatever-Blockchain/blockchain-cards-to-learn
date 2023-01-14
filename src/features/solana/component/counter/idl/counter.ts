export type Counter = {
  version: "0.1.0";
  name: "counter";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "counterAccount";
          isMut: true;
          isSigner: true;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "increment";
      accounts: [
        {
          name: "counterAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "counterAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "count";
            type: "u64";
          }
        ];
      };
    }
  ];
};

export const IDL: Counter = {
  version: "0.1.0",
  name: "counter",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "counterAccount",
          isMut: true,
          isSigner: true,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "increment",
      accounts: [
        {
          name: "counterAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "counterAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "count",
            type: "u64",
          },
        ],
      },
    },
  ],
};
