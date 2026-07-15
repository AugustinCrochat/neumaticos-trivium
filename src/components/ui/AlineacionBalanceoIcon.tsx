export function AlineacionBalanceoIcon({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <img src="/icons/servicios/alineadora.svg" alt="" style={{ width: size, height: size }} />
      <img src="/icons/servicios/balanceadora.svg" alt="" style={{ width: size, height: size }} />
    </div>
  );
}
