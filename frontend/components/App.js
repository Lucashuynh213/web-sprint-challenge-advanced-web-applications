import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';
import axios,{ axiosWithAuth } from '../axios/index';

const articlesUrl = 'http://localhost:9000/api/articles';
const loginUrl = 'http://localhost:9000/api/login';

export default function App() {
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [spinnerOn, setSpinnerOn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && window.location.pathname !== '/') {
      navigate('/');
    } else {
      getArticles();
    }
  }, [navigate]);


  const postArticle = async (article) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:9000/api/articles', article, {
        headers: {
          Authorization: token,
        },
      });
      // Handle the response here
      console.log(response.data);
    } catch (error) {
      // Handle errors here
      console.error('Error posting article:', error);
    }
  };

  const setCurrentArticleId = (id) => {
    // Implement the logic to set the current article ID
  };

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

  const deleteArticle = async (articleId) => {
    setMessage('');
    setSpinnerOn(true);
  
    try {
      const token = localStorage.getItem('token');
      const response = await axiosWithAuth().delete(`${articlesUrl}/${articleId}`, {
        headers: {
          Authorization: token,
        },
      });
  
      if (response.data.message === 'Article deleted successfully') {
        // Update articles state to remove the deleted article
        setArticles(articles.filter(article => article.article_id !== articleId));
        setMessage('Article deleted successfully');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage('An error occurred while deleting the article.');
    } finally {
      setSpinnerOn(false);
    }
  };

  const updateArticle = async ({ articleId, updatedArticle }) => {
    setMessage('');
    setSpinnerOn(true);
  
    try {
      const token = localStorage.getItem('token');
      const response = await axiosWithAuth().put(`${articlesUrl}/${articleId}`, updatedArticle, {
        headers: {
          Authorization: token,
        },
      });
  
      if (response.data.article) {
        // Update articles state with the updated article
        setArticles(articles.map(article => (article.article_id === articleId ? response.data.article : article)));
      }
      setMessage(response.data.message);
    } catch (error) {
      setMessage('An error occurred while updating the article.');
    } finally {
      setSpinnerOn(false);
    }
  };

  return (
    <>
       <Spinner on={spinnerOn} />
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
              <ArticleForm postArticle={postArticle} setCurrentArticleId={setCurrentArticleId} updateArticle={updateArticle}/>
              <Articles articles={articles} deleteArticle={deleteArticle} setCurrentArticleId={setCurrentArticleId} getArticles={getArticles}  />
            </>
            }
          />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  );
}
