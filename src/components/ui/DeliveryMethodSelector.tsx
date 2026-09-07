"use client";

import { useCart, type ShippingAddress } from "@/contexts/cart-context";
import { useBranch } from "@/contexts/branch-context";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "@/lib/config";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(price);
}

export function isShippingAddressComplete(address: ShippingAddress | null): address is ShippingAddress {
  if (!address) return false;
  return Object.values(address).every((v) => v.trim().length > 0);
}

const inputClass =
  "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-navy-900 outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-500/10";

export function DeliveryMethodSelector() {
  const { deliveryMethod, setDeliveryMethod, shippingAddress, setShippingAddress, itemsTotal } = useCart();
  const { selectedBranch } = useBranch();
  const envioGratis = itemsTotal >= FREE_SHIPPING_THRESHOLD;

  function updateAddress(field: keyof ShippingAddress, value: string) {
    setShippingAddress({
      fullName: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      ...shippingAddress,
      [field]: value,
    });
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setDeliveryMethod("pickup")}
          className={`rounded-xl border-2 p-3 text-left transition-colors ${deliveryMethod === "pickup" ? "border-orange-500 bg-orange-50" : "border-slate-200 hover:border-slate-300"}`}
        >
          <span className="block text-sm font-black text-navy-900">Retiro en sucursal</span>
          <span className="block text-xs font-bold text-emerald-600 mt-0.5">Gratis</span>
        </button>
        <button
          type="button"
          onClick={() => setDeliveryMethod("shipping")}
          className={`rounded-xl border-2 p-3 text-left transition-colors ${deliveryMethod === "shipping" ? "border-orange-500 bg-orange-50" : "border-slate-200 hover:border-slate-300"}`}
        >
          <span className="block text-sm font-black text-navy-900">Envío a domicilio</span>
          <span className={`block text-xs font-bold mt-0.5 ${envioGratis ? "text-emerald-600" : "text-slate-500"}`}>
            {envioGratis ? "Gratis" : `${formatPrice(SHIPPING_FLAT_RATE)}`} · todo el país
          </span>
        </button>
      </div>

      {deliveryMethod === "pickup" && (
        <p className="text-xs text-slate-500">
          Retiro el mismo día en Sucursal {selectedBranch.shortName}, {selectedBranch.address}.
        </p>
      )}

      {deliveryMethod === "shipping" && (
        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Dirección de envío</p>
          <input
            type="text"
            placeholder="Nombre y apellido"
            value={shippingAddress?.fullName ?? ""}
            onChange={(e) => updateAddress("fullName", e.target.value)}
            className={inputClass}
          />
          <input
            type="tel"
            placeholder="Teléfono de contacto"
            value={shippingAddress?.phone ?? ""}
            onChange={(e) => updateAddress("phone", e.target.value)}
            className={inputClass}
          />
          <input
            type="text"
            placeholder="Calle y número"
            value={shippingAddress?.address ?? ""}
            onChange={(e) => updateAddress("address", e.target.value)}
            className={inputClass}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Localidad"
              value={shippingAddress?.city ?? ""}
              onChange={(e) => updateAddress("city", e.target.value)}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Provincia"
              value={shippingAddress?.province ?? ""}
              onChange={(e) => updateAddress("province", e.target.value)}
              className={inputClass}
            />
          </div>
          <input
            type="text"
            placeholder="Código postal"
            value={shippingAddress?.postalCode ?? ""}
            onChange={(e) => updateAddress("postalCode", e.target.value)}
            className={inputClass}
          />
        </div>
      )}
    </div>
  );
}
