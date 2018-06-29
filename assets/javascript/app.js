var recipe = $(this).attr("data-name");
var queryURL = 'https://api.edamam.com/search?q=chicken&app_id=66ec94ca&app_key=2ac8781d2e3a0ea944c221aaaa9ccf5f';
var resultsArray = []

function displayRecipe() {
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    
    .then(function(response) {
        //
        resultsArray = response.hits;

        for (var i = 0; i < 10; i++) {

            // Call Recipe Image
            var recipeDiv = $(`<div id='${i}' class='recipe-item'>`);
            var imgURL = response.hits[i].recipe.image;
            var recipeImage = $('<img>').attr({
                src: imgURL,
                height: '200px',
                id: "recipe"+i,
            })
            recipeDiv.append(recipeImage);

            // Shorten Recipe Name
            text_truncate = function(str, length, ending) {
                if (length == null) {
                  length = 100;
                }
                if (ending == null) {
                  ending = '...';
                }
                if (str.length > length) {
                  return str.substring(0, length - ending.length) + ending;
                } else {
                  return str;
                }
              };

            recipeNameTrim = text_truncate(response.hits[i].recipe.label, 18);
            text_truncate(recipeNameTrim);
            console.log(recipeNameTrim);

            // Call Recipe Name
            var recipeName = $('<p id="recipe-name">').html(recipeNameTrim);
            recipeDiv.append(recipeName);



         
            $('.recipe-rating').html(`Calories: ${response.hits[i].recipe.calories}`);

            // Log the data in the console as well
        
            console.log(response.hits[i].recipe.image);

            $("#recipe").append(recipeDiv);

        }
    })
}

$(document).on("click", displayRecipe);




