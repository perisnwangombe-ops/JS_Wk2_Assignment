// Variables
let totalCalories = 0;


// DOM Elements
const foodForm = document.getElementById('food-form');
const foodNameInput = document.getElementById('food-name');
const caloriesInput = document.getElementById('calories');
const foodList = document.getElementById('food-list');
const totalCaloriesEl = document.getElementById('total-calories');
const resetBtn = document.getElementById('reset-btn');
const emptyState = document.getElementById('empty-state');

// Load saved data when page opens
function loadSavedData() {
  // Load total calories
  const savedTotal = localStorage.getItem('totalCalories');
  if (savedTotal) {
    totalCalories = parseInt(savedTotal);
    totalCaloriesEl.textContent = totalCalories;
  }

  // Load food list
  const savedFoods = localStorage.getItem('foodItems');
  if (savedFoods) {
    foodList.innerHTML = savedFoods;
  }

  // Hide empty message if there are foods
  if (foodList.children.length > 0) {
    emptyState.classList.add('hidden');
  }
}

// Save total calories
function saveTotal() {
  localStorage.setItem('totalCalories', totalCalories);
}

// Save the food list 
function saveFoods() {
  localStorage.setItem('foodItems', foodList.innerHTML);
}
// Add new food
function addFood() {
  const name = foodNameInput.value.trim();
  const calories = parseInt(caloriesInput.value);

  if (name === "" || isNaN(calories)) {
    return; // do nothing if empty
  }
// Create food item HTML
  const item = `
    <div class="bg-zinc-800 p-4 rounded-xl flex justify-between items-center">
      <div>
        <span class="font-medium">${name}</span>
        <span class="ml-4 text-emerald-400 font-bold">${calories} cal</span>
      </div>
      <button class="delete-btn text-red-400 hover:text-red-500">
        <i class="fas fa-trash"></i>
      </button>
    </div>
   `;

// Add to list
  foodList.innerHTML += item;

  // Update total
  totalCalories = totalCalories + calories;
  totalCaloriesEl.textContent = totalCalories;

// Save data
  saveTotal();
  saveFoods();
  
  // Hide empty message
  emptyState.classList.add('hidden');

  // Clear input fields
  foodNameInput.value = "";
  caloriesInput.value = "";
}
// Delete food item
function deleteFood(button) {
  const foodItem = button.parentElement;
  const caloriesText = foodItem.querySelector('span:last-child').textContent;
  const calories = parseInt(caloriesText);

  // Reduce total
  totalCalories = totalCalories - calories;
  totalCaloriesEl.textContent = totalCalories;

  // Remove item from screen
  foodItem.remove();

  // Save changes
  saveTotal();
  saveFoods();

  // Show empty message if no foods left
  if (foodList.children.length === 0) {
    emptyState.classList.remove('hidden');
  }
}

// Reset everything for new day
function resetDay() {
  if (confirm("Start a new day? All foods will be deleted.")) {
    totalCalories = 0;
    totalCaloriesEl.textContent = "0";
    foodList.innerHTML = "";
    
    localStorage.removeItem('totalCalories');
    localStorage.removeItem('foodItems');
    
    emptyState.classList.remove('hidden');
  }
}
// When user submits the form
foodForm.addEventListener('submit', function(e) {
  e.preventDefault();   // Stop page refresh
  addFood();
});

// When user clicks delete button
foodList.addEventListener('click', function(e) {
  if (e.target.closest('.delete-btn')) {
    deleteFood(e.target.closest('.delete-btn'));
  }
});
// When user clicks Reset button
resetBtn.addEventListener('click', resetDay);

// Start the app - load saved data
loadSavedData();
