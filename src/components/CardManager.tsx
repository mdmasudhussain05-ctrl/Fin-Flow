"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useProfile } from "@/context/ProfileContext";
import { Plus, CreditCard, Edit, Trash2, Banknote } from "lucide-react"; // Removed non-existent brand icons
import * as LucideIcons from "lucide-react"; // Import all Lucide icons for dynamic rendering
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const cardBrands = [
  { value: "visa", label: "Visa", icon: LucideIcons.CreditCard }, // Using generic CreditCard
  { value: "mastercard", label: "Mastercard", icon: LucideIcons.CreditCard }, // Using generic CreditCard
  { value: "amex", label: "American Express", icon: LucideIcons.CreditCard }, // Using generic CreditCard
  { value: "discover", label: "Discover", icon: LucideIcons.CreditCard }, // Using generic CreditCard
  { value: "rupay", label: "Rupay", icon: Banknote }, 
  { value: "other", label: "Other", icon: CreditCard },
];

const getCardBrandIcon = (brand: string, className?: string) => {
  const brandInfo = cardBrands.find(b => b.value === brand);
  const IconComponent = brandInfo?.icon || CreditCard;
  return <IconComponent className={className} />;
};

const formatCardNumber = (number: string) => {
  // Mask all but last 4 digits and format into blocks
  const cleaned = number.replace(/\D/g, '');
  const masked = cleaned.slice(0, -4).replace(/./g, '*') + cleaned.slice(-4);
  return masked.replace(/(.{4})/g, '$1 ').trim();
};

export function CardManager() {
  const { cards, addCard, updateCard, deleteCard, currentProfileId } = useProfile();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expiryDate: "",
    cardType: "credit",
    brand: "visa"
  });
  const [editCard, setEditCard] = useState({
    cardNumber: "",
    expiryDate: "",
    cardType: "credit",
    brand: "visa"
  });

  const profileCards = cards.filter(card => card.profileId === currentProfileId);

  const handleAddCard = () => {
    if (newCard.cardNumber && newCard.expiryDate) {
      addCard({
        ...newCard,
        profileId: currentProfileId
      });
      setNewCard({
        cardNumber: "",
        expiryDate: "",
        cardType: "credit",
        brand: "visa"
      });
      setIsAdding(false);
    }
  };

  const handleUpdateCard = (id: string) => {
    updateCard(id, editCard);
    setEditingId(null);
  };

  const startEditing = (card: any) => {
    setEditingId(card.id);
    setEditCard({
      cardNumber: card.cardNumber,
      expiryDate: card.expiryDate,
      cardType: card.cardType,
      brand: card.brand
    });
  };

  return (
    <Card className="glass-effect">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payment Cards</CardTitle>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full">
              <Plus className="h-4 w-4 mr-1" />
              Add Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Card</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value})}
                  placeholder="Enter card number"
                  maxLength={19}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="month"
                  value={newCard.expiryDate}
                  onChange={(e) => setNewCard({...newCard, expiryDate: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardType">Card Type</Label>
                  <Select value={newCard.cardType} onValueChange={(value) => setNewCard({...newCard, cardType: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Credit Card</SelectItem>
                      <SelectItem value="debit">Debit Card</SelectItem>
                      <SelectItem value="emi">EMI Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Select value={newCard.brand} onValueChange={(value) => setNewCard({...newCard, brand: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cardBrands.map((brand) => (
                        <SelectItem key={brand.value} value={brand.value}>
                          <div className="flex items-center">
                            {getCardBrandIcon(brand.value, "h-4 w-4 mr-2")}
                            {brand.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddCard}>Add Card</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {profileCards.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No cards added yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Add your payment cards to track them</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileCards.map((card) => (
              <div key={card.id} className="relative group">
                {editingId === card.id ? (
                  <div className="space-y-3 p-4 border rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div>
                      <Label htmlFor="editCardNumber">Card Number</Label>
                      <Input
                        id="editCardNumber"
                        value={editCard.cardNumber}
                        onChange={(e) => setEditCard({...editCard, cardNumber: e.target.value})}
                        placeholder="Enter card number"
                        maxLength={19}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="editExpiryDate">Expiry Date</Label>
                      <Input
                        id="editExpiryDate"
                        type="month"
                        value={editCard.expiryDate}
                        onChange={(e) => setEditCard({...editCard, expiryDate: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" onClick={() => handleUpdateCard(card.id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl transform transition-transform duration-300 hover:scale-[1.02] cursor-pointer">
                    <div className="flex justify-between items-start mb-8">
                      <div className="text-3xl">
                        {getCardBrandIcon(card.brand, "h-8 w-8")}
                      </div>
                      <div className="text-xs uppercase tracking-wider bg-white/20 px-2 py-1 rounded-full font-semibold">
                        {card.cardType}
                      </div>
                    </div>
                    <div className="my-6 text-2xl tracking-widest font-mono">
                      {formatCardNumber(card.cardNumber)}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <div className="text-xs opacity-80">Expires</div>
                        <div className="font-medium">{card.expiryDate}</div>
                      </div>
                      <div className="font-semibold uppercase">
                        {cardBrands.find(b => b.value === card.brand)?.label || card.brand}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                        onClick={(e) => { e.stopPropagation(); startEditing(card); }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-red-300 hover:text-red-100 hover:bg-white/20"
                        onClick={(e) => { e.stopPropagation(); deleteCard(card.id); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}