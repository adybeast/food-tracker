import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Trash2, Home, BookOpen, BarChart3, Settings, Utensils } from "lucide-react";
import "./App.css";

const STORAGE_KEY = "adis_food_tracker_v2";

const foodDb = [
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
  { id: 12, name: "Burek with meat", category: "Balkan", serving: 100, unit: "g", kcal: 280, protein: 10, carbs: 30, fat: 13, salt: 1.1 },
  { id: 13, name: "Ćevapi", category: "Balkan", serving: 100, unit: "g", kcal: 290, protein: 17, carbs: 3, fat: 23, salt: 1.4 },
  { id: 14, name: "Lepinja / somun", category: "Balkan", serving: 100, unit: "g", kcal: 270, protein: 8, carbs: 52, fat: 3, salt: 1.1 },
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

function getTotals(entries) {
  return entries.reduce(
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
}

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [date, setDate] = useState(todayKey());
  const [query, setQuery] = useState("");
  const [meal, setMeal] = useState("Breakfast");
  const [selectedFoodId, setSelectedFoodId] = useState(foodDb[0].id);
  const [amount, setAmount] = useState(100);
  const [entriesByDate, setEntriesByDate] = useState({});
  const [goals, setGoals] = useState({
    kcal: 2200,
    protein: 160,
    carbs: 220,
    fat: 70,
    salt: 5,
  });
  const [appName, setAppName] = useState("Adis Food Tracker");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setEntriesByDate(data.entriesByDate || {});
      setGoals(data.goals || goals);
      setAppName(data.appName || "Adis Food Tracker");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        entriesByDate,
        goals,
        appName,
      })
    );
  }, [entriesByDate, goals, appName]);

  const selectedFood = foodDb.find((food) => food.id === Number(selectedFoodId)) || foodDb[0];
  const entries = entriesByDate[date] || [];
  const totals = getTotals(entries);

  const filteredFoods = useMemo(() => {
    const q = query.toLowerCase().trim();
    return foodDb.filter(
      (food) =>
        food.name.toLowerCase().includes(q) ||
        food.category.toLowerCase().includes(q)
    );
  }, [query]);

  function addFood() {
    if (!selectedFood) return;

    const nutrition = scaleFood(selectedFood, amount);

    const newEntry = {
      id: crypto.randomUUID(),
      name: selectedFood.name,
      category: selectedFood.category,
      meal,
      amount,
      unit: selectedFood.unit,
      ...nutrition,
    };

    setEntriesByDate((prev) => ({
      ...prev,
      [date]: [...(prev[date] || []), newEntry],
    }));

    setActiveTab("dashboard");
  }

  function deleteEntry(id) {
    setEntriesByDate((prev) => ({
      ...prev,
      [date]: (prev[date] || []).filter((entry) => entry.id !== id),
    }));
  }

  function updateGoal(key, value) {
    setGoals((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  }

  function progress(current, goal) {
    if (!goal) return 0;
    return Math.min(100, (current / goal) * 100);
  }

  const last7Days = [...Array(7)].map((_, index) => {
    const d = new Date();
    d.setDate(d.getDate() - index);
    const key = d.toISOString().slice(0, 10);
    const dayEntries = entriesByDate[key] || [];
    return {
      date: key,
      totals: getTotals(dayEntries),
      entries: dayEntries,
    };
  }).reverse();

  const weeklyAverage = last7Days.reduce((sum, day) => sum + day.totals.kcal, 0) / 7;

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>{appName}</h1>
          <p>Calories, macros, salt and food database.</p>
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

              <label>Choose food</label>
              <select
                value={selectedFoodId}
                onChange={(e) => {
                  const food = foodDb.find((f) => f.id === Number(e.target.value));
                  setSelectedFoodId(e.target.value);
                  if (food) setAmount(food.serving);
                }}
              >
                {foodDb.map((food) => (
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
                  {amount} {selectedFood.unit} = {round(scaleFood(selectedFood, amount).kcal, 0)} kcal,
                  P {round(scaleFood(selectedFood, amount).protein)}g,
                  C {round(scaleFood(selectedFood, amount).carbs)}g,
                  F {round(scaleFood(selectedFood, amount).fat)}g,
                  Salt {round(scaleFood(selectedFood, amount).salt, 2)}g
                </p>
              </div>

              <button className="primary-button full" onClick={addFood}>
                <Plus size={16} />
                Add to daily log
              </button>
            </div>
          </section>
        )}

        {activeTab === "database" && (
          <section className="screen">
            <h2>Food Database</h2>

            <div className="search-box">
              <Search size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search food or category..."
              />
            </div>

            <div className="food-database">
              {filteredFoods.map((food) => (
                <div className="food-card" key={food.id}>
                  <div>
                    <strong>{food.name}</strong>
                    <p>{food.category} • per {food.serving} {food.unit}</p>
                  </div>
                  <div className="macro-row">
                    <span>{food.kcal} kcal</span>
                    <span>P {food.protein}g</span>
                    <span>C {food.carbs}g</span>
                    <span>F {food.fat}g</span>
                    <span>Salt {food.salt}g</span>
                  </div>
                </div>
              ))}
            </div>
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
              <label>App name</label>
              <input value={appName} onChange={(e) => setAppName(e.target.value)} />

              <h3>Daily goals</h3>

              <label>Calories</label>
              <input type="number" value={goals.kcal} onChange={(e) => updateGoal("kcal", e.target.value)} />

              <label>Protein g</label>
              <input type="number" value={goals.protein} onChange={(e) => updateGoal("protein", e.target.value)} />

              <label>Carbs g</label>
              <input type="number" value={goals.carbs} onChange={(e) => updateGoal("carbs", e.target.value)} />

              <label>Fat g</label>
              <input type="number" value={goals.fat} onChange={(e) => updateGoal("fat", e.target.value)} />

              <label>Salt g</label>
              <input type="number" value={goals.salt} onChange={(e) => updateGoal("salt", e.target.value)} />
            </div>
          </section>
        )}
      </main>

      <nav className="bottom-nav">
        <NavButton active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} icon={<Home size={19} />} label="Today" />
        <NavButton active={activeTab === "log"} onClick={() => setActiveTab("log")} icon={<Utensils size={19} />} label="Log" />
        <NavButton active={activeTab === "database"} onClick={() => setActiveTab("database")} icon={<BookOpen size={19} />} label="Foods" />
        <NavButton active={activeTab === "progress"} onClick={() => setActiveTab("progress")} icon={<BarChart3 size={19} />} label="Progress" />
        <NavButton active={activeTab === "settings"} onClick={() => setActiveTab("settings")} icon={<Settings size={19} />} label="Settings" />
      </nav>
    </div>
  );
}

function SummaryCard({ label, value, goal, suffix, progress }) {
  return (
    <div className="summary-card">
      <span>{label}</span>
      <strong>{value} {suffix}</strong>
      <small>Goal: {goal} {suffix}</small>
      <div className="progress-bar">
        <div style={{ width: `${progress}%` }} />
      </div>
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
