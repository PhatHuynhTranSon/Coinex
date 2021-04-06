import React from "react";
import Background from "./components/background";
import Navigation from "./navigation";
import GlobalStyle from "./styles";

const App = () => {
  return (
    <React.Fragment>
      <GlobalStyle />
      <Navigation />
      <Background>
        Hello
      </Background>
    </React.Fragment>
  );
}

export default App;
