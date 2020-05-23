import uniqid from 'uniqid'; // package to create unique ids

export default class List {
    constructor() {
        this.items = [];

    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,  // in ES6 this is the same as count: count,
            unit,
            ingredient,
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        //ES6, use 'findIndex' and iterate over items to check if id matches and return the index from the item
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        //ES6, 'find' is sililar to findIndex but it return the element and not the index
        this.items.find(el => el.id === id).count = newCount;
    }
}