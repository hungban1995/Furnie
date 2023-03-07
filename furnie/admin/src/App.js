import "./App.css";
import Layout from "./components/Layout";
import Login from "./components/login";
import RouterPage from "./routers";
import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { connect } from "react-redux";
import Loading from "./components/Loading";
function App({ num }) {
  const [refreshToken, setRefreshToken] = useState(null);
  useEffect(() => {
    if (localStorage && localStorage.getItem("refreshToken")) {
      setRefreshToken(JSON.parse(localStorage.getItem("refreshToken")));
    } else {
      setRefreshToken(null);
    }
  }, [num]);
  return (
    <>
      <BrowserRouter>
        <Loading />
        {refreshToken ? (
          <Layout>
            <RouterPage />
          </Layout>
        ) : (
          <Login />
        )}
      </BrowserRouter>
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    num: state.RefreshReducer.num,
  };
};
export default connect(mapStateToProps)(App);
