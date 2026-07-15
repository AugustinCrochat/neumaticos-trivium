export function AlineacionBalanceoIcon({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <img src="/icons/servicios/alineadora.svg" alt="" style={{ width: size, height: size }} />
      <div className="flex flex-col items-center">
        <img src="/icons/servicios/balanceadora.svg" alt="" style={{ width: size, height: size }} />
        <span className="mt-0.5 min-w-4 h-4 px-1 rounded-full bg-orange-500 text-white text-[10px] font-black leading-4 flex items-center justify-center">4</span>
      </div>
    </div>
  );
}
