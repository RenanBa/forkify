import axios from 'axios';

export default class Recipe {
    constructor (id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
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
    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    // this is to illustrat the serving amounts
    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        // to make the margements uniform we use these two arrays, the first is what we don't want, and the second is the replacement
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']
        
        // map the ingredients 
        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i])
            });

            // 2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                // there is an unit
                const arrCount = arrIng.slice(0, unitIndex); // Ex 4 1/2 cups, arrCount is [4 1/2]
                
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                }
                else {
                    count = eval(arrIng.slice(0, unitIndex).join('+')); // eval turn this [4 1/2] into 4.5
                }

                objIng = {
                    count, // same as count: count
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
            }
            else if (parseInt(arrIng[0], 10)) {
                // there is no unit, but 1st element is a number 
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            }
            else if (unitIndex === -1) {
                // these in NO unit
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient, // on ES6 this mean ingredient: ingredient
                }
            }

            return objIng;

        });
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        // update serving
        const newServings = type ==='dec' ? this.servings - 1 : this.servings + 1;
        
        // ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        })

        this.servings = newServings;
    }
};