import {API_KEY} from "../CONFIG.js"

API_KEY : API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/movie?" + API_KEY;

const main = document.querySelector("main");
const form = document.querySelector("form");
const search = document.querySelector(".search");

getMovies(API_URL);
function getMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      showMovie(data.results);
    })
    .catch((err) => {
      console.log(err);
    });
}

function showMovie(data) {
  main.innerHTML = "";

  data.forEach(movie => {
    const {title, overview, vote_average, poster_path} = movie;
    const movieE = document.createElement("div");
    movieE.classList.add("movie");
    movieE.innerHTML = `
    <img src="${IMG_URL + poster_path}"
        alt="${title}">

    <div class="movie_info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${vote_average}</span>
    </div>

    <div class="plot">
        <h3 class="overview">Overview</h3>
        ${overview}
    </div>
        `;

    main.appendChild(movieE);
  });
}

function getColor(vote) {
  if(vote >= 8){
    return "green";
  } else if(vote >= 5){
    return "orange";
  } else{
    return "red";
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchTerm = search.value;

  if(searchTerm){
    getMovies(searchURL+ "&query="+searchTerm);
  } else{
    getMovies(API_URL);
  }
})