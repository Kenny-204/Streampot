import { useEffect, useState } from "react";
import { WelcomeSection } from "../components/Main";
import { SearchBar } from "../components/SearchBar";
import { MovieList } from "../components/MovieList";
import { Loader } from "../components/Loader";
import { RenderError } from "../components/Error";
import { movie } from "../components/MovieList";
import { AUTH_BEARER } from "../config";

// Define the movie interface
interface Movie {
  id: string;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
}

interface HomepageProps {
  setCurrentMovie: Function;
  setQueriedMovies: Function;
  queriedMovies: movie[];
}

// Define the API URL and options
const url = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${AUTH_BEARER}`,
  },
};

function HomePage({
  setCurrentMovie,
  setQueriedMovies,
  queriedMovies,
}: HomepageProps) {
  const [popularMoviesList, setPopularMoviesList] = useState<movie[]>([]);

  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log(JSON.parse(localStorage.getItem("queriedMovies") || "[]"));

  useEffect(() => {
    async function getPopularMoviesList() {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(url, options);
        if (!response) {
          throw new Error(
            "There was an error fetching your request... check your internet connection and try again"
          );
        }
        const data = await response.json();

        const editData: movie[] = data.results.map((movie: Movie) => ({
          id: movie.id,
          title: movie.title,
          year: movie.release_date,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          description: movie.overview,
          score: Math.round(movie.vote_average * 10),
        }));

        console.log(data.results);
        setPopularMoviesList(editData);
      } catch (error: any) {
        console.log("Failed to fetch popular movies:");
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    getPopularMoviesList();
  }, []);

  return (
    <>
      <WelcomeSection />
      <SearchBar
        setQueriedMovies={setQueriedMovies}
        setLoading={setLoading}
        setError={setError}
        query={query}
        setQuery={setQuery}
      />
      {loading ? (
        <Loader />
      ) : error ? (
        <RenderError message={error} />
      ) : JSON.parse(localStorage.getItem('queriedMovies') || '[]').length === 0 ? (
        <PopularMovies
          popularMoviesList={popularMoviesList}
          setCurrentMovie={setCurrentMovie}
        />
      ) : (
        <SearchResult
          queriedMovies={queriedMovies}
          setCurrentMovie={setCurrentMovie}
        />
      )}
    </>
  );
}
function PopularMovies({
  popularMoviesList,
  setCurrentMovie,
}: {
  popularMoviesList: movie[];
  setCurrentMovie: Function;
}) {
  return (
    <MovieList list={popularMoviesList} setCurrentMovie={setCurrentMovie}>
      <div className="title">
        <p>Popular movies right now</p>
      </div>
    </MovieList>
  );
}

function SearchResult({
  queriedMovies,
  setCurrentMovie,
}: {
  queriedMovies: movie[];
  setCurrentMovie: Function;
}) {
  return (
    <MovieList list={JSON.parse(localStorage.getItem('queriedMovies') || '[]')} setCurrentMovie={setCurrentMovie}>
      <div className="title">
        <p>Showing {queriedMovies.length} results</p>
      </div>
    </MovieList>
  );
}

export default HomePage;
