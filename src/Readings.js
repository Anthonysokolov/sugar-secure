import React, { Component } from 'react'
import { UserSession } from 'blockstack'
import { appConfig, ME_FILENAME } from './constants'
import CanvasJSReact from './canvasjs.react'


import './Readings.css'

var CanvasJSChart = CanvasJSReact.CanvasJSChart

class Readings extends Component {

  constructor(props) {
    super(props)
    this.state = {
      value: '',
      app:`${props.protocol}//${props.realm}`,
      rulerUsername: "Anthony",
      readings:[],
    }
    this.userSession = new UserSession({ appConfig })
    this.handleChange = this.handleChange.bind(this)
    this.addReading = this.addReading.bind(this)
  }

  componentWillMount() {
    const app = this.state.app
    const search = window.location.search
    if(search) {
      const appUrl = search.split('=')[1]
      this.setState({
        value: appUrl,
        clickAdd: true
      })
    }
    this.loadMe()

  }

  handleChange(event) {
   this.setState({value: event.target.value});
  }

  loadMe() {
    let temp = []
    let options = { decrypt: true }
    this.userSession.getFile(ME_FILENAME, options).then(async (content) =>{
      if(content){
        temp = await JSON.parse(content)
        this.setState({readings:temp})
      }
    })
  }

  addReading(event){
    event.preventDefault()
    let options = { encrypt: true }
    this.state.readings.push({y:parseInt(this.state.value)})
    this.userSession.putFile(ME_FILENAME, JSON.stringify(this.state.readings), options)
    this.setState({value:""})
  }

  render() {
    const username = this.state.rulerUsername
    const app = this.state.app
    const clickAdd = this.state.clickAdd
    const options = {
      axisY:{
        minimum:60
      },
      data: [{
                type: "line",
                dataPoints:this.state.readings
       }]
     }

    return (
      <div className="Kingdom">
        <div className="row">
        </div>
        <div className="row ruler">
          <div className="col-lg-12">
            <h2>{username}'s Glucose Readings</h2>
            <div>
              <CanvasJSChart options = {options}/>
            </div>
            <div className="container">
              <h2>Add Reading</h2>
                <div className="row justify-content-center">
                  <div
                    id="addReading"
                    className="add-frame col-lg-8"
                    style={{borderColor: (clickAdd ? 'red' : '#f8f9fa')}}
                  >
                    <form onSubmit={this.addReading} className="input-group">
                      <input
                        className="form-control"
                        type="number"
                        onChange={this.handleChange}
                        value={this.state.value}
                        required
                        placeholder="Glucose value"
                      />
                      <div className="input-group-append">
                        <input type="submit" className="btn btn-primary" value="Add reading"/>
                      </div>
                    </form>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Readings
