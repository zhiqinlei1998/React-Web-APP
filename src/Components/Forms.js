import React, { Component } from 'react'
import config from "./config"
//get a reference to firebase
const firebase = require('firebase')

export class Guest extends Component {
    constructor(props){
        super()
        this.state = {
            name: '',
            data: [],
            bio: '',
            message: '',
            email: '',
            visability: 'private',
        }
    }

    componentDidMount(){
    
        if (!firebase.apps.length) {
          firebase.initializeApp(config);
        }
        
        firebase.database().ref('data').on('value', snapshot => {
    
            let data = snapshot.val();
            let add_on = [];
            let month = ["January", "February", "March", "April", "May", "June", "July", "Auguest",
                          "September", "October", "Novmber", "December"];
            for (let entry in data) {
              let d = new Date(data[entry].date);
              let date = month[d.getMonth()]+"/"+d.getDate()+"/"+d.getFullYear()+",   "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
              add_on.push({
                date: date,
                name: data[entry].name,
                description: data[entry].description,
                say: data[entry].say,
                visibility: data[entry].visibility,
                email: data[entry].email,
                
              })
            }
            this.setState({data: add_on});
        })
      }
    
     
    
    helper = (event) => {
        event.preventDefault();
        if (this.state.name === '') {
          alert("Missing component name");
        } 
        else if (this.state.say === '') {
          alert("Missing component! What have you to say?");
        } 
         else {
          let formObj = {
            name: this.state.name, 
            description: this.state.description,
            say: this.state.say,
            visibility: this.state.visibility,
            email: this.state.email,
            date: firebase.database.ServerValue.TIMESTAMP,
            };
          firebase.database().ref('data').push().set(formObj);
          this.setState({shouldUpdate: true});
          alert("We have received your message");
        }
      }
    
    do_change = (event) => {
        let field = event.target.name;
        let value = event.target.value;
        this.setState({[field]: value});
      }
    
    render() {
        return (
          <div>
    
              <div className='left_right'>
                <div className='form'>
                <form onSubmit={this.helper}>
                  <h2>Comment Submission Form</h2>
    
                  <p>
    
                  <h5><dot>*</dot> What is your name?<br/>
                  <input name='name' type='text' minLength='6' maxLength='19'  onChange={this.do_change} />
                  </h5>
    
    
                  <h5>Offer a short description of yourself.<br/>
                  <input name='description' type='text'  maxLength='99' onChange={this.do_change}/>
                  </h5>
    
    
    
                  <h5><dot>*</dot> What have you to say?<br/>
                    <textarea name='say' minLength='16' maxLength='499'  onChange={this.do_change}></textarea>
                  </h5>
    
    
    
                  <h5><dot>*</dot> Would you like your name and message to be viewable by the other guests of this site?<br/>
                    <select id='visibility' name='visibility' onChange={this.do_change}>
                      <option value='private'>No</option>
                      <option value='public'>Yes</option>
                    </select>
                  </h5>
    
                  <h5>If you would like me to be able to contact you, what is your email? (email will not be posted)
                  <input name='email' type='text'  onChange={this.do_change}/>
                  </h5>
    
    
                  <h6><dot>*</dot>is required</h6>
                  <div>
                    <input type='submit' id='submit' name='submit' value='Submit'></input> 
                  </div>
    
                  
                  </p>
    
                </form>
                </div>
    
                
                <div className='out_put'>
                <h2 >Comment</h2>
                {this.state.data.map((entry) => {
                    if(entry.visibility !== 'private') {
                  
                    return (
                      <div>
                        <br/><span className='date'>{entry.date}</span> <br/>
                        <span className='name'>{entry.name}</span> <br/>
                        <span >{entry.description}</span> <br/>
                        <span >{entry.say}</span>
                        <h5>----------------------------------------------------------------------------------------------------------------</h5>
                        <br/>
                        <br/>
                        
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