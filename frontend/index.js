//Redirect to Home when clicked
document.querySelector("#title-logo").addEventListener("click", function () {
  window.location.href = `http://${window.location.host}/frontend/index.html`;
});

// Getting Search data
function getSearchData() {
  const departure = document.querySelector("#departure").value;
  const arrival = document.querySelector("#arrival").value;
  const date = document.querySelector("#date").value;
  if (date.trim() === "" || departure.trim() === "" || arrival.trim() === "") return;

  return { departure, arrival, date: new Date(date) };
}

// When clicked to search button
const searchButton = document.querySelector("#submit-search-button");
searchButton &&
  searchButton.addEventListener("click", function () {
    const body = getSearchData();
    // Si le body est vide on affiche une alerte
    if (!body) return alert("Vous devez entrer votre depart, arrivé et date pour valider");

    fetch(`http://localhost:3000/trips?departure=${body.departure}&arrival=${body.arrival}&date=${body.date}`)
      .then((response) => response.json())
      .then(({ trips, result }) => {
        if (!result) {
          document.querySelector("#logo-img").setAttribute("src", "./images/notfound.png");
          document.querySelector("#result-text").textContent = "No trip found";
        }
        if (trips && trips.length > 0) {
          document.querySelector(".result").innerHTML = "";
          document.querySelector(".result").classList.remove("result-base");

          const result = document.querySelector(".result");
          trips.map((trip) => {
            //   console.log(trip);
            result.innerHTML += `
        <div class="result-books">
          <p>${trip.departure} > ${trip.arrival}</p>
          <p>${new Date(trip.date).getHours()}:${new Date(trip.date).getMinutes()}</p>
          <p><strong>${trip.price} €</strong></p>
          <button id="book" data-trip=${JSON.stringify(trip)}>Book</button>
        </div>`;
          });
        }
      })
      .then(() => {
        // When clicked to to Book
        const bookButtons = document.querySelectorAll("#book");
        Array.from(bookButtons).map((button) => {
          button.addEventListener("click", function () {
            const { departure, arrival, date, price } = JSON.parse(button.dataset.trip);
            console.log(departure, arrival, date, price);
            fetch("http://localhost:3000/carts", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ departure, arrival, date, price }),
            })
              .then((response) => response.json())
              .then((returned) => console.log(returned))
              .catch((error) => {
                console.error("Error:", error);
              });
            window.location.href = `http://${window.location.host}/frontend/cart.html`;
          });
        });
      });
  });

//   Carts
function displayCarts() {
  fetch("http://localhost:3000/carts")
    .then((response) => response.json())
    .then(({ carts }) => {
      // Dans ce block se trouve la logique pour recuperer les carts depuis le backend et les affichers en frontend
      if (!carts.length > 0) {
        const emptyButton = document.querySelector("#empty");
        const myCart = document.querySelector("#my-cart");
        if (emptyButton && myCart) {
          emptyButton.style.display = "block";
          myCart.style.display = "none";
        }
      } else {
        const baskets = document.querySelector("#baskets");
        let total = 0;
        baskets &&
          carts.map((cart) => {
            total += cart.price;
            baskets.innerHTML += `
            <div class="result-books">
            <p>${cart.departure} > ${cart.arrival}</p>
            <p>${new Date(cart.date).getHours()}:${new Date(cart.date).getMinutes()}</p>
            <p><strong>${cart.price} €</strong></p>
            <button id="delete-cart" data-id=${cart._id}>❌</button>
          </div>
            `;
          });
        const totalSpan = document.querySelector("#total-value");
        if (totalSpan) {
          totalSpan.textContent = total;
        }
        return carts;
      }
    })
    // Dans ce block se trouve la logique pour  payer le panier
    .then((carts) => {
      const purchaseButton = document.querySelector("#purchase");
      if (purchaseButton) {
        purchaseButton.addEventListener("click", function () {
          carts.map((cart) => {
            // Permet de supprimer l'_id et __v
            // delete cart._id;
            // delete cart.__v;
            console.log(cart);
            fetch(`http://localhost:3000/carts/${cart._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ...cart, isPaid: true }),
            })
              .then((response) => response.json())
              .then((returned) => {
                console.log(returned);
                window.location.href = `http://${window.location.host}/frontend/booking.html`;
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          });
        });
      }
    })
    // Dans ce block se trouve la logique pour supprimer chaque cart
    .then(() => {
      // When clicked to delete cart
      const deleteButtons = document.querySelectorAll("#delete-cart");
      Array.from(deleteButtons).map((button) => {
        button.addEventListener("click", function () {
          const id = button.dataset.id;
          fetch(`http://localhost:3000/carts/${id}`, {
            method: "DELETE",
          })
            .then((response) => response.json())
            .then((returned) => {
              console.log(returned);
              //   permet d'actualiser la page automatiquement
              window.location.reload();
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });
      });
    });
}
displayCarts();

// Bookings
function displayBookings() {
  fetch("http://localhost:3000/carts/bookings")
    .then((response) => response.json())
    .then(({ carts }) => {
      // Dans ce block se trouve la logique pour recuperer les carts depuis le backend et les affichers en frontend
      if (!carts.length > 0) {
        const empty = document.querySelector("#book-empty");
        const myBooking = document.querySelector("#my-booking");
        if (empty && myBooking) {
          empty.style.display = "block";
          myBooking.style.display = "none";
        }
      } else {
        const books = document.querySelector("#books");

        books &&
          carts.map((cart) => {
            const departure = new Date(cart.date).getHours() - new Date().getHours();
            books.innerHTML += `
            <div class="result-books">
                <p>${cart.departure} > ${cart.arrival}</p>
                <p>${new Date(cart.date).getHours()}:${new Date(cart.date).getMinutes()}</p>
                <p><strong>${cart.price} €</strong></p>
                <p>${departure > 0 ? `Departure in ${departure} hours` : "expired"}</p>
            </div>
            `;
          });

        return carts;
      }
    });
}

displayBookings();
