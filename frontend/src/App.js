import React from "react";
import {Switch,Route , Link} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import AddReview from "./Components/add-review";
import Login from "./Components/login";
import RestaurantList from "./Components/restaurants-list";
import Restaurant from "./Components/restaurants";

function App() {
  const [user,setUser] = React.useState(null);
  async function login(user=null){
    setUser(user)
  }
  async function logOut(){
    setUser(null)
  }

  return (
     
     <div className="App">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/restaurants" className="navbar-brand" >
          Restaurant Review
        </a>
        <div className="navbar-nav mr-auto">
        <li className="nav-Item">
          <Link to={"/restaurants"} className="nav-link">
            Restaurants
          </Link>
        </li>
        <li className="nav-Item">
          {user ? (
            <a onClick={logOut} className="nav-link" style={{cursor:"pointer"}}>
              Logout {user.name}
            </a>
          ):(
            <Link to = {"/login"} className="nav-link">
              Login
            </Link>
          )}
        </li>
        </div>
      </nav>
        
        <Switch>
          <Route exact path={['/','/restaurants']} component =  {RestaurantList}/>
          <Route
                path={"/restaurants/:id/review"}
                render={(props)=>(
                  <AddReview {...props} user={user}/>
                )}/>
           <Route
                path={"/restaurants/:id"}
                render={(props)=>(
                  <Restaurant {...props} user={user}/>
                )}/>
            <Route
                path={"/login"}
                render={(props)=>(
                  <Login {...props} login={login}/>
                )}/> 
        </Switch>


    </div>


  );
}

export default App;
