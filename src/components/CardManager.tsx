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
import { Plus, CreditCard, Edit, Trash2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const cardBrands = [
  { value: "visa", label: "Visa" },
  { value: "mastercard", label: "Mastercard" },
  { value: "amex", label: "American Express" },
  { value: "discover", label: "Discover" },
  { value: "rupay", label: "Rupay" },
  { value: "other", label: "Other" },
];

const getCardIcon = (brand: string) => {
  switch (brand) {
    case "visa":
      return "💳";
    case "mastercard":
      return "💳";
    case "amex":
      return "💳";
    case "discover":
      return "💳";
    default:
      return "💳";
  }
};

const formatCardNumber = (number: string) => {
  // Mask all but last 4 digits
  return number.replace(/\d(?=\d{4})/g, "*");
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
                />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="month"
                  value={newCard.expiryDate}
                  onChange={(e) => setNewCard({...newCard, expiryDate: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardType">Card Type</Label>
                  <Select value={newCard.cardType} onValueChange={(value) => setNewCard({...newCard, cardType: value})}>
                    <SelectTrigger>
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cardBrands.map((brand) => (
                        <SelectItem key={brand.value} value={brand.value}>
                          {brand.label}
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
          <div className="text-center py-8 text-gray-500">
            <p>No cards added yet</p>
            <p className="text-sm mt-2">Add your payment cards to track them</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profileCards.map((card) => (
              <div key={card.id} className="relative">
                {editingId === card.id ? (
                  <div className="space-y-3 p-4 border rounded-xl">
                    <div>
                      <Label htmlFor="editCardNumber">Card Number</Label>
                      <Input
                        id="editCardNumber"
                        value={editCard.cardNumber}
                        onChange={(e) => setEditCard({...editCard, cardNumber: e.target.value})}
                        placeholder="Enter card number"
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <Label htmlFor="editExpiryDate">Expiry Date</Label>
                      <Input
                        id="editExpiryDate"
                        type="month"
                        value={editCard.expiryDate}
                        onChange={(e) => setEditCard({...editCard, expiryDate: e.target.value})}
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
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-start">
                      <div className="text-2xl">
                        {getCardIcon(card.brand)}
                      </div>
                      <div className="text-xs uppercase tracking-wider">
                        {card.cardType}
                      </div>
                    </div>
                    <div className="my-6 text-xl tracking-widest font-mono">
                      {formatCardNumber(card.cardNumber)}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <div className="text-xs opacity-80">Expires</div>
                        <div>{card.expiryDate}</div>
                      </div>
                      <div className="text-sm uppercase">
                        {card.brand}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                        onClick={() => startEditing(card)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-white hover:text-white hover:bg-white/20"
                        onClick={() => deleteCard(card.id)}
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