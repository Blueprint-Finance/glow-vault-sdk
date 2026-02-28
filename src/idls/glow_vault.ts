/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/glow_vault.json`.
 */
export type GlowVault = {
  "address": "gwv1ybUe2JVEpjdWARK1PjZUVY5xdNUCRhu24tgYtxa",
  "metadata": {
    "name": "glowVault",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "acceptVaultAccountChange",
      "discriminator": [
        223,
        118,
        153,
        181,
        14,
        99,
        190,
        176
      ],
      "accounts": [
        {
          "name": "signer",
          "signer": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "proposer",
          "writable": true
        },
        {
          "name": "proposal",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "accruePerformanceFees",
      "discriminator": [
        60,
        180,
        126,
        234,
        121,
        98,
        136,
        146
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "vaultUser",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "assignVaultOperatorAuthority",
      "discriminator": [
        233,
        66,
        55,
        111,
        176,
        39,
        5,
        177
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "permit"
          ]
        },
        {
          "name": "permit"
        },
        {
          "name": "operatorPermit",
          "optional": true
        },
        {
          "name": "vault",
          "relations": [
            "vaultOperator"
          ]
        },
        {
          "name": "vaultOperator",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "operatorAdmin",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "cancelTransferableVaultPendingWithdrawal",
      "discriminator": [
        120,
        37,
        38,
        11,
        109,
        22,
        216,
        146
      ],
      "accounts": [
        {
          "name": "withdrawer",
          "signer": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "pendingWithdrawals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "withdrawer"
              }
            ]
          }
        },
        {
          "name": "shareMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultPendingWithdrawalsCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115,
                  95,
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "destinationShareTokenAccount",
          "writable": true
        },
        {
          "name": "mintTokenProgram"
        }
      ],
      "args": [
        {
          "name": "withdrawalIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "cancelVaultPendingWithdrawal",
      "discriminator": [
        200,
        146,
        120,
        84,
        156,
        121,
        214,
        35
      ],
      "accounts": [
        {
          "name": "withdrawer",
          "signer": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultUser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "withdrawer"
              }
            ]
          }
        },
        {
          "name": "pendingWithdrawals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "withdrawer"
              }
            ]
          }
        },
        {
          "name": "shareMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultPendingWithdrawalsCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115,
                  95,
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "destinationShareTokenAccount",
          "writable": true
        },
        {
          "name": "mintTokenProgram"
        }
      ],
      "args": [
        {
          "name": "withdrawalIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "claimDepositedShares",
      "discriminator": [
        115,
        228,
        22,
        78,
        134,
        193,
        160,
        189
      ],
      "accounts": [
        {
          "name": "depositor",
          "signer": true
        },
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "pendingDeposits",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "depositor"
              }
            ]
          }
        },
        {
          "name": "shareMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "shareTokenAccount",
          "writable": true
        },
        {
          "name": "vaultPendingDepositsCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  115,
                  95,
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "depositIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "closeOperatorMarginAccount",
      "discriminator": [
        182,
        128,
        187,
        103,
        178,
        125,
        195,
        17
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true
        },
        {
          "name": "receiver",
          "writable": true,
          "signer": true
        },
        {
          "name": "airspace",
          "relations": [
            "marginAccount"
          ]
        },
        {
          "name": "operator",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "marginAccount",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          },
          "relations": [
            "operator"
          ]
        },
        {
          "name": "accountConstraintTicket",
          "writable": true
        },
        {
          "name": "adapterConfig"
        },
        {
          "name": "adapterProgram"
        },
        {
          "name": "adapterSigner",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  97,
                  112,
                  116,
                  101,
                  114,
                  45,
                  115,
                  105,
                  103,
                  110,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "airspace"
              },
              {
                "kind": "account",
                "path": "adapterProgram"
              }
            ],
            "program": {
              "kind": "account",
              "path": "adapterProgram"
            }
          }
        },
        {
          "name": "glowMarginProgram",
          "address": "GLoWMgcn3VbyFKiC2FGMgfKxYSyTJS7uKFwKY2CSkq9X"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "closePendingWithdrawal",
      "discriminator": [
        186,
        224,
        65,
        253,
        171,
        152,
        76,
        189
      ],
      "accounts": [
        {
          "name": "withdrawer",
          "signer": true
        },
        {
          "name": "receiver",
          "writable": true
        },
        {
          "name": "pendingWithdrawals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "withdrawer"
              }
            ]
          }
        },
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "configureVault",
      "discriminator": [
        129,
        53,
        99,
        52,
        49,
        176,
        249,
        156
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vault",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "config",
          "type": {
            "defined": {
              "name": "vaultConfig"
            }
          }
        }
      ]
    },
    {
      "name": "createOperatorMarginAccount",
      "discriminator": [
        220,
        214,
        118,
        243,
        34,
        37,
        182,
        178
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "permit"
          ]
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "airspace"
        },
        {
          "name": "permit"
        },
        {
          "name": "operator",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "marginAccount",
          "writable": true
        },
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          },
          "relations": [
            "operator"
          ]
        },
        {
          "name": "accountConstraintTicket",
          "writable": true
        },
        {
          "name": "adapterConfig"
        },
        {
          "name": "adapterProgram"
        },
        {
          "name": "adapterSigner",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  97,
                  112,
                  116,
                  101,
                  114,
                  45,
                  115,
                  105,
                  103,
                  110,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "airspace"
              },
              {
                "kind": "account",
                "path": "adapterProgram"
              }
            ],
            "program": {
              "kind": "account",
              "path": "adapterProgram"
            }
          }
        },
        {
          "name": "glowMarginProgram",
          "address": "GLoWMgcn3VbyFKiC2FGMgfKxYSyTJS7uKFwKY2CSkq9X"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "seed",
          "type": "u16"
        },
        {
          "name": "featureFlags",
          "type": {
            "defined": {
              "name": "accountFeatureFlags"
            }
          }
        }
      ]
    },
    {
      "name": "createVault",
      "discriminator": [
        29,
        237,
        247,
        208,
        193,
        82,
        54,
        135
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "permit"
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "vaultOperator",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "underlyingMint"
        },
        {
          "name": "vaultShareMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultReserve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  110,
                  100,
                  101,
                  114,
                  108,
                  121,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultPendingWithdrawalsCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115,
                  95,
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "underlyingMintTokenProgram"
        },
        {
          "name": "vaultMintTokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "vaultIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createVaultPendingWithdrawal",
      "discriminator": [
        135,
        118,
        55,
        235,
        139,
        167,
        195,
        188
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "withdrawer",
          "signer": true
        },
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "pendingWithdrawals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "withdrawer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "depositToTransferableVault",
      "discriminator": [
        181,
        69,
        13,
        254,
        229,
        99,
        110,
        131
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "depositor",
          "signer": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "underlyingMint"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "shareMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          },
          "relations": [
            "vault"
          ]
        },
        {
          "name": "underlyingMint",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "depositorUnderlyingTokenAccount",
          "writable": true
        },
        {
          "name": "shareTokenAccount",
          "writable": true,
          "optional": true
        },
        {
          "name": "vaultReserve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  110,
                  100,
                  101,
                  114,
                  108,
                  121,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "pendingDeposits",
          "writable": true,
          "optional": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "depositor"
              }
            ]
          }
        },
        {
          "name": "vaultPendingDepositsCustody",
          "writable": true,
          "optional": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  115,
                  95,
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "underlyingMintTokenProgram"
        },
        {
          "name": "shareTokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tokenChange",
          "type": {
            "defined": {
              "name": "tokenChange"
            }
          }
        }
      ]
    },
    {
      "name": "depositToVault",
      "discriminator": [
        18,
        62,
        110,
        8,
        26,
        106,
        248,
        151
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "depositor",
          "signer": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "underlyingMint"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "shareMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          },
          "relations": [
            "vault"
          ]
        },
        {
          "name": "underlyingMint",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "depositorUnderlyingTokenAccount",
          "writable": true
        },
        {
          "name": "shareTokenAccount",
          "writable": true
        },
        {
          "name": "vaultUser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "depositor"
              }
            ]
          }
        },
        {
          "name": "vaultReserve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  110,
                  100,
                  101,
                  114,
                  108,
                  121,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "underlyingMintTokenProgram"
        },
        {
          "name": "shareTokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "tokenChange",
          "type": {
            "defined": {
              "name": "tokenChange"
            }
          }
        }
      ]
    },
    {
      "name": "executeTransferableVaultWithdrawal",
      "discriminator": [
        128,
        151,
        48,
        188,
        193,
        11,
        139,
        186
      ],
      "accounts": [
        {
          "name": "withdrawer",
          "signer": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "underlyingMint"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "pendingWithdrawals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "withdrawer"
              }
            ]
          }
        },
        {
          "name": "shareMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "underlyingMint",
          "writable": true
        },
        {
          "name": "vaultPendingWithdrawalsCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115,
                  95,
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultReserve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  110,
                  100,
                  101,
                  114,
                  108,
                  121,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "destinationUnderlyingTokenAccount",
          "writable": true
        },
        {
          "name": "mintTokenProgram"
        },
        {
          "name": "underlyingMintTokenProgram"
        }
      ],
      "args": [
        {
          "name": "withdrawalIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "executeVaultWithdrawal",
      "discriminator": [
        82,
        165,
        164,
        2,
        168,
        78,
        108,
        158
      ],
      "accounts": [
        {
          "name": "withdrawer",
          "signer": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "underlyingMint"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultUser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "withdrawer"
              }
            ]
          }
        },
        {
          "name": "pendingWithdrawals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "withdrawer"
              }
            ]
          }
        },
        {
          "name": "shareMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "underlyingMint",
          "writable": true
        },
        {
          "name": "vaultPendingWithdrawalsCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115,
                  95,
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultReserve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  110,
                  100,
                  101,
                  114,
                  108,
                  121,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "destinationUnderlyingTokenAccount",
          "writable": true
        },
        {
          "name": "mintTokenProgram"
        },
        {
          "name": "underlyingMintTokenProgram"
        }
      ],
      "args": [
        {
          "name": "withdrawalIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeVaultMargin",
      "discriminator": [
        233,
        185,
        30,
        73,
        94,
        49,
        47,
        64
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "airspace",
          "relations": [
            "vault",
            "underlyingTokenConfig"
          ]
        },
        {
          "name": "airspaceAuthority",
          "signer": true
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "shareMint",
          "writable": true,
          "relations": [
            "vault"
          ]
        },
        {
          "name": "underlyingMint",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "shareTokenConfig",
          "writable": true
        },
        {
          "name": "underlyingTokenConfig"
        },
        {
          "name": "glowMargin",
          "address": "GLoWMgcn3VbyFKiC2FGMgfKxYSyTJS7uKFwKY2CSkq9X"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "config",
          "type": {
            "defined": {
              "name": "vaultMarginCollateralConfig"
            }
          }
        }
      ]
    },
    {
      "name": "initiateTransferableVaultWithdrawal",
      "discriminator": [
        55,
        176,
        26,
        238,
        136,
        124,
        18,
        90
      ],
      "accounts": [
        {
          "name": "withdrawer",
          "signer": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "pendingWithdrawals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "withdrawer"
              }
            ]
          }
        },
        {
          "name": "shareMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "shareTokenAccount",
          "writable": true
        },
        {
          "name": "vaultPendingWithdrawalsCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115,
                  95,
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "shares",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initiateVaultWithdrawal",
      "discriminator": [
        35,
        204,
        143,
        33,
        235,
        229,
        155,
        85
      ],
      "accounts": [
        {
          "name": "withdrawer",
          "signer": true
        },
        {
          "name": "vault",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "pendingWithdrawals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "withdrawer"
              }
            ]
          }
        },
        {
          "name": "shareMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "shareTokenAccount",
          "writable": true
        },
        {
          "name": "vaultPendingWithdrawalsCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115,
                  95,
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "vaultUser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "withdrawer"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "shares",
          "type": "u64"
        }
      ]
    },
    {
      "name": "marginInstantVaultLiquidation",
      "discriminator": [
        210,
        244,
        176,
        48,
        163,
        170,
        174,
        133
      ],
      "accounts": [
        {
          "name": "marginAccount",
          "writable": true,
          "signer": true
        },
        {
          "name": "liquidator",
          "signer": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "underlyingMint"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultUser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "marginAccount"
              }
            ]
          }
        },
        {
          "name": "pendingWithdrawals",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  112,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "marginAccount"
              }
            ]
          }
        },
        {
          "name": "vaultPendingWithdrawalsCustody",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  119,
                  105,
                  116,
                  104,
                  100,
                  114,
                  97,
                  119,
                  97,
                  108,
                  115,
                  95,
                  99,
                  117,
                  115,
                  116,
                  111,
                  100,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "shareMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          },
          "relations": [
            "vault"
          ]
        },
        {
          "name": "underlyingMint"
        },
        {
          "name": "marginShareTokenAccount",
          "writable": true
        },
        {
          "name": "marginUnderlyingTokenAccount",
          "writable": true
        },
        {
          "name": "vaultReserve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  110,
                  100,
                  101,
                  114,
                  108,
                  121,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "mintTokenProgram"
        },
        {
          "name": "underlyingMintTokenProgram"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "operatorDepositToVault",
      "discriminator": [
        40,
        211,
        53,
        162,
        185,
        6,
        77,
        86
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true,
          "relations": [
            "operator"
          ]
        },
        {
          "name": "operator",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "underlyingMint"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          },
          "relations": [
            "operator"
          ]
        },
        {
          "name": "sourceTokenAccount",
          "writable": true
        },
        {
          "name": "vaultReserve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  110,
                  100,
                  101,
                  114,
                  108,
                  121,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "underlyingMint",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "shareMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "underlyingMintTokenProgram"
        }
      ],
      "args": [
        {
          "name": "tokenChange",
          "type": {
            "defined": {
              "name": "tokenChange"
            }
          }
        }
      ]
    },
    {
      "name": "operatorTransferFromMargin",
      "discriminator": [
        232,
        178,
        247,
        118,
        229,
        91,
        131,
        120
      ],
      "accounts": [
        {
          "name": "operatorMarginAccount",
          "signer": true
        },
        {
          "name": "authorityPermit"
        },
        {
          "name": "accountConstraintTicket"
        },
        {
          "name": "operator",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "underlyingMint"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          },
          "relations": [
            "operator"
          ]
        },
        {
          "name": "marginTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "operatorMarginAccount"
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "underlyingMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "vaultReserve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  110,
                  100,
                  101,
                  114,
                  108,
                  121,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "underlyingMint",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "shareMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "underlyingMintTokenProgram"
        }
      ],
      "args": [
        {
          "name": "tokenChange",
          "type": {
            "defined": {
              "name": "tokenChange"
            }
          }
        }
      ]
    },
    {
      "name": "operatorTransferToMargin",
      "discriminator": [
        157,
        110,
        62,
        153,
        161,
        156,
        134,
        141
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "authorityPermit"
        },
        {
          "name": "operator",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "operatorMarginAccount",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "underlyingMint"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          },
          "relations": [
            "operator"
          ]
        },
        {
          "name": "marginTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "operatorMarginAccount"
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "underlyingMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "vaultReserve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  110,
                  100,
                  101,
                  114,
                  108,
                  121,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "underlyingMint",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "shareMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "underlyingMintTokenProgram"
        },
        {
          "name": "glowMarginProgram",
          "address": "GLoWMgcn3VbyFKiC2FGMgfKxYSyTJS7uKFwKY2CSkq9X"
        }
      ],
      "args": [
        {
          "name": "tokenChange",
          "type": {
            "defined": {
              "name": "tokenChange"
            }
          }
        }
      ]
    },
    {
      "name": "operatorWithdrawFromVault",
      "discriminator": [
        73,
        7,
        212,
        129,
        11,
        248,
        207,
        57
      ],
      "accounts": [
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "operatorPermit"
        },
        {
          "name": "operator",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "underlyingMint"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          },
          "relations": [
            "operator"
          ]
        },
        {
          "name": "destinationTokenAccount",
          "writable": true
        },
        {
          "name": "vaultReserve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  110,
                  100,
                  101,
                  114,
                  108,
                  121,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "underlyingMint",
          "relations": [
            "vault"
          ]
        },
        {
          "name": "shareMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "underlyingMintTokenProgram"
        }
      ],
      "args": [
        {
          "name": "tokenChange",
          "type": {
            "defined": {
              "name": "tokenChange"
            }
          }
        }
      ]
    },
    {
      "name": "proposeVaultAccountChange",
      "discriminator": [
        232,
        16,
        253,
        187,
        200,
        228,
        225,
        121
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "vault"
          ]
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "proposal",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "kind",
          "type": {
            "defined": {
              "name": "vaultAccountKind"
            }
          }
        },
        {
          "name": "proposed",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateOperatorMarginAccountPosition",
      "discriminator": [
        144,
        204,
        61,
        57,
        90,
        94,
        14,
        23
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "relations": [
            "operator"
          ]
        },
        {
          "name": "operator",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "operatorMarginAccount"
        },
        {
          "name": "shareMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultReserve",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  110,
                  100,
                  101,
                  114,
                  108,
                  121,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "priceOracle"
        },
        {
          "name": "redemptionQuoteOracle",
          "optional": true
        }
      ],
      "args": []
    },
    {
      "name": "updateOperatorWalletPosition",
      "discriminator": [
        99,
        88,
        225,
        196,
        18,
        40,
        147,
        120
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "vault",
          "writable": true,
          "relations": [
            "operator"
          ]
        },
        {
          "name": "operator",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "operatorPermit",
          "optional": true
        },
        {
          "name": "shareMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultReserve",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  110,
                  100,
                  101,
                  114,
                  108,
                  121,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "priceOracle"
        },
        {
          "name": "redemptionQuoteOracle",
          "optional": true
        }
      ],
      "args": [
        {
          "name": "lastTokenUsdValue",
          "type": {
            "defined": {
              "name": "number128"
            }
          }
        }
      ]
    },
    {
      "name": "updateShareTokenMetadata",
      "discriminator": [
        33,
        144,
        157,
        164,
        161,
        4,
        219,
        121
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault",
          "writable": true
        },
        {
          "name": "shareMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "metadata",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "const",
                "value": [
                  11,
                  112,
                  101,
                  177,
                  227,
                  209,
                  124,
                  69,
                  56,
                  157,
                  82,
                  127,
                  107,
                  4,
                  195,
                  205,
                  88,
                  184,
                  108,
                  115,
                  26,
                  160,
                  253,
                  181,
                  73,
                  182,
                  209,
                  188,
                  3,
                  248,
                  41,
                  70
                ]
              },
              {
                "kind": "account",
                "path": "shareMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                11,
                112,
                101,
                177,
                227,
                209,
                124,
                69,
                56,
                157,
                82,
                127,
                107,
                4,
                195,
                205,
                88,
                184,
                108,
                115,
                26,
                160,
                253,
                181,
                73,
                182,
                209,
                188,
                3,
                248,
                41,
                70
              ]
            }
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "sysvarInstructions"
        }
      ],
      "args": [
        {
          "name": "metadata",
          "type": {
            "defined": {
              "name": "shareTokenMetadata"
            }
          }
        }
      ]
    },
    {
      "name": "updateVaultBalances",
      "discriminator": [
        43,
        232,
        143,
        241,
        175,
        245,
        206,
        221
      ],
      "accounts": [
        {
          "name": "vault",
          "writable": true,
          "relations": [
            "operator"
          ]
        },
        {
          "name": "operator",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  111,
                  112,
                  101,
                  114,
                  97,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "shareMint",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  100,
                  101,
                  112,
                  111,
                  115,
                  105,
                  116,
                  95,
                  109,
                  105,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        },
        {
          "name": "vaultReserve",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  117,
                  110,
                  100,
                  101,
                  114,
                  108,
                  121,
                  105,
                  110,
                  103,
                  95,
                  114,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "vault"
              }
            ]
          }
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "accountConstraintTicket",
      "discriminator": [
        245,
        195,
        128,
        26,
        134,
        81,
        28,
        114
      ]
    },
    {
      "name": "airspace",
      "discriminator": [
        14,
        154,
        104,
        38,
        250,
        109,
        45,
        101
      ]
    },
    {
      "name": "airspacePermit",
      "discriminator": [
        244,
        233,
        44,
        229,
        112,
        87,
        200,
        88
      ]
    },
    {
      "name": "marginAccount",
      "discriminator": [
        133,
        220,
        173,
        213,
        179,
        211,
        43,
        238
      ]
    },
    {
      "name": "pendingDeposits",
      "discriminator": [
        38,
        207,
        9,
        20,
        9,
        100,
        40,
        17
      ]
    },
    {
      "name": "pendingWithdrawals",
      "discriminator": [
        238,
        25,
        15,
        1,
        187,
        25,
        253,
        16
      ]
    },
    {
      "name": "permit",
      "discriminator": [
        219,
        195,
        186,
        174,
        197,
        232,
        83,
        160
      ]
    },
    {
      "name": "tokenConfig",
      "discriminator": [
        92,
        73,
        255,
        43,
        107,
        51,
        117,
        101
      ]
    },
    {
      "name": "vault",
      "discriminator": [
        211,
        8,
        232,
        43,
        2,
        152,
        117,
        119
      ]
    },
    {
      "name": "vaultAccountChangeProposal",
      "discriminator": [
        92,
        252,
        89,
        100,
        224,
        154,
        214,
        242
      ]
    },
    {
      "name": "vaultOperator",
      "discriminator": [
        94,
        136,
        228,
        128,
        47,
        79,
        73,
        131
      ]
    },
    {
      "name": "vaultUser",
      "discriminator": [
        226,
        160,
        22,
        145,
        90,
        151,
        122,
        226
      ]
    }
  ],
  "events": [
    {
      "name": "cancelPendingWithdrawal",
      "discriminator": [
        172,
        79,
        158,
        231,
        149,
        101,
        171,
        10
      ]
    },
    {
      "name": "claimDepositedShares",
      "discriminator": [
        194,
        37,
        207,
        139,
        9,
        190,
        77,
        108
      ]
    },
    {
      "name": "createPendingWithdrawal",
      "discriminator": [
        191,
        181,
        109,
        216,
        93,
        155,
        230,
        191
      ]
    },
    {
      "name": "deposit",
      "discriminator": [
        62,
        205,
        242,
        175,
        244,
        169,
        136,
        52
      ]
    },
    {
      "name": "executeWithdrawal",
      "discriminator": [
        207,
        109,
        44,
        68,
        210,
        237,
        75,
        209
      ]
    },
    {
      "name": "initiateWithdrawal",
      "discriminator": [
        171,
        20,
        135,
        174,
        132,
        41,
        48,
        82
      ]
    },
    {
      "name": "marginPositionUpdated",
      "discriminator": [
        248,
        251,
        237,
        193,
        6,
        128,
        198,
        157
      ]
    },
    {
      "name": "shareTokenMetadataUpdated",
      "discriminator": [
        198,
        125,
        210,
        142,
        81,
        143,
        15,
        135
      ]
    },
    {
      "name": "vaultClosed",
      "discriminator": [
        238,
        129,
        38,
        228,
        227,
        118,
        249,
        215
      ]
    },
    {
      "name": "vaultConfigured",
      "discriminator": [
        233,
        213,
        9,
        148,
        93,
        175,
        39,
        36
      ]
    },
    {
      "name": "vaultCreated",
      "discriminator": [
        117,
        25,
        120,
        254,
        75,
        236,
        78,
        115
      ]
    },
    {
      "name": "verifiedHealthy",
      "discriminator": [
        166,
        227,
        45,
        178,
        36,
        123,
        154,
        227
      ]
    },
    {
      "name": "verifiedUnhealthy",
      "discriminator": [
        210,
        107,
        103,
        210,
        153,
        4,
        241,
        58
      ]
    },
    {
      "name": "walletPositionUpdated",
      "discriminator": [
        150,
        188,
        139,
        190,
        253,
        160,
        35,
        243
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidFeatureFlags",
      "msg": "Invalid feature flags"
    },
    {
      "code": 6001,
      "name": "unauthorizedInvocation",
      "msg": "Unauthorized invocation"
    },
    {
      "code": 6002,
      "name": "wrongAirspace",
      "msg": "Invalid config adapter address change"
    },
    {
      "code": 6003,
      "name": "insufficientPermissions",
      "msg": "Insufficient permissions"
    },
    {
      "code": 6004,
      "name": "unauthorizedVaultOracleAuthority",
      "msg": "Unauthorized vault oracle authority"
    },
    {
      "code": 6005,
      "name": "invalidOracleSnapshotAccount",
      "msg": "Invalid oracle snapshot account"
    },
    {
      "code": 6006,
      "name": "invalidOracle",
      "msg": "Invalid oracle"
    },
    {
      "code": 6007,
      "name": "positionStoreFull",
      "msg": "Position store is full"
    },
    {
      "code": 6008,
      "name": "positionStale",
      "msg": "Position is stale"
    },
    {
      "code": 6009,
      "name": "positionNotFound",
      "msg": "Position not found"
    },
    {
      "code": 6010,
      "name": "positionNotEmpty",
      "msg": "Position not empty"
    },
    {
      "code": 6011,
      "name": "invalidFeeRate",
      "msg": "Invalid fee rate"
    },
    {
      "code": 6012,
      "name": "accountShouldNotBeTheSame",
      "msg": "Account should not be the same"
    },
    {
      "code": 6013,
      "name": "proposalVaultMismatch",
      "msg": "Proposal vault does not match this vault"
    },
    {
      "code": 6014,
      "name": "proposalProposerMismatch",
      "msg": "Proposer does not match the proposal"
    },
    {
      "code": 6015,
      "name": "invalidProposedAdmin",
      "msg": "Invalid proposed admin"
    },
    {
      "code": 6016,
      "name": "vaultPermissionDenied",
      "msg": "Vault permission denied"
    },
    {
      "code": 6017,
      "name": "overflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6018,
      "name": "underflow",
      "msg": "Arithmetic underflow"
    },
    {
      "code": 6019,
      "name": "invalidPositionDestination",
      "msg": "Invalid position destination"
    },
    {
      "code": 6020,
      "name": "invalidWithdrawalWaitingPeriod",
      "msg": "Invalid withdrawal waiting period"
    },
    {
      "code": 6021,
      "name": "positionNotSettled",
      "msg": "The operator position is not settled and cannot be closed"
    },
    {
      "code": 6022,
      "name": "invalidAccount",
      "msg": "Invalid account"
    },
    {
      "code": 6023,
      "name": "staleVaultPrices",
      "msg": "Stale vault prices, please refresh positions first"
    },
    {
      "code": 6024,
      "name": "invalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6025,
      "name": "depositBelowMinimum",
      "msg": "Deposit amount below minimum required"
    },
    {
      "code": 6026,
      "name": "feeAccrualTooBehind",
      "msg": "Fee accrual too far behind"
    },
    {
      "code": 6027,
      "name": "accountShouldNotBeEmpty",
      "msg": "Account should not be empty"
    },
    {
      "code": 6028,
      "name": "invalidWithdrawIndex",
      "msg": "Invalid withdrawal index"
    },
    {
      "code": 6029,
      "name": "withdrawWaitingPeriodPassed",
      "msg": "Withdrawal waiting period has passed"
    },
    {
      "code": 6030,
      "name": "withdrawWaitingPeriodNotPassed",
      "msg": "WIthdrawal waiting period has not passed"
    },
    {
      "code": 6031,
      "name": "tooManyPendingWithdrawals",
      "msg": "Too many pending withdrawals"
    },
    {
      "code": 6032,
      "name": "depositLimitReached",
      "msg": "Deposit limit reached"
    },
    {
      "code": 6033,
      "name": "accountShouldBeEmpty",
      "msg": "Account should be empty"
    },
    {
      "code": 6034,
      "name": "tooManyPendingDeposits",
      "msg": "Too many pending deposits"
    },
    {
      "code": 6035,
      "name": "depositDeliveryLockNotPassed",
      "msg": "Deposit delivery lock period has not passed"
    },
    {
      "code": 6036,
      "name": "depositDeliveryLockPassed",
      "msg": "Deposit delivery lock period has already passed"
    },
    {
      "code": 6037,
      "name": "invalidDepositLockConfig",
      "msg": "Redemption lock period must be <= delivery lock period"
    },
    {
      "code": 6038,
      "name": "invalidEpochConfig",
      "msg": "Invalid epoch withdrawal config: period must be > 0 and cutoff < period"
    },
    {
      "code": 6039,
      "name": "withdrawalLimitExceeded",
      "msg": "Withdrawal exceeds the vault's per-transaction withdrawal limit"
    }
  ],
  "types": [
    {
      "name": "accountConstraintTicket",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "adapter",
            "type": "pubkey"
          },
          {
            "name": "marginAccount",
            "type": "pubkey"
          },
          {
            "name": "constraints",
            "type": {
              "defined": {
                "name": "accountConstraints"
              }
            }
          }
        ]
      }
    },
    {
      "name": "accountConstraints",
      "repr": {
        "kind": "transparent"
      },
      "type": {
        "kind": "struct",
        "fields": [
          "u8"
        ]
      }
    },
    {
      "name": "accountFeatureFlags",
      "repr": {
        "kind": "transparent"
      },
      "type": {
        "kind": "struct",
        "fields": [
          "u16"
        ]
      }
    },
    {
      "name": "airspace",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "isRestricted",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "airspacePermit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "airspace",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "issuer",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "bitSet",
      "serialization": "bytemuck",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bits",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "cancelPendingWithdrawal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "withdrawer",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "pendingOwner",
            "type": "pubkey"
          },
          {
            "name": "marginAccount",
            "type": "pubkey"
          },
          {
            "name": "lastPerformanceFeeRate",
            "type": {
              "array": [
                "u8",
                16
              ]
            }
          },
          {
            "name": "accruedPerformanceFees",
            "type": "u64"
          },
          {
            "name": "totalShares",
            "type": "u64"
          },
          {
            "name": "totalTokens",
            "type": "u64"
          },
          {
            "name": "pendingWithdrawalShares",
            "type": "u64"
          },
          {
            "name": "lastUpdateTimestamp",
            "type": "i64"
          },
          {
            "name": "destinationShareTokenAccount",
            "type": "pubkey"
          },
          {
            "name": "underlyingMint",
            "type": "pubkey"
          },
          {
            "name": "index",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "changeKind",
      "repr": {
        "kind": "rust"
      },
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "setSourceTo"
          },
          {
            "name": "setDestinationTo"
          },
          {
            "name": "shiftBy"
          }
        ]
      }
    },
    {
      "name": "claimDepositedShares",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "depositor",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "shareMint",
            "type": "pubkey"
          },
          {
            "name": "sharesClaimed",
            "type": "u64"
          },
          {
            "name": "depositIndex",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "createPendingWithdrawal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "payer",
            "type": "pubkey"
          },
          {
            "name": "withdrawer",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "marginAccount",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "deposit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "payer",
            "type": "pubkey"
          },
          {
            "name": "depositor",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "underlyingMint",
            "type": "pubkey"
          },
          {
            "name": "underlyingMintDecimals",
            "type": "u8"
          },
          {
            "name": "depositorUnderlyingTokenAccount",
            "type": "pubkey"
          },
          {
            "name": "shareTokenAccount",
            "type": "pubkey"
          },
          {
            "name": "vaultUser",
            "type": "pubkey"
          },
          {
            "name": "depositTokens",
            "type": "u64"
          },
          {
            "name": "depositShares",
            "type": "u64"
          },
          {
            "name": "totalUserShares",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "executeWithdrawal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "withdrawer",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "pendingOwner",
            "type": "pubkey"
          },
          {
            "name": "marginAccount",
            "type": "pubkey"
          },
          {
            "name": "totalPendingAssets",
            "type": "u64"
          },
          {
            "name": "totalPendingShares",
            "type": "u64"
          },
          {
            "name": "earliestWithdrawalTimestamp",
            "type": "i64"
          },
          {
            "name": "underlyingMint",
            "type": "pubkey"
          },
          {
            "name": "withdrawIndex",
            "type": "u8"
          },
          {
            "name": "grossWithdrawalTokens",
            "type": "u64"
          },
          {
            "name": "performanceFeesToWithhold",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "initiateWithdrawal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "withdrawer",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "pendingOwner",
            "type": "pubkey"
          },
          {
            "name": "marginAccount",
            "type": "pubkey"
          },
          {
            "name": "totalPendingAssets",
            "type": "u64"
          },
          {
            "name": "totalPendingShares",
            "type": "u64"
          },
          {
            "name": "earliestWithdrawalTimestamp",
            "type": "i64"
          },
          {
            "name": "shareTokenAccount",
            "type": "pubkey"
          },
          {
            "name": "underlyingMint",
            "type": "pubkey"
          },
          {
            "name": "shares",
            "type": "u64"
          },
          {
            "name": "tokensToWithdraw",
            "type": "u64"
          },
          {
            "name": "index",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "invocation",
      "serialization": "bytemuck",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "callerHeights",
            "type": {
              "defined": {
                "name": "bitSet"
              }
            }
          }
        ]
      }
    },
    {
      "name": "marginAccount",
      "serialization": "bytemuck",
      "repr": {
        "kind": "c",
        "align": 8
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "bumpSeed",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "userSeed",
            "type": {
              "array": [
                "u8",
                2
              ]
            }
          },
          {
            "name": "invocation",
            "type": {
              "defined": {
                "name": "invocation"
              }
            }
          },
          {
            "name": "constraints",
            "type": {
              "defined": {
                "name": "accountConstraints"
              }
            }
          },
          {
            "name": "features",
            "type": {
              "defined": {
                "name": "accountFeatureFlags"
              }
            }
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "airspace",
            "type": "pubkey"
          },
          {
            "name": "liquidator",
            "type": "pubkey"
          },
          {
            "name": "positions",
            "type": {
              "defined": {
                "name": "positions"
              }
            }
          }
        ]
      }
    },
    {
      "name": "marginPositionUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "operator",
            "type": "pubkey"
          },
          {
            "name": "shareMint",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "vaultReserve",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": {
              "defined": {
                "name": "number128"
              }
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "underlyingMintExponent",
            "type": "i8"
          }
        ]
      }
    },
    {
      "name": "number128",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          "i128"
        ]
      }
    },
    {
      "name": "operatorPosition",
      "repr": {
        "kind": "c",
        "align": 8
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "destinationAddress",
            "type": "pubkey"
          },
          {
            "name": "operatorShares",
            "type": {
              "defined": {
                "name": "number128"
              }
            }
          },
          {
            "name": "usdValue",
            "type": {
              "defined": {
                "name": "number128"
              }
            }
          },
          {
            "name": "operatorTokens",
            "type": "u64"
          },
          {
            "name": "lastUpdateTs",
            "type": "i64"
          },
          {
            "name": "destinationKind",
            "type": {
              "defined": {
                "name": "positionDestinationKind"
              }
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                15
              ]
            }
          }
        ]
      }
    },
    {
      "name": "pendingDeposit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pendingShares",
            "type": "u64"
          },
          {
            "name": "depositTimestamp",
            "type": "i64"
          },
          {
            "name": "deliveryWaitingPeriod",
            "type": "u32"
          },
          {
            "name": "redemptionWaitingPeriod",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "pendingDeposits",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "totalPendingShares",
            "type": "u64"
          },
          {
            "name": "deposits",
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "pendingDeposit"
                  }
                },
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "pendingWithdrawal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pendingAssets",
            "type": "u64"
          },
          {
            "name": "pendingShares",
            "type": "u64"
          },
          {
            "name": "withdrawalRequestTimestamp",
            "type": "i64"
          },
          {
            "name": "withdrawalWaitingPeriod",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "pendingWithdrawals",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "marginAccount",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "totalPendingAssets",
            "type": "u64"
          },
          {
            "name": "totalPendingShares",
            "type": "u64"
          },
          {
            "name": "earliestWithdrawalTimestamp",
            "type": "i64"
          },
          {
            "name": "withdrawals",
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "pendingWithdrawal"
                  }
                },
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "permissions",
      "repr": {
        "kind": "transparent"
      },
      "type": {
        "kind": "struct",
        "fields": [
          "u32"
        ]
      }
    },
    {
      "name": "permit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "airspace",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "permissions",
            "type": {
              "defined": {
                "name": "permissions"
              }
            }
          }
        ]
      }
    },
    {
      "name": "positionDestinationKind",
      "repr": {
        "kind": "transparent"
      },
      "type": {
        "kind": "struct",
        "fields": [
          "u8"
        ]
      }
    },
    {
      "name": "positions",
      "serialization": "bytemuck",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "positions",
            "type": {
              "array": [
                "u8",
                7432
              ]
            }
          }
        ]
      }
    },
    {
      "name": "shareTokenMetadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "symbol",
            "type": {
              "option": "string"
            }
          },
          {
            "name": "uri",
            "type": {
              "option": "string"
            }
          }
        ]
      }
    },
    {
      "name": "shareTokenMetadataUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "shareMint",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "tokenAdmin",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "margin",
            "fields": [
              {
                "name": "oracle",
                "type": {
                  "defined": {
                    "name": "tokenPriceOracle"
                  }
                }
              }
            ]
          },
          {
            "name": "adapter",
            "fields": [
              "pubkey"
            ]
          }
        ]
      }
    },
    {
      "name": "tokenChange",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "kind",
            "type": {
              "defined": {
                "name": "changeKind"
              }
            }
          },
          {
            "name": "tokens",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "tokenConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "mintTokenProgram",
            "type": "pubkey"
          },
          {
            "name": "underlyingMint",
            "type": "pubkey"
          },
          {
            "name": "underlyingMintTokenProgram",
            "type": "pubkey"
          },
          {
            "name": "airspace",
            "type": "pubkey"
          },
          {
            "name": "tokenKind",
            "type": {
              "defined": {
                "name": "tokenKind"
              }
            }
          },
          {
            "name": "valueModifier",
            "type": "u16"
          },
          {
            "name": "maxStaleness",
            "type": "u64"
          },
          {
            "name": "admin",
            "type": {
              "defined": {
                "name": "tokenAdmin"
              }
            }
          },
          {
            "name": "tokenFeatures",
            "type": {
              "defined": {
                "name": "tokenFeatures"
              }
            }
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "reserved",
            "type": {
              "array": [
                "u8",
                64
              ]
            }
          }
        ]
      }
    },
    {
      "name": "tokenFeatures",
      "repr": {
        "kind": "transparent"
      },
      "type": {
        "kind": "struct",
        "fields": [
          "u16"
        ]
      }
    },
    {
      "name": "tokenKind",
      "repr": {
        "kind": "rust"
      },
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "collateral"
          },
          {
            "name": "claim"
          },
          {
            "name": "adapterCollateral"
          }
        ]
      }
    },
    {
      "name": "tokenPriceOracle",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "noOracle"
          },
          {
            "name": "pythPull",
            "fields": [
              {
                "name": "feedId",
                "type": {
                  "array": [
                    "u8",
                    32
                  ]
                }
              }
            ]
          },
          {
            "name": "pythPullRedemption",
            "fields": [
              {
                "name": "feedId",
                "type": {
                  "array": [
                    "u8",
                    32
                  ]
                }
              },
              {
                "name": "quoteFeedId",
                "type": {
                  "array": [
                    "u8",
                    32
                  ]
                }
              }
            ]
          },
          {
            "name": "glowFeed",
            "fields": [
              {
                "name": "address",
                "type": "pubkey"
              }
            ]
          }
        ]
      }
    },
    {
      "name": "vault",
      "serialization": "bytemuck",
      "repr": {
        "kind": "c",
        "align": 8
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "bumpSeed",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "flags",
            "type": {
              "defined": {
                "name": "vaultFeatureFlags"
              }
            }
          },
          {
            "name": "vaultIndex",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "underlyingMintExponent",
            "type": "i8"
          },
          {
            "name": "vaultName",
            "type": {
              "array": [
                "u8",
                27
              ]
            }
          },
          {
            "name": "airspace",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "oracleAuthority",
            "type": "pubkey"
          },
          {
            "name": "feeReceiver",
            "type": "pubkey"
          },
          {
            "name": "shareMint",
            "type": "pubkey"
          },
          {
            "name": "underlyingMint",
            "type": "pubkey"
          },
          {
            "name": "vaultReserve",
            "type": "pubkey"
          },
          {
            "name": "vaultRedemptionReserve",
            "type": "pubkey"
          },
          {
            "name": "underlyingMintTokenProgram",
            "type": "pubkey"
          },
          {
            "name": "depositTokens",
            "type": "u64"
          },
          {
            "name": "operatorTokens",
            "type": "u64"
          },
          {
            "name": "depositShares",
            "type": "u64"
          },
          {
            "name": "uncollectedManagementFees",
            "type": "u64"
          },
          {
            "name": "uncollectedPerformanceFees",
            "type": "u64"
          },
          {
            "name": "lastUpdateTimestamp",
            "type": "i64"
          },
          {
            "name": "lastManagementFeeTimestamp",
            "type": "i64"
          },
          {
            "name": "depositLimit",
            "type": "u64"
          },
          {
            "name": "withdrawalLimit",
            "type": "u64"
          },
          {
            "name": "withdrawalWaitingPeriod",
            "type": "i64"
          },
          {
            "name": "minimumDeposit",
            "type": "u64"
          },
          {
            "name": "minimumSharesDustThreshold",
            "type": "u64"
          },
          {
            "name": "performanceFee",
            "type": "u16"
          },
          {
            "name": "managementFee",
            "type": "u16"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                3
              ]
            }
          },
          {
            "name": "oracleType",
            "type": "u8"
          },
          {
            "name": "oracleField1",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "oracleField2",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "realisedPerformanceFees",
            "type": "u64"
          },
          {
            "name": "depositDeliveryLockPeriod",
            "type": "i64"
          },
          {
            "name": "depositRedemptionLockPeriod",
            "type": "i64"
          },
          {
            "name": "epochPeriodSeconds",
            "type": "u32"
          },
          {
            "name": "epochCutoffBeforeSettlementSeconds",
            "type": "u32"
          },
          {
            "name": "reservedWithdrawalTokens",
            "type": "u64"
          },
          {
            "name": "reservedWithdrawalShares",
            "type": "u64"
          },
          {
            "name": "reserved",
            "type": {
              "array": [
                "u8",
                16
              ]
            }
          }
        ]
      }
    },
    {
      "name": "vaultAccountChangeProposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "proposer",
            "type": "pubkey"
          },
          {
            "name": "proposedAccount",
            "type": "pubkey"
          },
          {
            "name": "kind",
            "type": {
              "defined": {
                "name": "vaultAccountKind"
              }
            }
          }
        ]
      }
    },
    {
      "name": "vaultAccountKind",
      "repr": {
        "kind": "rust"
      },
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "vaultAuthority"
          },
          {
            "name": "feeReceiver"
          },
          {
            "name": "oracleAuthority"
          }
        ]
      }
    },
    {
      "name": "vaultClosed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "vaultConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "performanceFee",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "managementFee",
            "type": {
              "option": "u16"
            }
          },
          {
            "name": "vaultFlags",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "depositLimit",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "withdrawalLimit",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "withdrawalWaitingPeriod",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "minimumDeposit",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "minimumSharesDustThreshold",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "vaultName",
            "type": {
              "option": {
                "array": [
                  "u8",
                  27
                ]
              }
            }
          },
          {
            "name": "oracle",
            "type": {
              "option": {
                "defined": {
                  "name": "tokenPriceOracle"
                }
              }
            }
          },
          {
            "name": "depositDeliveryLockPeriod",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "depositRedemptionLockPeriod",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "epochPeriodSeconds",
            "type": {
              "option": "u32"
            }
          },
          {
            "name": "epochCutoffBeforeSettlementSeconds",
            "type": {
              "option": "u32"
            }
          }
        ]
      }
    },
    {
      "name": "vaultConfigured",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "performanceFee",
            "type": "u16"
          },
          {
            "name": "managementFee",
            "type": "u16"
          },
          {
            "name": "vaultFlags",
            "type": "u8"
          },
          {
            "name": "depositLimit",
            "type": "u64"
          },
          {
            "name": "withdrawalLimit",
            "type": "u64"
          },
          {
            "name": "withdrawalWaitingPeriod",
            "type": "i64"
          },
          {
            "name": "minimumDeposit",
            "type": "u64"
          },
          {
            "name": "minimumSharesDustThreshold",
            "type": "u64"
          },
          {
            "name": "vaultName",
            "type": {
              "array": [
                "u8",
                27
              ]
            }
          },
          {
            "name": "oracle",
            "type": {
              "option": {
                "defined": {
                  "name": "tokenPriceOracle"
                }
              }
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "vaultCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "pubkey"
          },
          {
            "name": "underlyingMint",
            "type": "pubkey"
          },
          {
            "name": "underlyingMintDecimals",
            "type": "u8"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "operator",
            "type": "pubkey"
          },
          {
            "name": "airspace",
            "type": "pubkey"
          },
          {
            "name": "oracleAuthority",
            "type": "pubkey"
          },
          {
            "name": "vaultIndex",
            "type": "u8"
          },
          {
            "name": "vaultReserve",
            "type": "pubkey"
          },
          {
            "name": "vaultRedemptionReserve",
            "type": "pubkey"
          },
          {
            "name": "vaultShareMint",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "vaultFeatureFlags",
      "repr": {
        "kind": "transparent"
      },
      "type": {
        "kind": "struct",
        "fields": [
          "u8"
        ]
      }
    },
    {
      "name": "vaultMarginCollateralConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "collateralMaxStaleness",
            "type": "u64"
          },
          {
            "name": "collateralTokenFeatures",
            "type": {
              "defined": {
                "name": "tokenFeatures"
              }
            }
          }
        ]
      }
    },
    {
      "name": "vaultOperator",
      "serialization": "bytemuck",
      "repr": {
        "kind": "c",
        "align": 8
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "positions",
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "operatorPosition"
                  }
                },
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "vaultUser",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "lastPerformanceFeeRate",
            "type": {
              "array": [
                "u8",
                16
              ]
            }
          },
          {
            "name": "accruedPerformanceFees",
            "type": "u64"
          },
          {
            "name": "totalShares",
            "type": "u64"
          },
          {
            "name": "pendingWithdrawalShares",
            "type": "u64"
          },
          {
            "name": "lastUpdateTimestamp",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "verifiedHealthy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "verifiedUnhealthy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "walletPositionUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "operator",
            "type": "pubkey"
          },
          {
            "name": "updater",
            "type": "pubkey"
          },
          {
            "name": "walletUsdValue",
            "type": {
              "defined": {
                "name": "number128"
              }
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "vaultAccountProposalSeed",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116, 95, 97, 99, 99, 111, 117, 110, 116, 95, 112, 114, 111, 112, 111, 115, 97, 108]"
    },
    {
      "name": "vaultDepositMintSeed",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116, 95, 100, 101, 112, 111, 115, 105, 116, 95, 109, 105, 110, 116]"
    },
    {
      "name": "vaultOperatorSeed",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116, 95, 111, 112, 101, 114, 97, 116, 111, 114]"
    },
    {
      "name": "vaultOracleTransferSeed",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116, 95, 111, 114, 97, 99, 108, 101, 95, 116, 114, 97, 110, 115, 102, 101, 114]"
    },
    {
      "name": "vaultPendingDepositsCustodySeed",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116, 95, 100, 101, 112, 111, 115, 105, 116, 115, 95, 99, 117, 115, 116, 111, 100, 121]"
    },
    {
      "name": "vaultPendingDepositsSeed",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116, 95, 112, 101, 110, 100, 105, 110, 103, 95, 100, 101, 112, 111, 115, 105, 116, 115]"
    },
    {
      "name": "vaultPendingWithdrawalsCustodySeed",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116, 95, 119, 105, 116, 104, 100, 114, 97, 119, 97, 108, 115, 95, 99, 117, 115, 116, 111, 100, 121]"
    },
    {
      "name": "vaultPendingWithdrawalsSeed",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116, 95, 112, 101, 110, 100, 105, 110, 103, 95, 119, 105, 116, 104, 100, 114, 97, 119, 97, 108, 115]"
    },
    {
      "name": "vaultSeed",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116]"
    },
    {
      "name": "vaultUnderlyingReserveSeed",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116, 95, 117, 110, 100, 101, 114, 108, 121, 105, 110, 103, 95, 114, 101, 115, 101, 114, 118, 101]"
    },
    {
      "name": "vaultUserSeed",
      "type": "bytes",
      "value": "[118, 97, 117, 108, 116, 95, 117, 115, 101, 114]"
    }
  ]
};
