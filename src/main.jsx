import './index.css' // <--- MAKE SURE THIS IS HERE!
import React from 'react'
import ReactDOM from 'react-dom/client'
// ... rest of file
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
