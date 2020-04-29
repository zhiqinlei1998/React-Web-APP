import React, { Component } from 'react';
import './style.css';
import video1 from '../video/video1.mp4'
import video2 from '../video/video2.mp4'
import video3 from '../video/video3.mp4'


export class Videos extends Component{
  render(){

    return (
    	<div className="vid">
			<p>Here are some funny videos I found. They are created by a Youtuber Seanzoz.</p>
    		<video src={video1}  controls="controls"/>
			<video src={video2}  controls="controls"/>
			<video src={video3}  controls="controls"/>
			<div className="comment"></div><a href="https://www.youtube.com/channel/UCeZ_GliTTOBahnjcnnRihAA"> Here is the link of his other videos</a>
			<p>If it violated some copyright, please contact me and I will delete it.</p>
    	</div>
    	);
  }

}


export default Videos;