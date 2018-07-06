let queryURL = 'https://api.edamam.com/search?q=chicken&app_id=66ec94ca&app_key=2ac8781d2e3a0ea944c221aaaa9ccf5f'; // Default API URL.
let resultsArray = []; // Global binding to hold the most recent API search results - Array of Objects.
let userID = localStorage.getItem("userID"); // Sets the userID to the users ID from the local storage item created during authentication.
let database = firebase.database(); // A global reference to the Firebase database.

// Function to trim recipe title
function truncateName(str, length, ending) {
    if (length == null) {
        length = 100; // Default length of string set to 100 if not provided. (It always will be)
    }
    if (ending == null) {
        ending = '...'; // Set a defualt string ending to "..." when no ending was passed on function call. (It never will be)
    }
    if (str.length > length) { // If the string legth is greater than the length provided...

        return str.substring(0, length - ending.length) + ending; // Return a cut version of the string, adding the ending (...).

    } else { // It is not greater...

        return str; // Return the string with no changes.
    }
};

// This function is called and passed an array to be used to populate the page with recipes
function displayResuts(array) {

    $( "#recipe" ).empty(); // Empty all exsisting recipe div sets from the page.

    // Loop through the passed arry to create a div set for each recipe object in the array.
    for (let i = 0; i < array.length; i++) {

        let recipeNameTrim = truncateName(array[i].recipe.label, 20); // Trim long recipe names.
        let imgURL = array[i].recipe.image; // Get the recipe image.

        // Create a div set for the recipe found in the current index location of the passed array
        $( "#recipe" ).append(
            `<div id='${i}' class='recipe-item'>
                    <div class='recipe-image' style="background: url('${imgURL}'); background-position: center; background-repeat: no-repeat; background-size: cover; position:relative;">
                         <button id="fav${i}" class="fas fa-star fa-md" style="position:absolute; padding-left:10px;" onclick="addFav(${i})"></button>
                    </div>
                    <p class="recipe-name" onclick="displayPopup(${i})">${recipeNameTrim}</p>
                 </div>`
        );
    }
}

// Function to query recipes.
function queryRecipes() {

    $.ajax({ // jQuery ajax call to query the API.
        url: queryURL, // This will always use the global queryURL binding. And so when this function is run, it will use it in its current state.
        method: "GET"
    })
    
    .then(function(response) { // After the results are returned, push them into the resultsArray, and then call the displayResults function.

        if (response.count > 0) { // Results were returned....

            resultsArray = response.hits; // Add results to the global results array.

            displayResuts(resultsArray); // Pass the results array to the display results function.

        } else { // No results were returned.

            $( "#recipe" ).empty(); // Empty all exsisting recipe div sets from the page.

            // Add a message to let the user know that their search tearm did not include results.
            $( "#recipe" ).append(
                `<p id="no-results">We could not seem to find any recipes containing your search term. <br>Please try searching for something else.</p>`
            );
        }

    });
}

// Click function to process when the search button is clicked.
$( "#search" ).click(function(event) {

    // Prevent the page reload when the search button is clicked.
    event.preventDefault();

    // Set a variable for keyword to
    let keyword = $( "#keyword" ).val();

    if (keyword != '') { // If search term is not empty....

        // Set the global querryURL to include the keyword.
        queryURL = `https://api.edamam.com/search?q=${keyword}&app_id=66ec94ca&app_key=2ac8781d2e3a0ea944c221aaaa9ccf5f`;

        // Call the query API function after updating the queryURL.
        queryRecipes();

        // Empty the search input.
        $( "#keyword" ).val('');
    }

});

// This functions is called any time one of the side bar menu items is click. It passes in the word to be added to the queryURL.
function staticSearch(word) {

    // Set the global querryURL to include the search word.
    queryURL = `https://api.edamam.com/search?q=${word}&app_id=66ec94ca&app_key=2ac8781d2e3a0ea944c221aaaa9ccf5f`;

    // Call the query API function after updating the queryURL.
    queryRecipes();
}

// Function to display full recipe in vex modal - Called on recipe title click.
function displayPopup(index) {

    let currentRecipe = resultsArray[index].recipe; // Set the currentRecipe binding to the clicked recipe object.
    let healthLables = ''; // A string that is used to hold the health labels as HTML list items.
    let ingredients = ''; // A string that is used to hold the ingredients as HTML table rows.
    let servings = currentRecipe.yield; // This holds the serving yield of the current recipe.
    let cal = Math.floor(currentRecipe.calories / servings); // This calculates the calories per serving.

    // This loops through each of the health lables of the current recipe and adds them to the healthLabels binding.
    for (let i = 0; i < currentRecipe.healthLabels.length; i++) {
        healthLables += `<li>${currentRecipe.healthLabels[i]}</li>`
    }

    // This loops through each of the ingredients of the current recipe and adds them to the ingredients binding.
    for (let i = 0; i < currentRecipe.ingredientLines.length; i++) {
        ingredients += `<tr><td>${currentRecipe.ingredientLines[i]}</td></tr>`;
    }

    // Set the recipe binding to an HTML tring to be written to the vex modal.
    let recipe = `
        <div class="modal-body">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 col-md-6">
                        <div class="row">
                            <div class="col-12 col-md-8">
                                <img src="${currentRecipe.image}" style="float: left; width: 100%; padding: 0px; border: solid #000 1px; margin-bottom: 20px;">
                                <h2 style="margin-bottom:10px">${currentRecipe.label}</h2>
                                <div id="instructions" style="margin-bottom: 20px;">
                                    <a href="${currentRecipe.url}" target="_blank">Recipe Instructions</a>
                                </div>
                            </div>      
                        </div>    
                    </div>

                    <div class="col-12 col-md-6">
                        <div class="row">
                        <table class="table">
                                <th><h5>Nutritional Facts</h5></th>
                            </table>
                            <div class="col-6">
                                <p>Servings: ${servings}</p>
                            </div>
                        <div class="col-6">
                            <p>Calories: ${cal}</p>
                        </div>
                    </div>
                    <div class="row">
                        <table class="table">
                            <tr>
                                <th>Nutrient</th>
                                <th>Amount / Serving</th>
                            </tr>
                            <tr>
                                <td>Total Fat</td>
                                <td>${Math.floor((currentRecipe.digest[0].total / servings))} g</td>
                            </tr>
                            <tr>
                                <td>Cholesterol</td>
                                <td>${Math.floor((currentRecipe.digest[3].total / servings))} mg</td>
                            </tr>
                            <tr>
                                <td>Sodium</td>
                                <td>${Math.floor((currentRecipe.digest[4].total / servings))} mg</td>
                            </tr>
                            <tr>
                                <td>Total Carbohydrates</td>
                                <td>${Math.floor((currentRecipe.digest[1].total / servings))} g</td>
                            </tr>
                            <tr>
                                <td>Protein</td>
                                <td>${Math.floor((currentRecipe.digest[2].total / servings))} g</td>
                            </tr>
                        </table>
                    </div>
                </div>
                
                <div class="col-12 col-md-6">
                    <div class="row">
                            <table class="table">
                                <tr>
                                    <th><h5>Ingredients</h5></th>
                                </tr>
                                    <tbody>${ingredients}</tbody>
                            </table>
                    </div>
                </div>

                <div class="col-12 col-md-6">
                    <div class="row"
                        <div class="col-12">
                            <table class="table">
                                <th><h5>Allergy Information</h5></th>
                            </table>
                            <ul>
                                ${healthLables}
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;

    // Popup the vex model, listing the recipe details.
    vex.dialog.alert({
        unsafeMessage: `${recipe}`,
        className: 'vex-theme-wireframe-full',
        showCloseButton: false
    });

};

// Function to process adding favorites when favorite icon clicked.
function addFav(id) {

    // Firebase will not accept opject keys with a period(.) in the name. So, if the key "SUGAR.added" is found, remove it.
    if ("SUGAR.added" in resultsArray[id].recipe.totalNutrients) {
        delete resultsArray[id].recipe.totalNutrients["SUGAR.added"];
    }

    let userID = localStorage.getItem("userID"); // Get the user ID from the local storage variable.

    if (userID != null) { // If user ID is not empty, user is logged in...

        // Add the clicked recipe to the Firebase Database
        database.ref(`/favorites/${userID}`).push({
            recipe : resultsArray[id].recipe
        });

        // Add css class to change star to yellow and disable the button.
        $( `#fav${id}` ).prop("disabled", true);
        $( `#fav${id}` ).addClass("faved");

    } else { // User is not logged in ...

        // Popup modal to tell the user to login.
        vex.dialog.alert({
            unsafeMessage: '<p>You must be signed in to add favorites.</p>\n' +
            '               <a href="./login.html">Sign In</a>',
            className: 'vex-theme-wireframe'
        });
    }
}

// Function to load the users favorites when the "Favorites" nav button is clicked.
function loadFavorites() {

    $("#recipe").empty(); // Removes all exsisting recipe dives from the page.
    $("#recipe").html('<div id="favs"></div>'); // Adds a new Div to be used to add favorites.

        if (userID !== null) { // If the userID is not null, the user is signed in...

            startListener(); // Starts the Firebase listener process to populate the page.

        } else { // User is not signed in....

            // Add a message to the page asking the user to sign in to view favorites.
            $( "#favs" ).append(`<div class="fav-error"><p>You must be signed in to view your favorites.</p>
                                 <a href="./login.html">Sign In</a></div>`);
        }
}

// Function to trigger the listener to populate favorites divs.
function startListener() {

    let indexCounter = 0; // Create an index counter to be used to associate an ID to each recipe DIV when the listener loops through the Firebase entries.
    resultsArray = []; // Clear the global resultsArray.

    // Start the Firebase listner - Pull recipe fav entries where nested under the users ID.
    database.ref(`/favorites/${userID}`).on("child_added", function(childSnapshot) {

        resultsArray.push(childSnapshot.val()); // Push the recipe object into the global resultsArray.

        let recipeNameTrim = truncateName(childSnapshot.val().recipe.label, 20); // Trim long recipe names.
        let imgURL = childSnapshot.val().recipe.image; // Set the recipe image

        // Append the recipe div set with the current recipe object form firebase.
        $("#favs").append(
            `<div id='${indexCounter}' class='recipe-item'>
                 <div class='recipe-image' style="background: url('${imgURL}'); background-position: center; background-repeat: no-repeat; background-size: cover; position:relative;"></div>
                 <p class="recipe-name" onclick="displayPopup(${indexCounter})">${recipeNameTrim}</p>
             </div>`
        );

        indexCounter++; // Increment the index counter before moving to the next recipe object.

    });
}

// Initial recipe load
queryRecipes();

function loadMap() {
    $("#recipe").empty();
    $("#map").html('<div class="map-container"><object style="" data="map.html"/></div>');
}