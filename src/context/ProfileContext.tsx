"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Card {
  id: string;
  profileId: string;
  cardNumber: string;
  expiryDate: string;
  cardType: string;
  brand: string;
}

interface ProfileContextType {
  profiles: Profile[];
  currentProfileId: string;
  cards: Card[];
  addProfile: (profile: Omit<Profile, "id">) => string; // Fix: specify return type
  updateProfile: (id: string, profile: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  setCurrentProfileId: (id: string) => void;
  addCard: (card: Omit<Card, "id">) => void;
  updateCard: (id: string, card: Partial<Card>) => void;
  deleteCard: (id: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    const saved = localStorage.getItem("profiles");
    return saved ? JSON.parse(saved) : [
      {
        id: "1",
        name: "Default User",
        email: "user@example.com"
      }
    ];
  });

  const [currentProfileId, setCurrentProfileId] = useState<string>(() => {
    return localStorage.getItem("currentProfileId") || "1";
  });

  const [cards, setCards] = useState<Card[]>(() => {
    const saved = localStorage.getItem("cards");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("profiles", JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem("currentProfileId", currentProfileId);
  }, [currentProfileId]);

  useEffect(() => {
    localStorage.setItem("cards", JSON.stringify(cards));
  }, [cards]);

  // Profile functions
  const addProfile = (profile: Omit<Profile, "id">): string => { // Fix: specify return type
    const newProfile = {
      ...profile,
      id: Date.now().toString(),
    };
    setProfiles([...profiles, newProfile]);
    return newProfile.id; // Fix: explicitly return the id
  };

  const updateProfile = (id: string, updatedProfile: Partial<Profile>) => {
    setProfiles(
      profiles.map((profile) =>
        profile.id === id ? { ...profile, ...updatedProfile } : profile
      )
    );
  };

  const deleteProfile = (id: string) => {
    if (profiles.length <= 1) return; // Prevent deleting the last profile
    setProfiles(profiles.filter((profile) => profile.id !== id));
    if (currentProfileId === id) {
      setCurrentProfileId(profiles[0].id);
    }
  };

  // Card functions
  const addCard = (card: Omit<Card, "id">) => {
    const newCard = {
      ...card,
      id: Date.now().toString(),
    };
    setCards([...cards, newCard]);
  };

  const updateCard = (id: string, updatedCard: Partial<Card>) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, ...updatedCard } : card
      )
    );
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter((card) => card.id !== id));
  };

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        currentProfileId,
        cards,
        addProfile,
        updateProfile,
        deleteProfile,
        setCurrentProfileId,
        addCard,
        updateCard,
        deleteCard,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};