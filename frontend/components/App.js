import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  const navigate = useNavigate()
  const redirectToLogin = () => navigate('/')
  const redirectToArticles = () => navigate('/articles')

  const logout = () => {
    localStorage.removeItem('token')
    setMessage('Goodbye!')
    redirectToLogin()
  }

  const login = ({ username, password }) => {
    setMessage('')
    setSpinnerOn(true)
    axios.post(loginUrl, { username, password })
      .then(res => {
        localStorage.setItem('token', res.data.token)
        setMessage(res.data.message)
        redirectToArticles()
      })
      .catch(err => {
        setMessage(err.response.data.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const getArticles = () => {
    setMessage('')
    setSpinnerOn(true)
    axios.get(articlesUrl, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
      .then(res => {
        setArticles(res.data.articles)
        setMessage(res.data.message)
      })
      .catch(err => {
        if (err.response.status === 401) {
          redirectToLogin()
        } else {
          setMessage(err.response.data.message)
        }
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const postArticle = article => {
    setMessage('')
    setSpinnerOn(true)
    axios.post(articlesUrl, article, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
      .then(res => {
        setArticles([...articles, res.data.article])
        setMessage(res.data.message)
      })
      .catch(err => {
        setMessage(err.response.data.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const updateArticle = ({ article_id, article }) => {
    setMessage('')
    setSpinnerOn(true)
    axios.put(`${articlesUrl}/${article_id}`, article, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
      .then(res => {
        setArticles(articles.map(art => art.article_id === article_id ? res.data.article : art))
        setMessage(res.data.message)
      })
      .catch(err => {
        setMessage(err.response.data.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const deleteArticle = article_id => {
    setMessage('')
    setSpinnerOn(true)
    axios.delete(`${articlesUrl}/${article_id}`, {
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
      .then(res => {
        setArticles(articles.filter(art => art.article_id !== article_id))
        setMessage(res.data.message)
      })
      .catch(err => {
        setMessage(err.response.data.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  return (
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={articles.find(art => art.article_id === currentArticleId)}
              />
              <Articles 
                articles={articles}
                getArticles={getArticles}
                deleteArticle={deleteArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}