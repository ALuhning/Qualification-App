import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import './App.css';
import Header from './components/header/header.component'
import HomePage from './pages/home-page/home-page.component'
import AwardQualifications from './pages/award-qualifications/award-qualifications.component';

class App extends Component {
  

render() {  

  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route path='/quals' component={AwardQualifications} />
      </Switch>
    </div>
  )
}
}

export default App;
