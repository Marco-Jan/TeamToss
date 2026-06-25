import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { LanguageProvider } from './i18n/LanguageContext'
import './index.css'

// Self-hosted fonts (DSGVO-konform – kein externer Google-Fonts-Request).
import '@fontsource-variable/archivo'
import '@fontsource-variable/plus-jakarta-sans'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
