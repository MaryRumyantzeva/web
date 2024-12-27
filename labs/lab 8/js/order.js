import { setupForm, loadDishes } from "./render.js";

let sortedDishes = [];

export function renderDishes(element, dishes) {
  const orderItems = JSON.parse(localStorage.getItem("order") || "[]");

  const order = orderItems.reduce((prev, current) => {
    const dish = sortedDishes.find(dish => dish.keyword === current);
    prev[dish.category] = dish;
    return prev;
  }, {});

  const dishSection = document.createElement("section");
  dishSection.innerHTML = `
        <h2 class='order-items-heading'>Состав заказа</h2>
    `;
  dishSection.classList.add("dishes");

  const categoryDiv = document.createElement("div");
  categoryDiv.classList.add("category");

  Object.values(order).forEach(dish => {
    const emptyOrderHeading = document.querySelector(".empty-order-heading");
    emptyOrderHeading.classList.add("hidden");

    const dishDiv = document.createElement("div");
    categoryDiv.appendChild(dishDiv);
    dishDiv.outerHTML = `
        <div data-dish="${dish.keyword}" data-kind=${dish.kind} class="dish">
        <img src="${dish.image}" alt="${dish.name}" />
        <div class="dish-content">
        <p class="dish-price">${dish.price}₽</p>
        <p class="dish-title">${dish.name}</p>                    
        <p class="dish-weight">${dish.count}</p>
        <button class="remove-button">Удалить</button>
        </div>
        </div>`;
  });
  dishSection.appendChild(categoryDiv);
  element.appendChild(dishSection);
}

loadDishes().then(dishes => {
  sortedDishes = dishes.sort((a, b) => a.name.localeCompare(b.name));
  renderDishes(document.querySelector("main"), dishes);
  setupForm(sortedDishes);
});
