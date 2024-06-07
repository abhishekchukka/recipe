const express = require("express");
const path = require("path");
const app = express();
const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0fRn6Y_aAXsDdjoiNGHcJmMawKv34BDs",
  authDomain: "assignment-4f1cb.firebaseapp.com",
  projectId: "assignment-4f1cb",
  storageBucket: "assignment-4f1cb.appspot.com",
  messagingSenderId: "319331197445",
  appId: "1:319331197445:web:476ec63472eec47eaff26c",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Endpoint to create a new user
app.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const auth = getAuth(firebaseApp);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        res.sendFile(path.join(__dirname, "login-success.html"));
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        res.status(400).send(`Error: ${errorMessage}`);
      });
  } catch (e) {
    console.error(e);
    res.redirect("/register"); // Redirect to register page on error
  }
});

// Endpoint to login a user
app.post("/log-in", async (req, res) => {
  try {
    const { email, password } = req.body;
    const auth = getAuth(firebaseApp);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        res.sendFile(path.join(__dirname, "login-success.html")); // Redirect to login success page
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        res.status(400).send(`Error: ${errorMessage}`); // Send an error response
      });
  } catch (e) {
    console.error(e);
    res.redirect("/login"); // Redirect to login page on error
  }
});

// Endpoint to fetch recipes
app.get("/recipe", async (req, res) => {
  const recipeName = req.query.name;
  const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`;

  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching the recipe:", error);
    res.status(500).send("Error fetching the recipe");
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
