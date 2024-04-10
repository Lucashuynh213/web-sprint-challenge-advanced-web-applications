import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';
import { axiosWithAuth } from '../axios/index';

const articlesUrl = 'http://localhost:9000/api/articles';
const loginUrl = 'http://localhost:9000/api/login';

export default function App() {
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState();
  const [spinnerOn, setSpinnerOn] = useState(false);
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/');
  };

  const redirectToArticles = () => {
    navigate('/articles');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin();
  };

  const login = async ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);

    try {
      const response = await axiosWithAuth().post(loginUrl, {
        username,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setMessage(response.data.message);
        redirectToArticles();
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('An error occurred while logging in.');
    } finally {
      setSpinnerOn(false);
    }
  };

  const getArticles = async () => {
    setMessage('');
    setSpinnerOn(true);

    try {
      const response = await axiosWithAuth().get(articlesUrl);

      if (response.data.articles) {
        setArticles(response.data.articles);
        setMessage(response.data.message);
      } else {
        redirectToLogin();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        redirectToLogin();
      } else {
        setMessage('An error occurred while fetching articles.');
      }
    } finally {
      setSpinnerOn(false);
    }
  };

  const postArticle = async (article) => {
    // Implement postArticle
    setMessage('');
  setSpinnerOn(true);

  try {
    const response = await axiosWithAuth().post(articlesUrl, article);

    if (response.data.article) {
      setArticles([...articles, response.data.article]);
      setMessage(response.data.message);
    } else {
      setMessage(response.data.message);
    }
  } catch (error) {
    setMessage('An error occurred while posting the article.');
  } finally {
    setSpinnerOn(false);
  }
};

  const updateArticle = async ({ article_id, article }) => {
    // Implement updateArticle
    setMessage('');
  setSpinnerOn(true);

  try {
    const response = await axiosWithAuth().put(`${articlesUrl}/${article_id}`, article);

    if (response.data.article) {
      const updatedArticles = articles.map((item) => {
        if (item.id === article_id) {
          return response.data.article;
        }
        return item;
      });
      setArticles(updatedArticles);
      setMessage(response.data.message);
    } else {
      setMessage(response.data.message);
    }
  } catch (error) {
    setMessage('An error occurred while updating the article.');
  } finally {
    setSpinnerOn(false);
  }
};

  const deleteArticle = async (article_id) => {
    // Implement deleteArticle
    setMessage('');
  setSpinnerOn(true);

  try {
    const response = await axiosWithAuth().delete(`${articlesUrl}/${article_id}`);

    if (response.data.message === 'Article deleted successfully') {
      const updatedArticles = articles.filter((item) => item.id !== article_id);
      setArticles(updatedArticles);
    }
    setMessage(response.data.message);
  } catch (error) {
    setMessage('An error occurred while deleting the article.');
  } finally {
    setSpinnerOn(false);
  }
};

useEffect(() => {
  const fetchData = async () => {
    await getArticles();
  };

  fetchData();
}, []);
  return (
    <>
      {spinnerOn && <Spinner />}
      {message && <Message message={message} />}
      <button id="logout" onClick={logout}>
        Logout from app
      </button>
      <div id="wrapper" style={{ opacity: spinnerOn ? '0.25' : '1' }}>
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
                <ArticleForm postArticle={postArticle} />
                <Articles
        articles={articles}
        deleteArticle={deleteArticle}
        updateArticle={updateArticle}
        setCurrentArticleId={setCurrentArticleId}
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