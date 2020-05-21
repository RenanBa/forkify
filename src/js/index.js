import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

/** Global state of the app will store:
 *  - Search object
 *  - Current recipe object
 *  - Shopping list object
 *  - Liked recipes 
 */ 
const state = {}; // global state

const controlSearch = async () => { // using 'async' function to be able to use 'await' 
    // 1) get query from the view
    const query = searchView.getInput();

    if (query) {
        // 2) new search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for result
        searchView.clearInput();
        searchView.clearResults();
        // 4) Search for recipes
        await state.search.getResults(); // wait for promise to return to then proceed

        // 5) Render results on UI
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    controlSearch();
})


