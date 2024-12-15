import { dishes } from "./dishes.js"

const mainBlock = document.querySelector('main')
const sortedDishes = dishes.sort((a, b) => a.name.localeCompare(b.name));

// function fn() {}

// const fn = () => {}

const CATEGORIES = {
    drink: 'Напиток',
    mainDish: 'Главное блюдо',
    soup: 'Суп',
};

function renderDishes(element) {

    for (const category in CATEGORIES) {
        const dishSection = document.createElement('section');
        dishSection.classList.add('dishes');
        const header = document.createElement('h2');
        header.textContent = CATEGORIES[category];
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
                <p class="dish-price">${dish.price}₽</p>
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
function totalSummary(order) {
    let totalSum = 0;
    const dishes = Object.values(order)
    dishes.forEach(function (dish) {
        if (dish !== null) {
            totalSum += dish.price;
        }
    });
    return totalSum
}
function setupForm() {
    const addButtons = document.querySelectorAll('.add-button');
    const order = {
        soup: null,
        mainDish: null,
        drink: null,
    }
    const emptyOrderLabel = document.querySelector('.empty-order-label')
    const labels = document.querySelectorAll('#dishes label[data-category]');
    const totalSumElement = document.querySelector('#totalsum');
    totalSumElement.parentElement.classList.add('hidden');
    labels.forEach(label => label.classList.add('hidden'));
    labels.forEach(label => {
        const paragraph = document.createElement('p');
        paragraph.innerHTML = 'Блюдо не выбрано';
        paragraph.classList.add('empty-category')
        paragraph.classList.add('hidden')
        label.after(paragraph);
    })

    addButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            emptyOrderLabel.classList.add('hidden')
            totalSumElement.parentElement.classList.remove('hidden');
            labels.forEach(label => label.classList.remove('hidden'));
            const button = event.target;
            const dishElement = button.parentElement.parentElement;
            const dishKeyword = dishElement.dataset.dish
            const dish = sortedDishes.find(value => value.keyword === dishKeyword);
            order[dish.category] = dish;
            labels.forEach(label => {
                const labelCategory = label.dataset.category;
                const paragraph = label.nextElementSibling;
                paragraph.classList.remove('hidden')
                if (labelCategory === dish.category) {
                    const paragraphText = `${dish.name} ${dish.price}₽`
                    paragraph.innerHTML = paragraphText;
                }
                paragraph.classList.add('empty-category')
            })

            totalSumElement.innerHTML = `${totalSummary(order)}₽`;
        });
    });
}


setupForm();
