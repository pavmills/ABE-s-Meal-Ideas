let queryURL = 'https://api.edamam.com/search?q=chicken&app_id=66ec94ca&app_key=2ac8781d2e3a0ea944c221aaaa9ccf5f';
let resultsArray = [];
let userID = localStorage.getItem("userID");
let database = firebase.database();

// Function to trim recipe title
function truncateName(str, length, ending) {
    if (length == null) {
        length = 100;
    }
    if (ending == null) {
        ending = '...'; // Set a defualt string ending to "..." when no ending was passed on function call.
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
};

// This function is called and passed an array to be used to populate the page with recipes
function displayResuts(array) {

    for (let i = 0; i < array.length; i++) {

        let recipeNameTrim = truncateName(array[i].recipe.label, 25);
        let imgURL = array[i].recipe.image;

        // Create a div set for the recipe found in the current index location of the passed array
        $("#recipe").append(
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
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    
    .then(function(response) {

        resultsArray = response.hits; // Add results to the global results array.

        displayResuts(resultsArray); // Pass the results array to the display results function.

    });
}

queryRecipes();


function displayPopup(index) {

    let currentRecipe = resultsArray[index].recipe;

    console.log(currentRecipe);

    let recipe = `
        <img src="${currentRecipe.image}" style="float: left; padding: 5px; border: solid #000 1px; margin-right: 10px;">
        <h2>${currentRecipe.label}</h2>
        <p>By: ${currentRecipe.source}</p>
    `;

    vex.dialog.alert({
        unsafeMessage: `${recipe}`,
        className: 'vex-theme-wireframe-full'
    });

};

// Function to process adding favorites when favorite icon clicked.
function addFav(id) {

    let userID = localStorage.getItem("userID");
    console.log(userID);
    if (userID != null) {
        database.ref(`/favorites/${userID}`).push({
            recipe : resultsArray[id].recipe
        });
        console.log('Favorite Added.');
        $( `#fav${id}` ).prop("disabled", true);
        $( `#fav${id}` ).addClass("faved");
    } else {
        vex.dialog.alert({
            unsafeMessage: '<p>You must be signed in to add favorites.</p>\n' +
            '               <a href="./login.html">Sign In</a>',
            className: 'vex-theme-wireframe'
        });
        console.log('You must sign in to add favorites.');
    }
}

// Function to load the users favorites when the "Favorites" nav button is clicked.
function loadFavorites() {
    $("#recipe").empty();
    $("#recipe").html('<div id="favs"></div>');

        if (userID !== null) {
            startListener();
        } else {
            $( "#favs" ).append(`<p>You must be signed in to view your favorites.</p>
                                 <a href="./login.html">Sign In</a>`);
        }
}

// Function to trigger the listener to populate favorites divs.
function startListener() {
    let indexCounter = 0;
    resultsArray = [];

    database.ref(`/favorites/${userID}`).on("child_added", function(childSnapshot) {

        resultsArray.push(childSnapshot.val());

        let recipeNameTrim = truncateName(childSnapshot.val().recipe.label, 25);
        let imgURL = childSnapshot.val().recipe.image;

        $("#favs").append(
            `<div id='${indexCounter}' class='recipe-item'>
                 <div class='recipe-image' style="background: url('${imgURL}'); background-position: center; background-repeat: no-repeat; background-size: cover; position:relative;"></div>
                 <p class="recipe-name" onclick="displayPopup(${indexCounter})">${recipeNameTrim}</p>
             </div>`
        );

        indexCounter++;

    });
}