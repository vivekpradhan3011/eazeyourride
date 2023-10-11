// alert("Register.js Has Been Now Worked");
import * as firebase from "./firebase/firebase.js"; 
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js"

const app = firebase.app;
const auth = getAuth(firebase.app);
const db = getFirestore(firebase.app);

let email, password, phoneNo, path, name;

document.getElementById("verificationCodebtn").addEventListener("click", async function () {

  name = document.getElementById("name").value;
  phoneNo = document.getElementById("mNo").value;
  email = document.getElementById("email").value;
  password = document.getElementById("pwd").value;
  // path = `User/${name}/Account`;
  // console.log(path);

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      alert("Account Created Successfully ! 🤝");
      location.replace("./login.html");
    })
    .catch((error) => {
      console.log(error.code + " " + error.message);
      alert(error.code + " " + error.message);
      // ..
    });

  await setDoc(doc(db, "Users", email), {
    name: name,
    email: email,
    mobile_no: phoneNo,
    password: password,
  }); // set data to the current user



});