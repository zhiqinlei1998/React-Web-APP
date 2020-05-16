import React, { Component } from 'react'
import Home from './Home'
import Images from './Images'
import Videos from './Videos'
import Links from './Links'
import Guest from './Guest'
import Movies from './Movies'

export class Body extends Component{
	displayContent =() => {
		var activeTab = this.props.activeTab

		if(activeTab===1)
			return <Home/>

		else if (activeTab===2) 
			return <Images/>

		else if (activeTab===3)
			return <Videos/>

		else if (activeTab===4)
			return <Links/>

		else if (activeTab===5)
			return <Guest/>

		else
			return <Movies/>
		
	}
  render(){

    return (this.displayContent());
             
      
  }

}


export default Body;