const movieList = document.querySelector('.movie-list');
const movieDetail = document.querySelector('.movie-detail');
const movieDetailWrapper = document.querySelector('.movie-detail-wrapper');
const closeBtn = document.querySelector('.close-btn');

const init = function () {
  let moviesBucket = [];

  closeBtn.addEventListener('click', () =>
    movieDetail.classList.remove('show')
  );

  const buildMovieCard = function (movie) {
    return `
      <div class="card" data-id="${movie.id}">
        <div class="card-body">
          <div class="card-img">
            <img
              src="${movie.image.medium}"
            />
          </div>
          <div class="card-text">
            <h4 class="movie-title">${movie.name}</h4>
            <span
              ><strong>${
                movie.rating.average || 0
              }</strong> <span class="star">&starf;</span></span
            >
          </div>
        </div>
      </div>
    `;
  };

  const buildGenreTag = function (genre) {
    return `<div class="tag">${genre}</div>`;
  };

  const buildMovieDetailSection = function (movie) {
    return `
    <div class="left">
      <div class="movie-img">
        <img src="${movie.image.medium}" />
      </div>
    </div>
    <div class="right">
      <h1 class="movie-name">${movie.name}</h1>
      <div class="data">
        <div class="keyval">
          <span class="key">Premiered</span>
          <span class="val">${movie.premiered}</span>
        </div>

        <div class="keyval">
          <span class="key">Country</span>
          <span class="val">${movie.network.country.name}</span>
        </div>

        <div class="keyval">
          <span class="key">Rating</span>
          <span class="val">${movie.rating.average || 0} &starf;</span>
        </div>
      </div>

      <div class="data">
        <div class="keyval">
          <span class="key">Type</span>
          <span class="val">${movie.type || 'Unknown'}</span>
        </div>

        <div class="keyval">
          <span class="key">Language</span>
          <span class="val">${movie.laguage || 'Unknown'}</span>
        </div>
      </div>

      <div class="genres">
        ${
          movie.genres.length
            ? movie.genres.map(genre => buildGenreTag(genre)).join('')
            : ''
        }
      </div>

      <div class="summary">
        ${movie.summary}
      </div>
    </div>
    `;
  };

  const handleMovieClick = function (e) {
    const movieCard = e.target.closest('.card');

    if (!movieCard) return;

    const movieId = +movieCard.dataset.id;

    const foundMovie = moviesBucket.find(movie => movie.id === movieId);

    const markup = buildMovieDetailSection(foundMovie);
    movieDetailWrapper.innerHTML = '';
    movieDetailWrapper.insertAdjacentHTML('afterbegin', markup);

    movieDetail.classList.add('show');
  };

  const addHandlerToMovieList = function () {
    movieList.addEventListener('click', handleMovieClick);
  };

  const addMoviesToUi = async function (movies) {
    const markup = `
      ${movies.map(movie => buildMovieCard(movie)).join('')}
    `;

    movieList.insertAdjacentHTML('afterbegin', markup);

    moviesBucket = await [...movies];
    addHandlerToMovieList();
  };

  const loadMovies = async function () {
    try {
      const res = await fetch('data/tv-show.json');
      const data = await res.json();

      addMoviesToUi(data);
    } catch (err) {
      console.error('something went wrong');
    }
  };
  loadMovies();
};

window.addEventListener('load', init());
