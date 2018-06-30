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

        for (var i = 0; i < 9; i++) {

            // Create div container
            var recipeDiv = $(`<div id='${i}' class='recipe-item'>`);

            // Call Recipe Image
            var imgURL = response.hits[i].recipe.image;
            var recipeImage = $(`<div class='popup recipe-image' onclick='displayPopup(${i})' style="background: url('${imgURL}'); background-position: center; background-repeat: no-repeat; background-size: cover;"'><i class="fas fa-star"></i></div>`).attr({
                id: 'recipe'+i,
            })
            recipeDiv.append(recipeImage);

            // recipeDiv.append(`<i class="fas fa-star"></i>`);

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

            recipeNameTrim = text_truncate(response.hits[i].recipe.label, 25);
            console.log(recipeNameTrim);

            // Call Recipe Name
            var recipeName = $('<p class="recipe-name">').html(recipeNameTrim);
            recipeDiv.append(recipeName);

            $("#recipe").append(recipeDiv);

        }
    })
}

displayRecipe();


function displayPopup(index) {

    // $.ajax({
    //     url: queryURL,
    //     method: "GET"
    // })
    //
    // .then(function(response) {
    //
    //     // Create div container
    //     var ingredientDiv = $(`<div class='recipe-content'>`);
    //
    //     // Call image
    //     var imgURL = response.hits[1].recipe.image;
    //     var recipeImage = $('<img>').attr({
    //         src: imgURL,
    //         id: 'recipe',
    //     })
    //     ingredientDiv.append(recipeImage);
    //
    //     // Shorten Recipe Name
    //     text_truncate = function(str, length, ending) {
    //         if (length == null) {
    //             length = 100;
    //         }
    //         if (ending == null) {
    //             ending = '...';
    //         }
    //         if (str.length > length) {
    //             return str.substring(0, length - ending.length) + ending;
    //         } else {
    //             return str;
    //         }
    //     };

        var ingredientDiv = $(`<div class='recipe-content'>`);

        recipeNameTrim = text_truncate(resultsArray[index].recipe.label, 25);
        console.log(recipeNameTrim);

        // Call Recipe Name
        var recipeName = $('<p class="recipe-name">').html(recipeNameTrim);
        ingredientDiv.append(recipeName);

        // Call ingredients
        var ingredientList = $('<p class="ingredient-list">').html(resultsArray[index].recipe.ingredientLines[1]);
        ingredientDiv.append(ingredientList);

        // Place content inside container
        $("#popup").append(ingredientDiv);

        var options = { content : $('#popup') };
        $('.popup').popup(options);

    // });

};

// displayPopup();
