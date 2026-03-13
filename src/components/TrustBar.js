import React from "react";
import { Truck, ShieldCheck, RotateCcw, Star, Phone } from "lucide-react";

const trustItems = [
  {
    icon: Truck,
    label: "Free Delivery",
    sub: "On orders above ₹5,000",
  },
  {
    icon: ShieldCheck,
    label: "Genuine Products",
    sub: "100% authentic HORECA grade",
  },
  {
    icon: RotateCcw,
    label: "Easy Returns",
    sub: "Hassle-free return policy",
  },
  {
    icon: Star,
    label: "Premium Quality",
    sub: "Trusted by professionals",
  },
  {
    icon: Phone,
    label: "24/7 Support",
    sub: "Always here to help",
  },
];

const TrustBar = () => {
  return (
    <div className="bg-charcoal border-b border-white/5 overflow-hidden">
      <div className="container-main">
        <div className="flex items-stretch divide-x divide-white/10">
          {trustItems.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 px-4 py-3 flex-1 min-w-0"
            >
              <Icon size={16} className="text-brand-300 flex-shrink-0" />
              <div className="min-w-0 hidden sm:block">
                <p className="text-white text-xs font-semibold font-body leading-tight truncate">
                  {label}
                </p>
                <p className="text-stone-500 text-[11px] font-body leading-tight truncate hidden md:block">
                  {sub}
                </p>
              </div>
              <p className="text-white text-[11px] font-semibold font-body sm:hidden leading-tight truncate">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
