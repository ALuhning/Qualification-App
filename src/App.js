import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import './App.css'
import Header from './components/header/header.component'
import HomePage from './pages/home-page/home-page.component'
import AwardQualifications from './pages/award-qualifications/award-qualifications.component'
import Portis from '@portis/web3'
import Web3 from 'web3'
import QualificationCreationNew from './utils/QualificationCreationNew'
import AuthorizeTrainingEstablishment from './pages/training-establishments/assign-training-establishments.component'

class App extends Component {

  constructor(props){
    super(props)
    this.contract = new QualificationCreationNew()
    console.log(this.contract)
    const portis = new Portis('da7efc94-6cb2-4701-8878-60939fca9878', 'mainnet')
    //await portis.showPortis()
    this.web3js = new Web3(portis.provider)
  }

  componentDidMount() {
    this.contract.loadContract(this.web3js)
  }

render() {  

  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path='/' component={HomePage} />
        <Route path='/quals' component={AwardQualifications} />
        <Route path='/establishments' component={AuthorizeTrainingEstablishment} />
      </Switch>
    </div>
  )
}
}

export default App
