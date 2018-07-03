let queryURL = 'https://api.edamam.com/search?q=chicken&app_id=66ec94ca&app_key=2ac8781d2e3a0ea944c221aaaa9ccf5f';
let resultsArray = [];
let userID = localStorage.getItem("userID");
let database = firebase.database();
let map;
let infoWindow;

// Function to trim recipe title
function truncateName(str, length, ending) {
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

// Function to return recipes.
function displayRecipe() {
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    
    .then(function(response) {

        resultsArray = response.hits;

        for (let i = 0; i < 9; i++) {

            let recipeNameTrim = truncateName(response.hits[i].recipe.label, 25);
            let imgURL = response.hits[i].recipe.image;

            $("#recipe").append(
                `<div id='${i}' class='recipe-item'>
                    <div class='recipe-image' style="background: url('${imgURL}'); background-position: center; background-repeat: no-repeat; background-size: cover; position:relative;">
                         <button class="fas fa-star fa-md" style="position:absolute; padding-left:10px;" onclick="addFav(${i})"></button>
                    </div>
                    <p class="recipe-name" onclick="displayPopup(${i})">${recipeNameTrim}</p>
                 </div>`
            );

        }
    })
}

displayRecipe();


function displayPopup(index) {

    let currentRecipe = resultsArray[index].recipe;

    console.log(currentRecipe);

    let recipe = `
        <img src="${currentRecipe.image}" style="float: left; padding: 5px; border: solid #000 1px; margin-right: 10px;">
        <h2>${currentRecipe.label}</h2>
        <p>By: ${currentRecipe.source}</p>
        
        
        <section class="performance-facts" style="float: right">
  <header class="performance-facts__header">
    <h1 class="performance-facts__title">Nutrition Facts</h1>
    <p>Serving Size 1/2 cup (about 82g)
    <p>Serving Per Container 8</p>
  </header>
  <table class="performance-facts__table">
    <thead>
      <tr>
        <th colspan="3" class="small-info">
          Amount Per Serving
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th colspan="2">
          <b>Calories</b>
          200
        </th>
        <td>
          Calories from Fat
          130
        </td>
      </tr>
      <tr class="thick-row">
        <td colspan="3" class="small-info">
          <b>% Daily Value*</b>
        </td>
      </tr>
      <tr>
        <th colspan="2">
          <b>Total Fat</b>
          14g
        </th>
        <td>
          <b>22%</b>
        </td>
      </tr>
      <tr>
        <td class="blank-cell">
        </td>
        <th>
          Saturated Fat
          9g
        </th>
        <td>
          <b>22%</b>
        </td>
      </tr>
      <tr>
        <td class="blank-cell">
        </td>
        <th>
          Trans Fat
          0g
        </th>
        <td>
        </td>
      </tr>
      <tr>
        <th colspan="2">
          <b>Cholesterol</b>
          55mg
        </th>
        <td>
          <b>18%</b>
        </td>
      </tr>
      <tr>
        <th colspan="2">
          <b>Sodium</b>
          40mg
        </th>
        <td>
          <b>2%</b>
        </td>
      </tr>
      <tr>
        <th colspan="2">
          <b>Total Carbohydrate</b>
          17g
        </th>
        <td>
          <b>6%</b>
        </td>
      </tr>
      <tr>
        <td class="blank-cell">
        </td>
        <th>
          Dietary Fiber
          1g
        </th>
        <td>
          <b>4%</b>
        </td>
      </tr>
      <tr>
        <td class="blank-cell">
        </td>
        <th>
          Sugars
          14g
        </th>
        <td>
        </td>
      </tr>
      <tr class="thick-end">
        <th colspan="2">
          <b>Protein</b>
          3g
        </th>
        <td>
        </td>
      </tr>
    </tbody>
  </table>
  
  <table class="performance-facts__table--grid">
    <tbody>
      <tr>
        <td colspan="2">
          Vitamin A
          10%
        </td>
        <td>
          Vitamin C
          0%
        </td>
      </tr>
      <tr class="thin-end">
        <td colspan="2">
          Calcium
          10%
        </td>
        <td>
          Iron
          6%
        </td>
      </tr>
    </tbody>
  </table>
  
  <p class="small-info">* Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs:</p>
  
  <table class="performance-facts__table--small small-info">
    <thead>
      <tr>
        <td colspan="2"></td>
        <th>Calories:</th>
        <th>2,000</th>
        <th>2,500</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th colspan="2">Total Fat</th>
        <td>Less than</td>
        <td>65g</td>
        <td>80g</td>
      </tr>
      <tr>
        <td class="blank-cell"></td>
        <th>Saturated Fat</th>
        <td>Less than</td>
        <td>20g</td>
        <td>25g</td>
      </tr>
      <tr>
        <th colspan="2">Cholesterol</th>
        <td>Less than</td>
        <td>300mg</td>
        <td>300 mg</td>
      </tr>
      <tr>
        <th colspan="2">Sodium</th>
        <td>Less than</td>
        <td>2,400mg</td>
        <td>2,400mg</td>
      </tr>
      <tr>
        <th colspan="3">Total Carbohydrate</th>
        <td>300g</td>
        <td>375g</td>
      </tr>
      <tr>
        <td class="blank-cell"></td>
        <th colspan="2">Dietary Fiber</th>
        <td>25g</td>
        <td>30g</td>
      </tr>
    </tbody>
  </table>
  
  <p class="small-info">
    Calories per gram:
  </p>
  <p class="small-info text-center">
    Fat 9
    &bull;
    Carbohydrate 4
    &bull;
    Protein 4
  </p>
  
</section>
        
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

        // Create div container
        let recipeDiv = $(`<div id='${indexCounter}' class='recipe-item'>`);

        // Call Recipe Image
        let imgURL = childSnapshot.val().recipe.image;
        let recipeImage = $(`<div id="recipe${indexCounter}" class='popup recipe-image' onclick='displayPopup(${indexCounter})' style="background: url('${imgURL}'); background-position: center; background-repeat: no-repeat; background-size: cover;"'></div>`);

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

        let recipeNameTrim = text_truncate(childSnapshot.val().recipe.label, 25);
        console.log(recipeNameTrim);

        // Call Recipe Name
        let recipeName = $('<p class="recipe-name">').html(recipeNameTrim);
        recipeDiv.append(recipeName);

        $("#favs").append(recipeDiv);

        indexCounter++;

    });
}

function loadMap() {
    console.log("Loading Maps");
    $("#recipe").empty();
    $("#recipe").html('<div id="map"></div>');
    initMap();
}