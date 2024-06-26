import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { NotFound } from "./PageNotFound";
import { Dashboard } from "./Dashboard";
import { NewDirectPolling } from "./NewDirectPolling";
import { DirectPolling } from "./DirectPolling";
import { ResetPassword } from "./ResetPassword";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

const App = () => {
  const [userId, setUserId] = useState(3);
  const [userName, setUserName] = useState("22PW29");
  const [cookies, setCookie, removeCookie] = useCookies([
    "userId",
    "userName",
    "accessToken",
    "refreshToken",
    "batchName",
    "batchId"
  ]);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  useEffect(() => {
    const accessToken = cookies.accessToken;
    if (accessToken) {
      // Validate the access token (e.g., check expiration)
      // If valid, set the user as authenticated
      setIsAuthenticated(true);
    }
  }, [cookies.accessToken]);

  useEffect(() => {
    const userId = cookies.userId;
    if (userId) {
      // Validate the access token (e.g., check expiration)
      // If valid, set the user as authenticated
      setUserId(userId);
      console.log(userId);
    }
  }, [cookies.userId]);

  useEffect(() => {
    const userName = cookies.userName;
    if (userName) {
      // Validate the access token (e.g., check expiration)
      // If valid, set the user as authenticated
      setUserName(userName);
    }
  }, [cookies.userName]);
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginForm setCookie={setCookie} />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              uid={userId ? userId: cookies.userId}
              userName={userName}
              batchID={cookies.batchId}
              batchname={cookies.batchName}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        {/* <Route path="/cards" element={<Cards />} /> */}
        <Route path="/polls" element={<DirectPolling />} />
        <Route path="/new-polling" element={<NewDirectPolling />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
