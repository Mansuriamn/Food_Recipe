const searchbox = document.querySelector(".searchbox");
const btnsu = document.querySelector(".btnsu");
const recipeContainar = document.querySelector(".recipe-containar");
const recpidetailcontent = document.querySelector(".recipe-detailcontent");
const recipeclosbtn = document.querySelector(".recipe-closbtn");

const fetchRecipes = async (query) => {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    recipeContainar.innerHTML = ''; // Clear previous search results
    if (data.meals) {
      data.meals.forEach(meal => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");
        recipeDiv.innerHTML = `
          <h2>${meal.strMeal}</h2>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <p><span>${meal.strArea}</span> Dish</p>
          <span>${meal.strCategory}</span>
        `;
        const button = document.createElement("button");
        button.innerText = "View Recipe";
        recipeDiv.appendChild(button);
        button.addEventListener('click', () => {
          recipePopup(meal);
        });
        recipeContainar.appendChild(recipeDiv);
      });
    } else {
      recipeContainar.innerHTML = '<p>No recipes found</p>';
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    recipeContainar.innerHTML = '<p>Error fetching recipes</p>';
  }
}

const fetchRecipeIngredients = (meal) => {
  let ingredients = '';
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredients += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredients;
}

const recipePopup = (meal) => {
  recpidetailcontent.innerHTML = `
    <h2 class="recipename">${meal.strMeal}</h2>
    <h3>Ingredients :</h3>
    <ul class="recipeengridient">${fetchRecipeIngredients(meal)}</ul>
    <div class="recipeinstuction">
    <h3>Instruction :</h3>
    <p >${meal.strInstructions}</p>
    </div>
  `;
  recpidetailcontent.parentElement.style.display = "block";
}

recipeclosbtn.addEventListener('click',()=>{
  recpidetailcontent.parentElement.style.display="none";
})

btnsu.addEventListener('click', (e) => {
  e.preventDefault();
  const userdata = searchbox.value;
  fetchRecipes(userdata);
});




document.addEventListener('DOMContentLoaded', () => {
  // Function to fetch categories from the API
  const fetchCategories = async () => {
    const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.categories) {
        const categories = data.categories.map(category => category.strCategory);
        fetchRandomRecipes(categories, 2); // Fetch random recipes for each category
      } else {
        console.error('No categories found');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Function to fetch random recipes for multiple categories
  const fetchRandomRecipes = async (categories, numRecipesPerCategory) => {
    const recipes = [];

    try {
      const fetchRequests = categories.map(async category => {
        for (let i = 0; i < numRecipesPerCategory; i++) {
          const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
          const response = await fetch(url);
          const data = await response.json();

          if (data && data.meals) {
            const randomIndex = Math.floor(Math.random() * data.meals.length);
            recipes.push(data.meals[randomIndex]);
          } else {
            console.log(`No meals found for category '${category}'`);
          }
        }
      });

      // Wait for all fetch requests to complete
      await Promise.all(fetchRequests);

      // Display the fetched recipes
      displayRecipes(recipes);
    } catch (error) {
      console.error('Error fetching random recipes:', error);
      recpidetailcontent.innerHTML = '<p>Error fetching random recipes</p>';
    }
  };

  // Function to display fetched recipes
  const displayRecipes = (recipes) => {
    recipeContainar.innerHTML = ''; // Clear previous search results

    if (recipes.length > 0) {
      recipes.forEach(meal => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");
        recipeDiv.innerHTML = `
          <h2>${meal.strMeal}</h2>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <p><span>${meal.strArea}</span> Dish</p>
          <span>${meal.strCategory}</span>
        `;
        const button = document.createElement("button");
        button.innerText = "View Recipe";
        recipeDiv.appendChild(button);
        button.addEventListener('click', () => {
          recipePopup(meal);
        });
        recipeContainar.appendChild(recipeDiv);
      });
    } else {
      recipeContainar.innerHTML = '<p>No recipes found</p>';
    }
  };

  // Call the function to fetch categories when the page loads
  fetchCategories();
});

