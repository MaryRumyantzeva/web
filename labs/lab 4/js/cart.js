import { dishes } from "./dishes.js"

const dishesElements = document.querySelectorAll('div.dish')

function addToCartClickHandler(event) {
    const dishElement = event.target

    const keyword = dishElement.dataset.dish

    const dish = dishes.find((dishObject) => dishObject.keyword === keyword)

    const price = dish.price
    
}