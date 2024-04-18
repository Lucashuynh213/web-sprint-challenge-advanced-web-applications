import React from 'react'
import { render, fireEvent, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import '@testing-library/jest-dom/extend-expect'
import { setupServer, getHandlers } from './backend/mock-server'
import { st } from './backend/helpers'
import App from './frontend/components/App'

jest.setTimeout(750) // default 5000 too long for Codegrade
const waitForOptions = { timeout: 150 }
const queryOptions = { exact: false }

const renderApp = ui => {
  window.localStorage.clear()
  window.history.pushState({}, 'Test page', '/')
  return render(ui)
}
let server
beforeAll(() => {
  server = setupServer(...getHandlers())
  server.listen()
})
afterAll(() => {
  server.close()
})
beforeEach(() => {
  renderApp(<BrowserRouter><App /></BrowserRouter>)
})
afterEach(() => {
  server.resetHandlers(...getHandlers())
})

const token = () => window.localStorage.getItem('token')
const logoutBtn = () => screen.queryByText('Logout from app')
// login screen
const usernameInput = () => screen.queryByPlaceholderText('Enter username')
const passwordInput = () => screen.queryByPlaceholderText('Enter password')
const loginBtn = () => screen.queryByText('Submit credentials')
// articles screen
const articlesLink = () => screen.queryByRole('link', { name: 'Articles' })
const titleInput = () => screen.queryByPlaceholderText('Enter title')
const textInput = () => screen.queryByPlaceholderText('Enter text')
const topicSelect = () => screen.queryByRole('combobox')
const submitArticleBtn = () => screen.queryByText('Submit')

const loginFlow = async () => {
  fireEvent.change(usernameInput(), { target: { value: 'Foo' } })
  fireEvent.change(passwordInput(), { target: { value: '12345678' } })
  fireEvent.click(loginBtn())
  await screen.findByText(st.closuresTitle, queryOptions, waitForOptions)
  await screen.findByText('Here are your articles, Foo!', queryOptions, waitForOptions)
}

describe('Advanced Applications', () => {
  describe('Login', () => {
    test(`[1] Submit credentials button is disabled until
        - username (after trimming) is at least 3 chars AND
        - password (after trimming) is at least 8 chars
        - Review how to conditionally disable a button element.`, () => {
      expect(loginBtn()).toBeDisabled()
      fireEvent.change(usernameInput(), { target: { value: ' 12 ' } })
      fireEvent.change(passwordInput(), { target: { value: ' 1234567 ' } })
      expect(loginBtn()).toBeDisabled()
      fireEvent.change(usernameInput(), { target: { value: ' 123 ' } })
      fireEvent.change(passwordInput(), { target: { value: ' 12345678 ' } })
      expect(loginBtn()).toBeEnabled()
    })
    test(`[2] Attempting to navigate to Articles
        - renders a redirect back to login screen
        - articles form never 
        - Review how to implement protected routes using an authentication token and redirect users.`, () => {
      fireEvent.click(articlesLink())
      expect(titleInput()).not.toBeInTheDocument()
      expect(usernameInput()).toBeInTheDocument()
    })
    test(`[3] Submit credentials button is disabled until
        - username (after trimming) is at least 3 chars AND
        - password (after trimming) is at least 8 chars
        - Review how to conditionally disable a button element.`, () => {
      expect(loginBtn()).toBeDisabled()
      fireEvent.change(usernameInput(), { target: { value: ' 12 ' } })
      fireEvent.change(passwordInput(), { target: { value: ' 1234567 ' } })
      expect(loginBtn()).toBeDisabled()
      fireEvent.change(usernameInput(), { target: { value: ' 123 ' } })
      fireEvent.change(passwordInput(), { target: { value: ' 12345678 ' } })
      expect(loginBtn()).toBeEnabled()
    })
  })
  describe('Logout', () => {
    test(`[4] Submit credentials button is disabled until
        - username (after trimming) is at least 3 chars AND
        - password (after trimming) is at least 8 chars
        - Review how to conditionally disable a button element.`, () => {
      expect(loginBtn()).toBeDisabled()
      fireEvent.change(usernameInput(), { target: { value: ' 12 ' } })
      fireEvent.change(passwordInput(), { target: { value: ' 1234567 ' } })
      expect(loginBtn()).toBeDisabled()
      fireEvent.change(usernameInput(), { target: { value: ' 123 ' } })
      fireEvent.change(passwordInput(), { target: { value: ' 12345678 ' } })
      expect(loginBtn()).toBeEnabled()
    })
  })
  describe('Posting a new article', () => {
    test(`[5] Submit credentials button is disabled until
        - username (after trimming) is at least 3 chars AND
        - password (after trimming) is at least 8 chars
        - Review how to conditionally disable a button element.`, () => {
      expect(loginBtn()).toBeDisabled()
      fireEvent.change(usernameInput(), { target: { value: ' 12 ' } })
      fireEvent.change(passwordInput(), { target: { value: ' 1234567 ' } })
      expect(loginBtn()).toBeDisabled()
      fireEvent.change(usernameInput(), { target: { value: ' 123 ' } })
      fireEvent.change(passwordInput(), { target: { value: ' 12345678 ' } })
      expect(loginBtn()).toBeEnabled()
    })
    test(`[6] Submit credentials button is disabled until
        - username (after trimming) is at least 3 chars AND
        - password (after trimming) is at least 8 chars
        - Review how to conditionally disable a button element.`, () => {
      expect(loginBtn()).toBeDisabled()
      fireEvent.change(usernameInput(), { target: { value: ' 12 ' } })
      fireEvent.change(passwordInput(), { target: { value: ' 1234567 ' } })
      expect(loginBtn()).toBeDisabled()
      fireEvent.change(usernameInput(), { target: { value: ' 123 ' } })
      fireEvent.change(passwordInput(), { target: { value: ' 12345678 ' } })
      expect(loginBtn()).toBeEnabled()
    })
  })
  describe('Editing an existing article', () => {
    test(`[7] Submit credentials button is disabled until
        - username (after trimming) is at least 3 chars AND
        - password (after trimming) is at least 8 chars
        - Review how to conditionally disable a button element.`, () => {
      expect(loginBtn()).toBeDisabled()
      fireEvent.change(usernameInput(), { target: { value: ' 12 ' } })
      fireEvent.change(passwordInput(), { target: { value: ' 1234567 ' } })
      expect(loginBtn()).toBeDisabled()
      fireEvent.change(usernameInput(), { target: { value: ' 123 ' } })
      fireEvent.change(passwordInput(), { target: { value: ' 12345678 ' } })
      expect(loginBtn()).toBeEnabled()
    })
    test(`[8] Submit credentials button is disabled until
        - username (after trimming) is at least 3 chars AND
        - password (after trimming) is at least 8 chars
        - Review how to conditionally disable a button element.`, () => {
      expect(loginBtn()).toBeDisabled()
      fireEvent.change(usernameInput(), { target: { value: ' 12 ' } })
      fireEvent.change(passwordInput(), { target: { value: ' 1234567 ' } })
      expect(loginBtn()).toBeDisabled()
      fireEvent.change(usernameInput(), { target: { value: ' 123 ' } })
      fireEvent.change(passwordInput(), { target: { value: ' 12345678 ' } })
      expect(loginBtn()).toBeEnabled()
    })
  })
  describe('Deleting an existing article', () => {
    test(`[8] Submit credentials button is disabled until
    - username (after trimming) is at least 3 chars AND
    - password (after trimming) is at least 8 chars
    - Review how to conditionally disable a button element.`, () => {
  expect(loginBtn()).toBeDisabled()
  fireEvent.change(usernameInput(), { target: { value: ' 12 ' } })
  fireEvent.change(passwordInput(), { target: { value: ' 1234567 ' } })
  expect(loginBtn()).toBeDisabled()
  fireEvent.change(usernameInput(), { target: { value: ' 123 ' } })
  fireEvent.change(passwordInput(), { target: { value: ' 12345678 ' } })
  expect(loginBtn()).toBeEnabled()
})
  })
})
