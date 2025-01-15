import {renderGoods} from "./catalog1.js"

function totalSummary(order) {
    let totalSum = 0;
    const goods = Object.values(order)
    goods.forEach(function (good) {
        if (good !== null) {
            totalSum += good.price;
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

import { addToCart } from './basket.js';

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
                <button class="add-button" data-id="${good.id}">Добавить</button>
            </div>
        `;

        categoryContainer.appendChild(goodDiv);
    });

    document.querySelectorAll('.add-button').forEach((button) => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const good = goods.find((g) => g.id === id);
            addToCart(good);
        });
    });
}