import React, { useContext, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './index.css'
import jwt_decode from "jwt-decode";
 
import FeaturePage from './feature'

import KeycloakProvider, { configureKeycloak, PrivateRoute, Login, Logout } from 'react-router-keycloak';

const KEYCLOAK_URL = 'https://sso.gttinternacional.com';
const KEYCLOAK_REALM = 'jviejo100';
const KEYCLOAK_CLIENT_ID = 'sgr-ui';



configureKeycloak(KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID);

function App() {
  const [token, setToken] = useState<string|null>(null);
  
  function handleRefresh(token: any) {
    console.log('Called every time the token is refreshed so you can update it locally', token);
    var decoded:string = jwt_decode(token);
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
                <Link to="/users">Users</Link>
              </li>
              <li className="p-3">
                <Link to="/private">privado</Link>
              </li>
              <li className="p-3">
                <Link to="/log-out">salir</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
          <div className="p-3">
          <Switch>
            <Route path="/about"><FeaturePage /></Route>
            <Route path="/users"><div>users</div></Route>
            <Route path="/login" render={props => <Login
              onFailure={(err:any) => {
                console.log("error ", err);

              }}
              onSuccess={(token: any) => {
                //console.log("success", token);
                var decoded: string = jwt_decode(token);
                setToken(decoded)
              }} redirectTo="/private" {...props} />} ></Route>
            <Route path="/log-out"

              render={props => <Logout onSuccess={(evt: any) => {
                console.log("success", evt);

              }} redirectTo="/" {...props} />} />
            <PrivateRoute path="/private" component={() => <pre>{token && JSON.stringify(token,null, 5)}</pre>} />
            <Route path="/"><div>root </div></Route>
          </Switch>
          </div>
        </div>
      </Router>
    </KeycloakProvider>
  )
}

export default App
