let cartCounter = document.querySelector('#cartCounter');
function updateCart(order_add) {
      // Define the URL to which you want to send the POST request
      const url = '/update-cart';
  
      // Make a POST request with the Fetch API
      fetch(url, {
          method: 'POST', // or 'PUT'
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(order_add), // Convert the order_add object into a JSON string
      })
      .then(response => {
          if (!response.ok) {
              // If the server response is not ok, throw an error
              throw new Error('Network response was not ok');
          }
          return response.json(); // Parse the JSON response body
      })
      .then(data => {
          // Here you can handle the response. For example, you could
          // display a confirmation message to the user
          console.log('Success:', data);
          cartCounter.innerText = JSON.stringify(data.totalQty);
      })
      .catch((error) => {
          // Handle any errors that occurred during the fetch operation
          console.error('Error:', error);
      });
  }
  
  let addToCart = document.querySelectorAll('.cart-button');
  addToCart.forEach((btn) => {
      btn.addEventListener('click', (e) => {
          let order_add = JSON.parse(btn.dataset.order);
          updateCart(order_add);
          console.log(order_add);
      })
  });

