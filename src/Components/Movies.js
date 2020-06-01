import React, { Component } from 'react';
import Axios from 'axios';
import { PopupboxManager, PopupboxContainer } from 'react-popupbox';
import 'react-popupbox/dist/react-popupbox.css'; 
import config from './config';
const axios = require('axios')
const firebase = require('firebase');

export class Movies extends Component {
	constructor() {
		super();
		this.state = {
            src: '',
            title: '',
            imdb: '',
            plot: '',
            director: '',
            movieID: '',
			List: '',
			lists: {},
			movieListPairs: [],
			addToListName: 'Add to List',
			currentList: {id: '', name: 'All'},
			searchQuery: '',
            filteredMovies: [],
            maxLoaded: false,
			movies: [],
			moviesToLoad: 8,
			last: '',
			loaded: 0,
			loading: true,
		};
		this.wrapper = React.createRef();
        this.setState({loading:false});
    }
    
    getMovieInfo(obj, req) {
        axios.get(req)
        .then(function (response) {
          obj.setState({
            src: response.data.Poster,
            title: response.data.Title,
            imdb: response.data.imdbRating,
            plot: response.data.Plot,
            director: response.data.Director,
            year: response.data.year,
            runtime: response.data.runtime,
            genre: response.data.genre,
            Actor: response.data.Actor,
          });
          console.log(response.data);
        })
      }

	componentDidMount() {
        document.title = 'Categorized Movies';
		if (!firebase.apps.length) {
			firebase.initializeApp(config);
		}

		this.LoadMovies();

		let ref = firebase.database().ref('lists');
		ref.orderByChild('name').on('value', snapshot => {
			if (!snapshot.val()) return;
			
			let lists = {};
			
			Object.values(snapshot.val()).forEach(list => {
				lists[list.id] = list.name;
			});

			this.setState({
				lists: lists
			});
		});

		ref = firebase.database().ref('movie-lists');
		ref.orderByKey().on('value', snapshot => {
			if (!snapshot.val()) return;
			
			let movieLists = [];

			Object.values(snapshot.val()).forEach(movieListPair => {
				let pair = Object.entries(movieListPair)[0];
				movieLists.push(pair[0] + ' - ' + pair[1]);
			});

			this.setState({
				movieListPairs: movieLists
			});
		});

    }

	LoadMovies = () => {
		if (this.state.currentList.name === 'All') {
			let ref = firebase.database()
				.ref('movies')
				.orderByChild('title')
				.limitToFirst(this.state.moviesToLoad);
			
			ref.on('child_added', snapshot => {
				let movie = snapshot.val();
				let last = movie.title;
				let movies = this.state.movies;
				movies.push(movie);

				this.setState({
					'movies': movies,
					'last': last,
					'loaded': this.state.loaded + 1 % this.state.moviesToLoad,
					'loading': this.state.loaded + 1 < this.state.moviesToLoad
				});
			});
		}

		let movieIDs = this.getIDsInList();
		
		movieIDs.forEach(movieID => {
			let ref = firebase.database()
				.ref('movies')
				.orderByChild('id')
				.equalTo(movieID)
				.limitToFirst(1);

			ref.on('child_added', snapshot => {
				let movie = snapshot.val();
				let last = movie.title;
	
				if (this.state.currentList.name !== 'All') {
					let show = false;
					movieIDs.forEach(movieID => {
						if (movie.id === movieID) show = true;
					});
					if (!show) return;
				}
	
				let movies = this.state.movies;
				movies.push(movie);
	
				this.setState({
					'movies': movies,
					'last': last,
					'loaded': this.state.loaded + 1 % this.state.moviesToLoad,
					'loading': this.state.loaded + 1 < this.state.moviesToLoad
				});
			});
		});
	}

	LoadMore = () => {
		if (this.state.loading) return;
		
		this.setState({
			loading: true,
			loaded: 0
		});
		
		let ref = firebase.database()
			.ref('movies')
			.orderByChild('title')
			.startAt(this.state.last)
			.limitToFirst(this.state.moviesToLoad + 1);

		let movieIDs = [];
		if (this.state.currentList.name !== 'All') movieIDs = this.getIDsInList();

		ref.on('child_added', snapshot => {
			const movie = snapshot.val();

			let duplicate = false;
			this.state.movies.forEach(m => {
				if (m.id === movie.id) duplicate = true;
			});
			if (duplicate) return;

			if (this.state.currentList.name !== 'All') {
				let show = false;
				movieIDs.forEach(movieID => {
					if (movie.id === movieID) show = true;
				});
				if (!show) return;
			}

			let movies = this.state.movies;
			movies.push(movie);

			let last = movie.title;

			this.setState({
				'movies': movies,
				'last': last,
				'loaded': this.state.loaded + 1 % this.state.moviesToLoad,
				'loading': this.state.loaded + 1 < this.state.moviesToLoad
            });
		});
	}

	addMovie = (event) => {
		event.preventDefault();
		
		if (this.state.movieID.slice(0, 2) !== 'tt' || !/^\d+$/.test(this.state.movieID.slice(2))) {
			const title = this.state.movieID;

			this.setState({
				'movieID': ''
			});

			Axios.get('https://www.omdbapi.com/?apikey=c497da4f&t=' + title)
			.then(response => {
				if (response.data.Response === 'False') {
					alert('Movie cannot be found! Try another one.');
					return;
				}

				let duplicate = false;
				this.state.movies.forEach(movie => {
					if (movie.id === response.data.imdbID) duplicate = true;
				});

				if (duplicate) {
					alert('Movie existed!');
					return;
				}

				let movie = [];
				movie.id = response.data.imdbID;
				movie.title = response.data.Title;
				movie.director = response.data.Director;
				movie.year = response.data.Year;
				movie.plot = response.data.Plot;
				movie.rating = response.data.imdbRating;
                movie.poster = response.data.Poster;
                firebase.database().ref('movies').push().set(movie);
				
			});
            

			return;
		}

		const id = this.state.movieID;

		this.setState({
			'movieID': ''
		});
		
		let duplicate = false;
		this.state.movies.forEach(movie => {
			if (movie.id === id) duplicate = true;
		});

		if (duplicate) {
			alert('Cannot add a movie twice!');
			return;
		}


		Axios.get('https://www.omdbapi.com/?apikey=c497da4f&i=' + id)
		.then(response => {
			if (response.data.Response === 'False') {
				alert('Cannot find movie!');
				return;
			}

			let movie = [];
			movie.id = id;
			movie.title = response.data.Title;
			movie.director = response.data.Director;
			movie.year = response.data.Year;
			movie.plot = response.data.Plot;
            movie.rating = response.data.imdbRating;
            movie.poster = response.data.Poster;
            firebase.database().ref('movies').push().set(movie);
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });

		});
    }

    dimPoster(e) {
        e.target.style.opacity = 0.3;
      }
    
    resetPoster(e) {
        e.target.style.opacity = 1;
    }
    
    
    

	addList = (event) => {
		event.preventDefault();
		console.log('addList: ' + this.state.List);
		
		let List = this.state.List;
		
		this.setState({
			'List': ''
		});

		let duplicate = false;
		Object.entries(this.state.lists).forEach(list => {
			if (List.toLowerCase() === list[1].toLowerCase()) duplicate = true;
		});
		if (duplicate) {
			alert('Cannot create a list twice!');
			return;
		};
		
		let ref = firebase.database().ref('lists');
		let listRefKey = ref.push().key;
		
		let updates = {};
		updates['/lists/' + listRefKey + '/id'] = listRefKey;
		updates['/lists/' + listRefKey + '/name'] = List;
        alert('List created!');
		firebase.database().ref().update(updates);
	}

	getUpdateLists = () => {
		return Object.entries(this.state.lists).map(list => (
			<option key={list[0]}
				value={list[0]}>{list[1]}</option>
		));
	}

	getAddToLists = (id) => {
		return Object.entries(this.state.lists).map((list, i) => (
			<option key={list[0]}
				value={list[0]}>{list[1]}</option>
		));
	}

	updateList = (event) => {
		let List = '';
		if (event.target.value === '') {
			List = 'All';
		} else {
			List = this.state.lists[event.target.value];
		}

		this.setState({
			movies: [],
			currentList: {id: event.target.value, name: List},
			loaded: 0,
			loading: true
		});

		this.forceUpdate(this.LoadMovies);
	}

	addToList = (event, movieID) => {
		let listID = event.target.value;
		let duplicate = false;
		this.state.movieListPairs.forEach(movieListPair => {
			let pair = movieListPair.split(' - ');
			if (pair[0] === listID && pair[1] === movieID) duplicate = true;
		});
		if (duplicate) {
			alert('Cannot add a movie twice!');
			return;
		};
		
		let ref = firebase.database().ref('movie-lists');
		ref.push().set({[listID]: movieID});
        alert('Successfully add ' + movieID + ' to ' +  this.state.lists[event.target.value]);
		
	}

	getIDsInList = () => {
		let movieIDs = [];
		this.state.movieListPairs.forEach(movieListPair => {
			if (movieListPair.search(this.state.currentList.id) > -1) {
				movieIDs.push(movieListPair.slice((this.state.currentList.id + ' - ').length));
			}
		});

		return movieIDs;
	}
    
    inputHandler = (event) => {
        let field = event.target.name;
        let value = event.target.value;
        this.setState({[field]: value});
    }

	deleteMovie = (movieID) => {
		console.log('deleteMovie');
		let ref = firebase.database().ref('movies');
		
		ref.orderByChild('id').equalTo(movieID).limitToFirst(1).on('child_added', snapshot => {
			console.log(snapshot.key);
			ref.child(snapshot.key).remove();
		});

		let movies = this.state.movies;
		
		let toDelete = -1;
		movies.forEach((movie, i) => {
			if (movie.id === movieID) toDelete = i;
		});
		movies.splice(toDelete, 1);

		this.setState({movies: movies});

		PopupboxManager.close();
	}

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
    }
    

	Movies = () => {
		return this.state.movies.filter(movie => movie.title.toLowerCase().includes(this.state.searchQuery)).map(movie => (
			<img className="moviePoster" src={movie.poster}
                key={movie.id} alt=""
                onMouseEnter={this.dimPoster} onMouseLeave={this.resetPoster}
				onClick={this.Lightbox.bind(this, movie)}/>
		));
	}

	Lightbox = (movie) => {
		const content = (
            <div className="movLightboxContainer">
				<img className="movLightboxImage" src={movie.poster} alt=""/>
				<div className = "movLightboxContent">
					<span className = "title">{movie.title}</span>
					<br></br>
					<span className = "director">Directed by {movie.director}</span>
					<br></br>
                    <span className = "rating">IMDB Rate: {movie.rating}</span>
                    
                    <div>
                        <button className="delete-button-add" onClick={() => {this.deleteMovie(movie.id)}}>Delete</button>
                    </div>
                    <br></br>
					<p>{movie.plot}</p>

                    <div>
						<select className="dropdown" value={this.state.addToListName} onChange={event => {this.addToList(event, movie.id)}}>
							<option hidden value="">Add to list:</option>
                             {this.getAddToLists(movie.id)}
                        </select>
			 		</div>
                    
				</div>
			</div>
		)

		PopupboxManager.open({content,
			config: {
				onOpen: this.lockScroll,
				onClosed: this.unlockScroll
			}
		});
    }


	render() {
		const popupboxConfig = {
			style: {
				overflow: 'inherit'
			}
		}

		return (
			<div>
				<div className="movie-forms">
                    <div className="dropdown">
							<select  onChange={this.updateList} >
								<option value="">All movie lists</option>
                                {this.getUpdateLists()}
                            </select>
                            
                            
						</div>
					<div className="movie-add-forms">
                         <form className="movie-form" onSubmit={e => this.addList(e)}>
							<div>
								<input type="text"
									name="List"
									className="form-input-text"
									value={this.state.List}
									onChange={e => this.handleChange(e)}
									placeholder="Please enter a name"/>
                                <input type='submit' value='Create a list'/>
							</div>
						</form>

						<form className="movie-form" onSubmit={e => this.addMovie(e)}>
							<div>
								<input type="text"
									name="movieID"
									className="form-input-text"
									value={this.state.movieID}
									onChange={e => this.handleChange(e)}
									placeholder="Please enter the title"/>
                                <input type='submit' value='Add a Movie'/>
							</div>
						</form>

						

					</div>

					
					<div></div>
				</div>
				
				<div className="movies"
					ref={this.moviesScroll}>
					{this.Movies()}
					<PopupboxContainer { ...popupboxConfig } />
				</div>
                <div className='button'>
                {!(this.state.loading) && <button className = 'but' onClick={this.LoadMore}>Load More...</button>}
                </div>
			</div>

		);
	}
}

export default Movies;