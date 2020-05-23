import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app will store:
 *  - Search object
 *  - Current recipe object
 *  - Shopping list object
 *  - Liked recipes 
 */ 
const state = {}; // global state

window.state = state; // adding to global access for test. NEED TO DELETE.

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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );

        } catch (error){
            console.log(error)
            alert('Error processing recipe')
        }
    }
}

// adding global event listener to multiple events using array and window
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/**
 * List controller
 */
const controlList = () => {
    // Create a new list if it is none yet
    if (!state.list) state.list = new List(); // we only create a list if there is no list

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button 
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);
    }
    // Hadle the count update
    else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
})

/**
 * Like controller
 */
state.likes = new Likes(); // temporary here. NEED TO DELETE
likeView.toggleLikeMenu(state.likes.getNumLikes());// temporary here. NEED TO DELETE

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    
    // user has not yet like the current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add likes to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img_url
        )
        
        // Toggle the like button
        likeView.toggleLikeBtn(true);

        // Add like to the UI list
        console.log(state.likes);
        likeView.renderLike(newLike);
    } 
    // user has likeed the current recipe
    else {
        // Remove like from the state
        state.likes.deleteLike(currentID);
        
        // Toggle the like button
        likeView.toggleLikeBtn(false);
        
        // Remove like from the UI list
        likeView.deleteLike(currentID);
    }

    likeView.toggleLikeMenu(state.likes.getNumLikes());
};


// Handling recipe buttons click
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) { // the * after the class refers to all child node
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
    }
    else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list

        controlList();
    }
    else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
    console.log(state.recipe)
})


window.l = new List();