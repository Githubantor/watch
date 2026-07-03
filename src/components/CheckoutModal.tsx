"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";

interface CheckoutModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CheckoutModal({ onClose, onSuccess }: CheckoutModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<"form" | "confirming" | "success">("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zip: "",
  });

  useEffect(() => {
    if (overlayRef.current && modalRef.current) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("confirming");
    setTimeout(() => {
      clearCart();
      setStep("success");
    }, 2000);
  };

  const handleFinish = () => {
    onSuccess?.();
    handleClose();
  };

  const handleClose = () => {
    if (overlayRef.current && modalRef.current) {
      gsap.to(modalRef.current, {
        opacity: 0,
        y: 20,
        scale: 0.97,
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  const inputClass =
    "w-full border border-border bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors duration-300 placeholder:text-text-muted/50 focus:border-gold";

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-cream shadow-2xl"
      >
        {step === "success" ? (
          <div className="flex flex-col items-center justify-center px-10 py-20 text-center">
            <div className="mb-6 h-20 w-20 rounded-full bg-gold/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl text-charcoal mb-3">Order Confirmed</h2>
            <p className="text-text-body/70 mb-2 max-w-sm">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <p className="text-xs text-text-muted mb-8">
              A confirmation email will be sent to {formData.email}
            </p>
            <button
              onClick={handleFinish}
              className="border border-gold bg-gold px-8 py-3 text-xs tracking-[0.2em] uppercase text-charcoal transition-all duration-500 hover:bg-transparent hover:text-gold"
            >
              Continue Shopping
            </button>
          </div>
        ) : step === "confirming" ? (
          <div className="flex flex-col items-center justify-center px-10 py-20 text-center">
            <div className="mb-6 h-12 w-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
            <h2 className="font-serif text-2xl text-charcoal mb-2">Processing Order</h2>
            <p className="text-text-muted text-sm">Please wait while we confirm your purchase...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-border px-8 py-5">
              <h2 className="font-serif text-xl text-charcoal">Checkout</h2>
              <button
                onClick={handleClose}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-gold hover:text-gold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase text-gold mb-4">Contact Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase text-gold mb-4">Shipping Address</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Street Address"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="City"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="ZIP / Postal Code"
                    required
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className={inputClass}
                  />
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Country"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-5">
                <div className="space-y-2 mb-5">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between text-sm">
                      <span className="text-text-body">
                        {item.product.name} <span className="text-text-muted">×{item.quantity}</span>
                      </span>
                      <span className="text-charcoal">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 mb-6">
                  <span className="font-serif text-base text-charcoal">Total</span>
                  <span className="font-serif text-lg text-gold">{formatPrice(totalPrice)}</span>
                </div>
                <button
                  type="submit"
                  className="w-full bg-charcoal px-6 py-3.5 text-xs tracking-[0.2em] uppercase text-cream transition-all duration-500 hover:bg-gold hover:text-charcoal"
                >
                  Place Order
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
