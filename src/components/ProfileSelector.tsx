"use client";

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useProfile } from "@/context/ProfileContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileSelector() {
  const { profiles, currentProfileId, setCurrentProfileId, addProfile } = useProfile();
  const [isAdding, setIsAdding] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileEmail, setNewProfileEmail] = useState("");

  const currentProfile = profiles.find(p => p.id === currentProfileId);

  const handleAddProfile = () => {
    if (newProfileName && newProfileEmail) {
      const newId = addProfile({
        name: newProfileName,
        email: newProfileEmail
      });
      setCurrentProfileId(newId || ""); // Fix: handle potential void return
      setNewProfileName("");
      setNewProfileEmail("");
      setIsAdding(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={currentProfileId} onValueChange={setCurrentProfileId}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select profile" />
        </SelectTrigger>
        <SelectContent>
          {profiles.map((profile) => (
            <SelectItem key={profile.id} value={profile.id}>
              {profile.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogTrigger asChild>
          <Button size="icon" variant="ghost">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Enter name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newProfileEmail}
                onChange={(e) => setNewProfileEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <Button onClick={handleAddProfile}>Add Profile</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}