import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { UserSession } from 'blockstack'
import { appConfig } from './constants'

class Add extends Component {

  render() {
    return (
      <div className="add followers">
          <h1> Add A Follower: </h1>
          <form onSubmit={this.addReading} className="input-group">
            <input
              className="form-control"
              required
              placeholder="Blockstack ID"
            />
            <div className="input-group-append">
              <input type="submit" className="btn btn-primary" value="Add Follower"/>
            </div>
          </form>
          <h3>Your Followers:</h3>
          <h3>Dr. Clifton Jackness </h3>
      </div>
    );
  }
}
export default Add
