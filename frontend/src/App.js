import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Pages
import Register from "./pages/Register";
import Success from "./pages/Success";
import OTPVerify from "./pages/OTPVerify";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import PastorDashboard from "./pages/PastorDashboard";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Register} />
        <Route path="/success" component={Success} />
        <Route path="/verify" component={OTPVerify} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/users" component={AdminUsers} />
        <Route path="/pastor/dashboard" component={PastorDashboard} />
      </Switch>
    </Router>
  );
}

export default App; 