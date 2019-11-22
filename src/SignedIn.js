import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { UserSession } from 'blockstack'
import Kingdom from './Kingdom'
import Readings from './Readings'
import NavBar from './NavBar'
import { appConfig, ME_FILENAME } from './constants'
import './SignedIn.css'
import Add from "./add"

class SignedIn extends Component {

  constructor(props) {
    super(props)
    this.userSession = new UserSession({ appConfig })
    this.state = {
      me: {},
      savingMe: false,
      savingKingdown: false,
      redirectToMe: false
      //selectedAnimal: false,
      //selectedTerritory: false
    }
    this.saveMe = this.saveMe.bind(this)
    this.signOut = this.signOut.bind(this)
  }

  saveMe(me) {
    this.setState({me, savingMe: true})
    const options = { encrypt: true }
    this.userSession.putFile(ME_FILENAME, JSON.stringify(me), options)
    .finally(() => {
      this.setState({savingMe: false, redirectToMe: false})
    })
  }

  signOut(e) {
    e.preventDefault()
    this.userSession.signUserOut()
    window.location = '/'
  }

  render() {
    const username = this.userSession.loadUserData().username
    //const me = this.state.me
    const redirectToMe = this.state.redirectToMe
    if(redirectToMe) {
      // User hasn't configured their animal
      if(window.location.pathname !== '/me') {
        return (
          <Redirect to="/me" />
        )
      }
    }

    if(window.location.pathname === '/') {
      return (
        <Redirect to={`/readings/${username}`} />
      )
    }


    return (
      <div className="SignedIn">
      <NavBar username={username} signOut={this.signOut}/>
      <Switch>
              <Route
                path={`/readings/${username}`}
                render={
                  routeProps => <Readings
                  myKingdom={true}
                  protocol={window.location.protocol}
                  ruler={username}
                  realm={window.location.origin.split('//')[1]}
                  {...routeProps} />
                }
              />
              <Route
                path='/add/'
                render={
                  routeProps => <Add/>
                }
              />
      </Switch>
      </div>
    );
  }
}
export default SignedIn
