import React, { useContext, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './index.css'
import jwt_decode from "jwt-decode";
import KeycloakProvider, { configureKeycloak, PrivateRoute, Login, Logout } from 'react-router-keycloak';
import Hero from './Hero';
import Faq from './Faq';
import Feature from './feature';

const KEYCLOAK_URL = 'https://sso.gttinternacional.com';
const KEYCLOAK_REALM = 'jviejo100';
const KEYCLOAK_CLIENT_ID = 'sgr-ui';



configureKeycloak(KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID);

function App() {
  const [token, setToken] = useState<any | null>(null);

  function handleRefresh(token: any) {
    console.log('Called every time the token is refreshed so you can update it locally', token);
    var decoded: string = jwt_decode(token);
    setToken(decoded)
  }

  return (
    <KeycloakProvider
      loginPath="/login"
      logoutPath="/logout"
      onRefresh={handleRefresh}>
      <Router>
        <div className="container mx-auto">
          <nav className="w-full">
            <ul className="flex">
              <li className="p-3">
                <Link to="/">Home</Link>
              </li>
              <li className="p-3">
                <Link to="/about">About</Link>
              </li>
              <li className="p-3">
                <Link to="/faq">faq</Link>
              </li>
              {!token &&
                <li className="p-3">
                  <Link to="/private">Login</Link>
                </li>
              }
              {token &&
                <li className="p-3">
                  <Link to="/log-out">Logout ({token.name.substring(0,3)})</Link>
                </li>
              }
            </ul>
          </nav>
          <Switch>

            <Route path="/about" exact={true} render={props => <Feature></Feature>} />
            <Route path="/faq" exact={true} render={props => <Faq></Faq>} />
            <Route path="/login" exact={true} render={props => <Login
              onFailure={(err: any) => {
                console.log("error ", err);

              }}
              onSuccess={(token: any) => {
                //console.log("success", token);
                var decoded: string = jwt_decode(token);
                setToken(decoded)
              }} redirectTo="/private" {...props} />} />
            <Route path="/log-out" exact={true}
              render={props => <Logout onSuccess={(evt: any) => {
                console.log("success", evt);

              }} redirectTo="/" {...props} />} />
            <PrivateRoute exact={true} path="/private" component={() => <pre>{token && JSON.stringify(token, null, 5)}</pre>} />
            <Route path="/" exact={true} render={props => <Hero></Hero>} />
          </Switch>
        </div>
      </Router>
    </KeycloakProvider>
  )
}

export default App
