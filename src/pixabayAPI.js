import axios from 'axios';
// const axios = require('axios').default;
axios.defaults.baseURL = 'https://pixabay.com/api';

export class pixabayAPI {
  #page = 1;
  #query = '';
  #totalPages = 0;
  #params = {
    params: {
      key: '30733025-62942a0e02283ae2db659ca4c',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
    },
  };

  async searchImages() {
    const { data } = await axios.get(
      `/?q=${this.#query}&page=${this.#page}`,
      this.#params
    );
    return data;
  }
  set searchQuery(newQuery) {
    this.#query = newQuery;
  }
  get searchQuery() {
    return this.#query;
  }

  incrementPage() {
    this.#page += 1;
  }
  resetPage() {
    this.#page = 1;
  }
  calculateTotalPages(total) {
    const perPage = this.#params.params.per_page;
    this.#totalPages = Math.ceil(total / perPage);
  }
  get isShownLoadMore() {
    return this.#page < this.#totalPages;
  }
}
