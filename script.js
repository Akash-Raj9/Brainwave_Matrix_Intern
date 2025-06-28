// Add to Cart
const cartButtons = document.querySelectorAll("button");

cartButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const productCard = btn.closest(".product");
    const productName = productCard.querySelector("h4").textContent;
    const price = productCard.querySelector("p").textContent;
    alert(`🛒 ${productName} added to cart!\nPrice: ${price}`);
  });
});

// Search Filter
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
  const filter = searchInput.value.toLowerCase();
  const products = document.querySelectorAll(".product");

  products.forEach((product) => {
    const name = product.getAttribute("data-name").toLowerCase();
    product.style.display = name.includes(filter) ? "block" : "none";
  });
});
