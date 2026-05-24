import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import "./App.css";

const STORAGE_KEY = "adis_food_tracker_v1";

const foodDb = [
  { id: 1, name: "Chicken breast, cooked", serving: 100, unit: "g", kcal: 165, protein: 31, carbs: 0, fat: 3.6, salt: 0.19 },
  { id: 2, name: "Egg, whole", serving: 1, unit: "egg", kcal: 72, protein: 6.3, carbs: 0.4, fat: 4.8, salt: 0.18 },
  { id: 3, name: "Greek yogurt 2%", serving: 100, unit: "g", kcal: 73, protein: 9.7, carbs: 3.9, fat: 2, salt: 0.1 },
  { id: 4, name: "Cheddar slice", serving: 1, unit: "slice", kcal: 80, protein: 5, carbs: 0.4, fat: 6.6, salt: 0.36 },
  { id: 5, name: "White bread", serving: 1, unit: "slice", kcal: 80, protein: 2.7, carbs: 14.7, fat: 1, salt: 0.37 },
  { id: 6, name: "Rice, cooked", serving: 100, unit: "g", kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, salt: 0.01 },
  { id: 7, name: "Potato, boiled", serving: 100, unit: "g", kcal: 87, protein: 1.9, carbs: 20.1, fat: 0.1, salt: 0.01 },
  { id: 8, name: "Oats", serving: 100, unit: "g", kcal: 389, protein: 16.9, carbs: 66.3, fat: 6.9, salt: 0.01 },
  { id: 9, name: "Banana", serving: 1, unit: "medium", kcal: 105, protein: 1.3, carbs: 27, fat: 0.4, salt: 0.01 },
  { id: 10, name: "Apple", serving: 1, unit: "medium", kcal: 95, protein: 0.5, carbs: 25, fat: 0.3, salt: 0.01 },
  { id: 11, name: "Tuna in water", serving: 100, unit: "g", kcal: 116, protein: 26, carbs: 0, fat: 1, salt: 0.9 },
  { id: 12, name: "Burek with meat", serving: 100, unit: "g", kcal: 280, protein: 10, carbs: 30, fat: 13, salt: 1.1 },
  { id: 13, name: "Ćevapi", serving: 100, unit: "g", kcal: 290, protein: 17, carbs: 3, fat: 23, salt: 1.4 },
  { id: 14, name: "Lepinja / somun", serving: 100, unit: "g", kcal: 270, protein: 8, carbs: 52, fat: 3, salt: 1.1 },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function round(n, digits = 1) {
  return Math.round(Number(n || 0) * Math.pow(10, digits)) / Math.pow(10, digits);
}

function scaleFood(food, amount) {
  const factor = Number(amount) / Number(food.serving);
  return {
    kcal: food.kcal * factor,
    protein: food.protein * factor,
    carbs: food.carbs * factor,
    fat: food.fat * factor,
    salt: food.salt * factor,
  };
}

export default function App() {
  const [date, setDate] = useState(todayKey());
  const [query, setQuery] = useState("");
  const [meal, setMeal] = useState("Breakfast");
  const [selectedFood, setSelectedFood] = useState(foodDb[0]);
  const [amount, setAmount] = useState(100);
  const [entriesByDate, setEntriesByDate] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setEntriesByDate(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entriesByDate));
  }, [entriesByDate]);

  const entries = entriesByDate[date] || [];

  const filteredFoods = useMemo(() => {
    const q = query.toLowerCase().trim();
    return foodDb.filter((food) => food.name.toLowerCase().includes(q));
  }, [query]);

  const totals = entries.reduce(
    (acc, entry) => {
      acc.kcal += entry.kcal;
      acc.protein += entry.protein;
      acc.carbs += entry.carbs;
      acc.fat += entry.fat;
      acc.salt += entry.salt;
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0, salt: 0 }
  );

  function addFood() {
    if (!selectedFood) return;

    const nutrition = scaleFood(selectedFood, amount);

    const newEntry = {
      id: crypto.randomUUID(),
      name: selectedFood.name,
      meal,
      amount,
      unit: selectedFood.unit,
      ...nutrition,
    };

    setEntriesByDate((prev) => ({
      ...prev,
      [date]: [...(prev[date] || []), newEntry],
    }));
  }

  function deleteEntry(id) {
    setEntriesByDate((prev) => ({
      ...prev,
      [date]: (prev[date] || []).filter((entry) => entry.id !== id),
    }));
  }

  return (
    <div className="app">
      <header>
        <h1>Food Tracker</h1>
        <p>Track calories, protein, carbs, fat and salt.</p>
      </header>

      <section className="card">
        <div className="top-row">
          <h2>Daily Log</h2>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="totals">
          <div><strong>{round(totals.kcal, 0)}</strong><span>Calories</span></div>
          <div><strong>{round(totals.protein)}</strong><span>Protein g</span></div>
          <div><strong>{round(totals.carbs)}</strong><span>Carbs g</span></div>
          <div><strong>{round(totals.fat)}</strong><span>Fat g</span></div>
          <div><strong>{round(totals.salt, 2)}</strong><span>Salt g</span></div>
        </div>

        <div className="entries">
          {entries.length === 0 ? (
            <p className="empty">No food logged yet.</p>
          ) : (
            entries.map((entry) => (
              <div className="entry" key={entry.id}>
                <div>
                  <strong>{entry.name}</strong>
                  <p>{entry.meal} • {entry.amount} {entry.unit}</p>
                </div>
                <div className="entry-info">
                  <span>{round(entry.kcal, 0)} kcal</span>
                  <span>P {round(entry.protein)}g</span>
                  <span>C {round(entry.carbs)}g</span>
                  <span>F {round(entry.fat)}g</span>
                  <span>Salt {round(entry.salt, 2)}g</span>
                  <button onClick={() => deleteEntry(entry.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="card">
        <h2>Add Food</h2>

        <div className="search">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chicken, eggs, burek..."
          />
        </div>

        <div className="controls">
          <select value={meal} onChange={(e) => setMeal(e.target.value)}>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
          </select>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button className="add-button" onClick={addFood}>
            <Plus size={16} />
            Add Selected
          </button>
        </div>

        <div className="food-list">
          {filteredFoods.map((food) => (
            <button
              key={food.id}
              className={selectedFood.id === food.id ? "food selected" : "food"}
              onClick={() => {
                setSelectedFood(food);
                setAmount(food.serving);
              }}
            >
              <div>
                <strong>{food.name}</strong>
                <p>per {food.serving} {food.unit}</p>
              </div>
              <span>{food.kcal} kcal</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}