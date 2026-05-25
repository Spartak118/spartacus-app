import type { Meal } from '@/types'

export const MEALS: Meal[] = [
  {
    id: 'm1', name: 'Chicken & Rice Bowl', calories: 520, protein: 45, carbs: 55, fat: 8,
    servingSize: '400g', category: 'High Protein', prepTime: 20, emoji: '🍗',
    description: 'Classic bodybuilder meal. Brown rice, grilled chicken breast, steamed broccoli.'
  },
  {
    id: 'm2', name: 'Greek Yogurt Protein Bowl', calories: 280, protein: 30, carbs: 28, fat: 4,
    servingSize: '350g', category: 'High Protein', prepTime: 5, emoji: '🥣',
    description: 'Full-fat Greek yogurt with berries, granola, and honey.'
  },
  {
    id: 'm3', name: 'Egg White Omelette', calories: 220, protein: 28, carbs: 5, fat: 8,
    servingSize: '300g', category: 'High Protein', prepTime: 10, emoji: '🍳',
    description: '6 egg whites, spinach, feta cheese, bell peppers.'
  },
  {
    id: 'm4', name: 'Salmon & Asparagus', calories: 450, protein: 42, carbs: 12, fat: 24,
    servingSize: '380g', category: 'High Protein', prepTime: 25, emoji: '🐟',
    description: 'Atlantic salmon fillet with roasted asparagus and lemon.'
  },
  {
    id: 'm5', name: 'Steak & Sweet Potato', calories: 620, protein: 48, carbs: 52, fat: 18,
    servingSize: '450g', category: 'High Protein', prepTime: 30, emoji: '🥩',
    description: 'Lean sirloin steak with baked sweet potato and green beans.'
  },
  {
    id: 'm6', name: 'Tuna Salad Wrap', calories: 380, protein: 38, carbs: 32, fat: 10,
    servingSize: '320g', category: 'High Protein', prepTime: 8, emoji: '🌯',
    description: 'Canned tuna, light mayo, celery, whole wheat wrap.'
  },
  {
    id: 'm7', name: 'Cottage Cheese & Fruit', calories: 240, protein: 25, carbs: 24, fat: 4,
    servingSize: '280g', category: 'High Protein', prepTime: 3, emoji: '🧀',
    description: 'Low-fat cottage cheese with pineapple chunks and walnuts.'
  },
  {
    id: 'm8', name: 'Turkey Meatballs', calories: 380, protein: 40, carbs: 18, fat: 14,
    servingSize: '350g', category: 'High Protein', prepTime: 30, emoji: '🍖',
    description: 'Lean turkey meatballs with marinara sauce and zucchini noodles.'
  },
  // Cutting meals
  {
    id: 'm9', name: 'Shrimp Stir Fry', calories: 290, protein: 35, carbs: 22, fat: 6,
    servingSize: '350g', category: 'Cutting', prepTime: 15, emoji: '🍤',
    description: 'Shrimp with vegetables in low-sodium soy sauce over cauliflower rice.'
  },
  {
    id: 'm10', name: 'Zero Carb Beef Bowl', calories: 320, protein: 38, carbs: 4, fat: 16,
    servingSize: '300g', category: 'Cutting', prepTime: 20, emoji: '🥗',
    description: 'Ground beef 90/10, avocado, sour cream, lettuce wrap.'
  },
  {
    id: 'm11', name: 'Chicken Caesar Salad', calories: 340, protein: 36, carbs: 14, fat: 16,
    servingSize: '380g', category: 'Cutting', prepTime: 10, emoji: '🥗',
    description: 'Grilled chicken, romaine, light Caesar dressing, no croutons.'
  },
  {
    id: 'm12', name: 'Baked Cod & Veggies', calories: 260, protein: 32, carbs: 16, fat: 6,
    servingSize: '330g', category: 'Cutting', prepTime: 25, emoji: '🐠',
    description: 'Baked cod fillet with roasted bell peppers and zucchini.'
  },
  {
    id: 'm13', name: 'Protein Smoothie', calories: 280, protein: 35, carbs: 28, fat: 4,
    servingSize: '500ml', category: 'Cutting', prepTime: 3, emoji: '🥤',
    description: 'Whey protein, almond milk, spinach, banana, ice.'
  },
  // Bulking meals
  {
    id: 'm14', name: 'Mass Gainer Bowl', calories: 850, protein: 52, carbs: 108, fat: 22,
    servingSize: '600g', category: 'Bulking', prepTime: 25, emoji: '💪',
    description: 'Beef, white rice, whole eggs, olive oil. Pure mass.'
  },
  {
    id: 'm15', name: 'Pasta & Chicken', calories: 720, protein: 48, carbs: 92, fat: 12,
    servingSize: '520g', category: 'Bulking', prepTime: 25, emoji: '🍝',
    description: 'Whole grain pasta with grilled chicken in tomato sauce.'
  },
  {
    id: 'm16', name: 'Peanut Butter Oatmeal', calories: 580, protein: 22, carbs: 75, fat: 22,
    servingSize: '350g', category: 'Bulking', prepTime: 10, emoji: '🥜',
    description: 'Oats with 2 tbsp peanut butter, banana, honey, whey protein.'
  },
  {
    id: 'm17', name: 'Chicken Burrito Bowl', calories: 780, protein: 52, carbs: 88, fat: 18,
    servingSize: '580g', category: 'Bulking', prepTime: 20, emoji: '🌯',
    description: 'Chicken, brown rice, black beans, avocado, salsa, cheese.'
  },
  // Quick prep meals
  {
    id: 'm18', name: 'Scrambled Eggs Toast', calories: 380, protein: 24, carbs: 30, fat: 16,
    servingSize: '300g', category: 'Quick', prepTime: 8, emoji: '🍞',
    description: 'Whole grain toast, scrambled eggs with butter, avocado.'
  },
  {
    id: 'm19', name: 'Protein Bar & Apple', calories: 320, protein: 22, carbs: 42, fat: 8,
    servingSize: '250g', category: 'Quick', prepTime: 1, emoji: '🍎',
    description: 'High-protein bar with a medium apple.'
  },
  {
    id: 'm20', name: 'Deli Turkey Roll-Ups', calories: 240, protein: 28, carbs: 8, fat: 10,
    servingSize: '200g', category: 'Quick', prepTime: 5, emoji: '🥙',
    description: 'Deli turkey, string cheese, mustard, rolled in lettuce wraps.'
  },
  {
    id: 'm21', name: 'Sardines & Crackers', calories: 320, protein: 32, carbs: 22, fat: 12,
    servingSize: '220g', category: 'Quick', prepTime: 2, emoji: '🐟',
    description: 'Sardines in olive oil on whole grain crackers with hot sauce.'
  },
  {
    id: 'm22', name: 'Overnight Oats', calories: 420, protein: 28, carbs: 56, fat: 8,
    servingSize: '380g', category: 'Quick', prepTime: 5, emoji: '🌾',
    description: 'Oats, protein powder, chia seeds, almond milk. Prep night before.'
  },
  {
    id: 'm23', name: 'Edamame & Tuna', calories: 290, protein: 36, carbs: 20, fat: 6,
    servingSize: '280g', category: 'Quick', prepTime: 5, emoji: '🫘',
    description: 'Canned tuna over edamame with sesame oil and soy sauce.'
  },
  {
    id: 'm24', name: 'Skyr Protein Parfait', calories: 260, protein: 32, carbs: 26, fat: 2,
    servingSize: '300g', category: 'High Protein', prepTime: 4, emoji: '🫐',
    description: 'Icelandic skyr layered with berries and granola.'
  },
]

export function getMealsByCategory(category: string): Meal[] {
  if (category === 'All') return MEALS
  return MEALS.filter(m => m.category === category)
}

export const MEAL_CATEGORIES = ['All', 'High Protein', 'Cutting', 'Bulking', 'Quick']

export function searchMeals(query: string): Meal[] {
  const q = query.toLowerCase()
  return MEALS.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.description?.toLowerCase().includes(q) ||
    m.category.toLowerCase().includes(q)
  )
}

export interface MacroSummary {
  calories: { current: number; goal: number }
  protein: { current: number; goal: number }
  carbs: { current: number; goal: number }
  fat: { current: number; goal: number }
  water: { current: number; goal: number }
}

export function calculateMacroTotals(meals: Array<{ calories: number; protein: number; carbs: number; fat: number }>): {
  calories: number; protein: number; carbs: number; fat: number
} {
  return meals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })
}

export function getMacroRatio(protein: number, carbs: number, fat: number): { protein: number; carbs: number; fat: number } {
  const totalCalories = (protein * 4) + (carbs * 4) + (fat * 9)
  if (totalCalories === 0) return { protein: 33, carbs: 34, fat: 33 }
  return {
    protein: Math.round((protein * 4 / totalCalories) * 100),
    carbs: Math.round((carbs * 4 / totalCalories) * 100),
    fat: Math.round((fat * 9 / totalCalories) * 100),
  }
}

export const SAMPLE_NUTRITION_DATA = Array.from({ length: 30 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (29 - i))
  return {
    date: date.toISOString().split('T')[0],
    calories: 1800 + Math.floor(Math.random() * 600) - 200,
    protein: 150 + Math.floor(Math.random() * 50) - 20,
    carbs: 180 + Math.floor(Math.random() * 80) - 30,
    fat: 60 + Math.floor(Math.random() * 30) - 10,
  }
})

export const WATER_GLASS_ML = 250

export function cupsToLiters(cups: number): number {
  return Math.round((cups * WATER_GLASS_ML / 1000) * 10) / 10
}

export function litersToCups(liters: number): number {
  return Math.round((liters * 1000) / WATER_GLASS_ML)
}
