import * as firebase from "./firebase/firebase.js";
import { getAuth, onAuthStateChanged, } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getCountFromServer, getDoc, collectionGroup } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";


const app = firebase.app;
const auth = getAuth(firebase.app);
const db = getFirestore(firebase.app);
const storage = getStorage();

var loader = document.getElementById("loading");

document.addEventListener("DOMContentLoaded", checkUser)
let userEmail, rideCount, userName, userMobileno;
function checkUser() {
  console.log("Check User Function Execution Start");
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userEmail = user.email;
      console.log("User Email Is " + userEmail)
      console.log("User Find UID" + user.uid);
      getData();
      
    } else {
      location.reload("./login.html");
      console.log("User Not Found");
    }
  });
}
async function getData() {

  // count last ride 
  const coll = collection(db, `Users/${userEmail}/rides`);
  const snapshot = await getCountFromServer(coll);
  console.log("Past Ride Count From Current User : ", snapshot.data().count);
  rideCount = "ride_" + (snapshot.data().count); // increment by one bcz reuired uploading ride count
  // current User Data
  const userAccountref = doc(db, "Users", userEmail);
  const userAccountdetail = await getDoc(userAccountref);
  userName = userAccountdetail.data().name;
  userMobileno = userAccountdetail.data().mobile_no;

  // bill details
  const billRef = doc(db, `Users/${userEmail}/rides`, rideCount);
  const billdetails = await getDoc(billRef);
  console.log(billdetails.data());
  let orderId = billdetails.data().orderId;
  let startingDate = billdetails.data().startingDate;
  let endingDate = billdetails.data().endingDate;
  let totalTime = billdetails.data().totalTime;
  let totalKm = billdetails.data().totalKm;
  let amountOnmin = billdetails.data().amountOnmin;
  let amountOnkm = billdetails.data().amountOnkm;
  let subTotal = amountOnmin + amountOnkm;
  setData(orderId, startingDate, endingDate, userMobileno, totalTime, totalKm, amountOnmin, amountOnkm, subTotal);
  pdf();
}

function setData(orderId, startingDate, endingDate, userMobileno, totalTime, totalKm, amountOnmin, amountOnkm, subTotal) {
  document.getElementById("oid").innerHTML = orderId;
  document.getElementById("invDate").innerHTML = startingDate;
  document.getElementById("invDuedate").innerHTML = endingDate;
  document.getElementById("billto").innerHTML = userMobileno;
  document.getElementById("min").innerHTML = totalTime + " MIN";
  document.getElementById("km").innerHTML = totalKm + " KME";
  document.getElementById("minAmount").innerHTML = amountOnmin + " Rs";
  document.getElementById("kmAmount").innerHTML = amountOnkm + " Rs";
  document.getElementById("subTotal").innerHTML = subTotal + " Rs";
  document.getElementById("subTotal2").innerHTML = subTotal + " Rs";
  document.getElementById("subTotal3").innerHTML = subTotal + " Rs";

  loader.style.display = "none"; // completely then load data 
  
}

async function pdf() {
  const docRef = doc(db, `Users/${userEmail}/rides`, rideCount);
  const docSnap = await getDoc(docRef);
  await setDoc(doc(db, `Users/${userEmail}/rides`, rideCount), {
    paymentStatus : "paid"
  }, { merge: true });
  let ele = document.getElementById("billBox");
  html2pdf().from(ele).save()
}
document.getElementById("print").addEventListener("click",pdf);

