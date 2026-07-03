"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type MemberTier = "classic" | "silver" | "gold";

export interface Member {
  name: string;
  email: string;
  tier: MemberTier;
  points: number;
  joinDate: string;
  purchases: number;
}

interface MemberContextType {
  member: Member | null;
  isLoggedIn: boolean;
  signup: (name: string, email: string) => void;
  logout: () => void;
  addPoints: (amount: number) => void;
  addPurchase: () => void;
}

const tierNames: Record<MemberTier, string> = {
  classic: "Classic",
  silver: "Silver",
  gold: "Gold",
};

const nextTier: Record<MemberTier, { tier: MemberTier; name: string; needed: string } | null> = {
  classic: { tier: "silver", name: "Silver", needed: "1 purchase" },
  silver: { tier: "gold", name: "Gold", needed: "3 purchases or $15,000+" },
  gold: null,
};

export function getTierName(tier: MemberTier) {
  return tierNames[tier];
}

export function getNextTier(tier: MemberTier) {
  return nextTier[tier];
}

const MemberContext = createContext<MemberContextType | null>(null);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);

  const signup = useCallback((name: string, email: string) => {
    const newMember: Member = {
      name,
      email,
      tier: "classic",
      points: 500,
      joinDate: new Date().toISOString().split("T")[0],
      purchases: 0,
    };
    setMember(newMember);
  }, []);

  const logout = useCallback(() => setMember(null), []);

  const addPoints = useCallback((amount: number) => {
    setMember((prev) => {
      if (!prev) return prev;
      return { ...prev, points: prev.points + amount };
    });
  }, []);

  const addPurchase = useCallback(() => {
    setMember((prev) => {
      if (!prev) return prev;
      const newPurchases = prev.purchases + 1;
      let newTier: MemberTier = prev.tier;
      if (newPurchases >= 3) newTier = "gold";
      else if (newPurchases >= 1) newTier = "silver";
      return { ...prev, purchases: newPurchases, tier: newTier };
    });
  }, []);

  return (
    <MemberContext.Provider
      value={{ member, isLoggedIn: !!member, signup, logout, addPoints, addPurchase }}
    >
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error("useMember must be inside MemberProvider");
  return ctx;
}
