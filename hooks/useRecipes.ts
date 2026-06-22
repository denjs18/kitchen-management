import { useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, query, orderBy, getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Recipe, RecipeWithScore, InventoryItem, RecipeCategory } from '@/lib/types';
import { DEFAULT_RECIPES } from '@/lib/recipeDatabase';

export function useRecipes(inventory: InventoryItem[]) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'recipes'), orderBy('name'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Recipe));
      setRecipes(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  // Seeding incrémental : ajoute uniquement les recettes par défaut absentes de Firestore
  const seedDefaultRecipes = async () => {
    if (seeded) return;
    setSeeded(true);
    const snap = await getDocs(collection(db, 'recipes'));
    const existingNames = new Set(snap.docs.map(d => (d.data().name as string).toLowerCase()));
    const missing = DEFAULT_RECIPES.filter(r => !existingNames.has(r.name.toLowerCase()));
    if (missing.length > 0) {
      await Promise.all(missing.map(r => addDoc(collection(db, 'recipes'), r)));
    }
  };

  const addRecipe = async (recipe: Omit<Recipe, 'id'>) => {
    await addDoc(collection(db, 'recipes'), recipe);
  };

  const updateRecipe = async (id: string, recipe: Partial<Recipe>) => {
    await updateDoc(doc(db, 'recipes', id), recipe as Record<string, unknown>);
  };

  const deleteRecipe = async (id: string) => {
    await deleteDoc(doc(db, 'recipes', id));
  };

  const getMatchedRecipes = (category?: RecipeCategory): RecipeWithScore[] => {
    const filtered = category ? recipes.filter(r => r.category === category) : recipes;
    return filtered
      .map(recipe => {
        const available: string[] = [];
        const missing: string[] = [];
        recipe.ingredients.forEach(ing => {
          const inStock = inventory.find(
            i => i.foodId === ing.foodId && i.quantity >= ing.quantity
          );
          inStock ? available.push(ing.foodName) : missing.push(ing.foodName);
        });
        const matchScore = recipe.ingredients.length > 0
          ? available.length / recipe.ingredients.length : 0;
        return { ...recipe, matchScore, availableIngredients: available, missingIngredients: missing };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  };

  return { recipes, loading, addRecipe, updateRecipe, deleteRecipe, getMatchedRecipes, seedDefaultRecipes };
}
