"use client";

interface MobileBookBarProps {
  price: number;
}

export default function MobileBookBar({ price }: MobileBookBarProps) {
  const scrollToForm = () => {
    document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mobile-book-bar">
      <div className="mobile-book-bar-price">
        <small>From</small>
        ${price.toLocaleString()}
      </div>
      <button className="mobile-book-bar-btn" onClick={scrollToForm}>
        Check availability →
      </button>
    </div>
  );
}
