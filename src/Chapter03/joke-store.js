import { searchJokes } from './goodreads.service';
import { flow, action, computed, observable, reaction, autorun } from 'mobx';

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
    @observable term = 'beer';
    @observable status = '';
    @observable.shallow results = [];

    @observable totalCount = 0;

    @computed
    get isEmpty() {
        return this.results.length === 0;
    }

    constructor() {
        reaction(
            () => this.term,
            () => {
                this.search();
            },
            {
                fireImmediately: true,
                delay: 1000,
            },
        );
    }

    @action.bound
    setTerm(value) {
        this.term = value;
    }

    search = flow(function* () {
        try {
            this.status = 'pending';
            this.totalCount = 0;
            this.results = [];
            const result = yield searchJokes(this.term);

            this.totalCount = result.total;
            this.results = result.items;
            this.status = 'completed';
        } catch (e) {
            this.status = 'failed';
            console.log(e);
        }
    });
}

export const store = new JokeSearchStore();
