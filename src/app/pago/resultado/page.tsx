import { PaymentResult } from "./PaymentResult";

type Props = { searchParams: Promise<{ estado?: string }> };

export default async function PaymentResultPage({ searchParams }: Props) {
  const { estado } = await searchParams;
  return <PaymentResult status={estado} />;
}
