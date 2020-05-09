// cited partial code from react website: https://zh-hans.reactjs.org/docs/react-component.html
import React, { Component } from 'react'
import config from './config.js'
//get a reference to firebase
const firebase = require('firebase')

export class Guest extends Component {
  constructor(props) {
    super();
    this.state = {
      data: [],
      name: '',
      bio: '',
      msg: '',
      vis: 'private',
      email: '',
    }
  }

  //componentDidUpdate is invoked immediately after updating occurs.
  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.state.shouldUpdate !== prevState.shouldUpdate){
      let ref = firebase.database().ref('data')
      ref.on('value', snapshot => {
        const data = snapshot.val()
        let inf = []
        let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        for (let entry in data) {
          let Day = new Date(data[entry].date)
          let date = month[Day.getMonth()]+"-"+Day.getDate()+"-"+Day.getFullYear()+", "+Day.getHours()+":"+Day.getMinutes()+":"+Day.getSeconds()
          inf.push({
            name: data[entry].name,
            date: date,
            bio: data[entry].bio,
            msg: data[entry].msg,
            vis: data[entry].vis,
            email: data[entry].email,
          })
        }
        this.setState({data: inf})
      })
    }
  }

  componentDidMount(){
    //It is necessary to check if firebase has already been initialized otherwise it will throw an exception if it tries to initialize again
    //You can put this code in your componentDidMount function, or in an Effect to make sure it is ran when the app loads.
    //Use the second argument to useEffect() to control how often it is ran  
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    //get a reference to the database
    let ref = firebase.database().ref('data')
    //retrieve its data
    ref.on('value', snapshot => {
        //this is your call back function
		    //state will be a JSON object after this
        //set your apps state to contain this data however you like
        const data = snapshot.val();
        let inf = [];
        let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug","Sep", "Oct", "Nov", "Dec"]
        for (let entry in data) {
          let Day = new Date(data[entry].date);

          let date = month[Day.getMonth()]+"-"+Day.getDate()+"-"+Day.getFullYear()+",   "+Day.getHours()+":"+Day.getMinutes()+":"+Day.getSeconds()

          inf.push({
            name: data[entry].name,
            date: date,
            bio: data[entry].bio,
            msg: data[entry].msg,
            vis: data[entry].vis,
            email: data[entry].email,
          })
        }
        this.setState({data: inf});
    })
  }

 

  feedback = (event) => {
    event.preventDefault();
    if (this.state.name === '') {
      alert("You need to enter your name");
    } 
    else if (this.state.msg === '') {
      alert("You need to leave a message");
    } 
     else {
      let formObj = {
        vis: this.state.vis,
        email: this.state.email,
        date: firebase.database.ServerValue.TIMESTAMP,
        name: this.state.name, 
        bio: this.state.bio,
        msg: this.state.msg,
        };
      firebase.database().ref('data').push().set(formObj);
      this.setState({shouldUpdate: true});
      alert("Your message havs been delivered. Thank you!");
    }
  }

  Change = (event) => {
    let field = event.target.name;
    let value = event.target.value;
    this.setState({[field]: value});
  }

  render() {
    return (
      <div>

          <div className='messages'>
            <div className='Guest'>
            <form onSubmit={this.feedback}>
              <h2>You could leave a message</h2>

              <p><dot>*</dot> What is your name?<br/>
              <input name='name' type='text' minLength='6' maxLength='20'  onChange={this.Change} />
              </p>

              <p>Please introduce yourself.<br/>
              <input name='bio' type='text'  maxLength='99' onChange={this.Change}/>
              </p>

              <p><dot>*</dot> What have you to say?<br/>
                <textarea name='msg' minLength='16' maxLength='499'  onChange={this.Change}></textarea>
              </p>

              <p><dot>*</dot> Would you like your name and message to be viewable by the other guests of this site?<br/>
                <select id='vis' name='vis' onChange={this.Change}>
                  <option value='private'>No</option>
                  <option value='public'>Yes</option>
                </select>
              </p>

              <p>If you would like me to be able to contact you, what is your email? (email will not be posted)
              <input name='email' type='text'  onChange={this.Change}/>
              </p>

              <p><dot>*</dot>is required to enter</p>
              <div>
                <input type='submit' id='sent_message' name='sent_message' value='sent message'></input> 
              </div>

            </form>
            </div>


            <div className='response'>
              {this.state.data.map((entry) => {
                if(entry.vis !== 'private') {
                  
                    return (
                      <div>
                        <br/><span className='date'>{entry.date}</span> <br/>
                        <span className='name'>{entry.name}</span> <br/>
                        <span >{entry.bio}</span> <br/>
                        <span >{entry.msg}</span>
                        
                      </div>
                    )
                  
                }
              })}
            </div>
          
        </div>
        </div>
    );
  }
}
export default Guest;