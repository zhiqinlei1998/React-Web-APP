import React, { Component } from 'react';
import { SRLWrapper } from "simple-react-lightbox";

import alone from '../image/alone.jpg' 
import cave from '../image/cave.jpg'
import dark from '../image/dark.jpg'
import dragon from '../image/dragon.jpg'
import fight from '../image/fight.jpg'
import home from '../image/home.jpg'
import mission from '../image/mission.jpg'
import mountain from '../image/mountain.jpg'
import school from '../image/school.jpg'
import scroll from '../image/scroll.jpg'
import ship from '../image/ship.jpg'
import snow from '../image/snow.jpg'
import star from '../image/star.jpg'
import talk from '../image/talk.jpg'
import whiterun from '../image/whiterun.jpg'

 
function MyComponent() {
  return (
    <div className="MyComponent">
      <SRLWrapper>
            <img src={cave} alt="cave"/>
			<img src={school} alt="school"/>
			<img src={mountain} alt="mountain"/>
			<img src={whiterun} alt="whiterun"/>
			<img src={ship} alt="ship"/>
			<img src={talk} alt="talk"/>
			<img src={dark} alt="dark"/>
			<img src={dragon} alt="dragon"/>
			<img src={scroll} alt="scroll"/>
			<img src={star} alt="star"/>
			<img src={mission} alt="mission"/>
			<img src={snow} alt="snow"/>
			<img src={fight} alt="fight"/>
			<img src={home} alt="home"/>
			<img src={alone} alt="alone"/>
      </SRLWrapper>
    </div>
  );
}
 
export default MyComponent;