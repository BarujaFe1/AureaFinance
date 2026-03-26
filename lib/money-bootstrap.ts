export type MoneyAccountSeed = {
  name: string;
  institution: string;
  type: "checking" | "savings" | "cash" | "investment" | "reserve" | "credit_card_settlement";
  openingBalanceCents: number;
  includeInNetWorth: boolean;
  notes: string;
};

export type MoneyCardSeed = {
  name: string;
  brand: string;
  network: string;
  limitAmountCents: number;
  closeDay: number;
  dueDay: number;
  settlementAccountName: string;
};

export type MoneyRecurringSeed = {
  title: string;
  amountCents: number;
  direction: "income" | "expense";
  frequency: "weekly" | "monthly" | "yearly";
  startsOn: string;
  nextRunOn: string;
  accountName: string;
  notes: string;
};

export type MoneyBillSeed = {
  cardSlug: string;
  billMonth: string;
  dueOn: string;
  closesOn: string;
  totalAmountCents: number;
};

export type MoneyBillEntrySeed = {
  cardSlug: string;
  dueOn: string;
  description: string;
  amountCents: number;
  entryType: "installment" | "recurring";
};

export type MoneyReserveSeed = {
  name: string;
  investedCents: number;
  previousValueCents: number;
  currentValueCents: number;
  totalProfitCents: number;
  yieldTotalPercent: number;
  monthlyProfitCents: number;
  yieldMonthlyPercent: number;
};

export type MoneyStockSeed = {
  ticker: string;
  fullName: string;
  quantity: number;
  investedCents: number;
  previousCents: number;
  currentCents: number;
  resultTotalCents: number;
  rentabilityTotalPercent: number | null;
};

export type MoneyCryptoSeed = {
  name: string;
  quantity: number;
  investedCents: number;
  previousCents: number;
  currentCents: number;
  totalProfitCents: number;
};

export type MoneyAssetTradeSeed = {
  action: "compra" | "venda";
  assetName: string;
  quantity: number;
  tradeDate: string;
  totalInitialCents: number;
  pricePerUnitInitialCents: number;
  totalCurrentCents: number;
  pricePerUnitCurrentCents: number;
  yieldPercent: number | null;
  descriptionText: string;
  isCompleted: boolean;
};

export type MoneyBootstrapDataset = {
  "generatedAt": "2026-03-25",
  "currency": "BRL",
  "locale": "pt-BR",
  "sheetInventory": [
    {
      "name": "1. Acompanhamento Mensal",
      "rows": 1502,
      "columns": 17,
      "sampleHeaders": [
        "Data:",
        "Saldo de Hoje (25/03/2026)",
        "941.54",
        "-1281.65",
        "Realidade do Dia (25/03) nos PrÃ³ximos Meses",
        "2026-03-25 00:00:00",
        "1631.61",
        "0"
      ]
    },
    {
      "name": "2. VisÃ£o Geral",
      "rows": 1005,
      "columns": 21,
      "sampleHeaders": [
        "Total",
        "NuBank",
        "Banco do Brasil",
        "MercadoPago",
        "Inter",
        "Binance",
        "NuBank",
        "AÃ§Ãµes:"
      ]
    },
    {
      "name": "3. Contas",
      "rows": 363,
      "columns": 68,
      "sampleHeaders": [
        "Ãgua",
        "BK1",
        "2026-03-25 00:00:00",
        "HOJE",
        "-88.48000000000047",
        "R",
        "2026-01-01 00:00:00",
        "MPInvest"
      ]
    },
    {
      "name": "4. TransaÃ§Ãµes",
      "rows": 150,
      "columns": 12,
      "sampleHeaders": [
        "AÃ§Ã£o:",
        "CriptoMoeda:",
        "Quantidade:",
        "Data:",
        "HorÃ¡rio:",
        "Valor Inicial:",
        "Valor Inicial p/Unid",
        "Valor Final:"
      ]
    },
    {
      "name": "5. CartÃµes",
      "rows": 97,
      "columns": 16,
      "sampleHeaders": [
        "CartÃ£o Nubank",
        "CartÃ£o MercadoPago",
        "CartÃ£o Nubank",
        "CartÃ£o MercadoPago"
      ]
    },
    {
      "name": "6. Richard",
      "rows": 17,
      "columns": 12,
      "sampleHeaders": [
        "Incluir no MÃªs Atual?",
        "Incluir no MÃªs Seguinte?",
        "Incluir no MÃªs Posterior ao seguinte?",
        "Emoji",
        "Nome da Conta:",
        "Valor",
        "ðŸ“† *MarÃ§o*\n\nðŸ’³ Nubank: *R$ 566,25*\n - Violino (4/10) R$ 160,00\n - SmartFit R$ 149,90\n - Iphone 16e (2/12) R$ 256,35\n\nðŸ’³ Mercado Pago: *R$ 53,50*\n - Airfryer (4/4) R$ 53,50\n\nðŸ  Aluguel: *R$ 601,83*\nâš¡ Internet: *R$ 40,76*\n Micro-Ondas: *R$ 50,67*\n\nâœ… *Total MarÃ§o: R$ 1.313,01*",
        "ðŸ“† *Abril*\n\nðŸ’³ Nubank: *R$ 566,25*\n - Violino (5/10) R$ 160,00\n - SmartFit R$ 149,90\n - Iphone 16e (3/12) R$ 256,35\n\nðŸ’³ Mercado Pago: *R$ 0,00*\n\n\nðŸ  Aluguel: *R$ 601,83*\nâš¡ Internet: *R$ 40,76*\nðŸŒ Energia: *R$ 55,41*\n Micro-Ondas: *R$ 50,67*\n\nâœ… *Total Abril: R$ 1.314,91*"
      ]
    },
    {
      "name": "7. Resumo do Investimento",
      "rows": 1,
      "columns": 1,
      "sampleHeaders": [
        "Resumo do Investimento:\n--- AÃ§Ãµes ---\nEquatorial Energia - EQTL3: Investido R$ 65,02 | Atual R$ 82,34\nOuro - GOLD11: Investido R$ 26,81 | Atual R$ 24,03\nMercadoLibre - MELI34: Investido R$ 206,07 | Atual R$ 141,68\nApple - AAPL34: Investido R$ 0,00 | Atual R$ 0,00\nTotal AÃ§Ãµes: R$ 423,39 â†’ R$ 370,42\n--- Criptomoedas ---\nCriptomoedas:: Investido R$ Valor Investido: | Atual R$ Valor Atual:\nPi: Investido R$ 750,00 | Atual R$ 817,22\nBitcoin: Investido R$ 133,28 | Atual R$ 239,71\nEthereum: Investido R$ 427,24 | Atual R$ 232,36\nSolana: Investido R$ 386,07 | Atual R$ 183,10\nChainLink: Investido R$ 120,00 | Atual R$ 48,87\nRender: Investido R$ 54,00 | Atual R$ 40,05\nFartCoin: Investido R$ 29,00 | Atual R$ 19,54\nSui: Investido R$ 54,00 | Atual R$ 18,20\nCurve DAO: Investido R$ 28,25 | Atual R$ 18,14\nSAPIEN: Investido R$ 29,16 | Atual R$ 14,42\nUSDT: Investido R$ 0,00 | Atual R$ 0,00\nTotal Cripto: R$ 2011,00 â†’ R$ 1631,61\n--- Reservas ---\nReservas:: Investido R$ Valor Anterior: | Atual R$ Valor Atual:\nMeliDÃ³lar: Investido R$ 3731,43 | Atual R$ 3806,69\nCarta de Motorista: Investido R$ 2136,87 | Atual R$ 2139,03\nFuturo: Investido R$ 811,82 | Atual R$ 812,64\nNotebook: Investido R$ 695,23 | Atual R$ 695,93\nAÃ§Ãµes: Investido R$ 32,41 | Atual R$ 32,26\nCrypto: Investido R$ 32,23 | Atual R$ 32,44\nTotal Reservas: R$ 7439,99 â†’ R$ 7518,99\n--- Investimento Geral ---\nTotal Investido: R$ 9874,38 | Total Atual: R$ 9521,02\n--- TransaÃ§Ãµes Recentes ---\nComprei 13 Alibaba - BABA34 no dia 28/08/2025 Ã s 10:38:00. O valor de compra (p/unid): R$ 23,17. Atualmente (p/unid): R$ 23,60, gerando acrÃ©scimo de 1,87%.\nVendi 4 Alibaba - BABA34 no dia 02/09/2025 Ã s 10:48:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 26,58, gerando lucro de 1,87%.\nVendi 2 Alibaba - BABA34 no dia 03/09/2025 Ã s 10:23:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 26,57, gerando lucro de 1,87%.\nVendi 2 Alibaba - BABA34 no dia 04/09/2025 Ã s 11:12:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 25,41, gerando lucro de 1,87%.\nComprei 0,83 ChainLink no dia 05/09/2025 Ã s 14:58:00. O valor de compra (p/unid): R$ 119,67. Atualmente (p/unid): R$ 49,33, gerando decrÃ©scimo de 58,78%.\nComprei 2 MercadoLibre - MELI34 no dia 12/09/2025 Ã s 11:08:00. O valor de compra (p/unid): R$ 103,00. Atualmente (p/unid): R$ 70,84, gerando decrÃ©scimo de 31,22%.\nComprei 0,01690952 Ethereum no dia 25/09/2025 Ã s 07:18:28. O valor de compra (p/unid): R$ 19.683,59. Atualmente (p/unid): R$ 11.442,86, gerando decrÃ©scimo de 41,87%.\nComprei 3,6 Sui no dia 10/10/2025 Ã s 20:29:23. O valor de compra (p/unid): R$ 15,05. Atualmente (p/unid): R$ 5,06, gerando decrÃ©scimo de 66,37%.\nComprei 4,09 Render no dia 10/10/2025 Ã s 20:29:58. O valor de compra (p/unid): R$ 13,43. Atualmente (p/unid): R$ 9,80, gerando decrÃ©scimo de 27,01%.\nComprei 0,33 Solana no dia 10/10/2025 Ã s 02:54:21. O valor de compra (p/unid): R$ 1.018,00. Atualmente (p/unid): R$ 486,46, gerando decrÃ©scimo de 52,21%.\nComprei 0,0034 Ethereum no dia 25/03/2026 Ã s 05:16:16. O valor de compra (p/unid): R$ 20.400,00. Atualmente (p/unid): R$ 11.442,86, gerando decrÃ©scimo de 43,91%.\nComprei 35,4645 SAPIEN no dia 09/12/2025 Ã s 05:31:50. O valor de compra (p/unid): R$ 0,83. Atualmente (p/unid): R$ 0,41, gerando decrÃ©scimo de 51,12%.\nComprei 14,8 Curve DAO no dia 15/12/2025 Ã s 14:32:42. O valor de compra (p/unid): R$ 1,91. Atualmente (p/unid): R$ 1,23, gerando decrÃ©scimo de 35,79%.\nComprei 19,13824 FartCoin no dia 18/12/2025 Ã s 08:04:51. O valor de compra (p/unid): R$ 1,52. Atualmente (p/unid): R$ 1,02, gerando decrÃ©scimo de 32,62%."
      ]
    },
    {
      "name": "8. Registro DiÃ¡rio",
      "rows": 1162,
      "columns": 8,
      "sampleHeaders": [
        "2025-04-20 00:00:00",
        "10:08:48",
        "2528.1"
      ]
    },
    {
      "name": "9. Registro DiÃ¡rio de Investime",
      "rows": 1199,
      "columns": 12,
      "sampleHeaders": [
        "2025-08-27 00:00:00",
        "08:36:27",
        "7346.89",
        "110.03",
        "272.78",
        "7729.7",
        "7518.99"
      ]
    }
  ],
  "accounts": [
    {
      "name": "NuBank CC",
      "institution": "NuBank",
      "type": "checking",
      "openingBalanceCents": 23,
      "includeInNetWorth": true,
      "notes": "Conta corrente identificada na aba VisÃ£o Geral."
    },
    {
      "name": "Banco do Brasil CC",
      "institution": "Banco do Brasil",
      "type": "checking",
      "openingBalanceCents": 1425,
      "includeInNetWorth": true,
      "notes": "Conta corrente identificada na aba VisÃ£o Geral."
    },
    {
      "name": "MercadoPago CC",
      "institution": "MercadoPago",
      "type": "checking",
      "openingBalanceCents": 98952,
      "includeInNetWorth": true,
      "notes": "Conta corrente principal com liquidez mais alta na planilha."
    },
    {
      "name": "Inter CDI",
      "institution": "Inter",
      "type": "savings",
      "openingBalanceCents": 2048,
      "includeInNetWorth": true,
      "notes": "Conta/caixa de liquidez no Inter."
    },
    {
      "name": "MPInvest",
      "institution": "MercadoPago",
      "type": "reserve",
      "openingBalanceCents": 751899,
      "includeInNetWorth": true,
      "notes": "Reserva identificada como MPInvest."
    },
    {
      "name": "NuInvest",
      "institution": "NuBank",
      "type": "investment",
      "openingBalanceCents": 37042,
      "includeInNetWorth": true,
      "notes": "Carteira de aÃ§Ãµes ligada ao ecossistema Nubank."
    },
    {
      "name": "Binance",
      "institution": "Binance",
      "type": "investment",
      "openingBalanceCents": 163161,
      "includeInNetWorth": true,
      "notes": "Carteira cripto consolidada."
    }
  ],
  "cards": [
    {
      "name": "CartÃ£o Nubank",
      "brand": "Nubank",
      "network": "Mastercard",
      "limitAmountCents": 300000,
      "closeDay": 18,
      "dueDay": 25,
      "settlementAccountName": "NuBank CC"
    },
    {
      "name": "CartÃ£o MercadoPago",
      "brand": "Mercado Pago",
      "network": "Visa",
      "limitAmountCents": 150000,
      "closeDay": 8,
      "dueDay": 15,
      "settlementAccountName": "MercadoPago CC"
    }
  ],
  "recurring": [
    {
      "title": "Mesada",
      "amountCents": 100000,
      "direction": "income",
      "frequency": "monthly",
      "startsOn": "2026-01-12",
      "nextRunOn": "2026-04-12",
      "accountName": "MercadoPago CC",
      "notes": "Reconhecido pela repetiÃ§Ã£o mensal na aba Contas."
    },
    {
      "title": "MPInvest",
      "amountCents": 8000,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-01-01",
      "nextRunOn": "2026-04-01",
      "accountName": "MercadoPago CC",
      "notes": "Aporte mensal identificado na planilha Money."
    },
    {
      "title": "Notebook Futuro",
      "amountCents": 21012,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-01-26",
      "nextRunOn": "2026-04-25",
      "accountName": "MercadoPago CC",
      "notes": "Objetivo/reserva recorrente identificado na planilha."
    },
    {
      "title": "Aluguel",
      "amountCents": 60183,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-03-05",
      "nextRunOn": "2026-04-05",
      "accountName": "MercadoPago CC",
      "notes": "Compromisso fixo da aba Richard."
    },
    {
      "title": "Internet",
      "amountCents": 4076,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-03-10",
      "nextRunOn": "2026-04-10",
      "accountName": "MercadoPago CC",
      "notes": "Compromisso fixo da aba Richard."
    },
    {
      "title": "Energia",
      "amountCents": 5541,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-04-19",
      "nextRunOn": "2026-04-19",
      "accountName": "MercadoPago CC",
      "notes": "Compromisso fixo inferido com revisÃ£o assistida."
    },
    {
      "title": "Micro-Ondas",
      "amountCents": 5067,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-03-20",
      "nextRunOn": "2026-04-20",
      "accountName": "MercadoPago CC",
      "notes": "Parcela fixa destacada na aba Richard."
    }
  ],
  "cardBills": [
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-03",
      "dueOn": "2026-03-15",
      "closesOn": "2026-03-08",
      "totalAmountCents": 24642
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-04",
      "dueOn": "2026-04-15",
      "closesOn": "2026-04-08",
      "totalAmountCents": 19311
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-05",
      "dueOn": "2026-05-15",
      "closesOn": "2026-05-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-06",
      "dueOn": "2026-06-15",
      "closesOn": "2026-06-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-07",
      "dueOn": "2026-07-15",
      "closesOn": "2026-07-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-08",
      "dueOn": "2026-08-15",
      "closesOn": "2026-08-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-09",
      "dueOn": "2026-09-15",
      "closesOn": "2026-09-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-10",
      "dueOn": "2026-10-15",
      "closesOn": "2026-10-08",
      "totalAmountCents": 10012
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-11",
      "dueOn": "2026-11-15",
      "closesOn": "2026-11-08",
      "totalAmountCents": 10012
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-12",
      "dueOn": "2026-12-15",
      "closesOn": "2026-12-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-01",
      "dueOn": "2027-01-15",
      "closesOn": "2027-01-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-02",
      "dueOn": "2027-02-15",
      "closesOn": "2027-02-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-03",
      "dueOn": "2027-03-15",
      "closesOn": "2027-03-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-04",
      "dueOn": "2027-04-15",
      "closesOn": "2027-04-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-05",
      "dueOn": "2027-05-15",
      "closesOn": "2027-05-08",
      "totalAmountCents": 3348
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-03",
      "dueOn": "2026-03-25",
      "closesOn": "2026-03-18",
      "totalAmountCents": 99034
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-04",
      "dueOn": "2026-04-25",
      "closesOn": "2026-04-18",
      "totalAmountCents": 67224
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-05",
      "dueOn": "2026-05-25",
      "closesOn": "2026-05-18",
      "totalAmountCents": 67224
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-06",
      "dueOn": "2026-06-25",
      "closesOn": "2026-06-18",
      "totalAmountCents": 68071
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-07",
      "dueOn": "2026-07-25",
      "closesOn": "2026-07-18",
      "totalAmountCents": 56625
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-08",
      "dueOn": "2026-08-25",
      "closesOn": "2026-08-18",
      "totalAmountCents": 56625
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-09",
      "dueOn": "2026-09-25",
      "closesOn": "2026-09-18",
      "totalAmountCents": 41635
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-10",
      "dueOn": "2026-10-25",
      "closesOn": "2026-10-18",
      "totalAmountCents": 25635
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-11",
      "dueOn": "2026-11-25",
      "closesOn": "2026-11-18",
      "totalAmountCents": 25635
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-12",
      "dueOn": "2026-12-25",
      "closesOn": "2026-12-18",
      "totalAmountCents": 25635
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2027-01",
      "dueOn": "2027-01-25",
      "closesOn": "2027-01-18",
      "totalAmountCents": 25635
    }
  ],
  "cardEntries": [
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Tablet (12/12)",
      "amountCents": 15000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Airfryer (4/4)",
      "amountCents": 5350,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Violino (4/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Shorts (5/6)",
      "amountCents": 1365,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Tenis - Darter Pro (3/5)",
      "amountCents": 3599,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Sapato (3/4)",
      "amountCents": 1898,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Mochila Mizuno (3/3)",
      "amountCents": 1828,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Monitor (4/18)",
      "amountCents": 3332,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Bicicleta (2/15)",
      "amountCents": 2797,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "UltraBoost 5 - Netshoes (2/5)",
      "amountCents": 7000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Cadeira (2/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Iphone 16e (2/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Terno (2/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Uber (1/1)",
      "amountCents": 8733,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Shorts (2/3)",
      "amountCents": 2172,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Mouse (1/1)",
      "amountCents": 6249,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Bicicleta (3/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "Violino (5/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Shorts (6/6)",
      "amountCents": 1365,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "Tenis - Darter Pro (4/5)",
      "amountCents": 3599,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Sapato (4/4)",
      "amountCents": 1898,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Monitor (5/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "UltraBoost 5 - Netshoes (3/5)",
      "amountCents": 7000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Cadeira (3/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "Iphone 16e (3/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Terno (3/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Shorts (3/3)",
      "amountCents": 2172,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "Violino (6/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "Tenis - Darter Pro (5/5)",
      "amountCents": 3599,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-05-15",
      "description": "Bicicleta (4/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-05-15",
      "description": "Monitor (6/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "UltraBoost 5 - Netshoes (4/5)",
      "amountCents": 7000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-05-15",
      "description": "Cadeira (4/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "Iphone 16e (4/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-05-15",
      "description": "Terno (4/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "Violino (7/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-06-15",
      "description": "Bicicleta (5/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "Cadeira Gamer (6/6)",
      "amountCents": 4446,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-06-15",
      "description": "Monitor (7/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-06-15",
      "description": "Cadeira (5/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "UltraBoost 5 - Netshoes (5/5)",
      "amountCents": 7000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-06-15",
      "description": "Terno (5/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "Iphone 16e (5/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-07-15",
      "description": "Bicicleta (6/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-07-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-07-15",
      "description": "Monitor (8/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-07-25",
      "description": "Violino (8/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-07-15",
      "description": "Cadeira (6/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-07-25",
      "description": "Iphone 16e (6/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-07-15",
      "description": "Terno (6/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-08-25",
      "description": "Violino (9/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-08-15",
      "description": "Bicicleta (7/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-08-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-08-15",
      "description": "Monitor (9/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-08-25",
      "description": "Iphone 16e (7/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-08-15",
      "description": "Cadeira (7/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-08-15",
      "description": "Terno (7/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-09-25",
      "description": "Violino (10/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-09-25",
      "description": "Iphone 16e (8/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-09-15",
      "description": "Bicicleta (8./15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-09-15",
      "description": "Monitor (10/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-10-25",
      "description": "Iphone 16e (9/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-09-15",
      "description": "Cadeira (8/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-09-15",
      "description": "Terno (8/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-11-25",
      "description": "Iphone 16e (10/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-10-15",
      "description": "Bicicleta (9/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-12-25",
      "description": "Iphone 16e (11/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-10-15",
      "description": "Monitor (11/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2027-01-25",
      "description": "Iphone 16e (12/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-10-15",
      "description": "Terno (9/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-11-15",
      "description": "Bicicleta (10/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-11-15",
      "description": "Monitor (12/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-11-15",
      "description": "Terno (10/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-12-15",
      "description": "Bicicleta (11/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-12-15",
      "description": "Monitor (13/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-01-15",
      "description": "Monitor (14/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-01-15",
      "description": "Bicicleta (12/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-02-15",
      "description": "Monitor (15/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-02-15",
      "description": "Bicicleta (13/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-03-15",
      "description": "Monitor (16/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-03-15",
      "description": "Bicicleta (14/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-04-15",
      "description": "Bicicleta (15/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-04-15",
      "description": "Monitor (17/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-05-15",
      "description": "Monitor (18/18)",
      "amountCents": 3348,
      "entryType": "installment"
    }
  ],
  "netWorthSummary": {
    "month": "2026-03",
    "reservesCents": 751899,
    "investmentsCents": 200203,
    "debtsCents": 118344
  },
  "reserves": [
    {
      "name": "MeliDÃ³lar",
      "investedCents": 305084,
      "previousValueCents": 373143,
      "currentValueCents": 380669,
      "totalProfitCents": 75585,
      "yieldTotalPercent": 0.2477514389,
      "monthlyProfitCents": 7526,
      "yieldMonthlyPercent": 0.02016921127
    },
    {
      "name": "Carta de Motorista",
      "investedCents": 150000,
      "previousValueCents": 213687,
      "currentValueCents": 213903,
      "totalProfitCents": 63903,
      "yieldTotalPercent": 0.42602,
      "monthlyProfitCents": 216,
      "yieldMonthlyPercent": 0.001010824243
    },
    {
      "name": "Futuro",
      "investedCents": 62000,
      "previousValueCents": 81182,
      "currentValueCents": 81264,
      "totalProfitCents": 19264,
      "yieldTotalPercent": 0.3107096774,
      "monthlyProfitCents": 82,
      "yieldMonthlyPercent": 0.001010076125
    },
    {
      "name": "Notebook",
      "investedCents": 215000,
      "previousValueCents": 69523,
      "currentValueCents": 69593,
      "totalProfitCents": -145407,
      "yieldTotalPercent": -0.6763116279,
      "monthlyProfitCents": 70,
      "yieldMonthlyPercent": 0.001006861039
    },
    {
      "name": "AÃ§Ãµes",
      "investedCents": 1600,
      "previousValueCents": 3241,
      "currentValueCents": 3226,
      "totalProfitCents": 1626,
      "yieldTotalPercent": 1.01625,
      "monthlyProfitCents": -15,
      "yieldMonthlyPercent": -0.004628201172
    },
    {
      "name": "Crypto",
      "investedCents": 1600,
      "previousValueCents": 3223,
      "currentValueCents": 3244,
      "totalProfitCents": 1644,
      "yieldTotalPercent": 1.0275,
      "monthlyProfitCents": 21,
      "yieldMonthlyPercent": 0.006515668632
    }
  ],
  "stockPositions": [
    {
      "ticker": "AMBP3",
      "fullName": "Ambipar - AMBP3",
      "quantity": 19,
      "investedCents": 969,
      "previousCents": 399,
      "currentCents": 437,
      "resultTotalCents": -532,
      "rentabilityTotalPercent": -0.5490196078
    },
    {
      "ticker": "BABA34",
      "fullName": "Alibaba - BABA34",
      "quantity": 5,
      "investedCents": 11580,
      "previousCents": 11870,
      "currentCents": 11800,
      "resultTotalCents": 220,
      "rentabilityTotalPercent": 0.01899827288
    },
    {
      "ticker": "EQTL3",
      "fullName": "Equatorial Energia - EQTL3",
      "quantity": 2,
      "investedCents": 6502,
      "previousCents": 8272,
      "currentCents": 8234,
      "resultTotalCents": 1732,
      "rentabilityTotalPercent": 0.2663795755
    },
    {
      "ticker": "GOLD11",
      "fullName": "Ouro - GOLD11",
      "quantity": 1,
      "investedCents": 2681,
      "previousCents": 2396,
      "currentCents": 2403,
      "resultTotalCents": -278,
      "rentabilityTotalPercent": -0.103692652
    },
    {
      "ticker": "MELI34",
      "fullName": "MercadoLibre - MELI34",
      "quantity": 2,
      "investedCents": 20607,
      "previousCents": 14600,
      "currentCents": 14168,
      "resultTotalCents": -6439,
      "rentabilityTotalPercent": -0.3124666376
    },
    {
      "ticker": "AAPL34",
      "fullName": "Apple - AAPL34",
      "quantity": 5,
      "investedCents": 0,
      "previousCents": 0,
      "currentCents": 0,
      "resultTotalCents": 0,
      "rentabilityTotalPercent": null
    },
    {
      "ticker": "EGIE3",
      "fullName": "Engie Brasil - EGIE3",
      "quantity": 0,
      "investedCents": 0,
      "previousCents": 0,
      "currentCents": 0,
      "resultTotalCents": 0,
      "rentabilityTotalPercent": null
    }
  ],
  "cryptoPositions": [
    {
      "name": "Pi",
      "quantity": 829.0,
      "investedCents": 75000,
      "previousCents": 81621,
      "currentCents": 81722,
      "totalProfitCents": 6722
    },
    {
      "name": "Bitcoin",
      "quantity": 0.00032967,
      "investedCents": 13328,
      "previousCents": 23887,
      "currentCents": 23971,
      "totalProfitCents": 10643
    },
    {
      "name": "Ethereum",
      "quantity": 0.02030612,
      "investedCents": 42724,
      "previousCents": 23115,
      "currentCents": 23236,
      "totalProfitCents": -19488
    },
    {
      "name": "Solana",
      "quantity": 0.37639607,
      "investedCents": 38607,
      "previousCents": 18153,
      "currentCents": 18310,
      "totalProfitCents": -20297
    },
    {
      "name": "ChainLink",
      "quantity": 0.99073401,
      "investedCents": 12000,
      "previousCents": 4810,
      "currentCents": 4887,
      "totalProfitCents": -7113
    },
    {
      "name": "Render",
      "quantity": 4.08591,
      "investedCents": 5400,
      "previousCents": 3727,
      "currentCents": 4005,
      "totalProfitCents": -1395
    },
    {
      "name": "FartCoin",
      "quantity": 19.13824,
      "investedCents": 2900,
      "previousCents": 1812,
      "currentCents": 1954,
      "totalProfitCents": -946
    },
    {
      "name": "Sui",
      "quantity": 3.5964,
      "investedCents": 5400,
      "previousCents": 1800,
      "currentCents": 1820,
      "totalProfitCents": -3580
    },
    {
      "name": "Curve DAO",
      "quantity": 14.8,
      "investedCents": 2824,
      "previousCents": 1751,
      "currentCents": 1814,
      "totalProfitCents": -1010
    },
    {
      "name": "SAPIEN",
      "quantity": 35.4645,
      "investedCents": 2916,
      "previousCents": 1466,
      "currentCents": 1442,
      "totalProfitCents": -1474
    },
    {
      "name": "USDT",
      "quantity": 15.98141462,
      "investedCents": 0,
      "previousCents": 0,
      "currentCents": 0,
      "totalProfitCents": 0
    }
  ],
  "assetTrades": [
    {
      "action": "compra",
      "assetName": "Alibaba - BABA34",
      "quantity": 13.0,
      "tradeDate": "2025-08-28",
      "totalInitialCents": 30118,
      "pricePerUnitInitialCents": 2317,
      "totalCurrentCents": 11800,
      "pricePerUnitCurrentCents": 2360,
      "yieldPercent": 0.01865993758,
      "descriptionText": "Comprei 13 Alibaba - BABA34 no dia 28/08/2025 Ã s 10:38:00. O valor de compra (p/unid): R$ 23,17. Atualmente (p/unid): R$ 23,60, gerando acrÃ©scimo de 1,87%.",
      "isCompleted": true
    },
    {
      "action": "venda",
      "assetName": "Alibaba - BABA34",
      "quantity": 4.0,
      "tradeDate": "2025-09-02",
      "totalInitialCents": 10632,
      "pricePerUnitInitialCents": 2658,
      "totalCurrentCents": 11800,
      "pricePerUnitCurrentCents": 2360,
      "yieldPercent": 0.1472873365,
      "descriptionText": "Vendi 4 Alibaba - BABA34 no dia 02/09/2025 Ã s 10:48:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 26,58, gerando lucro de 1,87%.",
      "isCompleted": true
    },
    {
      "action": "venda",
      "assetName": "Alibaba - BABA34",
      "quantity": 2.0,
      "tradeDate": "2025-09-03",
      "totalInitialCents": 5314,
      "pricePerUnitInitialCents": 2657,
      "totalCurrentCents": 11800,
      "pricePerUnitCurrentCents": 2360,
      "yieldPercent": 0.1468557009,
      "descriptionText": "Vendi 2 Alibaba - BABA34 no dia 03/09/2025 Ã s 10:23:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 26,57, gerando lucro de 1,87%.",
      "isCompleted": true
    },
    {
      "action": "venda",
      "assetName": "Alibaba - BABA34",
      "quantity": 2.0,
      "tradeDate": "2025-09-04",
      "totalInitialCents": 5082,
      "pricePerUnitInitialCents": 2541,
      "totalCurrentCents": 11800,
      "pricePerUnitCurrentCents": 2360,
      "yieldPercent": 0.09678597516,
      "descriptionText": "Vendi 2 Alibaba - BABA34 no dia 04/09/2025 Ã s 11:12:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 25,41, gerando lucro de 1,87%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "ChainLink",
      "quantity": 0.83,
      "tradeDate": "2025-09-05",
      "totalInitialCents": 9933,
      "pricePerUnitInitialCents": 11967,
      "totalCurrentCents": 4887,
      "pricePerUnitCurrentCents": 4933,
      "yieldPercent": -0.587804848,
      "descriptionText": "Comprei 0,83 ChainLink no dia 05/09/2025 Ã s 14:58:00. O valor de compra (p/unid): R$ 119,67. Atualmente (p/unid): R$ 49,33, gerando decrÃ©scimo de 58,78%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "MercadoLibre - MELI34",
      "quantity": 2.0,
      "tradeDate": "2025-09-12",
      "totalInitialCents": 20600,
      "pricePerUnitInitialCents": 10300,
      "totalCurrentCents": 14168,
      "pricePerUnitCurrentCents": 7084,
      "yieldPercent": -0.3122330097,
      "descriptionText": "Comprei 2 MercadoLibre - MELI34 no dia 12/09/2025 Ã s 11:08:00. O valor de compra (p/unid): R$ 103,00. Atualmente (p/unid): R$ 70,84, gerando decrÃ©scimo de 31,22%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Ethereum",
      "quantity": 0.01690952,
      "tradeDate": "2025-09-25",
      "totalInitialCents": 33284,
      "pricePerUnitInitialCents": 1968359,
      "totalCurrentCents": 23236,
      "pricePerUnitCurrentCents": 1144286,
      "yieldPercent": -0.4186600274,
      "descriptionText": "Comprei 0,01690952 Ethereum no dia 25/09/2025 Ã s 07:18:28. O valor de compra (p/unid): R$ 19.683,59. Atualmente (p/unid): R$ 11.442,86, gerando decrÃ©scimo de 41,87%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Sui",
      "quantity": 3.6,
      "tradeDate": "2025-10-10",
      "totalInitialCents": 5418,
      "pricePerUnitInitialCents": 1505,
      "totalCurrentCents": 1820,
      "pricePerUnitCurrentCents": 506,
      "yieldPercent": -0.6637464338,
      "descriptionText": "Comprei 3,6 Sui no dia 10/10/2025 Ã s 20:29:23. O valor de compra (p/unid): R$ 15,05. Atualmente (p/unid): R$ 5,06, gerando decrÃ©scimo de 66,37%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Render",
      "quantity": 4.09,
      "tradeDate": "2025-10-10",
      "totalInitialCents": 5493,
      "pricePerUnitInitialCents": 1343,
      "totalCurrentCents": 4005,
      "pricePerUnitCurrentCents": 980,
      "yieldPercent": -0.2701431112,
      "descriptionText": "Comprei 4,09 Render no dia 10/10/2025 Ã s 20:29:58. O valor de compra (p/unid): R$ 13,43. Atualmente (p/unid): R$ 9,80, gerando decrÃ©scimo de 27,01%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Solana",
      "quantity": 0.33,
      "tradeDate": "2025-10-10",
      "totalInitialCents": 33594,
      "pricePerUnitInitialCents": 101800,
      "totalCurrentCents": 18310,
      "pricePerUnitCurrentCents": 48646,
      "yieldPercent": -0.5221457136,
      "descriptionText": "Comprei 0,33 Solana no dia 10/10/2025 Ã s 02:54:21. O valor de compra (p/unid): R$ 1.018,00. Atualmente (p/unid): R$ 486,46, gerando decrÃ©scimo de 52,21%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Ethereum",
      "quantity": 0.0034,
      "tradeDate": "2026-03-25",
      "totalInitialCents": 6936,
      "pricePerUnitInitialCents": 2040000,
      "totalCurrentCents": 23236,
      "pricePerUnitCurrentCents": 1144286,
      "yieldPercent": -0.4390757034,
      "descriptionText": "Comprei 0,0034 Ethereum no dia 25/03/2026 Ã s 05:16:16. O valor de compra (p/unid): R$ 20.400,00. Atualmente (p/unid): R$ 11.442,86, gerando decrÃ©scimo de 43,91%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "SAPIEN",
      "quantity": 35.4645,
      "tradeDate": "2025-12-09",
      "totalInitialCents": 2950,
      "pricePerUnitInitialCents": 83,
      "totalCurrentCents": 1442,
      "pricePerUnitCurrentCents": 41,
      "yieldPercent": -0.5111864407,
      "descriptionText": "Comprei 35,4645 SAPIEN no dia 09/12/2025 Ã s 05:31:50. O valor de compra (p/unid): R$ 0,83. Atualmente (p/unid): R$ 0,41, gerando decrÃ©scimo de 51,12%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Curve DAO",
      "quantity": 14.8,
      "tradeDate": "2025-12-15",
      "totalInitialCents": 2825,
      "pricePerUnitInitialCents": 191,
      "totalCurrentCents": 1814,
      "pricePerUnitCurrentCents": 123,
      "yieldPercent": -0.3578761062,
      "descriptionText": "Comprei 14,8 Curve DAO no dia 15/12/2025 Ã s 14:32:42. O valor de compra (p/unid): R$ 1,91. Atualmente (p/unid): R$ 1,23, gerando decrÃ©scimo de 35,79%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "FartCoin",
      "quantity": 19.13824,
      "tradeDate": "2025-12-18",
      "totalInitialCents": 2900,
      "pricePerUnitInitialCents": 152,
      "totalCurrentCents": 1954,
      "pricePerUnitCurrentCents": 102,
      "yieldPercent": -0.3262068966,
      "descriptionText": "Comprei 19,13824 FartCoin no dia 18/12/2025 Ã s 08:04:51. O valor de compra (p/unid): R$ 1,52. Atualmente (p/unid): R$ 1,02, gerando decrÃ©scimo de 32,62%.",
      "isCompleted": true
    }
  ],
  "dashboardHints": {
    "consolidatedAccountsCents": 1054550,
    "openBillsCents": 118344,
    "nextRecurringWindowCents": 103879
  }
} & {
  accounts: MoneyAccountSeed[];
  cards: MoneyCardSeed[];
  recurring: MoneyRecurringSeed[];
  cardBills: MoneyBillSeed[];
  cardEntries: MoneyBillEntrySeed[];
  reserves: MoneyReserveSeed[];
  stockPositions: MoneyStockSeed[];
  cryptoPositions: MoneyCryptoSeed[];
  assetTrades: MoneyAssetTradeSeed[];
};

export const moneyBootstrapDataset = {
  "generatedAt": "2026-03-25",
  "currency": "BRL",
  "locale": "pt-BR",
  "sheetInventory": [
    {
      "name": "1. Acompanhamento Mensal",
      "rows": 1502,
      "columns": 17,
      "sampleHeaders": [
        "Data:",
        "Saldo de Hoje (25/03/2026)",
        "941.54",
        "-1281.65",
        "Realidade do Dia (25/03) nos PrÃ³ximos Meses",
        "2026-03-25 00:00:00",
        "1631.61",
        "0"
      ]
    },
    {
      "name": "2. VisÃ£o Geral",
      "rows": 1005,
      "columns": 21,
      "sampleHeaders": [
        "Total",
        "NuBank",
        "Banco do Brasil",
        "MercadoPago",
        "Inter",
        "Binance",
        "NuBank",
        "AÃ§Ãµes:"
      ]
    },
    {
      "name": "3. Contas",
      "rows": 363,
      "columns": 68,
      "sampleHeaders": [
        "Ãgua",
        "BK1",
        "2026-03-25 00:00:00",
        "HOJE",
        "-88.48000000000047",
        "R",
        "2026-01-01 00:00:00",
        "MPInvest"
      ]
    },
    {
      "name": "4. TransaÃ§Ãµes",
      "rows": 150,
      "columns": 12,
      "sampleHeaders": [
        "AÃ§Ã£o:",
        "CriptoMoeda:",
        "Quantidade:",
        "Data:",
        "HorÃ¡rio:",
        "Valor Inicial:",
        "Valor Inicial p/Unid",
        "Valor Final:"
      ]
    },
    {
      "name": "5. CartÃµes",
      "rows": 97,
      "columns": 16,
      "sampleHeaders": [
        "CartÃ£o Nubank",
        "CartÃ£o MercadoPago",
        "CartÃ£o Nubank",
        "CartÃ£o MercadoPago"
      ]
    },
    {
      "name": "6. Richard",
      "rows": 17,
      "columns": 12,
      "sampleHeaders": [
        "Incluir no MÃªs Atual?",
        "Incluir no MÃªs Seguinte?",
        "Incluir no MÃªs Posterior ao seguinte?",
        "Emoji",
        "Nome da Conta:",
        "Valor",
        "ðŸ“† *MarÃ§o*\n\nðŸ’³ Nubank: *R$ 566,25*\n - Violino (4/10) R$ 160,00\n - SmartFit R$ 149,90\n - Iphone 16e (2/12) R$ 256,35\n\nðŸ’³ Mercado Pago: *R$ 53,50*\n - Airfryer (4/4) R$ 53,50\n\nðŸ  Aluguel: *R$ 601,83*\nâš¡ Internet: *R$ 40,76*\n Micro-Ondas: *R$ 50,67*\n\nâœ… *Total MarÃ§o: R$ 1.313,01*",
        "ðŸ“† *Abril*\n\nðŸ’³ Nubank: *R$ 566,25*\n - Violino (5/10) R$ 160,00\n - SmartFit R$ 149,90\n - Iphone 16e (3/12) R$ 256,35\n\nðŸ’³ Mercado Pago: *R$ 0,00*\n\n\nðŸ  Aluguel: *R$ 601,83*\nâš¡ Internet: *R$ 40,76*\nðŸŒ Energia: *R$ 55,41*\n Micro-Ondas: *R$ 50,67*\n\nâœ… *Total Abril: R$ 1.314,91*"
      ]
    },
    {
      "name": "7. Resumo do Investimento",
      "rows": 1,
      "columns": 1,
      "sampleHeaders": [
        "Resumo do Investimento:\n--- AÃ§Ãµes ---\nEquatorial Energia - EQTL3: Investido R$ 65,02 | Atual R$ 82,34\nOuro - GOLD11: Investido R$ 26,81 | Atual R$ 24,03\nMercadoLibre - MELI34: Investido R$ 206,07 | Atual R$ 141,68\nApple - AAPL34: Investido R$ 0,00 | Atual R$ 0,00\nTotal AÃ§Ãµes: R$ 423,39 â†’ R$ 370,42\n--- Criptomoedas ---\nCriptomoedas:: Investido R$ Valor Investido: | Atual R$ Valor Atual:\nPi: Investido R$ 750,00 | Atual R$ 817,22\nBitcoin: Investido R$ 133,28 | Atual R$ 239,71\nEthereum: Investido R$ 427,24 | Atual R$ 232,36\nSolana: Investido R$ 386,07 | Atual R$ 183,10\nChainLink: Investido R$ 120,00 | Atual R$ 48,87\nRender: Investido R$ 54,00 | Atual R$ 40,05\nFartCoin: Investido R$ 29,00 | Atual R$ 19,54\nSui: Investido R$ 54,00 | Atual R$ 18,20\nCurve DAO: Investido R$ 28,25 | Atual R$ 18,14\nSAPIEN: Investido R$ 29,16 | Atual R$ 14,42\nUSDT: Investido R$ 0,00 | Atual R$ 0,00\nTotal Cripto: R$ 2011,00 â†’ R$ 1631,61\n--- Reservas ---\nReservas:: Investido R$ Valor Anterior: | Atual R$ Valor Atual:\nMeliDÃ³lar: Investido R$ 3731,43 | Atual R$ 3806,69\nCarta de Motorista: Investido R$ 2136,87 | Atual R$ 2139,03\nFuturo: Investido R$ 811,82 | Atual R$ 812,64\nNotebook: Investido R$ 695,23 | Atual R$ 695,93\nAÃ§Ãµes: Investido R$ 32,41 | Atual R$ 32,26\nCrypto: Investido R$ 32,23 | Atual R$ 32,44\nTotal Reservas: R$ 7439,99 â†’ R$ 7518,99\n--- Investimento Geral ---\nTotal Investido: R$ 9874,38 | Total Atual: R$ 9521,02\n--- TransaÃ§Ãµes Recentes ---\nComprei 13 Alibaba - BABA34 no dia 28/08/2025 Ã s 10:38:00. O valor de compra (p/unid): R$ 23,17. Atualmente (p/unid): R$ 23,60, gerando acrÃ©scimo de 1,87%.\nVendi 4 Alibaba - BABA34 no dia 02/09/2025 Ã s 10:48:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 26,58, gerando lucro de 1,87%.\nVendi 2 Alibaba - BABA34 no dia 03/09/2025 Ã s 10:23:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 26,57, gerando lucro de 1,87%.\nVendi 2 Alibaba - BABA34 no dia 04/09/2025 Ã s 11:12:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 25,41, gerando lucro de 1,87%.\nComprei 0,83 ChainLink no dia 05/09/2025 Ã s 14:58:00. O valor de compra (p/unid): R$ 119,67. Atualmente (p/unid): R$ 49,33, gerando decrÃ©scimo de 58,78%.\nComprei 2 MercadoLibre - MELI34 no dia 12/09/2025 Ã s 11:08:00. O valor de compra (p/unid): R$ 103,00. Atualmente (p/unid): R$ 70,84, gerando decrÃ©scimo de 31,22%.\nComprei 0,01690952 Ethereum no dia 25/09/2025 Ã s 07:18:28. O valor de compra (p/unid): R$ 19.683,59. Atualmente (p/unid): R$ 11.442,86, gerando decrÃ©scimo de 41,87%.\nComprei 3,6 Sui no dia 10/10/2025 Ã s 20:29:23. O valor de compra (p/unid): R$ 15,05. Atualmente (p/unid): R$ 5,06, gerando decrÃ©scimo de 66,37%.\nComprei 4,09 Render no dia 10/10/2025 Ã s 20:29:58. O valor de compra (p/unid): R$ 13,43. Atualmente (p/unid): R$ 9,80, gerando decrÃ©scimo de 27,01%.\nComprei 0,33 Solana no dia 10/10/2025 Ã s 02:54:21. O valor de compra (p/unid): R$ 1.018,00. Atualmente (p/unid): R$ 486,46, gerando decrÃ©scimo de 52,21%.\nComprei 0,0034 Ethereum no dia 25/03/2026 Ã s 05:16:16. O valor de compra (p/unid): R$ 20.400,00. Atualmente (p/unid): R$ 11.442,86, gerando decrÃ©scimo de 43,91%.\nComprei 35,4645 SAPIEN no dia 09/12/2025 Ã s 05:31:50. O valor de compra (p/unid): R$ 0,83. Atualmente (p/unid): R$ 0,41, gerando decrÃ©scimo de 51,12%.\nComprei 14,8 Curve DAO no dia 15/12/2025 Ã s 14:32:42. O valor de compra (p/unid): R$ 1,91. Atualmente (p/unid): R$ 1,23, gerando decrÃ©scimo de 35,79%.\nComprei 19,13824 FartCoin no dia 18/12/2025 Ã s 08:04:51. O valor de compra (p/unid): R$ 1,52. Atualmente (p/unid): R$ 1,02, gerando decrÃ©scimo de 32,62%."
      ]
    },
    {
      "name": "8. Registro DiÃ¡rio",
      "rows": 1162,
      "columns": 8,
      "sampleHeaders": [
        "2025-04-20 00:00:00",
        "10:08:48",
        "2528.1"
      ]
    },
    {
      "name": "9. Registro DiÃ¡rio de Investime",
      "rows": 1199,
      "columns": 12,
      "sampleHeaders": [
        "2025-08-27 00:00:00",
        "08:36:27",
        "7346.89",
        "110.03",
        "272.78",
        "7729.7",
        "7518.99"
      ]
    }
  ],
  "accounts": [
    {
      "name": "NuBank CC",
      "institution": "NuBank",
      "type": "checking",
      "openingBalanceCents": 23,
      "includeInNetWorth": true,
      "notes": "Conta corrente identificada na aba VisÃ£o Geral."
    },
    {
      "name": "Banco do Brasil CC",
      "institution": "Banco do Brasil",
      "type": "checking",
      "openingBalanceCents": 1425,
      "includeInNetWorth": true,
      "notes": "Conta corrente identificada na aba VisÃ£o Geral."
    },
    {
      "name": "MercadoPago CC",
      "institution": "MercadoPago",
      "type": "checking",
      "openingBalanceCents": 98952,
      "includeInNetWorth": true,
      "notes": "Conta corrente principal com liquidez mais alta na planilha."
    },
    {
      "name": "Inter CDI",
      "institution": "Inter",
      "type": "savings",
      "openingBalanceCents": 2048,
      "includeInNetWorth": true,
      "notes": "Conta/caixa de liquidez no Inter."
    },
    {
      "name": "MPInvest",
      "institution": "MercadoPago",
      "type": "reserve",
      "openingBalanceCents": 751899,
      "includeInNetWorth": true,
      "notes": "Reserva identificada como MPInvest."
    },
    {
      "name": "NuInvest",
      "institution": "NuBank",
      "type": "investment",
      "openingBalanceCents": 37042,
      "includeInNetWorth": true,
      "notes": "Carteira de aÃ§Ãµes ligada ao ecossistema Nubank."
    },
    {
      "name": "Binance",
      "institution": "Binance",
      "type": "investment",
      "openingBalanceCents": 163161,
      "includeInNetWorth": true,
      "notes": "Carteira cripto consolidada."
    }
  ],
  "cards": [
    {
      "name": "CartÃ£o Nubank",
      "brand": "Nubank",
      "network": "Mastercard",
      "limitAmountCents": 300000,
      "closeDay": 18,
      "dueDay": 25,
      "settlementAccountName": "NuBank CC"
    },
    {
      "name": "CartÃ£o MercadoPago",
      "brand": "Mercado Pago",
      "network": "Visa",
      "limitAmountCents": 150000,
      "closeDay": 8,
      "dueDay": 15,
      "settlementAccountName": "MercadoPago CC"
    }
  ],
  "recurring": [
    {
      "title": "Mesada",
      "amountCents": 100000,
      "direction": "income",
      "frequency": "monthly",
      "startsOn": "2026-01-12",
      "nextRunOn": "2026-04-12",
      "accountName": "MercadoPago CC",
      "notes": "Reconhecido pela repetiÃ§Ã£o mensal na aba Contas."
    },
    {
      "title": "MPInvest",
      "amountCents": 8000,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-01-01",
      "nextRunOn": "2026-04-01",
      "accountName": "MercadoPago CC",
      "notes": "Aporte mensal identificado na planilha Money."
    },
    {
      "title": "Notebook Futuro",
      "amountCents": 21012,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-01-26",
      "nextRunOn": "2026-04-25",
      "accountName": "MercadoPago CC",
      "notes": "Objetivo/reserva recorrente identificado na planilha."
    },
    {
      "title": "Aluguel",
      "amountCents": 60183,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-03-05",
      "nextRunOn": "2026-04-05",
      "accountName": "MercadoPago CC",
      "notes": "Compromisso fixo da aba Richard."
    },
    {
      "title": "Internet",
      "amountCents": 4076,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-03-10",
      "nextRunOn": "2026-04-10",
      "accountName": "MercadoPago CC",
      "notes": "Compromisso fixo da aba Richard."
    },
    {
      "title": "Energia",
      "amountCents": 5541,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-04-19",
      "nextRunOn": "2026-04-19",
      "accountName": "MercadoPago CC",
      "notes": "Compromisso fixo inferido com revisÃ£o assistida."
    },
    {
      "title": "Micro-Ondas",
      "amountCents": 5067,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-03-20",
      "nextRunOn": "2026-04-20",
      "accountName": "MercadoPago CC",
      "notes": "Parcela fixa destacada na aba Richard."
    }
  ],
  "cardBills": [
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-03",
      "dueOn": "2026-03-15",
      "closesOn": "2026-03-08",
      "totalAmountCents": 24642
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-04",
      "dueOn": "2026-04-15",
      "closesOn": "2026-04-08",
      "totalAmountCents": 19311
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-05",
      "dueOn": "2026-05-15",
      "closesOn": "2026-05-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-06",
      "dueOn": "2026-06-15",
      "closesOn": "2026-06-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-07",
      "dueOn": "2026-07-15",
      "closesOn": "2026-07-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-08",
      "dueOn": "2026-08-15",
      "closesOn": "2026-08-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-09",
      "dueOn": "2026-09-15",
      "closesOn": "2026-09-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-10",
      "dueOn": "2026-10-15",
      "closesOn": "2026-10-08",
      "totalAmountCents": 10012
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-11",
      "dueOn": "2026-11-15",
      "closesOn": "2026-11-08",
      "totalAmountCents": 10012
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-12",
      "dueOn": "2026-12-15",
      "closesOn": "2026-12-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-01",
      "dueOn": "2027-01-15",
      "closesOn": "2027-01-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-02",
      "dueOn": "2027-02-15",
      "closesOn": "2027-02-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-03",
      "dueOn": "2027-03-15",
      "closesOn": "2027-03-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-04",
      "dueOn": "2027-04-15",
      "closesOn": "2027-04-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-05",
      "dueOn": "2027-05-15",
      "closesOn": "2027-05-08",
      "totalAmountCents": 3348
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-03",
      "dueOn": "2026-03-25",
      "closesOn": "2026-03-18",
      "totalAmountCents": 99034
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-04",
      "dueOn": "2026-04-25",
      "closesOn": "2026-04-18",
      "totalAmountCents": 67224
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-05",
      "dueOn": "2026-05-25",
      "closesOn": "2026-05-18",
      "totalAmountCents": 67224
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-06",
      "dueOn": "2026-06-25",
      "closesOn": "2026-06-18",
      "totalAmountCents": 68071
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-07",
      "dueOn": "2026-07-25",
      "closesOn": "2026-07-18",
      "totalAmountCents": 56625
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-08",
      "dueOn": "2026-08-25",
      "closesOn": "2026-08-18",
      "totalAmountCents": 56625
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-09",
      "dueOn": "2026-09-25",
      "closesOn": "2026-09-18",
      "totalAmountCents": 41635
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-10",
      "dueOn": "2026-10-25",
      "closesOn": "2026-10-18",
      "totalAmountCents": 25635
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-11",
      "dueOn": "2026-11-25",
      "closesOn": "2026-11-18",
      "totalAmountCents": 25635
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-12",
      "dueOn": "2026-12-25",
      "closesOn": "2026-12-18",
      "totalAmountCents": 25635
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2027-01",
      "dueOn": "2027-01-25",
      "closesOn": "2027-01-18",
      "totalAmountCents": 25635
    }
  ],
  "cardEntries": [
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Tablet (12/12)",
      "amountCents": 15000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Airfryer (4/4)",
      "amountCents": 5350,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Violino (4/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Shorts (5/6)",
      "amountCents": 1365,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Tenis - Darter Pro (3/5)",
      "amountCents": 3599,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Sapato (3/4)",
      "amountCents": 1898,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Mochila Mizuno (3/3)",
      "amountCents": 1828,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Monitor (4/18)",
      "amountCents": 3332,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Bicicleta (2/15)",
      "amountCents": 2797,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "UltraBoost 5 - Netshoes (2/5)",
      "amountCents": 7000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Cadeira (2/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Iphone 16e (2/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Terno (2/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Uber (1/1)",
      "amountCents": 8733,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Shorts (2/3)",
      "amountCents": 2172,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Mouse (1/1)",
      "amountCents": 6249,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Bicicleta (3/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "Violino (5/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Shorts (6/6)",
      "amountCents": 1365,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "Tenis - Darter Pro (4/5)",
      "amountCents": 3599,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Sapato (4/4)",
      "amountCents": 1898,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Monitor (5/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "UltraBoost 5 - Netshoes (3/5)",
      "amountCents": 7000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Cadeira (3/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "Iphone 16e (3/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Terno (3/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Shorts (3/3)",
      "amountCents": 2172,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "Violino (6/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "Tenis - Darter Pro (5/5)",
      "amountCents": 3599,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-05-15",
      "description": "Bicicleta (4/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-05-15",
      "description": "Monitor (6/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "UltraBoost 5 - Netshoes (4/5)",
      "amountCents": 7000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-05-15",
      "description": "Cadeira (4/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "Iphone 16e (4/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-05-15",
      "description": "Terno (4/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "Violino (7/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-06-15",
      "description": "Bicicleta (5/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "Cadeira Gamer (6/6)",
      "amountCents": 4446,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-06-15",
      "description": "Monitor (7/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-06-15",
      "description": "Cadeira (5/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "UltraBoost 5 - Netshoes (5/5)",
      "amountCents": 7000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-06-15",
      "description": "Terno (5/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "Iphone 16e (5/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-07-15",
      "description": "Bicicleta (6/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-07-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-07-15",
      "description": "Monitor (8/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-07-25",
      "description": "Violino (8/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-07-15",
      "description": "Cadeira (6/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-07-25",
      "description": "Iphone 16e (6/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-07-15",
      "description": "Terno (6/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-08-25",
      "description": "Violino (9/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-08-15",
      "description": "Bicicleta (7/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-08-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-08-15",
      "description": "Monitor (9/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-08-25",
      "description": "Iphone 16e (7/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-08-15",
      "description": "Cadeira (7/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-08-15",
      "description": "Terno (7/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-09-25",
      "description": "Violino (10/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-09-25",
      "description": "Iphone 16e (8/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-09-15",
      "description": "Bicicleta (8./15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-09-15",
      "description": "Monitor (10/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-10-25",
      "description": "Iphone 16e (9/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-09-15",
      "description": "Cadeira (8/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-09-15",
      "description": "Terno (8/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-11-25",
      "description": "Iphone 16e (10/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-10-15",
      "description": "Bicicleta (9/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-12-25",
      "description": "Iphone 16e (11/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-10-15",
      "description": "Monitor (11/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2027-01-25",
      "description": "Iphone 16e (12/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-10-15",
      "description": "Terno (9/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-11-15",
      "description": "Bicicleta (10/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-11-15",
      "description": "Monitor (12/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-11-15",
      "description": "Terno (10/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-12-15",
      "description": "Bicicleta (11/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-12-15",
      "description": "Monitor (13/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-01-15",
      "description": "Monitor (14/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-01-15",
      "description": "Bicicleta (12/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-02-15",
      "description": "Monitor (15/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-02-15",
      "description": "Bicicleta (13/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-03-15",
      "description": "Monitor (16/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-03-15",
      "description": "Bicicleta (14/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-04-15",
      "description": "Bicicleta (15/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-04-15",
      "description": "Monitor (17/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-05-15",
      "description": "Monitor (18/18)",
      "amountCents": 3348,
      "entryType": "installment"
    }
  ],
  "netWorthSummary": {
    "month": "2026-03",
    "reservesCents": 751899,
    "investmentsCents": 200203,
    "debtsCents": 118344
  },
  "reserves": [
    {
      "name": "MeliDÃ³lar",
      "investedCents": 305084,
      "previousValueCents": 373143,
      "currentValueCents": 380669,
      "totalProfitCents": 75585,
      "yieldTotalPercent": 0.2477514389,
      "monthlyProfitCents": 7526,
      "yieldMonthlyPercent": 0.02016921127
    },
    {
      "name": "Carta de Motorista",
      "investedCents": 150000,
      "previousValueCents": 213687,
      "currentValueCents": 213903,
      "totalProfitCents": 63903,
      "yieldTotalPercent": 0.42602,
      "monthlyProfitCents": 216,
      "yieldMonthlyPercent": 0.001010824243
    },
    {
      "name": "Futuro",
      "investedCents": 62000,
      "previousValueCents": 81182,
      "currentValueCents": 81264,
      "totalProfitCents": 19264,
      "yieldTotalPercent": 0.3107096774,
      "monthlyProfitCents": 82,
      "yieldMonthlyPercent": 0.001010076125
    },
    {
      "name": "Notebook",
      "investedCents": 215000,
      "previousValueCents": 69523,
      "currentValueCents": 69593,
      "totalProfitCents": -145407,
      "yieldTotalPercent": -0.6763116279,
      "monthlyProfitCents": 70,
      "yieldMonthlyPercent": 0.001006861039
    },
    {
      "name": "AÃ§Ãµes",
      "investedCents": 1600,
      "previousValueCents": 3241,
      "currentValueCents": 3226,
      "totalProfitCents": 1626,
      "yieldTotalPercent": 1.01625,
      "monthlyProfitCents": -15,
      "yieldMonthlyPercent": -0.004628201172
    },
    {
      "name": "Crypto",
      "investedCents": 1600,
      "previousValueCents": 3223,
      "currentValueCents": 3244,
      "totalProfitCents": 1644,
      "yieldTotalPercent": 1.0275,
      "monthlyProfitCents": 21,
      "yieldMonthlyPercent": 0.006515668632
    }
  ],
  "stockPositions": [
    {
      "ticker": "AMBP3",
      "fullName": "Ambipar - AMBP3",
      "quantity": 19,
      "investedCents": 969,
      "previousCents": 399,
      "currentCents": 437,
      "resultTotalCents": -532,
      "rentabilityTotalPercent": -0.5490196078
    },
    {
      "ticker": "BABA34",
      "fullName": "Alibaba - BABA34",
      "quantity": 5,
      "investedCents": 11580,
      "previousCents": 11870,
      "currentCents": 11800,
      "resultTotalCents": 220,
      "rentabilityTotalPercent": 0.01899827288
    },
    {
      "ticker": "EQTL3",
      "fullName": "Equatorial Energia - EQTL3",
      "quantity": 2,
      "investedCents": 6502,
      "previousCents": 8272,
      "currentCents": 8234,
      "resultTotalCents": 1732,
      "rentabilityTotalPercent": 0.2663795755
    },
    {
      "ticker": "GOLD11",
      "fullName": "Ouro - GOLD11",
      "quantity": 1,
      "investedCents": 2681,
      "previousCents": 2396,
      "currentCents": 2403,
      "resultTotalCents": -278,
      "rentabilityTotalPercent": -0.103692652
    },
    {
      "ticker": "MELI34",
      "fullName": "MercadoLibre - MELI34",
      "quantity": 2,
      "investedCents": 20607,
      "previousCents": 14600,
      "currentCents": 14168,
      "resultTotalCents": -6439,
      "rentabilityTotalPercent": -0.3124666376
    },
    {
      "ticker": "AAPL34",
      "fullName": "Apple - AAPL34",
      "quantity": 5,
      "investedCents": 0,
      "previousCents": 0,
      "currentCents": 0,
      "resultTotalCents": 0,
      "rentabilityTotalPercent": null
    },
    {
      "ticker": "EGIE3",
      "fullName": "Engie Brasil - EGIE3",
      "quantity": 0,
      "investedCents": 0,
      "previousCents": 0,
      "currentCents": 0,
      "resultTotalCents": 0,
      "rentabilityTotalPercent": null
    }
  ],
  "cryptoPositions": [
    {
      "name": "Pi",
      "quantity": 829.0,
      "investedCents": 75000,
      "previousCents": 81621,
      "currentCents": 81722,
      "totalProfitCents": 6722
    },
    {
      "name": "Bitcoin",
      "quantity": 0.00032967,
      "investedCents": 13328,
      "previousCents": 23887,
      "currentCents": 23971,
      "totalProfitCents": 10643
    },
    {
      "name": "Ethereum",
      "quantity": 0.02030612,
      "investedCents": 42724,
      "previousCents": 23115,
      "currentCents": 23236,
      "totalProfitCents": -19488
    },
    {
      "name": "Solana",
      "quantity": 0.37639607,
      "investedCents": 38607,
      "previousCents": 18153,
      "currentCents": 18310,
      "totalProfitCents": -20297
    },
    {
      "name": "ChainLink",
      "quantity": 0.99073401,
      "investedCents": 12000,
      "previousCents": 4810,
      "currentCents": 4887,
      "totalProfitCents": -7113
    },
    {
      "name": "Render",
      "quantity": 4.08591,
      "investedCents": 5400,
      "previousCents": 3727,
      "currentCents": 4005,
      "totalProfitCents": -1395
    },
    {
      "name": "FartCoin",
      "quantity": 19.13824,
      "investedCents": 2900,
      "previousCents": 1812,
      "currentCents": 1954,
      "totalProfitCents": -946
    },
    {
      "name": "Sui",
      "quantity": 3.5964,
      "investedCents": 5400,
      "previousCents": 1800,
      "currentCents": 1820,
      "totalProfitCents": -3580
    },
    {
      "name": "Curve DAO",
      "quantity": 14.8,
      "investedCents": 2824,
      "previousCents": 1751,
      "currentCents": 1814,
      "totalProfitCents": -1010
    },
    {
      "name": "SAPIEN",
      "quantity": 35.4645,
      "investedCents": 2916,
      "previousCents": 1466,
      "currentCents": 1442,
      "totalProfitCents": -1474
    },
    {
      "name": "USDT",
      "quantity": 15.98141462,
      "investedCents": 0,
      "previousCents": 0,
      "currentCents": 0,
      "totalProfitCents": 0
    }
  ],
  "assetTrades": [
    {
      "action": "compra",
      "assetName": "Alibaba - BABA34",
      "quantity": 13.0,
      "tradeDate": "2025-08-28",
      "totalInitialCents": 30118,
      "pricePerUnitInitialCents": 2317,
      "totalCurrentCents": 11800,
      "pricePerUnitCurrentCents": 2360,
      "yieldPercent": 0.01865993758,
      "descriptionText": "Comprei 13 Alibaba - BABA34 no dia 28/08/2025 Ã s 10:38:00. O valor de compra (p/unid): R$ 23,17. Atualmente (p/unid): R$ 23,60, gerando acrÃ©scimo de 1,87%.",
      "isCompleted": true
    },
    {
      "action": "venda",
      "assetName": "Alibaba - BABA34",
      "quantity": 4.0,
      "tradeDate": "2025-09-02",
      "totalInitialCents": 10632,
      "pricePerUnitInitialCents": 2658,
      "totalCurrentCents": 11800,
      "pricePerUnitCurrentCents": 2360,
      "yieldPercent": 0.1472873365,
      "descriptionText": "Vendi 4 Alibaba - BABA34 no dia 02/09/2025 Ã s 10:48:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 26,58, gerando lucro de 1,87%.",
      "isCompleted": true
    },
    {
      "action": "venda",
      "assetName": "Alibaba - BABA34",
      "quantity": 2.0,
      "tradeDate": "2025-09-03",
      "totalInitialCents": 5314,
      "pricePerUnitInitialCents": 2657,
      "totalCurrentCents": 11800,
      "pricePerUnitCurrentCents": 2360,
      "yieldPercent": 0.1468557009,
      "descriptionText": "Vendi 2 Alibaba - BABA34 no dia 03/09/2025 Ã s 10:23:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 26,57, gerando lucro de 1,87%.",
      "isCompleted": true
    },
    {
      "action": "venda",
      "assetName": "Alibaba - BABA34",
      "quantity": 2.0,
      "tradeDate": "2025-09-04",
      "totalInitialCents": 5082,
      "pricePerUnitInitialCents": 2541,
      "totalCurrentCents": 11800,
      "pricePerUnitCurrentCents": 2360,
      "yieldPercent": 0.09678597516,
      "descriptionText": "Vendi 2 Alibaba - BABA34 no dia 04/09/2025 Ã s 11:12:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 25,41, gerando lucro de 1,87%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "ChainLink",
      "quantity": 0.83,
      "tradeDate": "2025-09-05",
      "totalInitialCents": 9933,
      "pricePerUnitInitialCents": 11967,
      "totalCurrentCents": 4887,
      "pricePerUnitCurrentCents": 4933,
      "yieldPercent": -0.587804848,
      "descriptionText": "Comprei 0,83 ChainLink no dia 05/09/2025 Ã s 14:58:00. O valor de compra (p/unid): R$ 119,67. Atualmente (p/unid): R$ 49,33, gerando decrÃ©scimo de 58,78%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "MercadoLibre - MELI34",
      "quantity": 2.0,
      "tradeDate": "2025-09-12",
      "totalInitialCents": 20600,
      "pricePerUnitInitialCents": 10300,
      "totalCurrentCents": 14168,
      "pricePerUnitCurrentCents": 7084,
      "yieldPercent": -0.3122330097,
      "descriptionText": "Comprei 2 MercadoLibre - MELI34 no dia 12/09/2025 Ã s 11:08:00. O valor de compra (p/unid): R$ 103,00. Atualmente (p/unid): R$ 70,84, gerando decrÃ©scimo de 31,22%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Ethereum",
      "quantity": 0.01690952,
      "tradeDate": "2025-09-25",
      "totalInitialCents": 33284,
      "pricePerUnitInitialCents": 1968359,
      "totalCurrentCents": 23236,
      "pricePerUnitCurrentCents": 1144286,
      "yieldPercent": -0.4186600274,
      "descriptionText": "Comprei 0,01690952 Ethereum no dia 25/09/2025 Ã s 07:18:28. O valor de compra (p/unid): R$ 19.683,59. Atualmente (p/unid): R$ 11.442,86, gerando decrÃ©scimo de 41,87%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Sui",
      "quantity": 3.6,
      "tradeDate": "2025-10-10",
      "totalInitialCents": 5418,
      "pricePerUnitInitialCents": 1505,
      "totalCurrentCents": 1820,
      "pricePerUnitCurrentCents": 506,
      "yieldPercent": -0.6637464338,
      "descriptionText": "Comprei 3,6 Sui no dia 10/10/2025 Ã s 20:29:23. O valor de compra (p/unid): R$ 15,05. Atualmente (p/unid): R$ 5,06, gerando decrÃ©scimo de 66,37%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Render",
      "quantity": 4.09,
      "tradeDate": "2025-10-10",
      "totalInitialCents": 5493,
      "pricePerUnitInitialCents": 1343,
      "totalCurrentCents": 4005,
      "pricePerUnitCurrentCents": 980,
      "yieldPercent": -0.2701431112,
      "descriptionText": "Comprei 4,09 Render no dia 10/10/2025 Ã s 20:29:58. O valor de compra (p/unid): R$ 13,43. Atualmente (p/unid): R$ 9,80, gerando decrÃ©scimo de 27,01%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Solana",
      "quantity": 0.33,
      "tradeDate": "2025-10-10",
      "totalInitialCents": 33594,
      "pricePerUnitInitialCents": 101800,
      "totalCurrentCents": 18310,
      "pricePerUnitCurrentCents": 48646,
      "yieldPercent": -0.5221457136,
      "descriptionText": "Comprei 0,33 Solana no dia 10/10/2025 Ã s 02:54:21. O valor de compra (p/unid): R$ 1.018,00. Atualmente (p/unid): R$ 486,46, gerando decrÃ©scimo de 52,21%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Ethereum",
      "quantity": 0.0034,
      "tradeDate": "2026-03-25",
      "totalInitialCents": 6936,
      "pricePerUnitInitialCents": 2040000,
      "totalCurrentCents": 23236,
      "pricePerUnitCurrentCents": 1144286,
      "yieldPercent": -0.4390757034,
      "descriptionText": "Comprei 0,0034 Ethereum no dia 25/03/2026 Ã s 05:16:16. O valor de compra (p/unid): R$ 20.400,00. Atualmente (p/unid): R$ 11.442,86, gerando decrÃ©scimo de 43,91%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "SAPIEN",
      "quantity": 35.4645,
      "tradeDate": "2025-12-09",
      "totalInitialCents": 2950,
      "pricePerUnitInitialCents": 83,
      "totalCurrentCents": 1442,
      "pricePerUnitCurrentCents": 41,
      "yieldPercent": -0.5111864407,
      "descriptionText": "Comprei 35,4645 SAPIEN no dia 09/12/2025 Ã s 05:31:50. O valor de compra (p/unid): R$ 0,83. Atualmente (p/unid): R$ 0,41, gerando decrÃ©scimo de 51,12%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Curve DAO",
      "quantity": 14.8,
      "tradeDate": "2025-12-15",
      "totalInitialCents": 2825,
      "pricePerUnitInitialCents": 191,
      "totalCurrentCents": 1814,
      "pricePerUnitCurrentCents": 123,
      "yieldPercent": -0.3578761062,
      "descriptionText": "Comprei 14,8 Curve DAO no dia 15/12/2025 Ã s 14:32:42. O valor de compra (p/unid): R$ 1,91. Atualmente (p/unid): R$ 1,23, gerando decrÃ©scimo de 35,79%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "FartCoin",
      "quantity": 19.13824,
      "tradeDate": "2025-12-18",
      "totalInitialCents": 2900,
      "pricePerUnitInitialCents": 152,
      "totalCurrentCents": 1954,
      "pricePerUnitCurrentCents": 102,
      "yieldPercent": -0.3262068966,
      "descriptionText": "Comprei 19,13824 FartCoin no dia 18/12/2025 Ã s 08:04:51. O valor de compra (p/unid): R$ 1,52. Atualmente (p/unid): R$ 1,02, gerando decrÃ©scimo de 32,62%.",
      "isCompleted": true
    }
  ],
  "dashboardHints": {
    "consolidatedAccountsCents": 1054550,
    "openBillsCents": 118344,
    "nextRecurringWindowCents": 103879
  }
} as const satisfies MoneyBootstrapDataset;

export function getMoneySheetByName(name: string) {
  return moneyBootstrapDataset.sheetInventory.find((sheet) => sheet.name === name) ?? null;
}
