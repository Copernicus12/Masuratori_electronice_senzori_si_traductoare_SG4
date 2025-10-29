import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import Reports from './components/Reports'
import Login from './components/Login'

function App() {
  const SESSION_TIMEOUT = 30 * 60 * 1000 

  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('activePage') || 'sala-sport'
  })
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    const lastActivity = localStorage.getItem('lastActivity')
    
    if (loggedIn && lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity)
      if (timeSinceLastActivity > SESSION_TIMEOUT) {
        localStorage.removeItem('isLoggedIn')
        localStorage.removeItem('user')
        localStorage.removeItem('activePage')
        localStorage.removeItem('lastActivity')
        return false
      }
    }
    
    return loggedIn
  })
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const updateLastActivity = () => {
    localStorage.setItem('lastActivity', Date.now().toString())
  }

  useEffect(() => {
    localStorage.setItem('activePage', activePage)
  }, [activePage])

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn)
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [isLoggedIn, user])

  useEffect(() => {
    if (!isLoggedIn) return

    updateLastActivity()

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    
    const handleActivity = () => {
      updateLastActivity()
    }

    events.forEach(event => {
      document.addEventListener(event, handleActivity)
    })

    const checkInterval = setInterval(() => {
      const lastActivity = localStorage.getItem('lastActivity')
      if (lastActivity) {
        const timeSinceLastActivity = Date.now() - parseInt(lastActivity)
        if (timeSinceLastActivity > SESSION_TIMEOUT) {
          handleLogout()
          alert('Sesiunea ta a expirat din cauza inactivității. Te rugăm să te autentifici din nou.')
        }
      }
    }, 60000) 
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
      clearInterval(checkInterval)
    }
  }, [isLoggedIn])

  const handleLogin = (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
    updateLastActivity()
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setShowProfileMenu(false)
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
    localStorage.removeItem('activePage')
    localStorage.removeItem('lastActivity')
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  const handleProfileAction = (action) => {
    console.log(`Profile action: ${action}`)
    setShowProfileMenu(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.user-avatar')) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showProfileMenu])

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div id="app-root">
      <aside className="sidebar">
        <div className="sidebar-content">
          <button 
            className={`sidebar-btn ${activePage === 'sala-sport' ? 'active' : ''}`}
            onClick={() => setActivePage('sala-sport')}
          >
            <span>Sala Sport</span>
          </button>
          <button 
            className={`sidebar-btn ${activePage === 'rapoarte' ? 'active' : ''}`}
            onClick={() => setActivePage('rapoarte')}
          >
            <span>Rapoarte</span>
          </button>
        </div>

        <div className="user-section">
          <div className="user-avatar" onClick={toggleProfileMenu}>
            {user && user.name ? (
              <div className="user-initials">
                {user.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <svg 
                className="user-icon" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
            
            {showProfileMenu && (
              <div className="profile-popup">
                <div className="popup-header">
                  <div className="popup-user-info">
                    <div className="popup-user-name">{user?.name || 'User'}</div>
                    <div className="popup-user-email">{user?.email || ''}</div>
                  </div>
                </div>
                <button 
                  className="popup-item"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleProfileAction('view')
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>View Profile</span>
                </button>
                <button 
                  className="popup-item"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleProfileAction('edit')
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  <span>Edit Profile</span>
                </button>
                <button 
                  className="popup-item"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleProfileAction('change')
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>Change Profile</span>
                </button>
              </div>
            )}
          </div>
          <button 
            className="auth-btn logout"
            onClick={handleLogout}
          >
            <svg className="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Log Out</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        {activePage === 'sala-sport' ? <Dashboard /> : <Reports />}
      </main>
    </div>
  )
}

export default App
