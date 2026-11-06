import type { Money } from "./types";

export const CURRENCY = "CAD";

export const toMoney = (cents: number): Money => ({
  amount: (cents / 100).toFixed(2),
  currencyCode: CURRENCY,
});
