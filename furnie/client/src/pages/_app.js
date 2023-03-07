import "./styles/globals.css";
import Layout from "../components/Layout";
import { Provider } from "react-redux";
import { legacy_createStore as createStore } from "redux";
import rootReducer from "../store/rootReducer";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";

const onRouterLoading = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => {
      if (url !== router.asPath) {
        return setLoading(true);
      }
    };

    const handleComplete = (url) => {
      if (url === router.asPath) {
        return setLoading(false);
        // return setTimeout(() => {
        // }, 1000);
      }
    };

    // router.
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  if (loading) {
    return (
      <div className={"loading d-block"}>
        <div className="loading__spinner-container">
          <div className="loading__spinner-top">
            <Spinner
              animation="border"
              variant="info"
              className="loading__spinner-icon"
            />
          </div>
          <div className="loading__spinner-bottom mt-3">
            <span className="loading__spinner-text text-light">Loading</span>
            <Spinner
              animation="grow"
              variant="light"
              className="loading__spinner-icon me-2"
            />
            <Spinner
              animation="grow"
              variant="light"
              className="loading__spinner-icon me-2"
            />
            <Spinner
              animation="grow"
              variant="light"
              className="loading__spinner-icon me-2"
            />
            <Spinner
              animation="grow"
              variant="light"
              className="loading__spinner-icon me-2"
            />
            <Spinner
              animation="grow"
              variant="light"
              className="loading__spinner-icon"
            />
          </div>
        </div>
      </div>
    );
  }
};

const store = createStore(rootReducer);

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Layout>
        {onRouterLoading()}
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
