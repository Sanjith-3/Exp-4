const apiKey = 'aa62278fda21651aaa11269aee5c4df8';
const recommendBtn = document.getElementById('recommend-btn');
const movieTypeInput = document.getElementById('movie-type');
const movieInfoDiv = document.getElementById('movie-info');
const recommendationDiv = document.getElementById('recommendation');

recommendBtn.addEventListener('click', () => {
    const movieType = movieTypeInput.value.trim();
    if (movieType) {
        getMovieSuggestions(movieType);
    }
});

async function getMovieSuggestions(query) {
    try {
        const searchResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
        const searchData = await searchResponse.json();

        if (searchData.results && searchData.results.length > 0) {
            const movieId = searchData.results[0].id;
            const similarResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}`);
            const similarData = await similarResponse.json();

            if (similarData.results && similarData.results.length > 0) {
                displayMovies(similarData.results);
            } else {
                movieInfoDiv.innerHTML = "No related movies found. Please try different keywords.";
                recommendationDiv.style.display = "block";
            }
        } else {
            movieInfoDiv.innerHTML = "No movies found matching your criteria. Please try different keywords.";
            recommendationDiv.style.display = "block";
        }
    } catch (error) {
        console.error("Error fetching movie data:", error);
        movieInfoDiv.innerHTML = "An error occurred. Please try again.";
        recommendationDiv.style.display = "block";
    }
}

function displayMovies(movies) {
    const moviesHtml = movies.slice(0, 5).map(movie => `
        <p class="movie-title">${movie.title} (${new Date(movie.release_date).getFullYear()})</p>
        <p class="movie-overview">${movie.overview}</p>
    `).join('');
    
    movieInfoDiv.innerHTML = moviesHtml;
    recommendationDiv.style.display = "block";
}
