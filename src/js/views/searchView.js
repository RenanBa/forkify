import { elements } from './base';

export const getInput = () => elements.searchInput.value; // this has invisible returns

export const clearInput = () => { // this format does not have invisible returns
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSeleted = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        // look into each word in the title and check if exceed limit
        title.split(' ').reduce((acc, curr) => { // acc is the accumulator, starts as 0
            if (acc + curr.length <= limit) { // and curr is current word in the array
                newTitle.push(curr);
            }
            return acc + curr.length;
        }, 0);
        return `${newTitle.join(' ')}...`;
    }
    return title;
}

const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// type : prev or next
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    
    let button; 
    if (page === 1 && pages > 1) {
        // button to go to next page
        button = createButton(page, 'next')
    } 
    else if (page < pages) {
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
        `;
    }
    else if (page === pages && pages > 1){
        // button to go to previous page
        button = createButton(page, 'prev')
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render results of current page
    const start = (page-1) * resPerPage; // implement later
    const end = page * resPerPage;

    // indirectly add each element into renderRecipe call.
    recipes.slice(start, end).forEach(renderRecipe); // same as: .forEach(el => renderRecipe(el))

    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};

