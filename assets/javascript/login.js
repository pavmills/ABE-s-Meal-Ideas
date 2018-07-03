window.addEventListener('load', function() {
    initApp()

    // FirebaseUI config.
    let uiConfig = {
        signInSuccessUrl: 'favorites.html',
        signInOptions: [

            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ]
    };

// Initialize the FirebaseUI Widget using Firebase.
    let ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
});

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
                    <button id="signin" class="nav-link navBtn" onclick="signIn()">Sign In</button>
                </li>
            `);

        }
    }, function(error) {
        console.log(error);
    });
};