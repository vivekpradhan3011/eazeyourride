import { orderId, userName, userEmail, userMobileno, checkoutMoney } from "./ride.js";

let apiKey = "rzp_test_pK7z38UOSMybZn";


document.getElementById('pymentBtn').onclick = function (e) {
  var options = {
    "key": apiKey, // Enter the Key ID generated from the Dashboard
    "amount": checkoutMoney, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "EAZEYOURRIDE", //your business name
    "description": "Test Transaction",
    "image": "https://parmaraayush.github.io/eazeyourride/Sass/assets/Logo.png",
    "id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "callback_url": "https://parmaraayush.github.io/eazeyourride/bill.html",
    "redirect":true,
    // "callback_url": "<p>Thanks For Ride Please GO back To menu and Print Your Recipt</p>",
    "prefill": {
      "name": userName, //your customer's name
      "email": userEmail,
      "contact": userMobileno
    },
    "notes": {
      "address": "Razorpay Corporate Office"
    },
    "theme": {
      "color": "#3399cc"
    }
  };

  var rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
}