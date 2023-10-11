import * as firebase from "./firebase/firebase.js";
import { getAuth, onAuthStateChanged, } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, getCountFromServer, getDoc } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";

const auth = getAuth(firebase.app);
const db = getFirestore(firebase.app);
const storage = getStorage();

// global variable declaration
let userEmail, userName, userMobileno, rideCount, imgPath, imgURL, currentRide;
// calculation variable
let startingKm, startingDate, startingTime, paymentStatus;
let endingKm, endingDate, endingTime;
let startArray, endArray, orderId, subTotal, checkoutMoney;
// calculation variable
// global variable declaration

var loader = document.getElementById("loading");

document.addEventListener("DOMContentLoaded", checkUser, true)
function checkUser() {

  $("#panel3").slideUp("fast");
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
  rideCount = "ride_" + (snapshot.data().count + 1); // increment by one bcz reuired uploading ride count
  currentRide = "ride_" + snapshot.data().count;
  console.log(currentRide);

  // current User Data
  const userAccountref = doc(db, "Users", userEmail);
  const userAccountdetail = await getDoc(userAccountref);
  userName = userAccountdetail.data().name;
  userMobileno = userAccountdetail.data().mobile_no;

  // checkPayment();
  if (typeof rideCount !== 'undefined') // stop loading animation
  {
    loader.style.display = "none";
  }
}
function fileUpload(fileId) //file id : input file id
{
  var fileInput = document.getElementById(fileId);
  let fileElement = fileInput.files[0];
  let fileName = fileElement.name.split('.').shift() + Math.floor(Math.random() * 10);
  imgPath = userEmail + '/' + fileId + '/' + fileName;
  console.log("Path Of Image Storage" + imgPath);

  const imgstorageRef = ref(storage, imgPath);
  const uploadTask = uploadBytesResumable(imgstorageRef, fileInput.files[0]);

  uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    },
    (error) => {
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log("Url From This Keyword " + downloadURL);
        imgURL = downloadURL;
      });
    }
  );
}

function setTimeDate(element) {
  var now = new Date();
  // set time
  var timeInput = document.getElementsByClassName('time')[element];
  timeInput.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  // set Date
  var dateInput = document.getElementsByClassName('date')[element];
  dateInput.value = now.toISOString().slice(0, 10) || {};
}

async function checkPayment() {
  // alert("Check Your Payment Details 💳")
  const docRef = doc(db, `Users/${userEmail}/rides`, currentRide);
  const docSnap = await getDoc(docRef);
  console.log(docSnap.data());
  paymentStatus = docSnap.data().paymentStatus;
  if (paymentStatus == "pending") {
    $("#panel3").slideDown("fast");
    alert("Complete Prvious Ride Payment!!⚠️⚠️")
    document.getElementById("startingKm").value = docSnap.data().startingKm;
    document.getElementById("startingDate").value = docSnap.data().startingDate;
    document.getElementById("startingTime").value = docSnap.data().startingTime;

    document.getElementById("endingKm").value = docSnap.data().endingKm;
    document.getElementById("endingDate").value = docSnap.data().endingDate;
    endingTime = document.getElementById("endingTime").value = docSnap.data().endingTime;

  }
}

// perform when clicked start Ride 
document.getElementById("startRidebtn").addEventListener("click", async function () {
  if (paymentStatus !== "pending") {
    setTimeDate(0);
    fileUpload("startMeter");

    startingKm = document.getElementById("startingKm").value;
    startingDate = document.getElementById("startingDate").value; // year-month-date
    startingTime = document.getElementById("startingTime").value;
    console.log("User Start Ride " + startingDate + " at " + startingTime + "Intial Reading " + startingKm);

    await setDoc(doc(db, `Users/${userEmail}/rides`, rideCount), {
      startingDate: startingDate,
      startingTime: startingTime,
      startingKm: startingKm,
      StartingImg: imgPath,
      paymentStatus : "pending"
    }, { merge: true });
    // alert(`Record Add To the ${rideCount}`);
    alert(`Journey 🏙️ Begins 🚴‍♀️🚴‍♀️🚴‍♀️`);
  }
})

// perform when clicked end ride
document.getElementById("endRidebtn").addEventListener("click", async function () {
  if (paymentStatus !== "pending") {
    setTimeDate(1);
    fileUpload("endMeter");

    endingKm = document.getElementById("endingKm").value;
    endingDate = document.getElementById("endingDate").value; // year-month-date
    endingTime = document.getElementById("endingTime").value;
    console.log("User Start Ride " + endingDate + " at " + endingTime + "Intial Reading " + endingKm);

    await setDoc(doc(db, `Users/${userEmail}/rides`, rideCount), {
      endingDate: endingDate,
      endingTime: endingTime,
      endingKm: endingKm,
      endingImage: imgPath
      // endingImgurl : photoURL
    }, { merge: true });
    // alert(`Record Add To the ${rideCount}`);
    alert(`Ride Completed Safly😃😃😃`);

  }
})


document.getElementById("flip3").addEventListener("click", async function () {
  console.log("Clicked Payment option");

  const userAccref = doc(db, "Users", userEmail);
  const userAccdetail = await getDoc(userAccref);
  let uname = (userAccdetail.data().name).replace(/\s/g, '');
  console.log(uname);

  let docSnap;
  if (paymentStatus == "pending") {
    const docRef = doc(db, `Users/${userEmail}/rides`, currentRide);
    docSnap = await getDoc(docRef);
  }else
  {
    const docRef = doc(db, `Users/${userEmail}/rides`, rideCount);
    docSnap = await getDoc(docRef);
  }

  orderId = rideCount + Math.floor(Math.random() * 100);
  document.getElementById("oid").innerHTML = orderId;
  console.log("Ride Count :" + rideCount);

  document.getElementById("userName").innerHTML = uname;
  let totalTime, totalKm, amountOnkm
  if (docSnap.exists()) {
    let calStartime = docSnap.data().startingTime;
    let calEndtime = docSnap.data().endingTime;
    startArray = calStartime.split(":");
    endArray = calEndtime.split(":");
    console.log("Starting Array :" + startArray);
    console.log("Ending Array :" + endArray);
    totalTime = ((endArray[0] - startArray[0]) * 60) + (endArray[1] - startArray[1]);
    totalKm = docSnap.data().endingKm - docSnap.data().startingKm;
    console.log(totalKm);
    amountOnkm = totalKm * 4.5;
    subTotal = (totalKm * 4.5) + (totalTime * 1)
    console.log(totalTime);
    console.log("Document data:", docSnap.data());
    document.getElementById("setKm").innerHTML = totalKm;
    document.getElementById("setTime").innerHTML = totalTime;
    document.getElementById("amountOnkm").innerHTML = amountOnkm;
    document.getElementById("amountOnmin").innerHTML = totalTime * 1;
    document.getElementById("subTotal").innerHTML = subTotal + " Rs";
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
  let CountRide;
  if(paymentStatus == "pending")
  {
    CountRide = currentRide;
  }else
  {
    CountRide = rideCount;
  }
  await setDoc(doc(db, `Users/${userEmail}/rides`, CountRide), {
    customerName: uname,
    orderId: orderId,
    totalKm: totalKm,
    totalTime: totalTime,
    amountOnkm: amountOnkm,
    amountOnmin: totalTime
  }, { merge: true });
  // alert("Record Add To the Start_Ride");
  checkoutMoney = subTotal * 100;;
  console.log("type of subTOtal :" + typeof (checkoutMoney));
})

export { orderId, userName, userEmail, userMobileno, checkoutMoney };
/* ---------------------jquary slideup-down code ---------------------------*/
$(document).ready(function () {
  $("#flip").click(function () {
    $("#panel").slideToggle("slow");
  });
});
$(document).ready(function () {
  $("#flip2").click(function () {
    $("#panel2").slideToggle("slow");
    $("#panel").slideUp("slow");
  });
});
$(document).ready(function () {
  $("#flip3").click(function () {
    $("#panel3").slideToggle("slow");
    $("#panel2").slideUp("slow");
    document.getElementById("pymentBtn").scrollIntoView();
  });
});
/* ---------------------jquary slideup-down code ---------------------------*/

/* ---------------------nav bar code ---------------------------*/
const mobile_nav = document.querySelector(".mobile-navbar-btn");
const nav_header = document.querySelector(".header")
const toggleNavbar = () => {
  // alert("Aayush");
  nav_header.classList.toggle("active");
}
mobile_nav.addEventListener("click", () => toggleNavbar())
/* ---------------------nav bar code ---------------------------*/