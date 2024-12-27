import { renderDishes, setupGetLunch, loadDishes } from "./render.js";

const comboSection = document.querySelector('.combo')
let sortedDishes = [];

loadDishes().then(dishes => {
    sortedDishes = dishes.sort((a, b) => a.name.localeCompare(b.name));
    renderDishes(comboSection, sortedDishes);
    setupGetLunch(sortedDishes);
});
