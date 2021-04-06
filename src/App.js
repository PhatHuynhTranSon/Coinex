import React from "react";
import Background from "./components/background";
import Navigation from "./navigation";
import GlobalStyle from "./styles";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import OneCoinPage from "./pages/onecoin";
import AllCoinsPage from "./pages/allcoin";
import ProfilePage from "./pages/profile";

const App = () => {
  return (
    <Router>
      <React.Fragment>
        <GlobalStyle />
        <Navigation />
        <Background>
          <Switch>
            <Route exact path="/">
              <OneCoinPage/>
            </Route>

            <Route path="/all">
              <AllCoinsPage/>
            </Route>

            <Route path="/profile">
              <ProfilePage/>
            </Route>
          </Switch>
        </Background>
      </React.Fragment>
    </Router>
  );
}

export default App;
