import React, { useEffect, useMemo, useState } from "react";
import {
  Home,
  Utensils,
  BookOpen,
  ChefHat,
  BarChart3,
  Settings,
  Search,
  Plus,
  Trash2,
  Save,
  Wifi,
  SlidersHorizontal,
  X,
} from "lucide-react";
import "./App.css";

const STORAGE_KEY = "lazy_food_tracker_v5";
const appName = "Lazy Food Tracker";

const builtInFoods = [
  { id: 1, name: "Chicken breast, cooked", category: "Meat", serving: 100, unit: "g", kcal: 165, protein: 31, carbs: 0, fat: 3.6, salt: 0.19 },
  { id: 2, name: "Egg, whole", category: "Eggs", serving: 1, unit: "egg", kcal: 72, protein: 6.3, carbs: 0.4, fat: 4.8, salt: 0.18 },
  { id: 3, name: "Greek yogurt 2%", category: "Dairy", serving: 100, unit: "g", kcal: 73, protein: 9.7, carbs: 3.9, fat: 2, salt: 0.1 },
  { id: 4, name: "Cheddar slice", category: "Dairy", serving: 1, unit: "slice", kcal: 80, protein: 5, carbs: 0.4, fat: 6.6, salt: 0.36 },
  { id: 5, name: "White bread", category: "Bakery", serving: 1, unit: "slice", kcal: 80, protein: 2.7, carbs: 14.7, fat: 1, salt: 0.37 },
  { id: 6, name: "Rice, cooked", category: "Carbs", serving: 100, unit: "g", kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, salt: 0.01 },
  { id: 7, name: "Potato, boiled", category: "Carbs", serving: 100, unit: "g", kcal: 87, protein: 1.9, carbs: 20.1, fat: 0.1, salt: 0.01 },
  { id: 8, name: "Oats", category: "Breakfast", serving: 100, unit: "g", kcal: 389, protein: 16.9, carbs: 66.3, fat: 6.9, salt: 0.01 },
  { id: 9, name: "Banana", category: "Fruit", serving: 1, unit: "medium", kcal: 105, protein: 1.3, carbs: 27, fat: 0.4, salt: 0.01 },
  { id: 10, name: "Apple", category: "Fruit", serving: 1, unit: "medium", kcal: 95, protein: 0.5, carbs: 25, fat: 0.3, salt: 0.01 },
  { id: 11, name: "Tuna in water", category: "Fish", serving: 100, unit: "g", kcal: 116, protein: 26, carbs: 0, fat: 1, salt: 0.9 },
  { id: 12, name: "Whey protein", category: "Supplement", serving: 30, unit: "g scoop", kcal: 120, protein: 24, carbs: 3, fat: 1.5, salt: 0.2 },

  { id: 100, name: "Burek with meat", category: "Balkan", serving: 100, unit: "g", kcal: 280, protein: 10, carbs: 30, fat: 13, salt: 1.1 },
  { id: 101, name: "Sirnica / cheese pie", category: "Balkan", serving: 100, unit: "g", kcal: 270, protein: 11, carbs: 29, fat: 12, salt: 1.2 },
  { id: 102, name: "Zeljanica", category: "Balkan", serving: 100, unit: "g", kcal: 230, protein: 8, carbs: 28, fat: 9, salt: 1.1 },
  { id: 103, name: "Krompiruša", category: "Balkan", serving: 100, unit: "g", kcal: 240, protein: 5, carbs: 36, fat: 8, salt: 1.1 },
  { id: 104, name: "Ćevapi", category: "Balkan", serving: 100, unit: "g", kcal: 290, protein: 17, carbs: 3, fat: 23, salt: 1.4 },
  { id: 105, name: "Lepinja / somun", category: "Balkan", serving: 100, unit: "g", kcal: 270, protein: 8, carbs: 52, fat: 3, salt: 1.1 },
  { id: 106, name: "Pljeskavica", category: "Balkan", serving: 100, unit: "g", kcal: 280, protein: 17, carbs: 4, fat: 22, salt: 1.3 },
  { id: 107, name: "Sudžukice", category: "Balkan", serving: 100, unit: "g", kcal: 320, protein: 16, carbs: 2, fat: 28, salt: 1.8 },
  { id: 108, name: "Sarma", category: "Balkan", serving: 100, unit: "g", kcal: 150, protein: 7, carbs: 10, fat: 9, salt: 1.1 },
  { id: 109, name: "Punjena paprika", category: "Balkan", serving: 100, unit: "g", kcal: 135, protein: 6, carbs: 11, fat: 7, salt: 0.9 },
  { id: 110, name: "Grah / pasulj cooked", category: "Balkan", serving: 100, unit: "g", kcal: 120, protein: 7, carbs: 18, fat: 2, salt: 0.8 },
  { id: 111, name: "Sataraš", category: "Balkan", serving: 100, unit: "g", kcal: 75, protein: 2, carbs: 8, fat: 4, salt: 0.5 },
  { id: 112, name: "Ajvar", category: "Balkan", serving: 100, unit: "g", kcal: 120, protein: 2, carbs: 9, fat: 8, salt: 1.2 },
  { id: 113, name: "Kajmak", category: "Dairy Balkan", serving: 100, unit: "g", kcal: 420, protein: 7, carbs: 3, fat: 42, salt: 0.9 },
  { id: 114, name: "Pavlaka / sour cream", category: "Dairy Balkan", serving: 100, unit: "g", kcal: 200, protein: 3, carbs: 4, fat: 20, salt: 0.15 },
  { id: 115, name: "Mladi sir", category: "Dairy Balkan", serving: 100, unit: "g", kcal: 170, protein: 14, carbs: 3, fat: 11, salt: 0.8 },
  { id: 116, name: "Feta / bijeli sir", category: "Dairy Balkan", serving: 100, unit: "g", kcal: 265, protein: 14, carbs: 4, fat: 21, salt: 2.8 },
  { id: 117, name: "Jogurt plain", category: "Dairy Balkan", serving: 100, unit: "ml", kcal: 60, protein: 3.5, carbs: 4.5, fat: 3, salt: 0.12 },
  { id: 118, name: "Kefir", category: "Dairy Balkan", serving: 100, unit: "ml", kcal: 55, protein: 3.4, carbs: 4.6, fat: 2.5, salt: 0.12 },
  { id: 119, name: "Domaći hljeb", category: "Bakery Balkan", serving: 100, unit: "g", kcal: 260, protein: 8, carbs: 50, fat: 3, salt: 1.2 },
  { id: 120, name: "Pečeno pile", category: "Balkan", serving: 100, unit: "g", kcal: 210, protein: 27, carbs: 0, fat: 11, salt: 0.7 },
  { id: 121, name: "Svinjski vrat grilled", category: "Balkan", serving: 100, unit: "g", kcal: 310, protein: 23, carbs: 0, fat: 24, salt: 0.8 },
  { id: 122, name: "Kobasica", category: "Balkan", serving: 100, unit: "g", kcal: 330, protein: 15, carbs: 3, fat: 29, salt: 2 },
  { id: 123, name: "Pire krompir", category: "Balkan side", serving: 100, unit: "g", kcal: 110, protein: 2, carbs: 17, fat: 4, salt: 0.5 },
  { id: 124, name: "Pomfrit", category: "Fast food", serving: 100, unit: "g", kcal: 312, protein: 3.4, carbs: 41, fat: 15, salt: 0.6 },
  { id: 125, name: "Eurocrem style spread", category: "Sweet Balkan", serving: 100, unit: "g", kcal: 540, protein: 6, carbs: 58, fat: 31, salt: 0.2 },
  { id: 126, name: "Palačinka plain", category: "Sweet Balkan", serving: 1, unit: "piece", kcal: 120, protein: 4, carbs: 18, fat: 4, salt: 0.25 },
  { id: 127, name: "Palačinka with eurocrem", category: "Sweet Balkan", serving: 1, unit: "piece", kcal: 320, protein: 7, carbs: 45, fat: 13, salt: 0.35 },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function round(n, digits = 1) {
  return Math.round(Number(n || 0) * Math.pow(10, digits)) / Math.pow(10, digits);
}

function scaleFood(food, amount) {
  const factor = Number(amount || 0) / Number(food.serving || 100);

  return {
    kcal: Number(food.kcal || 0) * factor,
    protein: Number(food.protein || 0) * factor,
    carbs: Number(food.carbs || 0) * factor,
    fat: Number(food.fat || 0) * factor,
    salt: Number(food.salt || 0) * factor,
  };
}

function getTotals(entries) {
  return entries.reduce(
    (acc, entry) => {
      acc.kcal += Number(entry.kcal || 0);
      acc.protein += Number(entry.protein || 0);
      acc.carbs += Number(entry.carbs || 0);
      acc.fat += Number(entry.fat || 0);
      acc.salt += Number(entry.salt || 0);
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0, salt: 0 }
  );
}

function calculateRecipeTotals(items) {
  return items.reduce(
    (acc, item) => {
      const scaled = scaleFood(item.food, item.amount);
      acc.kcal += scaled.kcal;
      acc.protein += scaled.protein;
      acc.carbs += scaled.carbs;
      acc.fat += scaled.fat;
      acc.salt += scaled.salt;
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0, salt: 0 }
  );
}

function normalizeOnlineProduct(product) {
  const nutriments = product.nutriments || {};

  return {
    id: `off-${product.code || crypto.randomUUID()}`,
    name: product.product_name || product.generic_name || "Unnamed product",
    brand: product.brands || "Open Food Facts",
    category: "Online product",
    serving: 100,
    unit: "g",
    kcal: Number(nutriments["energy-kcal_100g"] || nutriments["energy-kcal"] || 0),
    protein: Number(nutriments.proteins_100g || 0),
    carbs: Number(nutriments.carbohydrates_100g || 0),
    fat: Number(nutriments.fat_100g || 0),
    salt: Number(nutriments.salt_100g || 0),
    barcode: product.code || "",
    image: product.image_front_small_url || product.image_small_url || "",
    custom: true,
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [date, setDate] = useState(todayKey());

  const [entriesByDate, setEntriesByDate] = useState({});
  const [customFoods, setCustomFoods] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const [databaseSearch, setDatabaseSearch] = useState("");
  const [logFoodSearch, setLogFoodSearch] = useState("");
  const [recipeFoodSearch, setRecipeFoodSearch] = useState("");

  const [onlineSearch, setOnlineSearch] = useState("");
  const [onlineResults, setOnlineResults] = useState([]);
  const [onlineLoading, setOnlineLoading] = useState(false);
  const [onlineError, setOnlineError] = useState("");

  const [meal, setMeal] = useState("Breakfast");
  const [selectedFoodId, setSelectedFoodId] = useState(builtInFoods[0].id);
  const [amount, setAmount] = useState(100);

  const [showMacroEditor, setShowMacroEditor] = useState(false);
  const [editedMacros, setEditedMacros] = useState({ kcal: 0, protein: 0, carbs: 0, fat: 0, salt: 0 });

  const [newFood, setNewFood] = useState({
    name: "",
    category: "Custom",
    serving: 100,
    unit: "g",
    kcal: "",
    protein: "",
    carbs: "",
    fat: "",
    salt: "",
  });

  const [recipeName, setRecipeName] = useState("");
  const [recipeSelectedFoodId, setRecipeSelectedFoodId] = useState(builtInFoods[0].id);
  const [recipeAmount, setRecipeAmount] = useState(100);
  const [recipeBuilderItems, setRecipeBuilderItems] = useState([]);

  const [activeRecipeId, setActiveRecipeId] = useState("");
  const [recipeDraftItems, setRecipeDraftItems] = useState([]);
  const [adjustedRecipeName, setAdjustedRecipeName] = useState("");

  const [goals, setGoals] = useState({
    kcal: 2200,
    protein: 160,
    carbs: 220,
    fat: 70,
    salt: 5,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const data = JSON.parse(saved);
        setEntriesByDate(data.entriesByDate || {});
        setCustomFoods(data.customFoods || []);
        setRecipes(data.recipes || []);
        setGoals(data.goals || goals);
      } catch {
        console.log("Could not load saved data.");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        entriesByDate,
        customFoods,
        recipes,
        goals,
      })
    );
  }, [entriesByDate, customFoods, recipes, goals]);

  const allFoods = useMemo(() => [...builtInFoods, ...customFoods], [customFoods]);

  const selectedFood =
    allFoods.find((food) => String(food.id) === String(selectedFoodId)) || allFoods[0];

  const selectedRecipeFood =
    allFoods.find((food) => String(food.id) === String(recipeSelectedFoodId)) || allFoods[0];

  const calculatedMacros = useMemo(() => scaleFood(selectedFood, amount), [selectedFood, amount]);

  useEffect(() => {
    setEditedMacros({
      kcal: round(calculatedMacros.kcal, 0),
      protein: round(calculatedMacros.protein),
      carbs: round(calculatedMacros.carbs),
      fat: round(calculatedMacros.fat),
      salt: round(calculatedMacros.salt, 2),
    });
  }, [calculatedMacros]);

  const entries = entriesByDate[date] || [];
  const totals = getTotals(entries);

  const filteredDatabaseFoods = useMemo(() => {
    const q = databaseSearch.toLowerCase().trim();

    return allFoods.filter(
      (food) =>
        food.name.toLowerCase().includes(q) ||
        food.category.toLowerCase().includes(q) ||
        (food.brand || "").toLowerCase().includes(q)
    );
  }, [databaseSearch, allFoods]);

  const filteredLogFoods = useMemo(() => {
    const q = logFoodSearch.toLowerCase().trim();

    return allFoods.filter(
      (food) =>
        food.name.toLowerCase().includes(q) ||
        food.category.toLowerCase().includes(q) ||
        (food.brand || "").toLowerCase().includes(q)
    );
  }, [logFoodSearch, allFoods]);

  const filteredRecipeFoods = useMemo(() => {
    const q = recipeFoodSearch.toLowerCase().trim();

    return allFoods.filter(
      (food) =>
        food.name.toLowerCase().includes(q) ||
        food.category.toLowerCase().includes(q) ||
        (food.brand || "").toLowerCase().includes(q)
    );
  }, [recipeFoodSearch, allFoods]);

  const last7Days = useMemo(() => {
    return [...Array(7)]
      .map((_, index) => {
        const d = new Date();
        d.setDate(d.getDate() - index);
        const key = d.toISOString().slice(0, 10);
        const dayEntries = entriesByDate[key] || [];

        return {
          date: key,
          totals: getTotals(dayEntries),
          entries: dayEntries,
        };
      })
      .reverse();
  }, [entriesByDate]);

  const weeklyAverage = last7Days.reduce((sum, day) => sum + day.totals.kcal, 0) / 7;

  const recipeBuilderTotals = calculateRecipeTotals(recipeBuilderItems);
  const recipeDraftTotals = calculateRecipeTotals(recipeDraftItems);

  function addFoodToLog(food = selectedFood, customAmount = amount, overrideMacros = null) {
    if (!food) return;

    const nutrition = overrideMacros || scaleFood(food, customAmount);

    const newEntry = {
      id: crypto.randomUUID(),
      name: food.name,
      category: food.category,
      brand: food.brand || "",
      meal,
      amount: Number(customAmount),
      unit: food.unit,
      kcal: Number(nutrition.kcal || 0),
      protein: Number(nutrition.protein || 0),
      carbs: Number(nutrition.carbs || 0),
      fat: Number(nutrition.fat || 0),
      salt: Number(nutrition.salt || 0),
      adjusted: Boolean(overrideMacros),
    };

    setEntriesByDate((prev) => ({
      ...prev,
      [date]: [...(prev[date] || []), newEntry],
    }));

    setShowMacroEditor(false);
    setActiveTab("dashboard");
  }

  function addSelectedFoodToLog() {
    if (showMacroEditor) {
      addFoodToLog(selectedFood, amount, editedMacros);
    } else {
      addFoodToLog(selectedFood, amount);
    }
  }

  function deleteEntry(id) {
    setEntriesByDate((prev) => ({
      ...prev,
      [date]: (prev[date] || []).filter((entry) => entry.id !== id),
    }));
  }

  function saveFoodToMyFoods(food) {
    const alreadyExists = customFoods.some(
      (item) => String(item.id) === String(food.id) || (food.barcode && item.barcode === food.barcode)
    );

    if (alreadyExists) {
      alert("This food is already saved.");
      return;
    }

    setCustomFoods((prev) => [...prev, food]);
    setSelectedFoodId(food.id);
    setAmount(food.serving);
    alert("Saved to My Foods.");
  }

  function addCustomFood() {
    if (!newFood.name.trim()) {
      alert("Food name is required.");
      return;
    }

    const foodToAdd = {
      id: `custom-${crypto.randomUUID()}`,
      name: newFood.name.trim(),
      category: newFood.category.trim() || "Custom",
      serving: Number(newFood.serving || 100),
      unit: newFood.unit.trim() || "g",
      kcal: Number(newFood.kcal || 0),
      protein: Number(newFood.protein || 0),
      carbs: Number(newFood.carbs || 0),
      fat: Number(newFood.fat || 0),
      salt: Number(newFood.salt || 0),
      custom: true,
    };

    saveFoodToMyFoods(foodToAdd);

    setNewFood({
      name: "",
      category: "Custom",
      serving: 100,
      unit: "g",
      kcal: "",
      protein: "",
      carbs: "",
      fat: "",
      salt: "",
    });
  }

  function deleteCustomFood(id) {
    setCustomFoods((prev) => prev.filter((food) => food.id !== id));
  }

  async function searchOnlineFoods() {
    if (!onlineSearch.trim()) {
      alert("Type a food name first.");
      return;
    }

    setOnlineLoading(true);
    setOnlineError("");
    setOnlineResults([]);

    try {
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        onlineSearch
      )}&search_simple=1&action=process&json=1&page_size=20&fields=code,product_name,generic_name,brands,nutriments,image_front_small_url,image_small_url`;

      const response = await fetch(url);
      const data = await response.json();

      const products = (data.products || [])
        .map(normalizeOnlineProduct)
        .filter((food) => food.name && food.kcal > 0);

      setOnlineResults(products);

      if (products.length === 0) {
        setOnlineError("No useful products found. Try another name or add it manually.");
      }
    } catch {
      setOnlineError("Online search failed. Check internet or try again.");
    } finally {
      setOnlineLoading(false);
    }
  }

  function addItemToRecipeBuilder() {
    if (!selectedRecipeFood) return;

    const item = {
      id: crypto.randomUUID(),
      food: selectedRecipeFood,
      amount: Number(recipeAmount || selectedRecipeFood.serving),
    };

    setRecipeBuilderItems((prev) => [...prev, item]);
  }

  function removeRecipeBuilderItem(id) {
    setRecipeBuilderItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateRecipeBuilderAmount(id, value) {
    setRecipeBuilderItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount: Number(value || 0) } : item
      )
    );
  }

  function saveRecipe() {
    if (!recipeName.trim()) {
      alert("Recipe name is required.");
      return;
    }

    if (recipeBuilderItems.length === 0) {
      alert("Add at least one food to the recipe.");
      return;
    }

    const recipe = {
      id: `recipe-${crypto.randomUUID()}`,
      name: recipeName.trim(),
      items: recipeBuilderItems,
      createdAt: new Date().toISOString(),
    };

    setRecipes((prev) => [...prev, recipe]);
    setRecipeName("");
    setRecipeBuilderItems([]);
    alert("Recipe saved.");
  }

  function deleteRecipe(id) {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));

    if (activeRecipeId === id) {
      setActiveRecipeId("");
      setRecipeDraftItems([]);
      setAdjustedRecipeName("");
    }
  }

  function prepareRecipe(recipe) {
    setActiveRecipeId(recipe.id);
    setAdjustedRecipeName(`${recipe.name} adjusted`);
    setRecipeDraftItems(
      recipe.items.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
      }))
    );
  }

  function updateRecipeDraftAmount(id, value) {
    setRecipeDraftItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, amount: Number(value || 0) } : item
      )
    );
  }

  function removeRecipeDraftItem(id) {
    setRecipeDraftItems((prev) => prev.filter((item) => item.id !== id));
  }

  function addRecipeDraftToLog() {
    if (recipeDraftItems.length === 0) {
      alert("Recipe has no items.");
      return;
    }

    const recipe = recipes.find((item) => item.id === activeRecipeId);
    const name = recipe?.name || "Recipe";
    const nutrition = calculateRecipeTotals(recipeDraftItems);

    const newEntry = {
      id: crypto.randomUUID(),
      name,
      category: "Recipe",
      brand: "",
      meal,
      amount: 1,
      unit: "recipe",
      kcal: nutrition.kcal,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      salt: nutrition.salt,
      adjusted: true,
      recipeItems: recipeDraftItems,
    };

    setEntriesByDate((prev) => ({
      ...prev,
      [date]: [...(prev[date] || []), newEntry],
    }));

    setActiveTab("dashboard");
  }

  function saveAdjustedRecipeAsNew() {
    if (!adjustedRecipeName.trim()) {
      alert("Name this adjusted recipe first.");
      return;
    }

    if (recipeDraftItems.length === 0) {
      alert("Recipe has no items.");
      return;
    }

    const recipe = {
      id: `recipe-${crypto.randomUUID()}`,
      name: adjustedRecipeName.trim(),
      items: recipeDraftItems,
      createdAt: new Date().toISOString(),
    };

    setRecipes((prev) => [...prev, recipe]);
    alert("Adjusted recipe saved as new recipe.");
  }

  function updateGoal(key, value) {
    setGoals((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  }

  function updateEditedMacro(key, value) {
    setEditedMacros((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  }

  function progress(current, goal) {
    if (!goal) return 0;
    return Math.min(100, (current / goal) * 100);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>{appName}</h1>
          <p>Balkan-first food tracker with recipes, custom foods and online search.</p>
        </div>

        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </header>

      <main className="main-content">
        {activeTab === "dashboard" && (
          <section className="screen">
            <div className="screen-title">
              <h2>Daily Dashboard</h2>

              <button onClick={() => setActiveTab("log")} className="primary-button">
                <Plus size={16} />
                Add Food
              </button>
            </div>

            <div className="summary-grid">
              <SummaryCard label="Calories" value={round(totals.kcal, 0)} goal={goals.kcal} suffix="kcal" progress={progress(totals.kcal, goals.kcal)} />
              <SummaryCard label="Protein" value={round(totals.protein)} goal={goals.protein} suffix="g" progress={progress(totals.protein, goals.protein)} />
              <SummaryCard label="Carbs" value={round(totals.carbs)} goal={goals.carbs} suffix="g" progress={progress(totals.carbs, goals.carbs)} />
              <SummaryCard label="Fat" value={round(totals.fat)} goal={goals.fat} suffix="g" progress={progress(totals.fat, goals.fat)} />
              <SummaryCard label="Salt" value={round(totals.salt, 2)} goal={goals.salt} suffix="g" progress={progress(totals.salt, goals.salt)} />
            </div>

            <div className="card">
              <h3>Food logged today</h3>

              {entries.length === 0 ? (
                <p className="empty">No food logged for this day yet.</p>
              ) : (
                <div className="entries">
                  {entries.map((entry) => (
                    <div className="entry" key={entry.id}>
                      <div>
                        <strong>{entry.name}</strong>
                        <p>
                          {entry.meal} • {entry.amount} {entry.unit}
                          {entry.adjusted ? " • adjusted" : ""}
                        </p>
                      </div>

                      <div className="entry-info">
                        <span>{round(entry.kcal, 0)} kcal</span>
                        <span>P {round(entry.protein)}g</span>
                        <span>C {round(entry.carbs)}g</span>
                        <span>F {round(entry.fat)}g</span>
                        <span>Salt {round(entry.salt, 2)}g</span>

                        <button onClick={() => deleteEntry(entry.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === "log" && (
          <section className="screen">
            <h2>Log Food</h2>

            <div className="card">
              <label>Meal</label>
              <select value={meal} onChange={(e) => setMeal(e.target.value)}>
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
                <option>Snack</option>
              </select>

              <label>Search food</label>
              <input
                value={logFoodSearch}
                onChange={(e) => setLogFoodSearch(e.target.value)}
                placeholder="Type chicken, egg, burek, jogurt..."
              />

              <label>Choose food</label>
              <select
                value={selectedFoodId}
                onChange={(e) => {
                  const food = allFoods.find((f) => String(f.id) === String(e.target.value));

                  setSelectedFoodId(e.target.value);

                  if (food) {
                    setAmount(food.serving);
                  }
                }}
              >
                {filteredLogFoods.map((food) => (
                  <option key={food.id} value={food.id}>
                    {food.name} — {food.kcal} kcal
                  </option>
                ))}
              </select>

              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="preview-box">
                <strong>{selectedFood.name}</strong>
                <p>
                  {amount} {selectedFood.unit} = {round(calculatedMacros.kcal, 0)} kcal,
                  P {round(calculatedMacros.protein)}g,
                  C {round(calculatedMacros.carbs)}g,
                  F {round(calculatedMacros.fat)}g,
                  Salt {round(calculatedMacros.salt, 2)}g
                </p>
              </div>

              <button
                className="secondary-button full"
                onClick={() => setShowMacroEditor((prev) => !prev)}
              >
                <SlidersHorizontal size={16} />
                {showMacroEditor ? "Hide macro correction" : "Adjust macros for this log"}
              </button>

              {showMacroEditor && (
                <div className="macro-editor">
                  <h3>Correct only this log entry</h3>
                  <p className="small-muted">
                    This changes only today’s log. The base food stays unchanged.
                  </p>

                  <div className="form-grid">
                    <MacroInput label="Calories" value={editedMacros.kcal} onChange={(value) => updateEditedMacro("kcal", value)} />
                    <MacroInput label="Protein g" value={editedMacros.protein} onChange={(value) => updateEditedMacro("protein", value)} />
                    <MacroInput label="Carbs g" value={editedMacros.carbs} onChange={(value) => updateEditedMacro("carbs", value)} />
                    <MacroInput label="Fat g" value={editedMacros.fat} onChange={(value) => updateEditedMacro("fat", value)} />
                    <MacroInput label="Salt g" value={editedMacros.salt} onChange={(value) => updateEditedMacro("salt", value)} />
                  </div>
                </div>
              )}

              <button className="primary-button full" onClick={addSelectedFoodToLog}>
                <Plus size={16} />
                Add to daily log
              </button>
            </div>
          </section>
        )}

        {activeTab === "database" && (
          <section className="screen">
            <h2>Food Database</h2>

            <div className="card">
              <h3>Online food search</h3>
              <p className="small-muted">
                Search packaged products online. Save useful results or add them directly.
              </p>

              <div className="online-search-row">
                <input
                  value={onlineSearch}
                  onChange={(e) => setOnlineSearch(e.target.value)}
                  placeholder="Search Nutella, Dukat jogurt, protein pudding..."
                />

                <button className="primary-button" onClick={searchOnlineFoods}>
                  <Wifi size={16} />
                  Search
                </button>
              </div>

              {onlineLoading && <p className="small-muted">Searching...</p>}
              {onlineError && <p className="error-text">{onlineError}</p>}

              <div className="online-results">
                {onlineResults.map((food) => (
                  <div className="online-card" key={food.id}>
                    {food.image && <img src={food.image} alt={food.name} />}

                    <div className="online-card-content">
                      <strong>{food.name}</strong>
                      <p>{food.brand} • per 100g</p>

                      <div className="macro-row">
                        <span>{round(food.kcal, 0)} kcal</span>
                        <span>P {round(food.protein)}g</span>
                        <span>C {round(food.carbs)}g</span>
                        <span>F {round(food.fat)}g</span>
                        <span>Salt {round(food.salt, 2)}g</span>
                      </div>

                      <div className="button-row">
                        <button className="secondary-button" onClick={() => saveFoodToMyFoods(food)}>
                          <Save size={16} />
                          Save to My Foods
                        </button>

                        <button className="primary-button" onClick={() => addFoodToLog(food, 100)}>
                          <Plus size={16} />
                          Add 100g today
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Add custom food manually</h3>

              <label>Food name</label>
              <input
                value={newFood.name}
                onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                placeholder="Example: Paladin cheddar slice"
              />

              <label>Category</label>
              <input
                value={newFood.category}
                onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                placeholder="Example: Dairy, Balkan, Snack"
              />

              <div className="form-grid">
                <div>
                  <label>Serving</label>
                  <input
                    type="number"
                    value={newFood.serving}
                    onChange={(e) => setNewFood({ ...newFood, serving: e.target.value })}
                  />
                </div>

                <div>
                  <label>Unit</label>
                  <input
                    value={newFood.unit}
                    onChange={(e) => setNewFood({ ...newFood, unit: e.target.value })}
                    placeholder="g, ml, slice, piece"
                  />
                </div>
              </div>

              <div className="form-grid">
                <MacroInput label="Calories" value={newFood.kcal} onChange={(value) => setNewFood({ ...newFood, kcal: value })} />
                <MacroInput label="Protein g" value={newFood.protein} onChange={(value) => setNewFood({ ...newFood, protein: value })} />
                <MacroInput label="Carbs g" value={newFood.carbs} onChange={(value) => setNewFood({ ...newFood, carbs: value })} />
                <MacroInput label="Fat g" value={newFood.fat} onChange={(value) => setNewFood({ ...newFood, fat: value })} />
                <MacroInput label="Salt g" value={newFood.salt} onChange={(value) => setNewFood({ ...newFood, salt: value })} />
              </div>

              <button className="primary-button full" onClick={addCustomFood}>
                <Plus size={16} />
                Save custom food
              </button>
            </div>

            <div className="search-box">
              <Search size={18} />
              <input
                value={databaseSearch}
                onChange={(e) => setDatabaseSearch(e.target.value)}
                placeholder="Search saved foods, Balkan foods, custom foods..."
              />
            </div>

            <div className="food-database">
              {filteredDatabaseFoods.map((food) => (
                <div className="food-card" key={food.id}>
                  <div>
                    <strong>{food.name}</strong>
                    <p>
                      {food.brand ? `${food.brand} • ` : ""}
                      {food.category} • per {food.serving} {food.unit}
                    </p>
                  </div>

                  <div className="macro-row">
                    <span>{round(food.kcal, 0)} kcal</span>
                    <span>P {round(food.protein)}g</span>
                    <span>C {round(food.carbs)}g</span>
                    <span>F {round(food.fat)}g</span>
                    <span>Salt {round(food.salt, 2)}g</span>

                    {food.custom && (
                      <button
                        className="small-danger-button"
                        onClick={() => deleteCustomFood(food.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "recipes" && (
          <section className="screen">
            <h2>My Recipes</h2>

            <div className="card">
              <h3>Create recipe</h3>

              <label>Recipe name</label>
              <input
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="Example: Overnight oats"
              />

              <label>Search ingredient</label>
              <input
                value={recipeFoodSearch}
                onChange={(e) => setRecipeFoodSearch(e.target.value)}
                placeholder="Search oats, yogurt, banana..."
              />

              <label>Choose ingredient</label>
              <select
                value={recipeSelectedFoodId}
                onChange={(e) => {
                  const food = allFoods.find((f) => String(f.id) === String(e.target.value));
                  setRecipeSelectedFoodId(e.target.value);
                  if (food) setRecipeAmount(food.serving);
                }}
              >
                {filteredRecipeFoods.map((food) => (
                  <option key={food.id} value={food.id}>
                    {food.name} — {food.kcal} kcal
                  </option>
                ))}
              </select>

              <label>Amount</label>
              <input
                type="number"
                value={recipeAmount}
                onChange={(e) => setRecipeAmount(e.target.value)}
              />

              <button className="secondary-button full" onClick={addItemToRecipeBuilder}>
                <Plus size={16} />
                Add ingredient
              </button>

              <div className="recipe-items">
                {recipeBuilderItems.map((item) => {
                  const nutrition = scaleFood(item.food, item.amount);

                  return (
                    <div className="recipe-item" key={item.id}>
                      <div>
                        <strong>{item.food.name}</strong>
                        <p>{round(nutrition.kcal, 0)} kcal • P {round(nutrition.protein)}g</p>
                      </div>

                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateRecipeBuilderAmount(item.id, e.target.value)}
                      />

                      <button onClick={() => removeRecipeBuilderItem(item.id)}>
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {recipeBuilderItems.length > 0 && (
                <div className="preview-box">
                  <strong>Recipe total</strong>
                  <p>
                    {round(recipeBuilderTotals.kcal, 0)} kcal,
                    P {round(recipeBuilderTotals.protein)}g,
                    C {round(recipeBuilderTotals.carbs)}g,
                    F {round(recipeBuilderTotals.fat)}g,
                    Salt {round(recipeBuilderTotals.salt, 2)}g
                  </p>
                </div>
              )}

              <button className="primary-button full" onClick={saveRecipe}>
                <Save size={16} />
                Save recipe
              </button>
            </div>

            <div className="card">
              <h3>Saved recipes</h3>

              {recipes.length === 0 ? (
                <p className="empty">No recipes saved yet.</p>
              ) : (
                <div className="recipe-list">
                  {recipes.map((recipe) => {
                    const recipeTotals = calculateRecipeTotals(recipe.items);

                    return (
                      <div className="recipe-card" key={recipe.id}>
                        <div>
                          <strong>{recipe.name}</strong>
                          <p>
                            {recipe.items.length} ingredients • {round(recipeTotals.kcal, 0)} kcal
                          </p>
                        </div>

                        <div className="button-row">
                          <button className="primary-button" onClick={() => prepareRecipe(recipe)}>
                            Use recipe
                          </button>

                          <button className="small-danger-button" onClick={() => deleteRecipe(recipe.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {activeRecipeId && (
              <div className="card">
                <h3>Adjust recipe before logging</h3>
                <p className="small-muted">
                  Change amounts or remove ingredients only for this log. Original recipe stays unchanged.
                </p>

                <label>Meal</label>
                <select value={meal} onChange={(e) => setMeal(e.target.value)}>
                  <option>Breakfast</option>
                  <option>Lunch</option>
                  <option>Dinner</option>
                  <option>Snack</option>
                </select>

                <div className="recipe-items">
                  {recipeDraftItems.map((item) => {
                    const nutrition = scaleFood(item.food, item.amount);

                    return (
                      <div className="recipe-item" key={item.id}>
                        <div>
                          <strong>{item.food.name}</strong>
                          <p>{round(nutrition.kcal, 0)} kcal • P {round(nutrition.protein)}g</p>
                        </div>

                        <input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updateRecipeDraftAmount(item.id, e.target.value)}
                        />

                        <button onClick={() => removeRecipeDraftItem(item.id)}>
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="preview-box">
                  <strong>Adjusted total</strong>
                  <p>
                    {round(recipeDraftTotals.kcal, 0)} kcal,
                    P {round(recipeDraftTotals.protein)}g,
                    C {round(recipeDraftTotals.carbs)}g,
                    F {round(recipeDraftTotals.fat)}g,
                    Salt {round(recipeDraftTotals.salt, 2)}g
                  </p>
                </div>

                <button className="primary-button full" onClick={addRecipeDraftToLog}>
                  <Plus size={16} />
                  Add adjusted recipe to today
                </button>

                <label>Save adjusted version as</label>
                <input
                  value={adjustedRecipeName}
                  onChange={(e) => setAdjustedRecipeName(e.target.value)}
                />

                <button className="secondary-button full" onClick={saveAdjustedRecipeAsNew}>
                  <Save size={16} />
                  Save adjusted version as new recipe
                </button>
              </div>
            )}
          </section>
        )}

        {activeTab === "progress" && (
          <section className="screen">
            <h2>Progress</h2>

            <div className="summary-grid two">
              <div className="summary-card">
                <span>7-day calorie average</span>
                <strong>{round(weeklyAverage, 0)} kcal</strong>
              </div>

              <div className="summary-card">
                <span>Tracked days</span>
                <strong>{last7Days.filter((d) => d.entries.length > 0).length}/7</strong>
              </div>
            </div>

            <div className="card">
              <h3>Last 7 days</h3>

              <div className="weekly-list">
                {last7Days.map((day) => (
                  <div className="weekly-day" key={day.date}>
                    <span>{day.date}</span>
                    <strong>{round(day.totals.kcal, 0)} kcal</strong>

                    <div className="mini-bar">
                      <div style={{ width: `${progress(day.totals.kcal, goals.kcal)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "settings" && (
          <section className="screen">
            <h2>Settings</h2>

            <div className="card">
              <h3>Daily goals</h3>

              <MacroInput label="Calories" value={goals.kcal} onChange={(value) => updateGoal("kcal", value)} />
              <MacroInput label="Protein g" value={goals.protein} onChange={(value) => updateGoal("protein", value)} />
              <MacroInput label="Carbs g" value={goals.carbs} onChange={(value) => updateGoal("carbs", value)} />
              <MacroInput label="Fat g" value={goals.fat} onChange={(value) => updateGoal("fat", value)} />
              <MacroInput label="Salt g" value={goals.salt} onChange={(value) => updateGoal("salt", value)} />
            </div>
          </section>
        )}
      </main>

      <nav className="bottom-nav">
        <NavButton active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} icon={<Home size={18} />} label="Today" />
        <NavButton active={activeTab === "log"} onClick={() => setActiveTab("log")} icon={<Utensils size={18} />} label="Log" />
        <NavButton active={activeTab === "database"} onClick={() => setActiveTab("database")} icon={<BookOpen size={18} />} label="Foods" />
        <NavButton active={activeTab === "recipes"} onClick={() => setActiveTab("recipes")} icon={<ChefHat size={18} />} label="Recipes" />
        <NavButton active={activeTab === "progress"} onClick={() => setActiveTab("progress")} icon={<BarChart3 size={18} />} label="Progress" />
        <NavButton active={activeTab === "settings"} onClick={() => setActiveTab("settings")} icon={<Settings size={18} />} label="Settings" />
      </nav>
    </div>
  );
}

function SummaryCard({ label, value, goal, suffix, progress }) {
  return (
    <div className="summary-card">
      <span>{label}</span>
      <strong>
        {value} {suffix}
      </strong>
      <small>
        Goal: {goal} {suffix}
      </small>

      <div className="progress-bar">
        <div style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function MacroInput({ label, value, onChange }) {
  return (
    <div>
      <label>{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function NavButton({ active, onClick, icon, label }) {
  return (
    <button className={active ? "nav-button active" : "nav-button"} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}