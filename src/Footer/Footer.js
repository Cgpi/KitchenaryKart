import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  ArrowUp,
  ChevronRight,
} from "lucide-react";
import logo from "../images/piclogo.png";

const globalStyles = `
 @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

  body, * {
  font-family: 'Roboto', 'Arial', sans-serif;
}
 
  /* ── nav links ─────────────────────────────────────── */
  .kk-nav-link {
    display: flex;
    align-items: center;
    gap: 0px;
    text-align: left;
    color: #151312;
    font-size: 0.875rem;
    font-weight: 400;
    text-decoration: none;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    width: 100%;
    transition: color 0.2s ease, gap 0.2s ease;
  }
  .kk-footer ul { padding: 0 !important; margin: 0 !important; list-style: none !important; }
  .kk-footer li { padding: 0 !important; margin: 0 !important; }
  .kk-nav-link .arrow-icon {
    opacity: 0;
    width: 0;
    overflow: hidden;
    color: #621515;
    flex-shrink: 0;
    transition: opacity 0.2s ease, width 0.2s ease;
  }
  .kk-nav-link:hover { color: #621515; }
  .kk-nav-link:hover .arrow-icon { opacity: 1; width: 14px; }

  /* ── trust badge cell ──────────────────────────────── */
  .trust-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 22px;
    transition: background 0.2s;
    cursor: default;
  }
  .trust-cell:hover { background: #fff8f8; }

  /* ── icon ring ─────────────────────────────────────── */
  .icon-ring {
    flex-shrink: 0;
    border-radius: 12px;
    border: 1px solid #fecaca;
    background: #fff5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s, background 0.2s, transform 0.2s;
  }
  .trust-cell:hover .icon-ring,
  .contact-link:hover .icon-ring {
    border-color: #B91C1C;
    background: #fee2e2;
    transform: scale(1.06);
  }

  /* ── contact card ──────────────────────────────────── */
  .contact-link {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    text-decoration: none;
    padding: 10px 12px;
    border-radius: 14px;
    border: 1px solid transparent;
    margin: -10px -12px;
    transition: border-color 0.2s, background 0.2s;
  }
  .contact-link:hover {
    border-color: #fecaca;
    background: #fff5f5;
  }

  /* ── section heading with right fade line ─────────── */
  .section-head {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  .section-head::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, #e7e5e4 0%, transparent 100%);
  }

  /* ── payment chip ──────────────────────────────────── */
  .pay-chip {
    display: inline-flex;
    align-items: center;
    padding: 5px 10px;
    border-radius: 7px;
    background: #f1f5f9;
    color: #334155;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    border: 1px solid #e2e8f0;
    transition: background 0.15s;
  }
  .pay-chip:hover { background: #e2e8f0; }

  /* ── back-to-top button ────────────────────────────── */
  .top-btn {
    width: 34px; height: 34px;
    border-radius: 10px;
    border: 1.5px solid #d6d3d1;
    display: flex; align-items: center; justify-content: center;
    color: #a8a29e;
    cursor: pointer;
    background: transparent;
    transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
  }
  .top-btn:hover {
    background: #B91C1C;
    border-color: #B91C1C;
    color: #fff;
    transform: translateY(-2px);
  }

  /* ── responsive ────────────────────────────────────── */
  @media (max-width: 768px) {
    .trust-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .trust-cell:nth-child(1), .trust-cell:nth-child(2) { border-bottom: 1px solid #f3f0ec; }
    .trust-cell:nth-child(even) { border-right: none !important; }
    .link-grid { grid-template-columns: 1fr 1fr !important; }
    .brand-col { width: 100% !important; }
    .main-wrap { flex-direction: column !important; gap: 36px !important; }
    .bottom-bar { flex-direction: column !important; text-align: center; }
  }
  @media (max-width: 480px) {
    .link-grid { grid-template-columns: 1fr !important; }
  }
`;

const Footer = () => {
  const navigate = useNavigate();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const trustBadges = [
    { icon: ShieldCheck, label: "Secure Payment", sub: "100% safe checkout" },
    { icon: Truck, label: "Fast Delivery", sub: "Pan India shipping" },
    { icon: RotateCcw, label: "Easy Returns", sub: "Hassle-free returns" },
    { icon: Star, label: "Premium Quality", sub: "HORECA grade products" },
  ];

  const usefulLinks = [
    { text: "Privacy Policy", link: "/privacy-policy" },
    { text: "Terms and Conditions", link: "/terms-policy" },
    { text: "Shipping Policy", link: "/shipping-policy" },
    { text: "Pricing Policy", link: "/pricing-policy" },
    { text: "Cancellation Policy", link: "/cancellation-policy" },
  ];

  const productLinks = [
    { text: "New Arrivals", action: () => navigate("/new-arrivals") },
    { text: "Best Sellers", action: () => navigate("/most-selling-all") },
    { text: "All Categories", action: () => navigate("/all-subcategories") },
  ];

  return (
    <>
      <style>{globalStyles}</style>

      <footer className="kk-footer" style={{ background: "#fdfcfb", borderTop: "1px solid #e7e5e4" }}>

        {/* ══ Trust badges strip ══════════════════════════════════════ */}
        <div style={{ background: "#fff", borderBottom: "1px solid #f3f0ec" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div className="trust-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
              {trustBadges.map(({ icon: Icon, label, sub }, idx) => (
                <div
                  key={label}
                  className="trust-cell"
                  style={{ borderRight: idx < 3 ? "1px solid #f3f0ec" : "none" }}
                >
                  <div className="icon-ring" style={{ width: 42, height: 42 }}>
                    <Icon size={16} style={{ color: "#B91C1C" }} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p style={{ color: "#1c1917", fontSize: 14, fontWeight: 600, lineHeight: 1.3, margin: 0 }}>{label}</p>
                    <p style={{ color: "#a8a29e", fontSize: 11, marginTop: 2, marginBottom: 0 }}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ Main content ════════════════════════════════════════════ */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 24px" }}>
          <div className="main-wrap" style={{ display: "flex", gap: 80, alignItems: "flex-start" }}>

            {/* ── Brand column ─────────────────────────────────────── */}
            <div className="brand-col" style={{ width: 200, flexShrink: 0 }}>
              <a href="/" style={{ display: "inline-block", marginBottom: 12 }}>
                <img src={logo} alt="Kitchenary Kart" style={{ height: 36, width: "auto", objectFit: "contain" }} />
              </a>
              <p style={{ color: "#a8a29e", fontSize: 14, lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
                Your one-stop destination for premium kitchen essentials and
                professional HORECA supplies. Quality you can trust.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 18 }}>
                <span style={{ display: "block", width: 24, height: 2, borderRadius: 2, background: "#B91C1C" }} />
                <span style={{ display: "block", width: 8, height: 2, borderRadius: 2, background: "#fca5a5" }} />
                <span style={{ display: "block", width: 4, height: 2, borderRadius: 2, background: "#fecaca" }} />
              </div>
            </div>

            {/* ── Link columns ─────────────────────────────────────── */}
            <div
              className="link-grid"
              style={{ flex: 1, minWidth: 0, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 40 }}
            >

              {/* Products */}
              <div>
                <div className="section-head">
                  <h4 className="kk-serif" style={{ color: "#1c1917", fontSize: 15, fontWeight: 700, margin: 0 }}>
                    Products
                  </h4>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {productLinks.map(({ text, action }) => (
                    <button key={text} onClick={action} className="kk-nav-link">
                      <ChevronRight size={13} className="arrow-icon" />
                      {text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Policies */}
              <div>
                <div className="section-head">
                  <h4 className="kk-serif" style={{ color: "#1c1917", fontSize: 15, fontWeight: 700, margin: 0 }}>
                    Policies
                  </h4>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {usefulLinks.map(({ text, link }) => (
                    <Link key={text} to={link} onClick={scrollToTop} className="kk-nav-link">
                      <ChevronRight size={13} className="arrow-icon" />
                      {text}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div>
                <div className="section-head">
                  <h4 className="kk-serif" style={{ color: "#1c1917", fontSize: 15, fontWeight: 700, margin: 0 }}>
                    Contact Us
                  </h4>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <a href="tel:+918806807419" className="contact-link">
                    <div className="icon-ring" style={{ width: 36, height: 36, borderRadius: 10, marginTop: 2 }}>
                      <Phone size={13} style={{ color: "#B91C1C" }} strokeWidth={2} />
                    </div>
                    <div>
                      <p style={{ color: "#1c1917", fontSize: 14, fontWeight: 600, margin: 0 }}>+91 9890352455</p>
                      <p style={{ color: "#a8a29e", fontSize: 12, margin: "3px 0 0" }}>Call us anytime</p>
                    </div>
                  </a>
                  <a href="mailto:support@kitchenarykart.com" className="contact-link">
                    <div className="icon-ring" style={{ width: 36, height: 36, borderRadius: 10, marginTop: 2 }}>
                      <Mail size={13} style={{ color: "#B91C1C" }} strokeWidth={2} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: "#1c1917", fontSize: 14, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        support@kitchenarykart.com
                      </p>
                      <p style={{ color: "#a8a29e", fontSize: 12, margin: "3px 0 0" }}>Email support</p>
                    </div>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ══ Bottom bar ══════════════════════════════════════════════ */}
        <div style={{ background: "#fff", borderTop: "1px solid #f3f0ec" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div
              className="bottom-bar"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, padding: "14px 0" }}
            >
              <p style={{ color: "#a8a29e", fontSize: 13, margin: 0 }}>
                &copy; {new Date().getFullYear()}{" "}
                <span style={{ color: "#57534e", fontWeight: 500 }}>Kitchenary Kart</span>
                . All Rights Reserved.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ color: "#c4bfbc", fontSize: 12 }}>Secure payments via</span>
                <span className="pay-chip">RAZORPAY</span>
                <span className="pay-chip">UPI</span>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#e7e5e4" }} />
                <button onClick={scrollToTop} aria-label="Back to top" className="top-btn">
                  <ArrowUp size={13} strokeWidth={2.2} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </footer>
    </>
  );
};

export default Footer;