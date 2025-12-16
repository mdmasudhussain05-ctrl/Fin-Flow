"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinance } from "@/context/FinanceContext";
import { Category } from "@/context/FinanceContext";
import { Plus, Edit, Trash2, Save, X, Tag } from "lucide-react";

const CategoryManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", color: "bg-blue-500" });
  const [editCategory, setEditCategory] = useState({ name: "", color: "" });

  const colorOptions = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      addCategory({ ...newCategory, icon: "Tag" });
      setNewCategory({ name: "", color: "bg-blue-500" });
      setIsAdding(false);
    }
  };

  const handleUpdateCategory = (id: string) => {
    if (editCategory.name.trim()) {
      updateCategory(id, { name: editCategory.name, color: editCategory.color });
      setEditingId(null);
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditCategory({ name: category.name, color: category.color });
  };

  return (
    <Card className="glass-effect">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categories</CardTitle>
        <Button 
          size="sm" 
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-full"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        {isAdding && (
          <div className="mb-6 p-4 border border-dashed rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Enter category name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full ${color} ${newCategory.color === color ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-600' : ''}`}
                      onClick={() => setNewCategory({...newCategory, color})}
                      aria-label={`Select ${color} color`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={handleAddCategory}>
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(false)}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="border rounded-xl p-3 flex flex-col items-center bg-white dark:bg-gray-800/50 hover:shadow-md transition-shadow"
            >
              {editingId === category.id ? (
                <div className="w-full">
                  <Input
                    value={editCategory.name}
                    onChange={(e) => setEditCategory({...editCategory, name: e.target.value})}
                    className="mb-2 text-center"
                  />
                  <div className="flex flex-wrap gap-1 justify-center mb-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        className={`w-5 h-5 rounded-full ${color} ${editCategory.color === color ? 'ring-1 ring-offset-1 ring-gray-400 dark:ring-gray-600' : ''}`}
                        onClick={() => setEditCategory({...editCategory, color})}
                        aria-label={`Select ${color} color`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6"
                      onClick={() => handleUpdateCategory(category.id)}
                    >
                      <Save className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mb-2`}>
                    <span className="text-white text-lg font-bold">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-center text-gray-900 dark:text-white">{category.name}</p>
                  <div className="flex gap-1 mt-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6"
                      onClick={() => startEditing(category)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => deleteCategory(category.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;