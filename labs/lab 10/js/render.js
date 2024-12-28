const CATEGORIES = {
    dessert: 'Десерт',
    drink: 'Напиток',
    'salad': 'Салат',
    'main-course': 'Главное блюдо',
    soup: 'Суп',

};

const FILTERS = {
    soup: [
        { label: "рыбный", value: "fish" },
        { label: "мясной", value: "meat" },
        { label: "вегетарианский", value: "veg" }
    ],
    'main-course': [
        { label: "рыбное", value: "fish" },
        { label: "мясное", value: "meat" },
        { label: "вегетарианское", value: "veg" }
    ],
    'salad': [
        { label: "рыбный", value: "fish" },
        { label: "мясной", value: "meat" },
        { label: "вегетарианский", value: "veg" }
    ],
    drink: [
        { label: "холодный", value: "cold" },
        { label: "горячий", value: "hot" },
    ],
    dessert: [
        { label: "маленькая порция", value: "small-size" },
        { label: "средняя порция", value: "average-size" },
        { label: "большая порция", value: "big-size" }
    ],
};

const COMBOS = [
    { soup: "Суп", drink: "Напиток", 'main-course': "Главное блюдо", 'salad': "Салат" },
    { drink: "Напиток", 'main-course': "Главное блюдо", 'salad': "Салат" },
    { soup: "Суп", drink: "Напиток", 'main-course': "Главное блюдо" },
    { soup: "Суп", drink: "Напиток", 'salad': "Салат" },
    { drink: "Напиток", 'main-course': "Главное блюдо" },

    { soup: "Суп", drink: "Напиток", 'main-course': "Главное блюдо", 'salad': "Салат", dessert: 'Десерт' },
    { soup: "Суп", drink: "Напиток", 'main-course': "Главное блюдо", dessert: 'Десерт' },
    { soup: "Суп", drink: "Напиток", 'salad': "Салат", dessert: 'Десерт' },
    { drink: "Напиток", 'main-course': "Главное блюдо", dessert: 'Десерт' },
    { drink: "Напиток", 'main-course': "Главное блюдо", 'salad': "Салат", dessert: 'Десерт' },
];

export function renderDishes(element, sortedDishes) {
    for (const category in CATEGORIES) {
        const dishSection = document.createElement('section');
        dishSection.classList.add('dishes');

        const header = document.createElement('h2');
        header.textContent = CATEGORIES[category];
        dishSection.appendChild(header);

        const filterDiv = document.createElement("div");
        filterDiv.classList.add("filters");

        FILTERS[category].forEach((filter) => {
            const filterButton = document.createElement("button");
            filterButton.textContent = filter.label;
            filterButton.dataset.kind = filter.value;
            filterButton.classList.add("filter-button");
            filterDiv.appendChild(filterButton);
        });

        dishSection.appendChild(filterDiv);

        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category');
        categoryDiv.setAttribute('data-category', category);

        sortedDishes.forEach((dish) => {
            if (dish.category === category) {
                const dishDiv = document.createElement('div');
                categoryDiv.appendChild(dishDiv);
                dishDiv.outerHTML = `
                <div data-dish="${dish.keyword}" data-kind=${dish.kind} class="dish">
                <img src="${dish.image}" alt="${dish.name}" />
                <div class="dish-content">
                <p class="dish-price">${dish.price}₽</p>
                <p class="dish-title">${dish.name}</p>                    
                <p class="dish-weight">${dish.count}</p>
                <button class="add-button">Добавить</button>
                </div>
                </div>`;
            }
        });

        dishSection.appendChild(categoryDiv);
        element.after(dishSection)
    }

}


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

function showModal(message) {
    const modal = document.getElementById("modal");
    const modalText = document.getElementById("modal-text");
    modalText.textContent = message;
    modal.classList.remove("hidden");
}


export function setupGetLunch(sortedDishes) {
    const orderTotalLabelElement = document.querySelector('.order-total-label');
    const bottomTotalSumElement = document.querySelector('.order-total');
    bottomTotalSumElement.classList.add('hidden');

    const addButtons = document.querySelectorAll('.add-button');
    const orderItems = JSON.parse(localStorage.getItem('order') || '[]');

    const order = orderItems.reduce((prev, current) => {
        const dish = sortedDishes.find(dish => dish.keyword === current);
        prev[dish.category] = dish;
        return prev;
    }, {});

    const orderLink = document.querySelector('.order-total-action');
    orderLink.addEventListener('click', () => window.location.replace('./buyorder.html'));

    const orderKeys = Object.keys(order);

    const isOrderValid = COMBOS.some(combo => {
        const comboKeys = Object.keys(combo);
        if (comboKeys.every(comboKey => orderKeys.includes(comboKey))) {
            return true;
        }
        return false;
    })

    if (isOrderValid) {
        orderLink.disabled = false;
    } else {
        orderLink.disabled = true;
    }

    Object.values(order).forEach((dishFromOrder) => {
        const dishElements = Array.from(document.querySelectorAll('.dish'));
        const dishElement = dishElements.find(dishElement => dishElement.dataset.dish === dishFromOrder.keyword);
        const button = dishElement.querySelector('button');

        button.classList.add('button-active');
        dishElement.classList.add('dishes-active');
        bottomTotalSumElement.classList.remove('hidden');
        orderTotalLabelElement.textContent = `Итого: ${totalSummary(order)}₽`;
    });

    addButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const orderLink = document.querySelector('.order-total-action');
            const button = event.target;
            const dishElement = button.parentElement.parentElement;
            const dishKeyword = dishElement.dataset.dish

            const dish = sortedDishes.find(value => value.keyword === dishKeyword);
            order[dish.category] = dish;

            const dishElementsInThisCategory = dishElement.parentElement.querySelectorAll('.dish');
            dishElementsInThisCategory.forEach(el => el.classList.remove('dishes-active'));

            const dishButtonInThisCategory = dishElement.parentElement.querySelectorAll('.add-button');
            dishButtonInThisCategory.forEach(b => b.classList.remove('button-active'));
            document.querySelectorAll(`.dish[data-category]`)

            button.classList.add('button-active');
            dishElement.classList.add('dishes-active');
            bottomTotalSumElement.classList.remove('hidden');
            orderTotalLabelElement.textContent = `Итого: ${totalSummary(order)}₽`;

            const storedItems = Object.values(order).map(value => value.keyword);

            localStorage.setItem('order', JSON.stringify(storedItems));

            const orderKeys = Object.keys(order);

            const isOrderValid = COMBOS.some(combo => {
                const comboKeys = Object.keys(combo);
                if (comboKeys.every(comboKey => orderKeys.includes(comboKey))) {
                    return true;
                }
                return false;
            })

            if (isOrderValid) {
                orderLink.disabled = false;
            } else {
                orderLink.disabled = true;
            }
        });
    });

    const filterButtons = document.querySelectorAll(".filter-button");

    filterButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const clickedButton = event.target;
            const kind = event.target.dataset.kind;
            const categoryDiv = event.target.parentElement.parentElement;
            const dishesFilter = categoryDiv.querySelectorAll(".dish");


            if (clickedButton.classList.contains("active-btn")) {
                clickedButton.classList.remove("active-btn");
                dishesFilter.forEach((dish) => {
                    dish.style.display = "block";
                });
            } else {
                const allButtons = clickedButton.parentElement.querySelectorAll(".filter-button");
                allButtons.forEach((btn) => btn.classList.remove("active-btn"));

                clickedButton.classList.add("active-btn");


                dishesFilter.forEach((dish) => {
                    if (dish.dataset.kind === kind || !kind) {
                        dish.style.display = "block";
                    } else {
                        dish.style.display = "none";
                    }
                });
            }
        });
    });
    // addButtons.forEach(b => b.classList.remove('button-active'));

    // addButtons.forEach(b => {
    //     const dishElement = b.parentElement.parentElement;

    //     const dishElementsInThisCategory = dishElement.parentElement.querySelectorAll('.dish');
    //     dishElementsInThisCategory.forEach(el => el.classList.remove('dishes-active'));
    // });
}


export function setupForm(sortedDishes) {
    const rootElement = document.querySelector('.order');
    const resetButton = document.querySelector('.form-button[type="reset"]');
    const sendButton = document.querySelectorAll('.form-button[type="submit"]');

    const emptyOrderLabel = document.querySelector('.empty-order-label')
    const labels = document.querySelectorAll('#dishes label[data-category]');
    const totalSumElement = document.querySelector('#totalsum');

    totalSumElement.parentElement.classList.add('hidden');
    labels.forEach(label => label.classList.add('hidden'));

    rootElement.classList.remove('hidden');
    labels.forEach(label => {
        const paragraph = document.createElement('p');
        const input = document.createElement('input');

        input.name = label.dataset.category + '_id';
        input.classList.add('hidden');

        paragraph.innerHTML = 'Блюдо не выбрано';
        paragraph.classList.add('empty-category')
        paragraph.classList.add('hidden')

        label.after(paragraph);
        paragraph.after(input);
    })

    const orderItems = JSON.parse(localStorage.getItem('order') || '[]');

    const order = orderItems.reduce((prev, current) => {
        const dish = sortedDishes.find(dish => dish.keyword === current);
        prev[dish.category] = dish;
        return prev;
    }, {});

    Object.values(order).forEach(dish => {
        emptyOrderLabel.classList.add('hidden')
        totalSumElement.parentElement.classList.remove('hidden');
        labels.forEach(label => label.classList.remove('hidden'));

        labels.forEach(label => {
            const labelCategory = label.dataset.category;

            const paragraph = label.nextElementSibling;
            const input = paragraph.nextElementSibling;

            paragraph.classList.remove('hidden')

            if (labelCategory === dish.category) {
                const paragraphText = `${dish.name} ${dish.price}₽`
                orderItems.push(dish);
                paragraph.innerHTML = paragraphText;
                input.value = dish.id;
            }
            paragraph.classList.add('empty-category')
        })

        totalSumElement.innerHTML = `${totalSummary(order)}₽`;
    })

    const removeButtons = document.querySelectorAll('.remove-button');

    function handleEmptyOrder() {
        emptyOrderLabel.classList.remove('hidden')
        totalSumElement.parentElement.classList.add('hidden');
        labels.forEach(label => label.classList.add('hidden'));

        document.querySelectorAll(`.dish[data-category]`)


        labels.forEach(label => {
            const paragraph = label.nextElementSibling;
            paragraph.classList.add('hidden')
            paragraph.classList.remove('empty-category')
            paragraph.innerHTML = 'Блюдо не выбрано';
        })

        Object.keys(order).forEach(key => order[key] = null);
        totalSumElement.innerHTML = '0₽';
        localStorage.removeItem('order');

        const dishDivs = document.querySelectorAll('.dish');
        dishDivs.forEach(dishDiv => dishDiv.remove());

        const emptyOrderHeading = document.querySelector(".empty-order-heading");
        emptyOrderHeading.classList.remove("hidden");
    }

    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const dishDiv = button.parentElement.parentElement;
            const dishKeyword = dishDiv.dataset.dish;

            const dish = Object.values(order).find(d => d.keyword === dishKeyword);
            delete order[dish.category];

            const storedItems = Object.values(order).map(value => value.keyword);
            localStorage.setItem('order', JSON.stringify(storedItems));
            dishDiv.remove();
            emptyOrderLabel.classList.remove('hidden');

            labels.forEach(label => {
                const labelCategory = label.dataset.category;

                const paragraph = label.nextElementSibling;
                const input = paragraph.nextElementSibling;

                paragraph.classList.remove('hidden')

                console.log(labelCategory, dish.category)
                if (labelCategory === dish.category) {
                    paragraph.innerHTML = 'Блюдо не выбрано';
                    input.value = null;
                }
                paragraph.classList.add('empty-category')
            });

            const totalSumElement = document.querySelector('#totalsum');
            totalSumElement.textContent = `${totalSummary(order)}₽`;

            if (Object.values(order).length === 0) {
                handleEmptyOrder();
                return;
            }
        })
    })
    resetButton.addEventListener('click', handleEmptyOrder);
    const form = document.forms[0];
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const modal = document.getElementById("modal");
        modal.classList.remove("hidden");

        const orderCategories = orderItems.map(dish => dish.category).filter((v, i, a) => a.indexOf(v) === i);

        if (orderItems.length === 0) {
            showModal("Ничего не выбрано. .");
            return;
        }

        else if ((orderCategories.includes('drink') && (orderItems.length === 1)) || (orderCategories.includes('drink') && orderCategories.includes('dessert') && orderItems.length <= 2)
            || (orderCategories.includes('dessert') && (orderItems.length === 1))) {
            showModal("Выберите главное блюдо");
            return;
        }

        else if ((orderCategories.includes('salad')) && !(orderCategories.includes('soup')) && !(orderCategories.includes('main-course')) ||
            (orderCategories.includes('salad')) && !(orderCategories.includes('soup')) && !(orderCategories.includes('main-course')) && (orderCategories.includes('drink')) ||
            (orderCategories.includes('salad')) && !(orderCategories.includes('soup')) && !(orderCategories.includes('main-course')) && (orderCategories.includes('drink')) && (orderCategories.includes('dessert'))) {
            showModal("Выберите суп или главное блюдо");
            return;
        }

        else if ((orderCategories.includes('soup')) && !(orderCategories.includes('salad')) && (orderCategories.includes('main-course')) ||
            (orderCategories.includes('soup')) && !(orderCategories.includes('salad')) && (orderCategories.includes('main-course')) && (orderCategories.includes('drink')) ||
            (orderCategories.includes('soup')) && !(orderCategories.includes('salad')) && (orderCategories.includes('main-course')) && (orderCategories.includes('drink')) && (orderCategories.includes('dessert'))) {
            showModal("Выберите салат");
            return;
        }

        else if (orderCategories.includes('soup') && !(orderCategories.includes('salad')) && !(orderCategories.includes('main-course')) ||
            (orderCategories.includes('soup')) && !(orderCategories.includes('salad')) && !(orderCategories.includes('main-course')) && (orderCategories.includes('drink')) ||
            (orderCategories.includes('soup')) && !(orderCategories.includes('salad')) && !(orderCategories.includes('main-course')) && (orderCategories.includes('drink')) && (orderCategories.includes('dessert'))) {
            showModal("Выберите главное блюдо/салат/стартер");
            return;
        }
        else if ((orderCategories.includes('soup') && (orderCategories.includes('salad')) && (orderCategories.includes('main-course')) && !(orderCategories.includes('drink')))
            || (orderCategories.includes('soup') && (orderCategories.includes('salad')) && (orderCategories.includes('main-course')) && !(orderCategories.includes('drink')) && (orderCategories.includes('dessert')))) {
            showModal("Выберите напиток");
            return;
        }
        else {
            const modal = document.getElementById("modal");
            modal.classList.add("hidden");
        }
        const BASE_URL = 'https://edu.std-900.ist.mospolytech.ru';
        const API_KEY = '74ca26d4-79b4-484e-a3a8-201b7d84a758';

        const formData = new FormData(form);

        fetch(BASE_URL + '/labs/api/orders?api_key=' + API_KEY, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            localStorage.clear();
            window.location.reload();
        })
        .catch(reason => alert('Не удалось оформить заказ!'))
    });

    document.getElementById("modal-ok").addEventListener("click", () => {
        const modal = document.getElementById("modal");
        modal.classList.add("hidden");
    });
}



export function loadDishes() {
    return fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network error!!!!');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Ошибка! ', error);
        });
}
