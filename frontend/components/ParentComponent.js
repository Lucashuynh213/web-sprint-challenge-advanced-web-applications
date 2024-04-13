import React, { useState, useEffect } from 'react';
import Articles from './Articles';
import { axiosWithAuth } from '../axios/index';

const ParentComponent = () => {
  const [articles, setArticles] = useState([]);

  // Define the getArticles function
  const getArticles = async () => {
    try {
      const response = await axiosWithAuth().get('http://localhost:9000/api/articles');
      setArticles(response.data.articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  useEffect(() => {
    // Fetch articles on component mount
    getArticles();
  }, []);

  return (
    <div>
      {/* Render the Articles component and pass the getArticles function as a prop */}
      <Articles articles={articles} getArticles={getArticles} />
    </div>
  );
};

export default ParentComponent;