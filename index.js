const express = require("express");
const path = require("path");
const app = express();
const { initializeApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");


const firebaseConfig = {
  apiKey: "AIzaSyB0fRn6Y_aAXsDdjoiNGHcJmMawKv34BDs",
  authDomain: "assignment-4f1cb.firebaseapp.com",
  projectId: "assignment-4f1cb",
  storageBucket: "assignment-4f1cb.appspot.com",
  messagingSenderId: "319331197445",
  appId: "1:319331197445:web:476ec63472eec47eaff26c",
};


const firebaseApp = initializeApp(firebaseConfig);


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


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
    res.redirect("/register");
  }
});


app.post("/log-in", async (req, res) => {
  try {
    const { email, password } = req.body;
    const auth = getAuth(firebaseApp);

    signInWithEmailAndPassword(auth, email, password)
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
    res.redirect("/login"); 
  }
});


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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
