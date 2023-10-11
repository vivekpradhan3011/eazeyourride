// alert("cNow login.js Has Been Worked");
import * as firebase from "./firebase/firebase.js"; 
import { getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
// import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js"

const app = firebase.app;
const auth = getAuth(firebase.app);
// const db = getFirestore(firebase.app);

let email, password;

document.getElementById("loginBtn").addEventListener("click", function (){

    email = document.getElementById("email").value;
    password = document.getElementById("pwd").value;

    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    alert("Welcom To Eaze Ride 👋")
    location.replace("./ride.html");
  })
  .catch((error) => {
    alert(error.code + " " + error.message);
    alert("Plaease Try Again!! 💀")
  });

})
/* ---------------------nav bar code ---------------------------*/
const mobile_nav = document.querySelector(".mobile-navbar-btn");
const nav_header = document.querySelector(".header")
const toggleNavbar = () => {
  // alert("Aayush");
  nav_header.classList.toggle("active");
}
mobile_nav.addEventListener("click", () => toggleNavbar())
/* ---------------------nav bar code ---------------------------*/