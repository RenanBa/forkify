import axios from 'axios';

export default class Recipe {
    constructor (id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.autho = res.data.recipe.publisher;
            this.img_url = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        }
        catch (error) {
            console.log(error);
            alert(error);
        }
    }

    // this method is to illustrate the cooking 
    // this function will try to calculate the cooking time for each recipe based
    // on the amount of ingredients. Each 3 ingredient add 15 min to cooking time
    clacTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    // this is to illustrat the serving amounts
    calcServings() {
        this.servings = 4;
    }
};