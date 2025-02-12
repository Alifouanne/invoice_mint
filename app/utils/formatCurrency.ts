interface Props {
  amount: number;
  currency: "USD" | "EUR";
}
export function formatCurrency({ amount, currency }: Props) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}
