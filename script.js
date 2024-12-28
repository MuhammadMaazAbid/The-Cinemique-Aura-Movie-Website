const API_KEY = "53dead8f3e52892b9fa807cb73421f84";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Fetch and display popular movies
async function fetchPopularMovies() {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await response.json();
  displayMovies(data.results);
}

// Toggle page visibility
function showPage(pageId) {
  ["home", "about", "contact", "movie-details"].forEach(id => {
    document.getElementById(id).classList.toggle("d-none", id !== pageId);
  });

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.getAttribute("onclick").includes(pageId));
  });
}

// Search for movies
async function searchMovies() {
  const query = document.getElementById("search-input").value.trim();
  if (!query) return;
  const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`);
  const data = await response.json();
  displayMovies(data.results);
}

// Display movies in a grid
function displayMovies(movies) {
  const movieGrid = document.getElementById("movie-grid");
  movieGrid.innerHTML = movies.map(movie => `
    <div class="col-lg-3 col-md-4 col-sm-6">
      <div class="card h-100 shadow">
        <img src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : 'placeholder.jpg'}" class="card-img-top" alt="${movie.title}">
        <div class="card-body text-center">
          <h5 class="card-title">${movie.title}</h5>
          <button class="btn btn-primary" onclick="showDetails(${movie.id})">Details</button>
        </div>
      </div>
    </div>`).join("");
}

// Show movie details
async function showDetails(movieId) {
  const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
  const movie = await response.json();
  document.getElementById("movie-details-content").innerHTML = `
    <img src="${movie.poster_path ? IMAGE_BASE_URL + movie.poster_path : 'placeholder.jpg'}" alt="${movie.title}" class="img-fluid mb-3">
    <h2>${movie.title}</h2>
    <p>${movie.overview || "No description available."}</p>
    <p><strong>Duration:</strong> ${movie.runtime || "N/A"} minutes</p>
    <p><strong>Release Date:</strong> ${movie.release_date || "N/A"}</p>
    <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" class="btn btn-primary mt-3">View on TMDb</a>
  `;
  showPage("movie-details");
}

// Load popular movies on page load
document.addEventListener("DOMContentLoaded", fetchPopularMovies);
