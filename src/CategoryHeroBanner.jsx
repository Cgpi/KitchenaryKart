import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const BANNER = {
  tag: "HORECA & Home",
  title: "Everything for Kitchens,\nFrom Home to Heavy-Duty",
  subtitle: "Utensils, equipment, machines and essentials for daily use or large-scale operations",
 image:
  "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=1600&q=80",
  overlay: "linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.3) 75%, rgba(0,0,0,0) 100%)",
};



export default function CategoryHeroBanner() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full">

      {/* HERO */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(380px, 52vw, 520px)" }}
      >
        {/* Background */}
        <img
          src={BANNER.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: BANNER.overlay }}
        />

        {/* Content */}
   <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-10 lg:px-16 xl:px-24 text-center">
  <div className="max-w-[700px]">

            {/* Tag */}
            <span className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full bg-black text-white text-[11px] font-semibold uppercase tracking-wider">
              <Star size={10} fill="currentColor" />
              {BANNER.tag}
            </span>

            {/* Title */}
            <h1
              className="text-white font-black leading-[1.1] mb-4 text-[26px] sm:text-[40px] md:text-[48px]"
              style={{ whiteSpace: "pre-line" }}
            >
              {BANNER.title}
            </h1>

            {/* Subtitle */}
            <p className="text-white/70 text-sm sm:text-base mb-6">
              {BANNER.subtitle}
            </p>

            {/* 👉 CATEGORY BUTTONS */}
          

            {/* CTA */}
            <button
              onClick={() => navigate("/all-subcategories")}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold 
                         bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
             Explore All Collections
              <ArrowRight size={14} />
            </button>

          </div>
        </div>

        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
      </div>
    </section>
  );
}