import React, { Component } from 'react';
import Movie from './Movie';
const movies = require('./List.json');


export class Movies extends Component {
  enlarge(image, title, director, rating, plot) {
    document.body.style.overflow = 'hidden';

    var mov = document.createElement('div');
    mov.id = 'mov';
    mov.className = 'setting';

    var wrap = document.createElement('img');
    wrap.src = image;
    wrap.id = 'wrap'; 

    var info = document.createElement('div'); 
    info.innerHTML = '<span class=\'title\'>'+title+'</span><br/><span class=\'director\'> Directed by  '+director+'</span><br/><span class=\'rating\'> IMDB Rate: '+rating+' </span><br/><span class=\'plot\'>'+plot+'</span><br/>';
    info.id = 'info';
    
    var appearance = document.createElement('div');
    appearance.id = 'appearance';
    appearance.className = 'appearance';

    document.body.appendChild(mov);  
    document.getElementById('mov').appendChild(appearance);
    document.getElementById('appearance').appendChild(wrap);
    document.getElementById('appearance').appendChild(info);

    document.getElementById('mov').addEventListener('click', function(event) {
      if(event.target.className === 'setting') {
        document.getElementById('mov').removeChild(document.getElementById('appearance'));
        document.body.removeChild(document.getElementById('mov'));
        document.body.style.overflow = 'auto';
      }
    });
  }
  
  IDs() {
    let movieList = [];
    for (let movie of movies) {
      movieList.push(movie.id);
    }
    return movieList;
  }
  
  render() {
    let movieList = this.IDs();
    return movieList.map((movie) =>(
        <div className='movie'>     
            <Movie movie={movie} enlarge={this.enlarge} />
        </div> 
    ));
  }
}
export default Movies;