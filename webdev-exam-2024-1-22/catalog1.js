const apiUrl = 'http://api.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?api_key=74ca26d4-79b4-484e-a3a8-201b7d84a758';
const apiKey = '74ca26d4-79b4-484e-a3a8-201b7d84a758';

let goods = [];
let filteredGoods = [];
let currentDisplayedGoods = 6;

function getCategoriesFromGoods(goods) {
    const categoriesWithSubCategories = goods.reduce((prev, current) => {
        prev[current.main_category] ??= [];
        if (prev[current.main_category].indexOf(current.sub_category) < 0) {
            prev[current.main_category].push(current.sub_category);
        }
        return prev;
    }, {});
    return categoriesWithSubCategories;
}

export function renderGoods(goods) {
    const categoryContainer = document.querySelector('.cata-log');
    categoryContainer.innerHTML = '';

    const goodsToShow = goods.slice(0, currentDisplayedGoods);
    goodsToShow.forEach((good) => {
        const goodDiv = document.createElement('div');
        goodDiv.classList.add('good');
        const discountPercentage = good.discount_price
            ? Math.round(((good.actual_price - good.discount_price) / good.actual_price) * 100)
            : null;

        goodDiv.innerHTML = `
            <img src="${good.image_url}" alt="${good.name}" class="good-img">
            <div class="good-content">
                <p class="good-title">${good.name}</p>
                <p class="good-rating">
                    ${good.rating}
                    <span class="rating-stars" data-rating="${good.rating}"></span>
                </p>
                <p class="good-price">
                    ${good.discount_price ? `<span class="striked-price">${good.actual_price}₽</span>` : `${good.actual_price}₽`}
                    ${good.discount_price
                ? `<span class="discount-percentage" style="color: red;">-${discountPercentage}%</span>` : ''}
                </p>
                ${good.discount_price ? `<p class="discount-price">${good.discount_price}₽</p>` : ''}
                <button class="add-button">Добавить</button>
            </div>
        `;
        categoryContainer.appendChild(goodDiv);
    });

    updateStars();

    //  загрузить ещё
    const loadMoreButton = document.querySelector('#load-more');
    if (goods.length <= currentDisplayedGoods) {
        loadMoreButton.style.display = 'none';
    } else {
        loadMoreButton.style.display = 'block';
    }
}

function updateStars() {
    document.querySelectorAll('.rating-stars').forEach(starContainer => {
        const rating = parseFloat(starContainer.dataset.rating);
        starContainer.innerHTML = '';

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            if (i <= Math.floor(rating)) {
                star.classList.add('bi', 'bi-star-fill');
            } else if (i - rating < 1) {
                star.classList.add('bi', 'bi-star-half');
            } else {
                star.classList.add('bi', 'bi-star');
            }
            starContainer.appendChild(star);
        }
    });
}


// сортировка
function applySorting() {
    const sortOption = document.querySelector('#sort-select').value;

    if (sortOption === 'price-asc') {
        filteredGoods.sort((a, b) => a.actual_price - b.actual_price);
    } else if (sortOption === 'price-desc') {
        filteredGoods.sort((a, b) => b.actual_price - a.actual_price);
    } else if (sortOption === 'rating-asc') {
        filteredGoods.sort((a, b) => a.rating - b.rating);
    } else if (sortOption === 'rating-desc') {
        filteredGoods.sort((a, b) => b.rating - a.rating);
    }
    
}

document.querySelector('#sort-select').addEventListener('change', () => {
    applySorting();
    // Отображаем отфильтрованные товары, если фильтры активны
    if (Object.keys(activeFilters).length > 0) {
        renderGoods(filteredGoods);
    } else {
        renderGoods(goods);
    }
});

// фильтры
let activeFilters = {};

function applyFiltersAndSort() {
    const selectedCategories = Array.from(
        document.querySelectorAll('#categories-list input:checked')
    ).map((input) => input.value);

    const minPrice = parseFloat(document.getElementById('price-min').value) || 0;
    const maxPrice = parseFloat(document.getElementById('price-max').value) || Infinity;

    const discountOnly = document.getElementById('discount-only').checked;

    // Сохраняем активные фильтры
    activeFilters = {
        selectedCategories,
        minPrice,
        maxPrice,
        discountOnly,
    };

    // Применяем фильтры
    filteredGoods = goods.filter((good) => {
        const inCategory =
            selectedCategories.length === 0 || selectedCategories.includes(good.main_category);
        const inPriceRange =
            good.actual_price >= minPrice && good.actual_price <= maxPrice;
        const hasDiscount = !discountOnly || good.discount_price;

        return inCategory && inPriceRange && hasDiscount;
    });

    // Применяем сортировку
    applySorting();

    // Сбрасываем количество отображаемых товаров
    currentDisplayedGoods = Math.min(filteredGoods.length, 6);
    renderGoods(filteredGoods);
}

document.querySelector('.apply-button').addEventListener('click', () => {
    applyFiltersAndSort();
});


document.querySelector('#load-more').addEventListener('click', () => {
    currentDisplayedGoods += 6;

    if (Object.keys(activeFilters).length > 0) {
        renderGoods(filteredGoods);
    } else {
        renderGoods(goods);
    }
});




function loadThings() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network error!');
            }
            return response.json();
        })
        .then(data => {
            goods = data;
            populateSidebarCategories(goods);
            renderGoods(goods);

        })
        .catch(error => {
            console.error('Ошибка!', error);
        });
}

function populateSidebarCategories(goods) {
    const categories = Array.from(new Set(goods.map((good) => good.main_category)));
    const categoriesList = document.getElementById('categories-list');
    categoriesList.innerHTML = '';

    categories.forEach((category) => {
        const categoryItem = document.createElement('div');
        categoryItem.innerHTML = `
            <label>
                <input type="checkbox" value="${category}">
                ${category}
            </label>
        `;
        categoriesList.appendChild(categoryItem);
    });
}



loadThings();


let cart = {}; 

function addToCart(good) {
    const goodId = good.id;
     
    addButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const orderLink = document.querySelector('.order-total-action');
            const button = event.target;
            const goodElement = button.parentElement.parentElement;
            const goodKeyword = goodElement.dataset.good

            const good = sortedgoodes.find(value => value.keyword === goodKeyword);
            order[good.category] = good;    
            button.classList.add('button-active');
            goodElement.classList.add('goodes-active');
            const storedItems = Object.values(order).map(value => value.keyword);

            localStorage.setItem('order', JSON.stringify(storedItems));
        });
    });
    saveCartToLocalStorage();
    updateCartPage();
}


function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}


function totalSummary(cart) {
    let totalSum = 0;
    const goods = Object.values(order)
    goods.forEach(function (good) {
        if (good !== null) {
            totalSum += good.price;
        }
    });
    return totalSum
}


function updateCartPage() {
    const cartContainer = document.querySelector('.cart-items');
    const totalContainer = document.querySelector('.cart-total');
    cartContainer.innerHTML = '';

    if (Object.keys(cart).length === 0) {
        cartContainer.innerHTML = '<p>Корзина пуста. Перейдите в каталог, чтобы добавить товары.</p>';
    } else {
        Object.values(cart).forEach((item) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <div class="cart-item-info">
                    <p>${item.name}</p>
                    <p>${item.quantity} x ${item.discount_price || item.actual_price}₽</p>
                </div>
                <button class="remove-item" data-id="${item.id}">Удалить</button>
            `;
            cartContainer.appendChild(itemDiv);
        });

            document.querySelectorAll('.remove-item').forEach((button) => {
            button.addEventListener('click', (event) => {
                const id = event.target.dataset.id;
                delete cart[id];
                saveCartToLocalStorage();
                updateCartPage();
            });
        });
    }


    totalContainer.textContent = `Общая стоимость: ${totalSummary(cart)}₽`;
}


loadCartFromLocalStorage();
updateCartPage();

export { addToCart };