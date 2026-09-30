export function wireOrderButton(document) {
  // Intentional demo bug: the page uses "place-order".
  const button = document.getElementById("order-button");
  if (!button) {
    return false;
  }

  button.addEventListener("click", () => {
    const confirmation = document.getElementById("confirmation");
    confirmation.textContent = "Order received! We'll start cooking now.";
  });

  return true;
}
