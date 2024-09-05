
function addToCart(product) {
// Prevent default form submission behavior
event.preventDefault();

// Retrieve cart items from local storage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
// Add the product to the cart
cartItems.push(product);
// Store updated cart items in local storage
localStorage.setItem('cartItems', JSON.stringify(cartItems));
// Show the modal
var modal = document.getElementById("myModal");
modal.style.display = "flex";
}
var span = document.getElementsByClassName("close")[0];
span.onclick = function () {
var modal = document.getElementById("myModal");
modal.style.display = "none";
}

function goToCart() {
window.location.href = "cart"; // Change "home" to the actual URL of your home screen
}
