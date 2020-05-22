import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
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

        // create new object recipe
        state.recipe = new Recipe(id);

        try {
            // get recipe data
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients)
            state.recipe.parseIngredients();

            // Calculating the serving and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            console.log(state.recipe);
        } catch (error){
            alert('Error processing recipe')
        }
    }
}

// adding global event listener
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe)
// adding global event listener to multiple events using array and window
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));