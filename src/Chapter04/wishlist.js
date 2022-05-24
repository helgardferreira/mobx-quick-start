import { action, computed, observable } from 'mobx';
import { asComponent } from '../core/as-component';

export const WishlistExample = asComponent(() => {
    class WishListStore {
        @observable.shallow lists = [];

        @computed
        get isEmpty() {
            return this.lists.length === 0;
        }

        @action
        addWishList(name) {
            const wishlist = new WishList(name);
            this.lists.push(wishlist);
            return wishlist;
        }

        @action
        removeWishList(list) {
            this.lists.remove(list);
        }
    }

    class WishList {
        @observable name = '';
        @observable.shallow items = [];

        @computed
        get isEmpty() {
            return this.items.length === 0;
        }

        @computed
        get purchasedItems() {
            return this.items.filter(item => item.purchased);
        }

        constructor(name) {
            this.name = name;
        }

        @action
        renameWishList(newName) {
            this.name = newName;
        }

        @action
        addItem(title) {
            const wishlistItem = new WishListItem(title);
            this.items.push(wishlistItem);
            return wishlistItem;
        }

        @action
        removeItem(item) {
            this.items.remove(item);
        }
    }

    class WishListItem {
        @observable title = '';
        @observable purchased = false;

        @action
        purchase() {
            this.purchased = true;
        }

        constructor(title) {
            this.title = title;
        }
    }

    const store = new WishListStore();

    const firstWishlist = store.addWishList('hello');
    const meditations = firstWishlist.addItem('Meditations');
    meditations.purchase();
    const theRepublic = firstWishlist.addItem('The Republic');
    store.lists[0].purchasedItems.forEach(item => {
        console.log(item.title);
    });
});
