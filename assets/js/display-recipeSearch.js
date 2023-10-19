// APi to display recipe search results

function getRecipeApi() {

  var requestURL = "https://api.spoonacular.com/recipes/complexSearch?apiKey=251762f82c2f4947978e9c9e7007612f&query=pasta&ingredients=number=16"

  fetch(requestURL)
    .then(function (response) {
      console.log(response)
      return response.json();
    })
    .then(function (data) {
      for (var i = 0; i< data.length; i++) {
        console.log(data[i].id)
      }
    });

}

// getRecipeApi();

// Function to display recipe search results on cards

function displayRecipe(resultObj) {
  console.log(resultObj)

  var recipeCard = document.createElement("div")
  recipeCard.classList.add("card")

  var recipeBody = document.createElement("div")
  recipeBody.classList.add("card-body")
  recipeCard.append(recipeBody);
  
  var recipeTitleEl = document.createElement("h5")
  recipeTitleEl.textContent = resultObj.title;
  recipeBody.append(recipeTitleEl);

  var recipeImgEl = document.createElement("img")
  recipyBody.append(recipeImgEl);

  var recipeDescriptionEl = document.createElement("div")
  recipeBody.append(recipeDescriptionEl);

}

displayRecipe();