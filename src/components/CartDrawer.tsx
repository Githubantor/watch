"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/products";
import CheckoutModal from "./CheckoutModal";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (!drawerRef.current || !overlayRef.current) return;

    if (open) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        visibility: "visible",
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(drawerRef.current, {
        x: "0%",
        duration: 0.5,
        ease: "power3.out",
      });
      document.body.style.overflow = "hidden";
    } else {
      gsap.to(drawerRef.current, {
        x: "100%",
        duration: 0.4,
        ease: "power3.in",
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        delay: 0.1,
        onComplete: () => {
          if (overlayRef.current)
            overlayRef.current.style.visibility = "hidden";
        },
      });
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        ref={overlayRef}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 opacity-0 invisible backdrop-blur-sm"
      />

      <div
        ref={drawerRef}
        className="fixed top-0 right-0 z-50 h-full w-full max-w-lg translate-x-full bg-cream shadow-2xl"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="font-serif text-xl text-charcoal">Your Cart</h2>
              <p className="text-xs text-text-muted mt-0.5">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-gold hover:text-gold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="h-16 w-16 rounded-full bg-cream-dark flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <p className="font-serif text-lg text-charcoal mb-1">Your cart is empty</p>
                <p className="text-sm text-text-muted">Add some timepieces to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="group flex gap-4 rounded-sm bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-sm bg-cream-dark relative">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <h3 className="font-serif text-sm text-charcoal">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-text-muted opacity-0 transition-all duration-300 hover:text-red-500 group-hover:opacity-100"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">
                          {item.product.accent}
                        </p>
                        <p className="text-sm text-gold mt-1 font-medium">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border rounded-sm">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="px-2.5 py-1 text-xs text-text-muted transition-colors hover:text-charcoal"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-xs text-charcoal border-x border-border">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="px-2.5 py-1 text-xs text-text-muted transition-colors hover:text-charcoal"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-xs text-text-body font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border px-6 py-5 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span className="text-charcoal font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Shipping</span>
                <span className="text-text-muted">Complimentary</span>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="font-serif text-base text-charcoal">Total</span>
                <span className="font-serif text-lg text-gold">{formatPrice(totalPrice)}</span>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full border border-gold bg-gold px-6 py-3.5 text-xs tracking-[0.2em] uppercase text-charcoal transition-all duration-500 hover:bg-transparent hover:text-gold"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setShowCheckout(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
