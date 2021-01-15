import './App.css';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions'
import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import AppNavbar from './components/AppNavbar'
import LandingPage from './components/screens/landingPage'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import ApplicantEdit from './components/screens/applicantEdit'
import AddJob from './components/screens/addJob'

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Router>
        <Provider store = { store }>
          <div className="app">
              <Route path="/" component={LandingPage}/>
              <Route path="/applicantEdit" component={ApplicantEdit}/>
              <Route path="/addJob" component={AddJob}/>
            <AppNavbar/>
          </div>
        </Provider>
      </Router>
    );
  }
}

export default App;