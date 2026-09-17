import { useEffect, useMemo, useState } from "react";
import "./App.css";

// =========================================================
// HELPERS
// =========================================================

const getDaysLeft = (expiryDate) => {
  const today = new Date();
  const expiry = new Date(expiryDate);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  return Math.ceil(
    (expiry - today) / (1000 * 60 * 60 * 24)
  );
};

const getExpiryStatus = (expiryDate) => {
  const days = getDaysLeft(expiryDate);

  if (days < 0) {
    return {
      text: "Expired",
      className: "danger",
    };
  }

  if (days === 0) {
    return {
      text: "Expires today",
      className: "danger",
    };
  }

  if (days <= 2) {
    return {
      text: `${days} day${days === 1 ? "" : "s"} left`,
      className: "warning",
    };
  }

  return {
    text: `${days} days left`,
    className: "fresh",
  };
};

const getFoodEmoji = (name, category) => {
  const food = name.toLowerCase();

  if (food.includes("milk")) return "🥛";
  if (food.includes("tomato")) return "🍅";
  if (food.includes("bread")) return "🍞";
  if (food.includes("apple")) return "🍎";
  if (food.includes("banana")) return "🍌";
  if (food.includes("rice")) return "🍚";
  if (food.includes("potato")) return "🥔";
  if (food.includes("carrot")) return "🥕";
  if (food.includes("egg")) return "🥚";
  if (food.includes("cheese")) return "🧀";
  if (food.includes("chicken")) return "🍗";
  if (food.includes("meat")) return "🥩";
  if (food.includes("fish")) return "🐟";
  if (food.includes("orange")) return "🍊";
  if (food.includes("mango")) return "🥭";
  if (food.includes("grape")) return "🍇";
  if (food.includes("juice")) return "🧃";

  if (category === "Dairy") return "🥛";
  if (category === "Vegetables") return "🥦";
  if (category === "Fruits") return "🍎";
  if (category === "Bakery") return "🍞";
  if (category === "Meat") return "🥩";
  if (category === "Grains") return "🌾";

  return "🍽️";
};

// =========================================================
// RECIPES
// =========================================================

const recipes = [
  {
    name: "Tomato Sandwich",
    ingredients: ["Tomatoes", "Bread"],
    emoji: "🥪",
    time: "10 min",
  },
  {
    name: "Milk Pancakes",
    ingredients: ["Milk"],
    emoji: "🥞",
    time: "15 min",
  },
  {
    name: "Veggie Toast",
    ingredients: ["Bread", "Tomatoes"],
    emoji: "🍞",
    time: "10 min",
  },
  {
    name: "Tomato Milk Curry",
    ingredients: ["Tomatoes", "Milk"],
    emoji: "🍛",
    time: "25 min",
  },
];

const getSuggestedRecipes = (foodList) => {
  const availableFoods = foodList.map((food) =>
    food.name.toLowerCase()
  );

  return recipes
    .map((recipe) => {
      const matchCount = recipe.ingredients.filter(
        (ingredient) =>
          availableFoods.includes(ingredient.toLowerCase())
      ).length;

      return {
        ...recipe,
        matchCount,
      };
    })
    .filter((recipe) => recipe.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount);
};
// =========================================================
// DEMO DATA
// =========================================================

const demoFoods = [
  {
    id: 101,
    name: "Milk",
    category: "Dairy",
    quantity: "1 litre",
    purchaseDate: "2026-09-16",
    expiryDate: "2026-09-17",
  },
  {
    id: 102,
    name: "Tomatoes",
    category: "Vegetables",
    quantity: "500 g",
    purchaseDate: "2026-09-16",
    expiryDate: "2026-09-18",
  },
  {
    id: 103,
    name: "Bread",
    category: "Bakery",
    quantity: "1 packet",
    purchaseDate: "2026-09-15",
    expiryDate: "2026-09-20",
  },
  {
    id: 104,
    name: "Bananas",
    category: "Fruits",
    quantity: "6 pieces",
    purchaseDate: "2026-09-16",
    expiryDate: "2026-09-19",
  },
  {
    id: 105,
    name: "Eggs",
    category: "Dairy",
    quantity: "12 pieces",
    purchaseDate: "2026-09-14",
    expiryDate: "2026-09-22",
  },
  {
    id: 106,
    name: "Apples",
    category: "Fruits",
    quantity: "4 pieces",
    purchaseDate: "2026-09-15",
    expiryDate: "2026-09-24",
  },
  {
    id: 107,
    name: "Rice",
    category: "Grains",
    quantity: "2 kg",
    purchaseDate: "2026-09-10",
    expiryDate: "2026-10-10",
  },
];
// =========================================================
// APP
// =========================================================

function App() {
  // -------------------------------------------------------
  // PAGE
  // -------------------------------------------------------

  const [page, setPage] = useState("dashboard");

  // -------------------------------------------------------
  // IMPACT DATA
  // -------------------------------------------------------

  
 const [foodSaved, setFoodSaved] = useState(() => {
  return Number(localStorage.getItem("foodwise_foodSaved")) || 0;
});

const [foodWasted, setFoodWasted] = useState(() => {
  return Number(localStorage.getItem("foodwise_foodWasted")) || 0;
});

const [moneySaved, setMoneySaved] = useState(() => {
  return Number(localStorage.getItem("foodwise_moneySaved")) || 0;
});

const [co2Saved, setCo2Saved] = useState(() => {
  return Number(localStorage.getItem("foodwise_co2Saved")) || 0;
});
useEffect(() => {
  localStorage.setItem("foodwise_foodSaved", foodSaved);
  localStorage.setItem("foodwise_foodWasted", foodWasted);
  localStorage.setItem("foodwise_moneySaved", moneySaved);
  localStorage.setItem("foodwise_co2Saved", co2Saved);
}, [foodSaved, foodWasted, moneySaved, co2Saved]);
  // -------------------------------------------------------
  // FOOD INVENTORY
  // -------------------------------------------------------

  
  const [foods, setFoods] = useState(() => {
  const savedFoods = localStorage.getItem("foodwise_foods");

  if (savedFoods) {
    return JSON.parse(savedFoods);
  }

  return [
    {
      id: 1,
      name: "Milk",
      category: "Dairy",
      quantity: "1 litre",
      purchaseDate: "2026-09-15",
      expiryDate: "2026-09-17",
    },
    {
      id: 2,
      name: "Tomatoes",
      category: "Vegetables",
      quantity: "500 g",
      purchaseDate: "2026-09-14",
      expiryDate: "2026-09-18",
    },
    {
      id: 3,
      name: "Bread",
      category: "Bakery",
      quantity: "1 packet",
      purchaseDate: "2026-09-15",
      expiryDate: "2026-09-20",
    },
  ];
});
useEffect(() => {
  localStorage.setItem("foodwise_foods", JSON.stringify(foods));
}, [foods]);

  // -------------------------------------------------------
  // FORM
  // -------------------------------------------------------

  const [formData, setFormData] = useState({
    name: "",
    category: "Vegetables",
    quantity: "",
    purchaseDate: "",
    expiryDate: "",
  });

  const [editingId, setEditingId] = useState(null);

  // -------------------------------------------------------
  // SEARCH / FILTER
  // -------------------------------------------------------

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("expiry");

  // -------------------------------------------------------
  // CATEGORIES
  // -------------------------------------------------------

  const categories = [
    "Vegetables",
    "Fruits",
    "Dairy",
    "Bakery",
    "Meat",
    "Grains",
    "Other",
  ];

  // -------------------------------------------------------
  // FILTERED FOOD
  // -------------------------------------------------------

  const filteredFood = useMemo(() => {
    let result = [...foods];

    if (searchTerm.trim()) {
      result = result.filter((food) =>
        food.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter(
        (food) => food.category === categoryFilter
      );
    }

    if (sortOption === "expiry") {
      result.sort(
        (a, b) =>
          new Date(a.expiryDate) -
          new Date(b.expiryDate)
      );
    }

    if (sortOption === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sortOption === "category") {
      result.sort((a, b) =>
        a.category.localeCompare(b.category)
      );
    }

    return result;
  }, [
    foods,
    searchTerm,
    categoryFilter,
    sortOption,
  ]);

  // -------------------------------------------------------
  // EXPIRING FOOD
  // -------------------------------------------------------

  const expiringFoods = useMemo(() => {
    return foods
      .filter((food) => getDaysLeft(food.expiryDate) <= 2)
      .sort(
        (a, b) =>
          new Date(a.expiryDate) -
          new Date(b.expiryDate)
      );
  }, [foods]);

  // -------------------------------------------------------
  // SUGGESTED RECIPES
  // -------------------------------------------------------

  const suggestedRecipes = useMemo(
    () => getSuggestedRecipes(foods),
    [foods]
  );

  // -------------------------------------------------------
  // FORM HANDLERS
  // -------------------------------------------------------

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "Vegetables",
      quantity: "",
      purchaseDate: "",
      expiryDate: "",
    });

    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (
  !formData.name.trim() ||
  !formData.quantity.trim() ||
  !formData.purchaseDate ||
  !formData.expiryDate
) {
  alert("Please fill all fields correctly.");
  return;
}

if (formData.expiryDate < formData.purchaseDate) {
  alert("Expiry date cannot be before purchase date.");
  return;
}

    if (editingId !== null) {
      setFoods((prev) =>
        prev.map((food) =>
          food.id === editingId
            ? {
                ...food,
                ...formData,
              }
            : food
        )
      );
    } else {
      const newFood = {
        id: Date.now(),
        ...formData,
      };

      setFoods((prev) => [...prev, newFood]);
    }

    resetForm();
    setPage("my-food");
  };

  // -------------------------------------------------------
  // EDIT FOOD
  // -------------------------------------------------------

  const handleEdit = (food) => {
    setFormData({
      name: food.name,
      category: food.category,
      quantity: food.quantity,
      purchaseDate: food.purchaseDate,
      expiryDate: food.expiryDate,
    });

    setEditingId(food.id);
    setPage("add-food");
  };

  // -------------------------------------------------------
  // DELETE FOOD
  // -------------------------------------------------------

  const handleDelete = (id) => {
    const food = foods.find(
      (item) => item.id === id
    );

    if (!food) return;

    const confirmDelete = window.confirm(
      `Delete ${food.name} from your inventory?`
    );

    if (!confirmDelete) return;

    setFoods((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // -------------------------------------------------------
  // SAVE FOOD
  // -------------------------------------------------------

  const handleSaveFood = (food) => {
    setFoodSaved((prev) => prev + 1);

    setMoneySaved((prev) => prev + 50);

    setCo2Saved((prev) => prev + 0.4);

    setFoods((prev) =>
      prev.filter((item) => item.id !== food.id)
    );
  };

  // -------------------------------------------------------
  // WASTE FOOD
  // -------------------------------------------------------

  const handleWasteFood = (food) => {
    setFoodWasted((prev) => prev + 1);

    setFoods((prev) =>
      prev.filter((item) => item.id !== food.id)
    );
  };

  // -------------------------------------------------------
  // QUICK ACTION
  // -------------------------------------------------------

  const goToAddFood = () => {
    resetForm();
    setPage("add-food");
  };
  // -------------------------------------------------------
// DEMO MODE
// -------------------------------------------------------

const handleDemoMode = () => {
  setFoods(demoFoods);

  setFoodSaved(8);
  setFoodWasted(2);
  setMoneySaved(400);
  setCo2Saved(3.2);

  setSearchTerm("");
  setCategoryFilter("All");
  setSortOption("expiry");
  resetForm();

  setPage("dashboard");
};

  // =======================================================
  // DASHBOARD
  // =======================================================

  const renderDashboard = () => {
    const totalItems = foods.length;
    const urgentCount = expiringFoods.length;

    const totalTracked =
      foodSaved + foodWasted;

    const wasteReduction =
      totalTracked > 0
        ? Math.round(
            (foodSaved / totalTracked) * 100
          )
        : 0;

    const priorityFood = expiringFoods[0];

    const bestRecipe = suggestedRecipes[0];

    return (
      <>
        <div className="header">
          <div>
            <p className="welcome">
              WELCOME BACK 👋
            </p>

            <h1>FoodLoop Dashboard</h1>

            <p className="dashboard-subtitle">
              Keep track of your food, reduce waste,
              save money, and make smarter choices.
            </p>
          </div>

          
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
  <button
    className="quick-action"
    onClick={handleDemoMode}
    style={{
      width: "auto",
      marginBottom: 0,
      padding: "11px 16px",
    }}
  >
    🎬 Demo Mode
  </button>

  <button
    className="add-button"
    onClick={goToAddFood}
  >
    + Add Food
  </button>
</div>
        </div>

        {/* MAIN STATS */}

        <div className="stats">
          <div className="stat-card">
            <div className="stat-icon">
              🍎
            </div>

            <div>
              <p>Total Food Items</p>
              <h2>{totalItems}</h2>

              <span className="stat-description">
                Currently in your inventory
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              ⏰
            </div>

            <div>
              <p>Expiring Soon</p>
              <h2>{urgentCount}</h2>

              <span className="stat-description">
                Need your attention
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              🌱
            </div>

            <div>
              <p>Food Saved</p>
              <h2>{foodSaved}</h2>

              <span className="stat-description">
                Items prevented from waste
              </span>
            </div>
          </div>
        </div>

        {/* DASHBOARD GRID */}

        <div className="dashboard-grid">
          {/* LEFT */}

          <div>
            {/* MY FOOD */}

            <div className="card">
              <div className="card-header">
                <div>
                  <h2>My Food</h2>
                  <p>
                    Your recently added food items
                  </p>
                </div>

                <button
                  onClick={() =>
                    setPage("my-food")
                  }
                >
                  View All
                </button>
              </div>

              <div className="my-food-list">
                {foods.length === 0 ? (
                  <p>
                    No food items available.
                  </p>
                ) : (
                  foods
                    .slice(0, 4)
                    .map((food) => {
                      const status =
                        getExpiryStatus(
                          food.expiryDate
                        );

                      return (
                        <div
                          className="my-food-item"
                          key={food.id}
                        >
                          <div className="my-food-icon">
                            {getFoodEmoji(
                              food.name,
                              food.category
                            )}
                          </div>

                          <div className="my-food-info">
                            <h3>{food.name}</h3>

                            <p>
                              {food.quantity} •{" "}
                              {food.category}
                            </p>

                            <p>
                              Purchased:{" "}
                              {food.purchaseDate}
                            </p>
                          </div>

                          <span
                            className={`expiry ${status.className}`}
                          >
                            {status.text}
                          </span>
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            {/* IMPACT OVERVIEW */}

            <div className="card">
              <div className="card-header">
                <div>
                  <h2>Impact Overview</h2>
                  <p>
                    Your contribution to reducing
                    food waste
                  </p>
                </div>
              </div>

              <div className="impact-overview">
                <div className="impact-overview-item">
                  <span className="impact-number">
                    {foodSaved}
                  </span>

                  <span>
                    Food Saved
                  </span>
                </div>

                <div className="impact-overview-item">
                  <span className="impact-number">
                    {foodWasted}
                  </span>

                  <span>
                    Food Wasted
                  </span>
                </div>

                <div className="impact-overview-item">
                  <span className="impact-number">
                    ₹{moneySaved}
                  </span>

                  <span>
                    Money Saved
                  </span>
                </div>

                <div className="impact-overview-item">
                  <span className="impact-number">
                    {co2Saved.toFixed(1)} kg
                  </span>

                  <span>
                    CO₂ Reduced
                  </span>
                </div>
              </div>

              <div className="progress-section">
                <div className="progress-header">
                  <span>
                    Waste Reduction Progress
                  </span>

                  <strong>
                    {wasteReduction}%
                  </strong>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${wasteReduction}%`,
                    }}
                  />
                </div>

                <p>
                  Every saved item helps reduce
                  unnecessary food waste.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div>
            {/* PRIORITY */}

            <div className="card">
              <div className="card-header">
                <div>
                  <h2>Priority Food</h2>
                  <p>
                    Food that needs attention first
                  </p>
                </div>
              </div>

              {priorityFood ? (
                <div className="priority-food">
                  <div className="priority-icon">
                    {getFoodEmoji(
                      priorityFood.name,
                      priorityFood.category
                    )}
                  </div>

                  <div className="priority-info">
                    <h3>
                      {priorityFood.name}
                    </h3>

                    <p>
                      {priorityFood.quantity}
                    </p>

                    <p>
                      Expires on{" "}
                      {priorityFood.expiryDate}
                    </p>
                  </div>

                  <span
                    className={`expiry ${
                      getExpiryStatus(
                        priorityFood.expiryDate
                      ).className
                    }`}
                  >
                    {
                      getExpiryStatus(
                        priorityFood.expiryDate
                      ).text
                    }
                  </span>
                </div>
              ) : (
                <div className="empty-state">
                  <div>🎉</div>
                  <h3>Nothing urgent!</h3>
                  <p>
                    Your food inventory is looking
                    good.
                  </p>
                </div>
              )}
            </div>

            {/* RECIPE */}

            <div className="card">
              <div className="card-header">
                <div>
                  <h2>Recipe Suggestion</h2>
                  <p>
                    Make something with what you have
                  </p>
                </div>
              </div>

              {bestRecipe ? (
                <div className="recipe-highlight">
                  <div className="recipe-emoji">
                    {bestRecipe.emoji}
                  </div>

                  <div>
                    <h3>
                      {bestRecipe.name}
                    </h3>

                    <p>
                      ⏱️ {bestRecipe.time}
                    </p>

                    <p>
                      Uses:{" "}
                      {bestRecipe.ingredients.join(
                        ", "
                      )}
                    </p>

                    <span className="recipe-match">
                      {bestRecipe.matchCount}/
                      {
                        bestRecipe.ingredients
                          .length
                      }{" "}
                      ingredients available
                    </span>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div>🍳</div>
                  <h3>No recipe yet</h3>
                  <p>
                    Add more food items to get
                    suggestions.
                  </p>
                </div>
              )}
            </div>

            {/* MILESTONE */}

            <div className="card">
              <div className="milestone">
                <div className="milestone-top">
                  <div>
                    <span>
                      Your FoodWise Milestone
                    </span>

                    <h2>
                      {foodSaved >= 10
                        ? "Food Saver Pro"
                        : foodSaved >= 5
                        ? "Waste Warrior"
                        : "Getting Started"}
                    </h2>
                  </div>

                  <div className="milestone-badge">
                    🏆
                  </div>
                </div>

                <p>
                  {foodSaved >= 10
                    ? "Amazing! You have prevented a significant amount of food from being wasted."
                    : foodSaved >= 5
                    ? "Great work! Keep saving food and move toward your next milestone."
                    : "Save your first food item to start building your FoodWise impact."}
                </p>
              </div>
            </div>

            {/* SMART TIP */}

            <div className="card">
              <div className="smart-tip">
                <div className="tip-icon">
                  💡
                </div>

                <p>
                  <strong>Smart Tip:</strong>{" "}
                  Check your Expiring Soon section
                  every day and prioritize food with
                  the shortest shelf life.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="card">
          <div className="card-header">
            <div>
              <h2>Quick Actions</h2>
              <p>
                Manage your food faster
              </p>
            </div>
          </div>

          <div className="quick-actions-grid">
            <button
              className="quick-action"
              onClick={goToAddFood}
            >
              ➕ Add Food
            </button>

            <button
              className="quick-action"
              onClick={() =>
                setPage("my-food")
              }
            >
              🍎 View My Food
            </button>

            <button
              className="quick-action"
              onClick={() =>
                setPage("expiring")
              }
            >
              ⏰ Expiring Soon
            </button>

            <button
              className="quick-action"
              onClick={() =>
                setPage("recipes")
              }
            >
              🍳 Find Recipes
            </button>
          </div>
        </div>
      </>
    );
  };

  // =======================================================
  // ADD FOOD
  // =======================================================

  const renderAddFood = () => {
    return (
      <>
        <div className="header">
          <div>
            <p className="welcome">
              FOOD INVENTORY
            </p>

            <h1>
              {editingId !== null
                ? "Edit Food"
                : "Add Food"}
            </h1>

            <p className="dashboard-subtitle">
              {editingId !== null
                ? "Update the details of your food item."
                : "Add a food item to start tracking its freshness."}
            </p>
          </div>

          <button
            className="add-button"
            onClick={() =>
              setPage("my-food")
            }
          >
            View My Food
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2>
                {editingId !== null
                  ? "Update Food Details"
                  : "Food Details"}
              </h2>

              <p>
                Enter accurate information to track
                expiry dates.
              </p>
            </div>
          </div>

          <form
            className="food-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label>
                Food Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="e.g. Tomatoes"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="form-group">
              <label>
                Quantity
              </label>

              <input
                type="text"
                name="quantity"
                placeholder="e.g. 500 g"
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                Purchase Date
              </label>

              <input
                type="date"
                name="purchaseDate"
                value={
                  formData.purchaseDate
                }
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>
                Expiry Date
              </label>

              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              className="submit-button"
            >
              {editingId !== null
                ? "Update Food"
                : "Add Food"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="quick-action"
                onClick={resetForm}
                style={{
                  width: "auto",
                  marginBottom: 0,
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      </>
    );
  };

  // =======================================================
  // MY FOOD
  // =======================================================

  const renderMyFood = () => {
    return (
      <>
        <div className="header">
          <div>
            <p className="welcome">
              FOOD INVENTORY
            </p>

            <h1>My Food</h1>

            <p className="dashboard-subtitle">
              Manage everything currently stored
              in your food inventory.
            </p>
          </div>

          <button
            className="add-button"
            onClick={goToAddFood}
          >
            + Add Food
          </button>
        </div>

        {/* SUMMARY */}

        <div className="stats">
          <div className="stat-card">
            <div className="stat-icon">
              🍎
            </div>

            <div>
              <p>Total Items</p>
              <h2>{foods.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              ⏰
            </div>

            <div>
              <p>Expiring Soon</p>
              <h2>
                {expiringFoods.length}
              </h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              🌱
            </div>

            <div>
              <p>Food Saved</p>
              <h2>{foodSaved}</h2>
            </div>
          </div>
        </div>

        {/* CONTROLS */}

        <div className="card">
          <div className="card-header">
            <div>
              <h2>
                Inventory
              </h2>

              <p>
                Search and organize your food
                items.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              placeholder="🔍 Search food..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              style={{
                flex: 1,
                minWidth: "220px",
                padding: "12px 14px",
                border: "1px solid #dce5df",
                borderRadius: "11px",
                outline: "none",
                background: "#fbfdfc",
              }}
            />

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
              style={{
                padding: "12px 14px",
                border: "1px solid #dce5df",
                borderRadius: "11px",
                background: "#fbfdfc",
              }}
            >
              <option value="All">
                All Categories
              </option>

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}
            </select>

            <select
              value={sortOption}
              onChange={(e) =>
                setSortOption(
                  e.target.value
                )
              }
              style={{
                padding: "12px 14px",
                border: "1px solid #dce5df",
                borderRadius: "11px",
                background: "#fbfdfc",
              }}
            >
              <option value="expiry">
                Sort by Expiry
              </option>

              <option value="name">
                Sort by Name
              </option>

              <option value="category">
                Sort by Category
              </option>
            </select>
          </div>
        </div>

        {/* FOOD LIST */}

        <div className="card">
          <div className="card-header">
            <div>
              <h2>
                {filteredFood.length}{" "}
                Food Item
                {filteredFood.length !== 1
                  ? "s"
                  : ""}
              </h2>

              <p>
                Take action before your food
                expires.
              </p>
            </div>
          </div>

          <div className="my-food-list">
            {filteredFood.length === 0 ? (
              <div className="empty-state">
                <div>🔎</div>

                <h3>
                  No food found
                </h3>

                <p>
                  Try changing your search or
                  category filter.
                </p>
              </div>
            ) : (
              filteredFood.map((food) => {
                const status =
                  getExpiryStatus(
                    food.expiryDate
                  );

                return (
                  <div
                    className="my-food-item"
                    key={food.id}
                  >
                    <div className="my-food-icon">
                      {getFoodEmoji(
                        food.name,
                        food.category
                      )}
                    </div>

                    <div className="my-food-info">
                      <h3>
                        {food.name}
                      </h3>

                      <p>
                        {food.category} •{" "}
                        {food.quantity}
                      </p>

                      <p>
                        Purchased:{" "}
                        {food.purchaseDate}
                      </p>

                      <p>
                        Expires:{" "}
                        {food.expiryDate}
                      </p>
                    </div>

                    <span
                      className={`expiry ${status.className}`}
                    >
                      {status.text}
                    </span>

                    <div className="food-actions">
                      <button
                        className="quick-action"
                        style={{
                          width: "auto",
                          marginBottom: 0,
                          padding: "8px 11px",
                        }}
                        onClick={() =>
                          handleEdit(food)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="saved-button"
                        onClick={() =>
                          handleSaveFood(
                            food
                          )
                        }
                      >
                        ✓ Saved
                      </button>

                      <button
                        className="wasted-button"
                        onClick={() =>
                          handleWasteFood(
                            food
                          )
                        }
                      >
                        ✕ Waste
                      </button>

                      <button
                        className="wasted-button"
                        onClick={() =>
                          handleDelete(
                            food.id
                          )
                        }
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </>
    );
  };

  // =======================================================
  // EXPIRING SOON
  // =======================================================

  const renderExpiring = () => {
    return (
      <>
        <div className="header">
          <div>
            <p className="welcome">
              ATTENTION NEEDED
            </p>

            <h1>Expiring Soon</h1>

            <p className="dashboard-subtitle">
              These food items should be used
              before they expire.
            </p>
          </div>

          <button
            className="add-button"
            onClick={() =>
              setPage("recipes")
            }
          >
            Find Recipes
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2>
                {expiringFoods.length}{" "}
                item
                {expiringFoods.length !== 1
                  ? "s"
                  : ""}{" "}
                need attention
              </h2>

              <p>
                Use these foods first to reduce
                waste.
              </p>
            </div>
          </div>

          <div className="my-food-list">
            {expiringFoods.length === 0 ? (
              <div className="empty-state">
                <div>🎉</div>

                <h3>
                  No food is expiring soon
                </h3>

                <p>
                  Great job! Your inventory is
                  under control.
                </p>
              </div>
            ) : (
              expiringFoods.map((food) => {
                const status =
                  getExpiryStatus(
                    food.expiryDate
                  );

                return (
                  <div
                    className="my-food-item"
                    key={food.id}
                  >
                    <div className="my-food-icon">
                      {getFoodEmoji(
                        food.name,
                        food.category
                      )}
                    </div>

                    <div className="my-food-info">
                      <h3>
                        {food.name}
                      </h3>

                      <p>
                        {food.quantity} •{" "}
                        {food.category}
                      </p>

                      <p>
                        Expiry:{" "}
                        {food.expiryDate}
                      </p>
                    </div>

                    <span
                      className={`expiry ${status.className}`}
                    >
                      {status.text}
                    </span>

                    <div className="food-actions">
                      <button
                        className="saved-button"
                        onClick={() =>
                          handleSaveFood(
                            food
                          )
                        }
                      >
                        ✓ Used / Saved
                      </button>

                      <button
                        className="wasted-button"
                        onClick={() =>
                          handleWasteFood(
                            food
                          )
                        }
                      >
                        ✕ Wasted
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </>
    );
  };

  // =======================================================
  // RECIPES
  // =======================================================

  const renderRecipes = () => {
    return (
      <>
        <div className="header">
          <div>
            <p className="welcome">
              SMART RECIPES
            </p>

            <h1>Recipes</h1>

            <p className="dashboard-subtitle">
              Turn the food you already have into
              simple meals.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2>
                Suggested Recipes
              </h2>

              <p>
                Based on your current inventory.
              </p>
            </div>
          </div>

          <div className="my-food-list">
            {suggestedRecipes.length === 0 ? (
              <div className="empty-state">
                <div>🍳</div>

                <h3>
                  No recipes available
                </h3>

                <p>
                  Add more food items to receive
                  recipe suggestions.
                </p>
              </div>
            ) : (
              suggestedRecipes.map(
                (recipe) => (
                  <div
                    className="my-food-item"
                    key={recipe.name}
                  >
                    <div className="my-food-icon">
                      {recipe.emoji}
                    </div>

                    <div className="my-food-info">
                      <h3>
                        {recipe.name}
                      </h3>

                      <p>
                        ⏱️ {recipe.time}
                      </p>

                      <p>
                        Ingredients:{" "}
                        {recipe.ingredients.join(
                          ", "
                        )}
                      </p>
                    </div>

                    <span className="expiry fresh">
                      {recipe.matchCount}/
                      {
                        recipe.ingredients
                          .length
                      }{" "}
                      available
                    </span>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </>
    );
  };

  // =======================================================
  // IMPACT TRACKER
  // =======================================================

  const renderImpact = () => {
    const totalTracked =
      foodSaved + foodWasted;

    const savingPercentage =
      totalTracked > 0
        ? Math.round(
            (foodSaved / totalTracked) * 100
          )
        : 0;

    return (
      <>
        <div className="header">
          <div>
            <p className="welcome">
              YOUR IMPACT
            </p>

            <h1>Impact Tracker</h1>

            <p className="dashboard-subtitle">
              See how your everyday food choices
              help reduce waste.
            </p>
          </div>
        </div>

        <div className="impact-card">
          <div>
            <p>
              Food Saved From Waste
            </p>

            <h2>
              {foodSaved} items
            </h2>
          </div>

          <div className="impact-stats">
            <div>
              <strong>
                {foodWasted}
              </strong>

              <span>
                Wasted
              </span>
            </div>

            <div>
              <strong>
                ₹{moneySaved}
              </strong>

              <span>
                Money Saved
              </span>
            </div>

            <div>
              <strong>
                {co2Saved.toFixed(1)}
              </strong>

              <span>
                kg CO₂
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2>
                Waste Reduction
              </h2>

              <p>
                Your current food-saving ratio.
              </p>
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-header">
              <span>
                Saved vs Tracked
              </span>

              <strong>
                {savingPercentage}%
              </strong>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${savingPercentage}%`,
                }}
              />
            </div>

            <p>
              Keep using food before it reaches
              its expiry date.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="milestone">
            <div className="milestone-top">
              <div>
                <span>
                  Current Milestone
                </span>

                <h2>
                  {foodSaved >= 10
                    ? "Food Saver Pro"
                    : foodSaved >= 5
                    ? "Waste Warrior"
                    : "Getting Started"}
                </h2>
              </div>

              <div className="milestone-badge">
                🏆
              </div>
            </div>

            <p>
              {foodSaved === 0
                ? "Save your first food item to begin your FoodWise journey."
                : `You have successfully saved ${foodSaved} food item${
                    foodSaved !== 1
                      ? "s"
                      : ""
                  } from waste.`}
            </p>
          </div>
        </div>
      </>
    );
  };

  // =======================================================
  // PAGE CONTENT
  // =======================================================

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return renderDashboard();

      case "add-food":
        return renderAddFood();

      case "my-food":
        return renderMyFood();

      case "expiring":
        return renderExpiring();

      case "recipes":
        return renderRecipes();

      case "impact":
        return renderImpact();

      default:
        return renderDashboard();
    }
  };

  // =======================================================
  // NAVIGATION
  // =======================================================

  const navigationItems = [
    {
      id: "dashboard",
      label: "🏠 Dashboard",
    },
    {
      id: "add-food",
      label: "➕ Add Food",
    },
    {
      id: "my-food",
      label: "🍎 My Food",
    },
    {
      id: "expiring",
      label: "⏰ Expiring Soon",
    },
    {
      id: "recipes",
      label: "🍳 Recipes",
    },
    {
      id: "impact",
      label: "🌱 Impact Tracker",
    },
  ];

  // =======================================================
  // RETURN
  // =======================================================

  return (
    <div className="app">
      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="logo">
          🌱 FoodLoop
        </div>

        <nav>
          {navigationItems.map(
            (item) => (
              <button
                key={item.id}
                className={`nav-item ${
                  page === item.id
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  if (
                    item.id ===
                    "add-food"
                  ) {
                    resetForm();
                  }

                  setPage(item.id);
                }}
              >
                {item.label}
              </button>
            )
          )}
        </nav>

        
        <div className="sidebar-bottom">
  <button
    onClick={handleDemoMode}
    style={{
      width: "100%",
      padding: "11px 14px",
      marginBottom: "16px",
      border: "1px solid #cfe5d5",
      borderRadius: "10px",
      background: "#e8f6ec",
      color: "#287a45",
      fontWeight: "700",
      cursor: "pointer",
    }}
  >
    🎬 Load Demo Data
  </button>

  <p>
    🌍 Make every bite count
  </p>

  <p>
    Track your food.
    <br />
    Reduce your waste.
    <br />
    Save the planet.
  </p>
</div>
      </aside>

      {/* MAIN */}

      <main className="main">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;