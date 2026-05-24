
import React, { useEffect, useMemo, useState } from "react";
import {
  Home, Utensils, BookOpen, ChefHat, Activity, MoreHorizontal,
  Search, Plus, Trash2, Save, Wifi, X, Pencil, Scale
} from "lucide-react";
import "./App.css";

const STORAGE_KEY = "bitepilot_v1";
const appName = "BitePilot";

const metricUnits = ["g", "kg", "ml", "dl", "l", "piece", "slice", "scoop", "serving"];
const usUnits = ["oz", "lb", "fl oz", "cup", "tbsp", "tsp", "piece", "slice", "scoop", "serving"];
const allUnits = ["g", "kg", "oz", "lb", "ml", "dl", "l", "fl oz", "cup", "tbsp", "tsp", "piece", "slice", "scoop", "serving"];

const unitToType = {
  g: "mass", kg: "mass", oz: "mass", lb: "mass",
  ml: "volume", dl: "volume", l: "volume", "fl oz": "volume", cup: "volume", tbsp: "volume", tsp: "volume",
  piece: "count", slice: "count", scoop: "count", serving: "count",
};

const measureNames = ["waist", "abdomen", "hips", "chest", "neck", "upperArm", "thigh", "calf"];
const measureLabels = {
  waist: "Waist", abdomen: "Abdomen / belly", hips: "Hips", chest: "Chest",
  neck: "Neck", upperArm: "Upper arm", thigh: "Thigh", calf: "Calf"
};

const builtInFoods = [
  { id: 1, name: "Chicken breast, cooked", category: "Meat", serving: 100, unit: "g", kcal: 165, protein: 31, carbs: 0, fat: 3.6, salt: 0.19 },
  { id: 2, name: "Egg, whole", category: "Eggs", serving: 1, unit: "piece", kcal: 72, protein: 6.3, carbs: 0.4, fat: 4.8, salt: 0.18 },
  { id: 3, name: "Greek yogurt 2%", category: "Dairy", serving: 100, unit: "g", kcal: 73, protein: 9.7, carbs: 3.9, fat: 2, salt: 0.1 },
  { id: 4, name: "Jogurt plain", category: "Dairy Balkan", serving: 100, unit: "ml", kcal: 60, protein: 3.5, carbs: 4.5, fat: 3, salt: 0.12 },
  { id: 5, name: "White bread", category: "Bakery", serving: 1, unit: "slice", kcal: 80, protein: 2.7, carbs: 14.7, fat: 1, salt: 0.37 },
  { id: 6, name: "Rice, cooked", category: "Carbs", serving: 100, unit: "g", kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, salt: 0.01 },
  { id: 7, name: "Potato, boiled", category: "Carbs", serving: 100, unit: "g", kcal: 87, protein: 1.9, carbs: 20.1, fat: 0.1, salt: 0.01 },
  { id: 8, name: "Oats", category: "Breakfast", serving: 100, unit: "g", kcal: 389, protein: 16.9, carbs: 66.3, fat: 6.9, salt: 0.01 },
  { id: 9, name: "Banana", category: "Fruit", serving: 1, unit: "piece", kcal: 105, protein: 1.3, carbs: 27, fat: 0.4, salt: 0.01 },
  { id: 10, name: "Tuna in water", category: "Fish", serving: 100, unit: "g", kcal: 116, protein: 26, carbs: 0, fat: 1, salt: 0.9 },
  { id: 11, name: "Whey protein", category: "Supplement", serving: 1, unit: "scoop", kcal: 120, protein: 24, carbs: 3, fat: 1.5, salt: 0.2 },
  { id: 100, name: "Burek with meat", category: "Balkan", serving: 100, unit: "g", kcal: 280, protein: 10, carbs: 30, fat: 13, salt: 1.1 },
  { id: 101, name: "Sirnica / cheese pie", category: "Balkan", serving: 100, unit: "g", kcal: 270, protein: 11, carbs: 29, fat: 12, salt: 1.2 },
  { id: 102, name: "Zeljanica", category: "Balkan", serving: 100, unit: "g", kcal: 230, protein: 8, carbs: 28, fat: 9, salt: 1.1 },
  { id: 103, name: "Krompiruša", category: "Balkan", serving: 100, unit: "g", kcal: 240, protein: 5, carbs: 36, fat: 8, salt: 1.1 },
  { id: 104, name: "Ćevapi", category: "Balkan", serving: 100, unit: "g", kcal: 290, protein: 17, carbs: 3, fat: 23, salt: 1.4 },
  { id: 105, name: "Lepinja / somun", category: "Balkan", serving: 100, unit: "g", kcal: 270, protein: 8, carbs: 52, fat: 3, salt: 1.1 },
  { id: 106, name: "Pljeskavica", category: "Balkan", serving: 100, unit: "g", kcal: 280, protein: 17, carbs: 4, fat: 22, salt: 1.3 },
  { id: 107, name: "Sarma", category: "Balkan", serving: 100, unit: "g", kcal: 150, protein: 7, carbs: 10, fat: 9, salt: 1.1 },
  { id: 108, name: "Grah / pasulj cooked", category: "Balkan", serving: 100, unit: "g", kcal: 120, protein: 7, carbs: 18, fat: 2, salt: 0.8 },
  { id: 109, name: "Ajvar", category: "Balkan", serving: 100, unit: "g", kcal: 120, protein: 2, carbs: 9, fat: 8, salt: 1.2 },
  { id: 110, name: "Kajmak", category: "Dairy Balkan", serving: 100, unit: "g", kcal: 420, protein: 7, carbs: 3, fat: 42, salt: 0.9 },
  { id: 111, name: "Pavlaka / sour cream", category: "Dairy Balkan", serving: 100, unit: "g", kcal: 200, protein: 3, carbs: 4, fat: 20, salt: 0.15 },
  { id: 112, name: "Mladi sir", category: "Dairy Balkan", serving: 100, unit: "g", kcal: 170, protein: 14, carbs: 3, fat: 11, salt: 0.8 },
  { id: 113, name: "Feta / bijeli sir", category: "Dairy Balkan", serving: 100, unit: "g", kcal: 265, protein: 14, carbs: 4, fat: 21, salt: 2.8 },
  { id: 114, name: "Kefir", category: "Dairy Balkan", serving: 100, unit: "ml", kcal: 55, protein: 3.4, carbs: 4.6, fat: 2.5, salt: 0.12 },
  { id: 115, name: "Domaći hljeb", category: "Bakery Balkan", serving: 100, unit: "g", kcal: 260, protein: 8, carbs: 50, fat: 3, salt: 1.2 },
  { id: 116, name: "Pečeno pile", category: "Balkan", serving: 100, unit: "g", kcal: 210, protein: 27, carbs: 0, fat: 11, salt: 0.7 },
  { id: 117, name: "Pomfrit", category: "Fast food", serving: 100, unit: "g", kcal: 312, protein: 3.4, carbs: 41, fat: 15, salt: 0.6 },
  { id: 118, name: "Eurocrem style spread", category: "Sweet Balkan", serving: 100, unit: "g", kcal: 540, protein: 6, carbs: 58, fat: 31, salt: 0.2 },
  { id: 119, name: "Palačinka with eurocrem", category: "Sweet Balkan", serving: 1, unit: "piece", kcal: 320, protein: 7, carbs: 45, fat: 13, salt: 0.35 },
];

const blankGoals = {
  kcal: 2200, protein: 160, carbs: 220, fat: 70, salt: 5,
  goalType: "lose", startWeight: "", targetWeight: "",
  unitSystem: "metric", bodyUnit: "cm", weightUnit: "kg",
};

const blankFoodForm = { name: "", category: "Custom", serving: 100, unit: "g", kcal: "", protein: "", carbs: "", fat: "", salt: "" };

function todayKey() { return new Date().toISOString().slice(0, 10); }
function round(n, digits = 1) { return Math.round(Number(n || 0) * Math.pow(10, digits)) / Math.pow(10, digits); }

function unitsFor(system) {
  if (system === "us") return usUnits;
  if (system === "all") return allUnits;
  return metricUnits;
}

function typeOfUnit(unit) { return unitToType[unit] || "count"; }

function toCanonical(value, unit) {
  const n = Number(value || 0);
  if (unit === "kg") return { type: "mass", value: n * 1000 };
  if (unit === "oz") return { type: "mass", value: n * 28.3495 };
  if (unit === "lb") return { type: "mass", value: n * 453.592 };
  if (unit === "g") return { type: "mass", value: n };

  if (unit === "dl") return { type: "volume", value: n * 100 };
  if (unit === "l") return { type: "volume", value: n * 1000 };
  if (unit === "fl oz") return { type: "volume", value: n * 29.5735 };
  if (unit === "cup") return { type: "volume", value: n * 240 };
  if (unit === "tbsp") return { type: "volume", value: n * 15 };
  if (unit === "tsp") return { type: "volume", value: n * 5 };
  if (unit === "ml") return { type: "volume", value: n };

  return { type: "count", value: n };
}

function scaleFood(food, amount, amountUnit = food.unit) {
  const wanted = toCanonical(amount, amountUnit);
  const base = toCanonical(food.serving || 100, food.unit || "g");
  const sameType = wanted.type === base.type;
  const factor = sameType && base.value ? wanted.value / base.value : Number(amount || 0) / Number(food.serving || 1);

  return {
    kcal: Number(food.kcal || 0) * factor,
    protein: Number(food.protein || 0) * factor,
    carbs: Number(food.carbs || 0) * factor,
    fat: Number(food.fat || 0) * factor,
    salt: Number(food.salt || 0) * factor,
  };
}

function getTotals(entries) {
  return entries.reduce((acc, e) => {
    acc.kcal += Number(e.kcal || 0);
    acc.protein += Number(e.protein || 0);
    acc.carbs += Number(e.carbs || 0);
    acc.fat += Number(e.fat || 0);
    acc.salt += Number(e.salt || 0);
    return acc;
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0, salt: 0 });
}

function recipeTotals(items) {
  return items.reduce((acc, item) => {
    const scaled = scaleFood(item.food, item.amount, item.unit);
    acc.kcal += scaled.kcal; acc.protein += scaled.protein; acc.carbs += scaled.carbs; acc.fat += scaled.fat; acc.salt += scaled.salt;
    return acc;
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0, salt: 0 });
}

function normalizeOnlineProduct(product) {
  const n = product.nutriments || {};
  return {
    id: `off-${product.code || crypto.randomUUID()}`,
    name: product.product_name || product.generic_name || "Unnamed product",
    brand: product.brands || "Open Food Facts",
    category: "Online product",
    serving: 100,
    unit: "g",
    kcal: Number(n["energy-kcal_100g"] || n["energy-kcal"] || 0),
    protein: Number(n.proteins_100g || 0),
    carbs: Number(n.carbohydrates_100g || 0),
    fat: Number(n.fat_100g || 0),
    salt: Number(n.salt_100g || 0),
    barcode: product.code || "",
    image: product.image_front_small_url || product.image_small_url || "",
    custom: true,
  };
}

function filterFoods(foods, q) {
  const s = String(q || "").toLowerCase().trim();
  if (!s) return foods;
  return foods.filter(f =>
    f.name.toLowerCase().includes(s) ||
    f.category.toLowerCase().includes(s) ||
    (f.brand || "").toLowerCase().includes(s)
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [moreScreen, setMoreScreen] = useState("progress");
  const [date, setDate] = useState(todayKey());

  const [entriesByDate, setEntriesByDate] = useState({});
  const [customFoods, setCustomFoods] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [weights, setWeights] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [goals, setGoals] = useState(blankGoals);

  const [searches, setSearches] = useState({ log: "", database: "", recipe: "", online: "" });
  const [onlineResults, setOnlineResults] = useState([]);
  const [onlineLoading, setOnlineLoading] = useState(false);
  const [onlineError, setOnlineError] = useState("");

  const [foodModal, setFoodModal] = useState(null);
  const [customFoodModal, setCustomFoodModal] = useState(false);
  const [foodForm, setFoodForm] = useState(blankFoodForm);

  const [recipeCreateModal, setRecipeCreateModal] = useState(false);
  const [recipeUseModal, setRecipeUseModal] = useState(null);
  const [recipeName, setRecipeName] = useState("");
  const [recipeItems, setRecipeItems] = useState([]);
  const [recipeFoodId, setRecipeFoodId] = useState(builtInFoods[0].id);
  const [recipeAmount, setRecipeAmount] = useState(100);
  const [recipeUnit, setRecipeUnit] = useState("g");
  const [adjustedRecipeName, setAdjustedRecipeName] = useState("");

  const [bodyModal, setBodyModal] = useState(null);
  const [weightForm, setWeightForm] = useState({ date: todayKey(), weight: "" });
  const [measurementForm, setMeasurementForm] = useState(() => ({
    date: todayKey(),
    waist: "", abdomen: "", hips: "", chest: "", neck: "", upperArm: "", thigh: "", calf: "",
  }));

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setEntriesByDate(data.entriesByDate || {});
        setCustomFoods(data.customFoods || []);
        setRecipes(data.recipes || []);
        setWeights(data.weights || []);
        setMeasurements(data.measurements || []);
        setGoals({ ...blankGoals, ...(data.goals || {}) });
      } catch {
        console.log("Could not load saved data.");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ entriesByDate, customFoods, recipes, weights, measurements, goals }));
  }, [entriesByDate, customFoods, recipes, weights, measurements, goals]);

  const allFoods = useMemo(() => [...builtInFoods, ...customFoods], [customFoods]);
  const todayEntries = entriesByDate[date] || [];
  const totals = getTotals(todayEntries);
  const availableUnits = unitsFor(goals.unitSystem);
  const latestWeight = weights.length ? [...weights].sort((a, b) => a.date.localeCompare(b.date)).at(-1) : null;
  const latestMeasurements = measurements.length ? [...measurements].sort((a, b) => a.date.localeCompare(b.date)).at(-1) : null;

  const last7Days = useMemo(() => {
    return [...Array(7)].map((_, i) => {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const entries = entriesByDate[key] || [];
      return { date: key, totals: getTotals(entries), entries };
    }).reverse();
  }, [entriesByDate]);

  const weeklyAverage = last7Days.reduce((sum, d) => sum + d.totals.kcal, 0) / 7;

  function updateSearch(key, value) { setSearches(prev => ({ ...prev, [key]: value })); }
  function updateGoal(key, value) {
    setGoals(prev => ({ ...prev, [key]: ["goalType", "unitSystem", "bodyUnit", "weightUnit"].includes(key) ? value : Number(value) }));
  }
  function progress(current, goal) { return goal ? Math.min(100, (current / goal) * 100) : 0; }

  function openFoodModal(food, mode = "add", entry = null) {
    const amount = entry?.amount || food.serving || 100;
    const unit = entry?.amountUnit || food.unit || "g";
    const macros = entry ? entry : scaleFood(food, amount, unit);
    setFoodModal({
      mode,
      food,
      entryId: entry?.id || null,
      meal: entry?.meal || "Breakfast",
      amount,
      unit,
      macros: {
        kcal: round(macros.kcal, 0), protein: round(macros.protein), carbs: round(macros.carbs),
        fat: round(macros.fat), salt: round(macros.salt, 2),
      },
    });
  }

  function updateFoodAmount(amount, unit = foodModal.unit) {
    const macros = scaleFood(foodModal.food, amount, unit);
    setFoodModal(prev => ({
      ...prev,
      amount: Number(amount || 0),
      unit,
      macros: { kcal: round(macros.kcal, 0), protein: round(macros.protein), carbs: round(macros.carbs), fat: round(macros.fat), salt: round(macros.salt, 2) },
    }));
  }

  function updateFoodMacro(key, value) {
    setFoodModal(prev => ({ ...prev, macros: { ...prev.macros, [key]: Number(value) } }));
  }

  function saveFoodModal() {
    const entry = {
      id: foodModal.entryId || crypto.randomUUID(),
      name: foodModal.food.name,
      category: foodModal.food.category,
      brand: foodModal.food.brand || "",
      meal: foodModal.meal,
      amount: Number(foodModal.amount),
      amountUnit: foodModal.unit,
      unit: foodModal.unit,
      kcal: Number(foodModal.macros.kcal || 0),
      protein: Number(foodModal.macros.protein || 0),
      carbs: Number(foodModal.macros.carbs || 0),
      fat: Number(foodModal.macros.fat || 0),
      salt: Number(foodModal.macros.salt || 0),
      adjusted: true,
    };
    setEntriesByDate(prev => {
      const day = prev[date] || [];
      if (foodModal.mode === "edit") return { ...prev, [date]: day.map(e => e.id === foodModal.entryId ? entry : e) };
      return { ...prev, [date]: [...day, entry] };
    });
    if (foodModal.food.custom) saveFoodSilently(foodModal.food);
    setFoodModal(null);
    setActiveTab("dashboard");
  }

  function deleteEntry(id) { setEntriesByDate(prev => ({ ...prev, [date]: (prev[date] || []).filter(e => e.id !== id) })); }

  function saveFoodSilently(food) {
    const exists = customFoods.some(item => String(item.id) === String(food.id) || (food.barcode && item.barcode === food.barcode));
    if (!exists) setCustomFoods(prev => [...prev, food]);
  }

  function saveFoodToMyFoods(food) {
    const exists = customFoods.some(item => String(item.id) === String(food.id) || (food.barcode && item.barcode === food.barcode));
    if (exists) return alert("This food is already saved.");
    setCustomFoods(prev => [...prev, food]);
    alert("Saved to My Foods.");
  }

  function saveCustomFood() {
    if (!foodForm.name.trim()) return alert("Food name is required.");
    setCustomFoods(prev => [...prev, {
      id: `custom-${crypto.randomUUID()}`,
      name: foodForm.name.trim(),
      category: foodForm.category.trim() || "Custom",
      serving: Number(foodForm.serving || 100),
      unit: foodForm.unit || "g",
      kcal: Number(foodForm.kcal || 0),
      protein: Number(foodForm.protein || 0),
      carbs: Number(foodForm.carbs || 0),
      fat: Number(foodForm.fat || 0),
      salt: Number(foodForm.salt || 0),
      custom: true,
    }]);
    setFoodForm(blankFoodForm);
    setCustomFoodModal(false);
  }

  function deleteCustomFood(id) { setCustomFoods(prev => prev.filter(f => f.id !== id)); }

  async function searchOnlineFoods() {
    if (!searches.online.trim()) return alert("Type a food name first.");
    setOnlineLoading(true); setOnlineError(""); setOnlineResults([]);
    try {
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searches.online)}&search_simple=1&action=process&json=1&page_size=20&fields=code,product_name,generic_name,brands,nutriments,image_front_small_url,image_small_url`;
      const res = await fetch(url);
      const data = await res.json();
      const products = (data.products || []).map(normalizeOnlineProduct).filter(f => f.name && f.kcal > 0);
      setOnlineResults(products);
      if (!products.length) setOnlineError("No useful products found. Try another name or add it manually.");
    } catch {
      setOnlineError("Online search failed. Check internet or try again.");
    } finally {
      setOnlineLoading(false);
    }
  }

  function addItemToRecipe() {
    const food = allFoods.find(f => String(f.id) === String(recipeFoodId));
    if (!food) return;
    setRecipeItems(prev => [...prev, { id: crypto.randomUUID(), food, amount: Number(recipeAmount || food.serving), unit: recipeUnit }]);
  }
  function updateRecipeItem(id, patch) { setRecipeItems(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item)); }
  function removeRecipeItem(id) { setRecipeItems(prev => prev.filter(item => item.id !== id)); }

  function saveRecipe() {
    if (!recipeName.trim()) return alert("Recipe name is required.");
    if (!recipeItems.length) return alert("Add at least one ingredient.");
    setRecipes(prev => [...prev, { id: `recipe-${crypto.randomUUID()}`, name: recipeName.trim(), items: recipeItems, createdAt: new Date().toISOString() }]);
    closeRecipeCreate();
  }
  function closeRecipeCreate() {
    setRecipeCreateModal(false); setRecipeName(""); setRecipeItems([]); setRecipeFoodId(builtInFoods[0].id); setRecipeAmount(100); setRecipeUnit("g");
  }
  function openRecipeUse(recipe) {
    setAdjustedRecipeName(`${recipe.name} adjusted`);
    setRecipeUseModal({ recipe, meal: "Breakfast", items: recipe.items.map(item => ({ ...item, id: crypto.randomUUID() })) });
  }
  function updateRecipeUseItem(id, patch) {
    setRecipeUseModal(prev => ({ ...prev, items: prev.items.map(item => item.id === id ? { ...item, ...patch } : item) }));
  }
  function removeRecipeUseItem(id) { setRecipeUseModal(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) })); }
  function addRecipeToLog() {
    if (!recipeUseModal?.items?.length) return alert("Recipe has no items.");
    const n = recipeTotals(recipeUseModal.items);
    const entry = {
      id: crypto.randomUUID(), name: recipeUseModal.recipe.name, category: "Recipe", brand: "",
      meal: recipeUseModal.meal, amount: 1, amountUnit: "recipe", unit: "recipe",
      kcal: n.kcal, protein: n.protein, carbs: n.carbs, fat: n.fat, salt: n.salt,
      adjusted: true, recipeItems: recipeUseModal.items,
    };
    setEntriesByDate(prev => ({ ...prev, [date]: [...(prev[date] || []), entry] }));
    setRecipeUseModal(null);
    setActiveTab("dashboard");
  }
  function saveAdjustedRecipeAsNew() {
    if (!adjustedRecipeName.trim()) return alert("Name this adjusted recipe first.");
    if (!recipeUseModal?.items?.length) return alert("Recipe has no items.");
    setRecipes(prev => [...prev, { id: `recipe-${crypto.randomUUID()}`, name: adjustedRecipeName.trim(), items: recipeUseModal.items, createdAt: new Date().toISOString() }]);
    alert("Adjusted recipe saved.");
  }
  function deleteRecipe(id) { setRecipes(prev => prev.filter(recipe => recipe.id !== id)); }

  function saveWeight() {
    if (!weightForm.weight) return alert("Enter your weight.");
    const entry = { id: crypto.randomUUID(), date: weightForm.date || todayKey(), weight: Number(weightForm.weight), unit: goals.weightUnit };
    setWeights(prev => [...prev.filter(w => w.date !== entry.date), entry]);
    setWeightForm({ date: todayKey(), weight: "" });
    setBodyModal(null);
  }
  function deleteWeight(id) { setWeights(prev => prev.filter(w => w.id !== id)); }

  function saveMeasurements() {
    const entry = { id: crypto.randomUUID(), unit: goals.bodyUnit, ...measurementForm };
    const hasAny = measureNames.some(name => entry[name] !== "");
    if (!hasAny) return alert("Enter at least one measurement.");
    setMeasurements(prev => [...prev.filter(m => m.date !== entry.date), entry]);
    setMeasurementForm({ date: todayKey(), waist: "", abdomen: "", hips: "", chest: "", neck: "", upperArm: "", thigh: "", calf: "" });
    setBodyModal(null);
  }
  function deleteMeasurement(id) { setMeasurements(prev => prev.filter(m => m.id !== id)); }

  const weightProgress = getWeightProgress(weights, goals);

  function getWeightProgress(list, goalData) {
    if (!list.length) return null;
    const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date));
    const first = Number(goalData.startWeight || sorted[0].weight);
    const latest = Number(sorted.at(-1).weight);
    const target = Number(goalData.targetWeight || 0);
    if (!target) return { first, latest, target: null, change: latest - first, remaining: null, percent: 0 };
    const totalNeeded = Math.abs(target - first);
    const completed = Math.abs(latest - first);
    return { first, latest, target, change: latest - first, remaining: Math.abs(target - latest), percent: totalNeeded ? Math.min(100, completed / totalNeeded * 100) : 0 };
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>{appName}</h1>
          <p>Food, recipes, weight and body tracking without stress.</p>
        </div>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </header>

      <main className="main-content">
        {activeTab === "dashboard" && (
          <section className="screen">
            <div className="screen-title">
              <h2>Today</h2>
              <button className="primary-button" onClick={() => setActiveTab("log")}><Plus size={16} />Add Food</button>
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
              {!todayEntries.length ? <p className="empty">No food logged for this day yet.</p> : (
                <div className="entries">
                  {todayEntries.map(entry => (
                    <div className="entry" key={entry.id}>
                      <div>
                        <strong>{entry.name}</strong>
                        <p>{entry.meal} • {entry.amount} {entry.amountUnit || entry.unit}{entry.adjusted ? " • adjusted" : ""}</p>
                      </div>
                      <div className="entry-info">
                        <span>{round(entry.kcal, 0)} kcal</span><span>P {round(entry.protein)}g</span><span>C {round(entry.carbs)}g</span><span>F {round(entry.fat)}g</span><span>Salt {round(entry.salt, 2)}g</span>
                        <button onClick={() => openFoodModal(entry, "edit", entry)}><Pencil size={16} /></button>
                        <button onClick={() => deleteEntry(entry.id)}><Trash2 size={16} /></button>
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
            <div className="search-box"><Search size={18} /><input value={searches.log} onChange={e => updateSearch("log", e.target.value)} placeholder="Search chicken, egg, burek, jogurt..." /></div>
            <div className="food-database">
              {filterFoods(allFoods, searches.log).map(food => <FoodCard key={food.id} food={food} onPrimary={() => openFoodModal(food)} primaryText="Add / edit amount" onDelete={food.custom ? () => deleteCustomFood(food.id) : null} />)}
            </div>
          </section>
        )}

        {activeTab === "database" && (
          <section className="screen">
            <div className="screen-title"><h2>Foods</h2><button className="primary-button" onClick={() => setCustomFoodModal(true)}><Plus size={16} />Custom food</button></div>
            <div className="card">
              <h3>Online food search</h3>
              <p className="small-muted">Search products online, then edit amount/macros in a popup before logging.</p>
              <div className="online-search-row">
                <input value={searches.online} onChange={e => updateSearch("online", e.target.value)} placeholder="Search Nutella, Dukat jogurt, protein pudding..." />
                <button className="primary-button" onClick={searchOnlineFoods}><Wifi size={16} />Search</button>
              </div>
              {onlineLoading && <p className="small-muted">Searching...</p>}
              {onlineError && <p className="error-text">{onlineError}</p>}
              <div className="online-results">
                {onlineResults.map(food => (
                  <div className="online-card" key={food.id}>
                    {food.image && <img src={food.image} alt={food.name} />}
                    <div className="online-card-content">
                      <strong>{food.name}</strong><p>{food.brand} • per 100g</p><MacroRow food={food} />
                      <div className="button-row">
                        <button className="secondary-button" onClick={() => saveFoodToMyFoods(food)}><Save size={16} />Save</button>
                        <button className="primary-button" onClick={() => openFoodModal(food)}><Plus size={16} />Add / edit</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="search-box"><Search size={18} /><input value={searches.database} onChange={e => updateSearch("database", e.target.value)} placeholder="Search saved foods, Balkan foods, custom foods..." /></div>
            <div className="food-database">
              {filterFoods(allFoods, searches.database).map(food => <FoodCard key={food.id} food={food} onPrimary={() => openFoodModal(food)} primaryText="Add / edit" onDelete={food.custom ? () => deleteCustomFood(food.id) : null} />)}
            </div>
          </section>
        )}

        {activeTab === "recipes" && (
          <section className="screen">
            <div className="screen-title"><h2>Recipes</h2><button className="primary-button" onClick={() => setRecipeCreateModal(true)}><Plus size={16} />New Recipe</button></div>
            {!recipes.length ? <p className="empty">No recipes saved yet.</p> : (
              <div className="recipe-list">
                {recipes.map(recipe => {
                  const total = recipeTotals(recipe.items);
                  return (
                    <div className="recipe-card" key={recipe.id}>
                      <div><strong>{recipe.name}</strong><p>{recipe.items.length} ingredients • {round(total.kcal, 0)} kcal</p></div>
                      <div className="button-row"><button className="primary-button" onClick={() => openRecipeUse(recipe)}>Use recipe</button><button className="small-danger-button" onClick={() => deleteRecipe(recipe.id)}>Delete</button></div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === "body" && (
          <section className="screen">
            <div className="screen-title"><h2>Body</h2><div className="button-row no-margin"><button className="primary-button" onClick={() => setBodyModal("weight")}><Scale size={16} />Weight</button><button className="secondary-button" onClick={() => setBodyModal("measurements")}><Activity size={16} />Measurements</button></div></div>
            <div className="summary-grid two">
              <div className="summary-card"><span>Current weight</span><strong>{latestWeight ? `${latestWeight.weight} ${latestWeight.unit || goals.weightUnit}` : "—"}</strong><small>{latestWeight?.date || "No entry yet"}</small></div>
              <div className="summary-card"><span>Latest waist</span><strong>{latestMeasurements?.waist ? `${latestMeasurements.waist} ${latestMeasurements.unit}` : "—"}</strong><small>{latestMeasurements?.date || "No entry yet"}</small></div>
            </div>
            {weightProgress && (
              <div className="card"><h3>Weight goal</h3><p className="small-muted">Started: {weightProgress.first} • Now: {weightProgress.latest}{weightProgress.target ? ` • Target: ${weightProgress.target}` : ""}</p><div className="progress-bar big"><div style={{ width: `${weightProgress.percent}%` }} /></div><div className="macro-row"><span>Change {round(weightProgress.change, 1)}</span>{weightProgress.remaining !== null && <span>Remaining {round(weightProgress.remaining, 1)}</span>}</div></div>
            )}
            <div className="card"><h3>Weight history</h3>{!weights.length ? <p className="empty">No weights yet.</p> : <div className="weekly-list">{[...weights].sort((a,b)=>b.date.localeCompare(a.date)).map(w => <div className="weekly-day" key={w.id}><span>{w.date}</span><strong>{w.weight} {w.unit || goals.weightUnit}</strong><button className="small-danger-button" onClick={() => deleteWeight(w.id)}>Delete</button></div>)}</div>}</div>
            <div className="card"><h3>Measurement history</h3>{!measurements.length ? <p className="empty">No measurements yet.</p> : <div className="weekly-list">{[...measurements].sort((a,b)=>b.date.localeCompare(a.date)).map(m => <div className="measurement-card" key={m.id}><div><strong>{m.date}</strong><p>{measureNames.filter(name => m[name] !== "").map(name => `${measureLabels[name]} ${m[name]}${m.unit}`).join(" • ")}</p></div><button className="small-danger-button" onClick={() => deleteMeasurement(m.id)}>Delete</button></div>)}</div>}</div>
          </section>
        )}

        {activeTab === "more" && (
          <section className="screen">
            <h2>More</h2>
            <div className="segmented"><button className={moreScreen === "progress" ? "active" : ""} onClick={() => setMoreScreen("progress")}>Progress</button><button className={moreScreen === "settings" ? "active" : ""} onClick={() => setMoreScreen("settings")}>Settings</button></div>
            {moreScreen === "progress" && (<><div className="summary-grid two"><div className="summary-card"><span>7-day calorie average</span><strong>{round(weeklyAverage, 0)} kcal</strong></div><div className="summary-card"><span>Tracked days</span><strong>{last7Days.filter(d => d.entries.length > 0).length}/7</strong></div></div><div className="card"><h3>Last 7 days</h3><div className="weekly-list">{last7Days.map(day => <div className="weekly-day" key={day.date}><span>{day.date}</span><strong>{round(day.totals.kcal, 0)} kcal</strong><div className="mini-bar"><div style={{ width: `${progress(day.totals.kcal, goals.kcal)}%` }} /></div></div>)}</div></div></>)}
            {moreScreen === "settings" && (
              <div className="card">
                <h3>Settings & goals</h3>
                <label>Measurement system</label><select value={goals.unitSystem} onChange={e => updateGoal("unitSystem", e.target.value)}><option value="metric">Metric / European</option><option value="us">US / Imperial</option><option value="all">Show all units</option></select>
                <label>Weight unit</label><select value={goals.weightUnit} onChange={e => updateGoal("weightUnit", e.target.value)}><option value="kg">kg</option><option value="lb">lb</option></select>
                <label>Body measurement unit</label><select value={goals.bodyUnit} onChange={e => updateGoal("bodyUnit", e.target.value)}><option value="cm">cm</option><option value="in">in</option></select>
                <label>Goal type</label><select value={goals.goalType} onChange={e => updateGoal("goalType", e.target.value)}><option value="lose">Lose weight</option><option value="gain">Gain weight</option><option value="maintain">Maintain</option></select>
                <div className="form-grid">
                  <NumberInput label="Calories" value={goals.kcal} onChange={v => updateGoal("kcal", v)} /><NumberInput label="Protein g" value={goals.protein} onChange={v => updateGoal("protein", v)} /><NumberInput label="Carbs g" value={goals.carbs} onChange={v => updateGoal("carbs", v)} /><NumberInput label="Fat g" value={goals.fat} onChange={v => updateGoal("fat", v)} /><NumberInput label="Salt g" value={goals.salt} onChange={v => updateGoal("salt", v)} /><NumberInput label={`Start weight ${goals.weightUnit}`} value={goals.startWeight} onChange={v => updateGoal("startWeight", v)} /><NumberInput label={`Target weight ${goals.weightUnit}`} value={goals.targetWeight} onChange={v => updateGoal("targetWeight", v)} />
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {foodModal && <Modal onClose={() => setFoodModal(null)}><h3>{foodModal.mode === "edit" ? "Edit logged food" : "Add food"}</h3><p className="small-muted">{foodModal.food.name}</p><label>Meal</label><select value={foodModal.meal} onChange={e => setFoodModal({ ...foodModal, meal: e.target.value })}><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select><div className="form-grid"><NumberInput label="Amount" value={foodModal.amount} onChange={v => updateFoodAmount(v, foodModal.unit)} /><div><label>Unit</label><select value={foodModal.unit} onChange={e => updateFoodAmount(foodModal.amount, e.target.value)}>{availableUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}</select></div></div><div className="preview-box"><strong>Nutrition for this log</strong><p>{round(foodModal.macros.kcal, 0)} kcal, P {round(foodModal.macros.protein)}g, C {round(foodModal.macros.carbs)}g, F {round(foodModal.macros.fat)}g, Salt {round(foodModal.macros.salt, 2)}g</p></div><div className="form-grid"><NumberInput label="Calories" value={foodModal.macros.kcal} onChange={v => updateFoodMacro("kcal", v)} /><NumberInput label="Protein g" value={foodModal.macros.protein} onChange={v => updateFoodMacro("protein", v)} /><NumberInput label="Carbs g" value={foodModal.macros.carbs} onChange={v => updateFoodMacro("carbs", v)} /><NumberInput label="Fat g" value={foodModal.macros.fat} onChange={v => updateFoodMacro("fat", v)} /><NumberInput label="Salt g" value={foodModal.macros.salt} onChange={v => updateFoodMacro("salt", v)} /></div><button className="primary-button full" onClick={saveFoodModal}><Save size={16} />Save to log</button></Modal>}

      {customFoodModal && <Modal onClose={() => setCustomFoodModal(false)}><h3>Add custom food</h3><label>Food name</label><input value={foodForm.name} onChange={e => setFoodForm({ ...foodForm, name: e.target.value })} /><label>Category</label><input value={foodForm.category} onChange={e => setFoodForm({ ...foodForm, category: e.target.value })} /><div className="form-grid"><NumberInput label="Serving amount" value={foodForm.serving} onChange={v => setFoodForm({ ...foodForm, serving: v })} /><div><label>Serving unit</label><select value={foodForm.unit} onChange={e => setFoodForm({ ...foodForm, unit: e.target.value })}>{availableUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}</select></div></div><div className="form-grid"><NumberInput label="Calories" value={foodForm.kcal} onChange={v => setFoodForm({ ...foodForm, kcal: v })} /><NumberInput label="Protein g" value={foodForm.protein} onChange={v => setFoodForm({ ...foodForm, protein: v })} /><NumberInput label="Carbs g" value={foodForm.carbs} onChange={v => setFoodForm({ ...foodForm, carbs: v })} /><NumberInput label="Fat g" value={foodForm.fat} onChange={v => setFoodForm({ ...foodForm, fat: v })} /><NumberInput label="Salt g" value={foodForm.salt} onChange={v => setFoodForm({ ...foodForm, salt: v })} /></div><button className="primary-button full" onClick={saveCustomFood}><Save size={16} />Save custom food</button></Modal>}

      {recipeCreateModal && <Modal onClose={closeRecipeCreate}><h3>Create recipe</h3><label>Recipe name</label><input value={recipeName} onChange={e => setRecipeName(e.target.value)} placeholder="Example: Overnight oats" /><label>Search ingredient</label><input value={searches.recipe} onChange={e => updateSearch("recipe", e.target.value)} /><label>Choose ingredient</label><select value={recipeFoodId} onChange={e => { const food = allFoods.find(item => String(item.id) === String(e.target.value)); setRecipeFoodId(e.target.value); if (food) { setRecipeAmount(food.serving); setRecipeUnit(food.unit); } }}>{filterFoods(allFoods, searches.recipe).map(food => <option key={food.id} value={food.id}>{food.name}</option>)}</select><div className="form-grid"><NumberInput label="Amount" value={recipeAmount} onChange={setRecipeAmount} /><div><label>Unit</label><select value={recipeUnit} onChange={e => setRecipeUnit(e.target.value)}>{availableUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}</select></div></div><button className="secondary-button full" onClick={addItemToRecipe}><Plus size={16} />Add ingredient</button><RecipeItems items={recipeItems} units={availableUnits} onUpdate={updateRecipeItem} onRemove={removeRecipeItem} />{!!recipeItems.length && <RecipeTotal items={recipeItems} />}<button className="primary-button full" onClick={saveRecipe}><Save size={16} />Save recipe</button></Modal>}

      {recipeUseModal && <Modal onClose={() => setRecipeUseModal(null)}><h3>Use recipe</h3><p className="small-muted">Change amounts or remove items only for this log.</p><label>Meal</label><select value={recipeUseModal.meal} onChange={e => setRecipeUseModal({ ...recipeUseModal, meal: e.target.value })}><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select><RecipeItems items={recipeUseModal.items} units={availableUnits} onUpdate={updateRecipeUseItem} onRemove={removeRecipeUseItem} /><RecipeTotal items={recipeUseModal.items} /><button className="primary-button full" onClick={addRecipeToLog}><Plus size={16} />Add recipe to today</button><label>Save adjusted version as</label><input value={adjustedRecipeName} onChange={e => setAdjustedRecipeName(e.target.value)} /><button className="secondary-button full" onClick={saveAdjustedRecipeAsNew}><Save size={16} />Save as new recipe</button></Modal>}

      {bodyModal === "weight" && <Modal onClose={() => setBodyModal(null)}><h3>Add weight</h3><label>Date</label><input type="date" value={weightForm.date} onChange={e => setWeightForm({ ...weightForm, date: e.target.value })} /><NumberInput label={`Weight ${goals.weightUnit}`} value={weightForm.weight} onChange={v => setWeightForm({ ...weightForm, weight: v })} /><button className="primary-button full" onClick={saveWeight}><Save size={16} />Save weight</button></Modal>}

      {bodyModal === "measurements" && <Modal onClose={() => setBodyModal(null)}><h3>Add measurements</h3><p className="small-muted">Use the same tape and same conditions each time.</p><label>Date</label><input type="date" value={measurementForm.date} onChange={e => setMeasurementForm({ ...measurementForm, date: e.target.value })} /><div className="form-grid">{measureNames.map(name => <NumberInput key={name} label={`${measureLabels[name]} ${goals.bodyUnit}`} value={measurementForm[name]} onChange={v => setMeasurementForm({ ...measurementForm, [name]: v })} />)}</div><button className="primary-button full" onClick={saveMeasurements}><Save size={16} />Save measurements</button></Modal>}

      <nav className="bottom-nav">
        <NavButton active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} icon={<Home size={18} />} label="Today" />
        <NavButton active={activeTab === "log"} onClick={() => setActiveTab("log")} icon={<Utensils size={18} />} label="Log" />
        <NavButton active={activeTab === "database"} onClick={() => setActiveTab("database")} icon={<BookOpen size={18} />} label="Foods" />
        <NavButton active={activeTab === "recipes"} onClick={() => setActiveTab("recipes")} icon={<ChefHat size={18} />} label="Recipes" />
        <NavButton active={activeTab === "body"} onClick={() => setActiveTab("body")} icon={<Activity size={18} />} label="Body" />
        <NavButton active={activeTab === "more"} onClick={() => setActiveTab("more")} icon={<MoreHorizontal size={18} />} label="More" />
      </nav>
    </div>
  );
}

function SummaryCard({ label, value, goal, suffix, progress }) {
  return <div className="summary-card"><span>{label}</span><strong>{value} {suffix}</strong><small>Goal: {goal} {suffix}</small><div className="progress-bar"><div style={{ width: `${progress}%` }} /></div></div>;
}

function FoodCard({ food, onPrimary, primaryText, onDelete }) {
  return <div className="food-card"><div><strong>{food.name}</strong><p>{food.brand ? `${food.brand} • ` : ""}{food.category} • per {food.serving} {food.unit}</p></div><MacroRow food={food} /><div className="button-row"><button className="primary-button" onClick={onPrimary}><Plus size={16} />{primaryText}</button>{onDelete && <button className="small-danger-button" onClick={onDelete}>Delete</button>}</div></div>;
}

function MacroRow({ food }) {
  return <div className="macro-row"><span>{round(food.kcal, 0)} kcal</span><span>P {round(food.protein)}g</span><span>C {round(food.carbs)}g</span><span>F {round(food.fat)}g</span><span>Salt {round(food.salt, 2)}g</span></div>;
}

function NumberInput({ label, value, onChange }) {
  return <div><label>{label}</label><input type="number" value={value} onChange={e => onChange(e.target.value)} /></div>;
}

function Modal({ children, onClose }) {
  return <div className="modal-overlay" onClick={onClose}><div className="food-modal" onClick={e => e.stopPropagation()}><button className="modal-close-button" onClick={onClose}><X size={18} /></button>{children}</div></div>;
}

function RecipeItems({ items, units, onUpdate, onRemove }) {
  return <div className="recipe-items">{items.map(item => { const n = scaleFood(item.food, item.amount, item.unit); return <div className="recipe-item" key={item.id}><div><strong>{item.food.name}</strong><p>{round(n.kcal, 0)} kcal • P {round(n.protein)}g</p></div><input type="number" value={item.amount} onChange={e => onUpdate(item.id, { amount: Number(e.target.value || 0) })} /><select value={item.unit} onChange={e => onUpdate(item.id, { unit: e.target.value })}>{units.map(unit => <option key={unit} value={unit}>{unit}</option>)}</select><button onClick={() => onRemove(item.id)}><X size={16} /></button></div>; })}</div>;
}

function RecipeTotal({ items }) {
  const total = recipeTotals(items);
  return <div className="preview-box"><strong>Total</strong><p>{round(total.kcal, 0)} kcal, P {round(total.protein)}g, C {round(total.carbs)}g, F {round(total.fat)}g, Salt {round(total.salt, 2)}g</p></div>;
}

function NavButton({ active, onClick, icon, label }) {
  return <button className={active ? "nav-button active" : "nav-button"} onClick={onClick}>{icon}<span>{label}</span></button>;
}
