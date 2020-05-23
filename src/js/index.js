import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app will store:
 *  - Search object
 *  - Current recipe object
 *  - Shopping list object
 *  - Liked recipes 
 */ 
const state = {}; // global state

/** Search Controller */
const controlSearch = async () => { // using 'async' function to be able to use 'await' 
    // 1) get query from the view
    const query = searchView.getInput();

    if (query) {
        // 2) new search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes); // show spin while waiting response
        try {
            // 4) Search for recipes
            await state.search.getResults(); // wait for promise to return to then proceed

            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Error getting recipies');
            clearLoader();
        }
    }
}

// search for type of food
elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})



/** Recipe controller */

const controlRecipe = async () => {
    // get ID frm url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // prepare the UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe); // pass the parent element

        // highlight the selected searchitem
        if (state.search) searchView.highlightSeleted(id);

        // create new object recipe
        state.recipe = new Recipe(id);

        try {
            // get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculating the serving and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (error){
            console.log(error)
            alert('Error processing recipe')
        }
    }
}

// adding global event listener to multiple events using array and window
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


// Handling recipe buttons click
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    };
    console.log(state.recipe)
})