  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-analytics.js";
  // https://firebase.google.com/docs/web/setup#available-libraries
  // https://firebase.google.com/docs/web/learn-more#libraries-cdn
  
  const firebaseConfig = {
    apiKey: "AIzaSyA4JHf-tVcI0YY0F4RmW2TRhbTFvkcL46A",
    authDomain: "eazeyourride.firebaseapp.com",
    projectId: "eazeyourride",
    storageBucket: "eazeyourride.appspot.com",
    messagingSenderId: "382824051953",
    appId: "1:382824051953:web:46796e2ee24ca75c01e550",
    measurementId: "G-XHRVK12WQH"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  console.log(app);
  console.log("Firebse Connection Separate File Over");