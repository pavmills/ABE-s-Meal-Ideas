initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            let userID = user.uid;
            user.getIdToken().then(function() {
                localStorage.setItem("userID", userID);
            });
        } else {
            // User is signed out.
            $( ".navbar-nav" ).append(`
                <li class="nav-item">
                    <button id="signin" class="nav-link" onclick="signIn()">Sign In</button>
                </li>
            `);

        }
    }, function(error) {
        console.log(error);
    });
};