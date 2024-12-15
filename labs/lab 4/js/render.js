import { dishes } from "./dishes.js"

const mainBlock = document.querySelector('main')
const sortedDishes = dishes.sort((a, b) => a.name.localeCompare(b.name));

// function fn() {}

// const fn = () => {}

console.log(dishes)
function renderDishes(element) {
    const categories = {
        soup: 'Суп',
        mainDish: 'Главное блюдо',
        drink: 'Напиток'
    };

    for (const category in categories) {
        const dishSection = document.createElement('section');
        dishSection.classList.add('dishes');
        const header = document.createElement('h2');
        header.textContent = categories[category];
        dishSection.appendChild(header);
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');

        sortedDishes.forEach((dish) => {
            if (dish.category === category) {
                const dishDiv = document.createElement('div');
                categoryDiv.appendChild(dishDiv);
                dishDiv.outerHTML = `
                <div data-dish="${dish.keyword}" class="dish">
                <img src="${dish.image}" alt="${dish.name}" />
                <div class="dish-content">
                <p class="dish-price">${dish.price}</p>
                <p class="dish-title">${dish.name}</p>                    
                <p class="dish-weight">${dish.count}</p>
                <button class="add-button">Добавить</button>
                </div>
                </div>`;
            }
        })
        dishSection.appendChild(categoryDiv);
        element.prepend(dishSection)
    }

}

renderDishes(mainBlock)

function setupAddButtons() {
    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', function () {

        });
    });
}

