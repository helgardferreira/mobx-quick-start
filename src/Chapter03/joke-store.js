import { searchJokes } from './goodreads.service';
import { flow, action, computed, observable, runInAction } from 'mobx';

// const searchState = observable({
//     term: '',
//     status: '',
//     results: [],
//     totalCount: 0,
//
//     search: action(function() {
//         // invoke search API
//     }),
//
//     setTerm: action(function(value) {
//         this.term = value;
//     }),
// });

class JokeSearchStore {
    @observable term = 'javascript';
    @observable status = '';
    @observable.shallow results = [];

    @observable totalCount = 0;

    @computed
    get isEmpty() {
        return this.results.length === 0;
    }

    constructor() {
        this.search();
    }

    @action.bound
    setTerm(value) {
        this.term = value;
    }

    search = flow(
        function*() {
            try {
                this.status = 'pending';
                const result = yield searchJokes(this.term);

                this.totalCount = result.total;
                this.results = result.items;
                this.status = 'completed';
            } catch (e) {
                this.status = 'failed';
                console.log(e);
            }
        }.bind(this),
    );
}

export const store = new JokeSearchStore();
