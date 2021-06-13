import React, { Component } from "react";
import { getMovies, deletMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import { toast } from "react-toastify";

import Pagination from "./commons/pagination";
import { paginate } from "../utils/paginate";
import Listgroup from "./commons/listGroup";
import MoviesTable from "./moviesTable";
import _ from "lodash";
import { Link } from "react-router-dom";
import SearchBox from "./commons/searchBox";
import { getJwt } from "./../services/authService";

export default class Movies extends Component {
  state = {
    movies: [], //initialize with empty array to avoid NullPointerException after componentDidMount
    genres: [],
    pageSize: 4,
    currentPage: 1,
    selectedGenre: null,
    sortColumn: { path: "title", order: "asc" },
    searchTerm: ""
  };

  async componentDidMount() {
    const { data: genreDB } = await getGenres();
    const { data: movieDB } = await getMovies();
    const genres = [{ _id: "", name: "All Genres" }, ...genreDB];
    const movies = [...movieDB];

    this.setState({
      movies: movies,
      genres
      // selectedGenre: { _id: "", name: "All Genres" }
    });
  }

  handleDelete = async movie => {
    const originalMovies = this.state.movies;

    const movies = originalMovies.filter(m => m._id !== movie._id);
    this.setState({ movies });
    try {
      await deletMovie(movie._id);
    } catch (error) {
      if (error.response && error.response.status === 404)
        toast.error("This movie has already been deleted");
      this.setState({ movies: originalMovies });
    }
  };

  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    console.log("SELECTED: ", genre);

    this.setState({ selectedGenre: genre, searchTerm: "", currentPage: 1 });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  handleSearch = query => {
    console.log("ASDASDF: ", query);

    this.setState({ searchTerm: query, selectedGenre: null, currentPage: 1 });
  };

  getPagedData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedGenre,
      searchTerm,
      movies: allMovies
    } = this.state;

    let filtered = allMovies;
    if (searchTerm)
      filtered = allMovies.filter(m =>
        m.title.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      //Falsey values: undefined, null, NaN, 0, "", false.
      filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const { length: count } = this.state.movies;
    const { pageSize, currentPage, sortColumn, searchTerm } = this.state;
    const { user } = this.props;
    console.log("USER: ", user);

    if (count === 0) return <p>No movies</p>;

    const { totalCount, data: movies } = this.getPagedData();

    return (
      <div className="row" style={{ marginTop: 10 }}>
        <div className="col-3">
          <Listgroup
            items={this.state.genres}
            onItemSelect={this.handleGenreSelect}
            selectedItem={this.state.selectedGenre}
          />
        </div>
        <div className="col">
          {user && (
            <Link
              to={"/movies/new"}
              className="btn btn-primary"
              style={{ marginBottom: 10 }}
            >
              New Movie
            </Link>
          )}
          <p>Showing {totalCount} movies</p>
          <SearchBox value={searchTerm} onChange={this.handleSearch} />
          <MoviesTable
            movies={movies.sort()}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
            user={this.props.user}
          />

          <Pagination
            itemsCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }

  drawColumn = marginLeft => ({
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: marginLeft
  });
}
