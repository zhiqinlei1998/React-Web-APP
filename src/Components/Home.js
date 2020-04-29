import React, { Component } from 'react';
import './style.css';
import Hey from '../image/Hey.jpg'


export class Home extends Component{
  render(){

    return (

    	<div className="home">
			<img src= {Hey} alt="Hey"/>
		
			<p>Hey, My name is Zhiqin Lei.
				I am a senior majoring in Computer Science in UCSB.
				I used to be a newbie designer, then I took the CS185-HCI class.
				I am interested in machine learning, web development and action role-playing video games.
				I am actively exploring those fields and now I decide to build a website to show my enthusiasim in Computer Science and my favorite games - The Elder Scrolls.
			</p>
			
    	</div>
    	);
             
      
  }

}


export default Home;