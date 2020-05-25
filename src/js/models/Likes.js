export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);
        
        // Persist data in local storage (localStorage)
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
    }

    isLiked(id) {
        // if the id is already in the array will return true
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        // localStorage only deals with strings. That is why the this.likes are parsed to string
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        // conver the string back to the structure before being stringigy
        const storage = JSON.parse(localStorage.getItem('likes'));
        
        // now we restore the likes from localStorage to the this.likes object
        if (storage) this.likes = storage;
    }
}