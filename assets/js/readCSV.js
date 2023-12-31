var csvLink = './assets/data/spoonacular_top1k_ingredients_20231016.csv';
// read existing CSV file, parse according to specified delimiter, create array of objects
function readCSV(csvFileUrl) {
  return fetch(csvFileUrl)
    .then(response => response.text())
    .then(text => {
      const lines = text.split('\n');
      const objects = [];

      lines.forEach(line => {
        const columns = line.split(';');
        const object = {
          ingredientName: columns[0],
          ingredientID: columns[1]
        };
        objects.push(object);
      });

      // take ingredient array and create and pass a new array with object properties renamed to label and value
      return $.map(objects, function (displayArray) {
        return {
          label: displayArray.ingredientName,
          value: displayArray.ingredientID
        }
      });
    });
}

// Clear ingredientSelection on page load
localStorage.setItem("selectedIngredients", JSON.stringify([]));

// Usage

readCSV(csvLink)
  .then(objects => {
    // takes ingredients from readCSV function and add them to suggestions
    // Then append them to the results div
    $("#ingredients").autocomplete({

      // The source of the suggestions for the autocomplete array
      source: objects,
      // The minimum number of characters a user has to type before autocomplete suggestions display
      minLength: 3,

      // Function that is run when an item from the autocomplete list is selected
      // ui contains name and id for selected ingredient
      select: function (e, ui) {
       
        var ingredientName = ui.item.label;
        var ingredientList = JSON.parse(localStorage.getItem("selectedIngredients"));
        // check for repeated ingredient 
        var repeat = false;
        if (ingredientList.length > 0) {
          for (var x in ingredientList) {
            if (ingredientList[x] === ingredientName) {
              repeat = true;
              $('#errorBody').text(ingredientName + ' has already been selected as an ingredient.')
              $('#errorModal').modal('show');
            }
          }
        }

        if (!repeat) {
          // Display selected ingredient in results section
          $('#results').append(`<div class= 'd-flex p-1 m-1 ingredientHolder'><p class='mb-0 text-capitalize'>
        ${ingredientName}</p><p class = 'removeIngredient  px-1 mb-0 mx-1'>x</p></div>`);

          // retrieve selected ingredients from localstorage, or if empty set empty array
          var ingredientList = JSON.parse(localStorage.getItem("selectedIngredients")) || [];

          // add current selected ingredient to array and save to localstorage
          ingredientList.push(ingredientName);
          localStorage.setItem("selectedIngredients", JSON.stringify(ingredientList));
        }
        //clear the value from the textbox and stop the event
        $(this).val(''); return false;
      },
      // Change the value in the text area based on which item is being focused on by hovering or up/down arrow key
      focus: function (e, ui) {
        $(this).val(ui.item.label)
        return false;
      }
    });
  })
  .catch(error => {
    console.error("Error:", error);  });

// Remove ingredient from the list of selected ingredients on user click
$('#results').on('click', '.ingredientHolder', function (event) {
  var ingredient = $(this).children().eq(0)[0].innerHTML.trim();
  $(this).remove();
  var ingredientList = JSON.parse(localStorage.getItem("selectedIngredients"));
  for (var x in ingredientList) {
    if (ingredientList[x] === ingredient) {
      ingredientList.splice(x, 1);
    }
  }
  localStorage.setItem("selectedIngredients", JSON.stringify(ingredientList));
  $('#errorBody').text(ingredient + ' was removed from the ingredient list.')
  $('#errorModal').modal('show');
});



function getRecipesByIngredients(ingredientList){
  var API_key = "994d5186ebf845a4a4d8311b272c6d11"
  // recieve input from multientry control
  // take array and convert to comma-delimited string  
  selectedIngredientsString = ingredientList.join(',+')
  var recipesByIngredientsURL = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=" +API_key + "&ingredients=" +selectedIngredientsString + "&number=10"// ingredients array seperated by commas

  fetch(recipesByIngredientsURL)
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
    // Handle the JSON data
    displayFoodSearchResults(data);
  })
  .catch(error => {
    // Handle any errors that occurred during the request
    console.error("Error:", error);
  });
  }

  var favoritesList = [];
  var data = [];

  

  function searchRecipesByFood(foodQuery) {
    var apiKey = '994d5186ebf845a4a4d8311b272c6d11';

    var apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${foodQuery}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(responseData => {
        displayFoodSearchResults(responseData.results);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  function displayFoodSearchResults(recipes) {
    var resultsContainer = document.getElementById("results2");
    resultsContainer.innerHTML = "";

    recipes.forEach(recipe => {
      var recipeCard = document.createElement("div");
      recipeCard.className = "card";
      recipeCard.innerHTML = `
          <img src="${recipe.image}" class="card-img-top img-thumbnail" alt="${recipe.title}">
          <div class="card-body">
              <h5 class="card-title">${recipe.title}</h5>

              <button class="btn btn-primary viewRecipe" data-recipe-id="${recipe.id}">View Recipe</a> <br>
              <button class="btn btn-success save-button" data-recipe-id="${recipe.id}">Save</button><button class="btn btn-info shop-button text-light" data-recipe-id="${recipe.id}">Add to Shopping List</button>
          </div>
      `;

      resultsContainer.appendChild(recipeCard);
    });

    // Event listeners for view recipe buttons
    document.querySelectorAll(".viewRecipe").forEach(button => {
      button.addEventListener("click", function () {
      var recipeId = button.getAttribute("data-recipe-id");
        localStorage.setItem('recipe', recipeId);
        window.location = "./recipe-results.html";
        })
      });
    

    // Update the event listeners for save buttons
    document.querySelectorAll(".save-button").forEach(button => {
      button.addEventListener("click", function () {
        var recipeId = button.getAttribute("data-recipe-id");

        // Find the selected recipe in the search results
        var selectedRecipe = recipes.find(recipe => recipe.id == recipeId);

        // Check if the recipe is not already in the favorites list
        if (!favoritesList.some(recipe => recipe.id === recipeId)) {
          favoritesList.push(selectedRecipe);

          // update the button text to indicate that it's saved.
          button.textContent = "Saved";

          // Save the updated favorites list to local storage
          saveFavoritesToLocalStorage();

          // Update the displayed favorites
          displayFavorites();
        }
      });
    });

    // add event listener to shop buttons and add ingredient id to shopping list array
    document.querySelectorAll(".shop-button").forEach(button => {
      button.addEventListener("click", function () {
        var recipeId = button.getAttribute("data-recipe-id");
        // update the button text to indicate that it's saved.
        button.textContent = "Added";
        var shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
        // check for repeated ingredient 
        var repeat = false;
        if (shoppingList.length > 0) {
          for (var x in shoppingList) {
            if (shoppingList[x] === recipeId) {
              repeat = true;
            }
          }
        }
        
        if (!repeat) {
          shoppingList.push(recipeId);
          localStorage.setItem("shoppingList", JSON.stringify(shoppingList));
        }
      }
      );
    });
  }

  function displayFavorites() {
    var favoritesContainer = document.getElementById("favorites");
    if (!favoritesContainer) {
      return; // Favorites container not found
    }
    favoritesContainer.innerHTML = ""; // Clear any previous favorites

    favoritesList.forEach(recipe => {
      var favoriteCard = document.createElement("div");
      favoriteCard.className = "card";
      favoriteCard.innerHTML = `
            <img src="${recipe.image}" class="card-img-top img-thumbnail" alt="${recipe.title}">
            <div class="card-body">
                <h5 class="card-title">${recipe.title}</h5>
                <a href="${recipe.sourceUrl}" class="btn btn-primary" target="_blank">View Recipe</a>
            </div>
        `;

      favoritesContainer.appendChild(favoriteCard);
    });
  }

  // Save favorites to local storage
  function saveFavoritesToLocalStorage() {
    localStorage.setItem("favorites", JSON.stringify(favoritesList));
  }

  // Load favorites from local storage when the page loads
  function loadFavoritesFromLocalStorage() {
    var savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      favoritesList = JSON.parse(savedFavorites);
      displayFavorites(); // Update the displayed favorites
    }
  }

  // Call loadFavoritesFromLocalStorage when the page loads
  loadFavoritesFromLocalStorage();
