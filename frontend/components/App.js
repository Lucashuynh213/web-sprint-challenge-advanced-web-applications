import React, { useState } from "react";
import {
  NavLink,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Articles from "./Articles";
import LoginForm from "./LoginForm";
import Message from "./Message";
import ArticleForm from "./ArticleForm";
import Spinner from "./Spinner";
import { axiosWithAuth } from "../axios/index";

const articlesUrl = "http://localhost:9000/api/articles";
const loginUrl = "http://localhost:9000/api/login";

export default function App() {
  // ✨ MVP can be achieved with these states
  const [currentArticle, setCurrentArticle] = useState(null);
  const [message, setMessage] = useState("");
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [spinnerOn, setSpinnerOn] = useState(false);

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate();
  // const redirectToLogin = () => { /* ✨ implement */ }
  const redirectToLogin = () => {
    navigate("/");
  };
  // const redirectToArticles = () => { /* ✨ implement */ }
  const redirectToArticles = () => {
    navigate("/articles");
  };

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    localStorage.removeItem("token");
    setMessage("Goodbye!");
    navigate("/"); // Redirect to login screen
  };

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("");
    setSpinnerOn(true);
    axios
      .post(loginUrl, { username, password })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        setMessage(response.data.message);
        setSpinnerOn(false);
        // After successful login, fetch articles
        getArticles();
      })
      .catch((error) => {
        setMessage(error.response.data.message);
        setSpinnerOn(false);
      });
  };

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage("");
  setSpinnerOn(true);

  const token = localStorage.getItem("token");
  if (!token) {
    // Redirect to login if token is missing
    redirectToLogin();
    return;
  }

  axiosWithAuth()
    .get(articlesUrl)
    .then((response) => {
      setArticles(response.data);
      setMessage("Articles fetched successfully.");
      setSpinnerOn(false);
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        // Redirect to login if token is invalid or expired
        redirectToLogin();
      } else {
        setMessage(error.response.data.message);
      }
      setSpinnerOn(false);
    });
};

  const postArticle = (article) => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth()
      .post(articlesUrl, article)
      .then((response) => {
        setArticles([...articles, response.data]);
        setMessage(response.data.message);
        setSpinnerOn(false);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
        setSpinnerOn(false);
      });
  };

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    setMessage("");
    setSpinnerOn(true);
    axiosWithAuth()
      .put(`${articlesUrl}/${article_id}`, article)
      .then((response) => {
        const updatedArticles = articles.map((item) =>
          item.article_id === article_id ? response.data : item
        );
        setArticles(updatedArticles);
        setMessage(response.data.message);
        setSpinnerOn(false);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
        setSpinnerOn(false);
      });
  };

  const deleteArticle = (article_id) => {
    // ✨ implement
    // Clear any previous messages and set spinner
    setMessage("");
    setSpinnerOn(true);
  
    // Send DELETE request to delete the article
    axiosWithAuth()
      .delete(`${articlesUrl}/${currentArticleId}`)
      .then((response) => {
        // If deletion is successful, update the articles state to remove the deleted article
        setArticles((prevArticles) =>
          prevArticles.filter(
            (article) => article.article_id !== currentArticleId
          )
        );
        // Set success message
        setMessage(response.data.message);
      })
      .catch((error) => {
        // If an error occurs, set error message
        setMessage(error.response.data.message);
      })
      .finally(() => {
        // Always turn off the spinner after request completes
        setSpinnerOn(false);
      });
  };

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        {" "}
        {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">
            Login
          </NavLink>
          <NavLink id="articlesScreen" to="/articles">
            Articles
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
  path="articles"
  element={
    <>
      <ArticleForm
        currentArticle={currentArticle}
        postArticle={postArticle}
        updateArticle={updateArticle}
        setCurrentArticleId={setCurrentArticleId}
        deleteArticle={deleteArticle} // Pass deleteArticle prop here
      />
      <Articles
        articles={articles}
        getArticles={getArticles}
        deleteArticle={deleteArticle} // Pass deleteArticle prop here
        setCurrentArticleId={setCurrentArticleId}
        currentArticleId={currentArticleId}
      />
    </>
  }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
