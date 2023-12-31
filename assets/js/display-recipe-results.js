// API for recipe information
viewRecipeInfo();
function viewRecipeInfo() {
  var recipeId = localStorage.getItem('recipe');
  // need to replace with variable that reflects the selected recipe id  
    var apiKey = '994d5186ebf845a4a4d8311b272c6d11';
    var apiURL = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`
    
    fetch(apiURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        displayRecipeInfo(data);
      })
      .catch(function (error){
        console.error("Error:", error);
      })
  }
  
  // Function that displays fetched recipe information in 
  var displayRecipeInfo = (data) => {
    var recipeInfoContainer = document.getElementById("info-container");
    var recipeInfo = document.createElement("div");
    recipeInfo.className = "recipe-info";
    var ingredientsList = ''; // Create an empty string to store ingredients
  
    for (var i = 0; i < data.extendedIngredients.length; i++) {
      var ingredient = data.extendedIngredients[i].original;
      ingredientsList += `<li class="ingredient-item">${ingredient}</li>`; // Append each ingredient to the list
    }
  
    recipeInfo.innerHTML = `
      <div class="recipe-content container row-100">
        <h2 class="recipe-title row w-100">${data.title}</h2>
        <p class="recipe-details row w-100">Ready in: ${data.readyInMinutes} minutes, Servings: ${data.servings}</p>
        <br>
        <div class="row w-100">
          <img src="${data.image}" alt="${data.title}" class="recipe-img col-sm">
            <div class="ingredient-container col-sm">
            <h4 class="recipe-ingredients">Ingredients:</h4>
            <ul class="ingredient-list">
              ${ingredientsList} <!-- Insert the list of ingredients here -->
            </ul>
          </div>
          <p class="recipe-summary w-100">${data.summary}</p>
          <div class="recipe-instructions row w-100">
          <h2 class="bolder">Instructions:<br></h2>${data.instructions}
          </div>
        </div>
      </div>
    `;
  
    recipeInfoContainer.appendChild(recipeInfo);
  };
