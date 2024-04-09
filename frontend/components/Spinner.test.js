// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from 'react';
import { render, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import Articles from './Articles';

// Mock the deleteArticle function
const deleteArticleMock = jest.fn();

// Mock articles data
const articles = [
  { article_id: 1, title: 'Article 1', text: 'Text for article 1', topic: 'Topic 1' },
  { article_id: 2, title: 'Article 2', text: 'Text for article 2', topic: 'Topic 2' },
];

test('[9] Clicking delete button on an article removes it from the page and shows success message', async () => {
  const { getByText, queryByText } = render(
    <Articles
      articles={articles}
      getArticles={() => {}} // Mock the getArticles function
      deleteArticle={deleteArticleMock} // Use the mocked deleteArticle function
      setCurrentArticleId={() => {}} // Mock the setCurrentArticleId function
    />
  );

  // Check if articles are rendered
  expect(getByText('Article 1')).toBeInTheDocument();
  expect(getByText('Article 2')).toBeInTheDocument();

  // Click delete button on the first article
  fireEvent.click(getByText('Delete'));

  // Verify that the article is removed from the page
  await waitForElementToBeRemoved(() => getByText('Article 1'));
  expect(queryByText('Article 1')).not.toBeInTheDocument();

  // Verify that the deleteArticle function is called with the correct article ID
  expect(deleteArticleMock).toHaveBeenCalledWith(1);

  // Verify that the success message renders
  expect(getByText('Article 1 was deleted.')).toBeInTheDocument();
});