import { dishes } from "./dishes.js"

const mainBlock = document.querySelector('main')
const sortedDishes = dishes.sort((a, b) => a.name.localeCompare(b.name));

// function fn() {}

// const fn = () => {}

const CATEGORIES = {
    dessert: 'Десерт',
    drink: 'Напиток',
    salat: 'Салат',
    mainDish: 'Главное блюдо',
    soup: 'Суп',

};

const FILTERS = {
    soup: [
        { label: "рыбный", value: "fish" },
        { label: "мясной", value: "meat" },
        { label: "вегетарианский", value: "veg" }
    ],
    mainDish: [
        { label: "рыбное", value: "fish" },
        { label: "мясное", value: "meat" },
        { label: "вегетарианское", value: "veg" }
    ],
    salat: [
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


function renderDishes(element) {

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
    const resetButton = document.querySelectorAll('.form-button[type="reset"]');
    console.log(resetButton);

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
        const input = document.createElement('input');

        input.name = label.dataset.category
        input.classList.add('hidden');

        paragraph.innerHTML = 'Блюдо не выбрано';
        paragraph.classList.add('empty-category')
        paragraph.classList.add('hidden')

        label.after(paragraph);
        paragraph.after(input);
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

            const dishElementsInThisCategory = dishElement.parentElement.querySelectorAll('.dish');
            dishElementsInThisCategory.forEach(el => el.classList.remove('dishes-active'));

            document.querySelectorAll(`.dish[data-category]`)
            addButtons.forEach(b => b.classList.remove('button-active'));
            button.classList.add('button-active');   
            dishElement.classList.add('dishes-active');

            labels.forEach(label => {
                const labelCategory = label.dataset.category;

                const paragraph = label.nextElementSibling;
                const input = paragraph.nextElementSibling;

                paragraph.classList.remove('hidden')

                if (labelCategory === dish.category) {
                    const paragraphText = `${dish.name} ${dish.price}₽`
                    paragraph.innerHTML = paragraphText;                            
                    

                    input.value = dish.keyword;
                }
                paragraph.classList.add('empty-category')
            })

            totalSumElement.innerHTML = `${totalSummary(order)}₽`;
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


    resetButton.forEach(buton => {
        buton.addEventListener('click', (event) => {
            emptyOrderLabel.classList.remove('hidden')
            totalSumElement.parentElement.classList.add('hidden');
            labels.forEach(label => label.classList.add('hidden'));
                        
            const button = event.target;
            const dishElement = button.parentElement.parentElement;
                    
            document.querySelectorAll(`.dish[data-category]`)
            addButtons.forEach(b => b.classList.remove('button-active'));

            addButtons.forEach(b =>{
                const dishElement = b.parentElement.parentElement;
                console.log(dishElement)
                    
                const dishElementsInThisCategory = dishElement.parentElement.querySelectorAll('.dish');
                dishElementsInThisCategory.forEach(el => el.classList.remove('dishes-active'));
            });     
            
            labels.forEach(label => {
                const paragraph = label.nextElementSibling;
                paragraph.classList.add('hidden')
                paragraph.classList.remove('empty-category')
            })
        });
    });
}


setupForm();


