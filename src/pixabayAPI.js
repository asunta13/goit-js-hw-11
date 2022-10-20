export class pixabayAPI {
  #page = 1;
  #query = '';
  #totalPages = 0;
  #perPage = 40;

  searchImages() {
    const url = `https://pixabay.com/api/?key=30733025-62942a0e02283ae2db659ca4c&q=${
      this.#query
    }&image_type=photo&orientation=horizontal&safesearch=true&per_page=${
      this.#perPage
    }&page=${this.#page}`;
    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
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
  calculateTotalPages(totalHits) {
    this.#totalPages = Math.ceil(totalHits / this.#perPage);
  }
  get isShownLoadMore() {
    return this.#page < this.#totalPages;
  }
}
