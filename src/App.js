import React, { Component } from 'react';

import Body from './Components/Body'
import TabList from './Components/TabList'
import './Components/style.css'

export class App extends Component{
  constructor(){
    super();
    this.state ={
      activeTab: 1
    }
    this.changeTab = (id) => {
      this.setState({
        activeTab: id
      })
    }
  }
  render(){
    const tabs = [
    {
      id:1,
      title: 'Home'
    },

    {
      id:2,
      title: 'Images'
    },

    {
      id:3,
      title: 'Videos'
    },

    {
      id:4,
      title: 'Links'
    }

    ]


    return(
      
      

      <div className= "body">

        <div className = "header">
          <h1>Welcome to you</h1>
			    <h2>Fortune smiles upon this meeting.</h2>
        </div>

        <div className ="navbar"> 
          
          <TabList tabs={tabs} 
          changeTab={this.changeTab}
            
          activeTab={this.state.activeTab} />
          
          
        </div>

       
        <div className ="main-body">
          <Body activeTab={this.state.activeTab}/>
        </div>

        
          
        
      </div>

      );
  }
}


export default App;