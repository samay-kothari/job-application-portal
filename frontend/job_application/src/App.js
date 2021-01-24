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
import ViewJobs from './components/screens/viewJob'
import AddSopApply from './components/screens/addSopApply'
import MyApplication from './components/screens/myApplications'
import RecruiterApplicationView from './components/screens/recruiterApplicationView'

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
              <Route path="/viewJob" component={ViewJobs}/>
              <Route path="/applyJob" component={AddSopApply}/>
              <Route path="/myApplication" component={MyApplication}/>
              <Route path="/recruiterApplication" component={RecruiterApplicationView}></Route>
            <AppNavbar/>
          </div>
        </Provider>
      </Router>
    );
  }
}

export default App;