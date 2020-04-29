import React, { Component } from 'react';
import './style.css';
import lore from '../link/lore.jpg'
import nexus from '../link/nexus.jpg'
import wiki from '../link/wiki.jpg'

export class Projects extends Component{
  render(){

    return (
    	<div className="link">
		
		<a href='https://skyrim.gamepedia.com/Skyrim_Wiki'><img src={wiki} alt="button"/></a>
		<p>Skyrim Wiki: a guide for everything you want to know. Armors, Weapons, NPCs and Quests.</p>
		
		
		<a href='https://www.nexusmods.com/skyrimspecialedition'><img src={nexus} alt="button"/></a>
		<p>Nexusmods: you will love it if you want to try some mods</p>
		

		<a href='https://www.youtube.com/watch?v=d0Od2lbw9N4&list=PLnoBdER6tUmSVbmPtdFyFX9Rn6GdTLOE-'><img src={lore} alt="button"/></a>
		<p>Elder Scrolls Lore Series: If you want to know more backstories of Elder Scrolls. Created by a Youtuber ShoddyCast.</p>
		

		</div>
		
    	);
      
  }

}


export default Projects;