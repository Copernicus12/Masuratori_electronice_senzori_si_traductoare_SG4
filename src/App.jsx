import { useState, useEffect } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import Reports from './components/Reports'
import Login from './components/Login'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

function App() {
  const SESSION_TIMEOUT = 30 * 60 * 1000 

  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem('activePage') || 'sala-sport'
  })
  const [showExportPopup, setShowExportPopup] = useState(false)
  const [exportOptions, setExportOptions] = useState({
    includeConsumption: true,
    includeEnvironment: true,
    period: 'current'
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
  const [showReportsMenu, setShowReportsMenu] = useState(false)

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

  const consumptionData = [
    { name: 'Sala Sport', value: 3589.07 },
    { name: 'Corp A', value: 4258.93 },
    { name: 'Corp B', value: 7892.1 },
    { name: 'AULA 1', value: 1212.59 },
    { name: 'AULA 2', value: 1345.06 }
  ]

  const environmentData = [
    { label: 'Temperatura exterioara', value: '33.5', unit: '°C' },
    { label: 'UMIDITATE EXTERIOARA', value: '42.08', unit: '%' },
    { label: 'UMIDITATE AULA 1', value: '51.05', unit: '%' },
    { label: 'UMIDITATE AULA 2', value: '56.72', unit: '%' }
  ]

  const generatePDF = () => {
    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(22)
    doc.setTextColor(40, 116, 240)
    doc.text('Raport Energy Management', 105, 20, { align: 'center' })
    
    // Date and info
    doc.setFontSize(10)
    doc.setTextColor(100)
    const currentDate = new Date().toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    doc.text(`Data generării: ${currentDate}`, 20, 35)
    doc.text(`Perioada: ${exportOptions.period === 'current' ? 'Curentă' : 'Luna trecută'}`, 20, 42)
    
    // Line separator
    doc.setDrawColor(200)
    doc.line(20, 48, 190, 48)
    
    let yPos = 58

    // Consumption section
    if (exportOptions.includeConsumption) {
      doc.setFontSize(16)
      doc.setTextColor(40)
      doc.text('Consum Energie', 20, yPos)
      yPos += 10
      
      const totalConsumption = consumptionData.reduce((sum, item) => sum + item.value, 0)
      doc.setFontSize(11)
      doc.setTextColor(80)
      doc.text(`Total Consum: ${totalConsumption.toFixed(2)} kWh`, 20, yPos)
      yPos += 10

      // Consumption table
      const consumptionTableData = consumptionData.map(item => [
        item.name,
        `${item.value.toFixed(2)} kWh`,
        `${((item.value / totalConsumption) * 100).toFixed(1)}%`
      ])

      doc.autoTable({
        startY: yPos,
        head: [['Locație', 'Consum', 'Procent din Total']],
        body: consumptionTableData,
        theme: 'grid',
        headStyles: {
          fillColor: [40, 116, 240],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 11
        },
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250]
        }
      })

      yPos = doc.lastAutoTable.finalY + 15
    }

    // Environment section
    if (exportOptions.includeEnvironment) {
      doc.setFontSize(16)
      doc.setTextColor(40)
      doc.text('Date Mediu', 20, yPos)
      yPos += 10

      const envTableData = environmentData.map(item => [
        item.label,
        `${item.value} ${item.unit}`
      ])

      doc.autoTable({
        startY: yPos,
        head: [['Parametru', 'Valoare']],
        body: envTableData,
        theme: 'grid',
        headStyles: {
          fillColor: [34, 197, 94],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 11
        },
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        alternateRowStyles: {
          fillColor: [240, 253, 244]
        }
      })
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150)
      doc.text(
        `Pagina ${i} din ${pageCount} | Energy Management System`,
        105,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      )
    }
    
    // Save PDF
    const fileName = `raport-energie-${new Date().getTime()}.pdf`
    doc.save(fileName)
    setShowExportPopup(false)
    setShowReportsMenu(false)
  }

  const handleReportsAction = (action) => {
    if (action === 'export') {
      setShowExportPopup(true)
    } else if (action === 'view') {
      setActivePage('rapoarte')
    }
    setShowReportsMenu(false)
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
      if (showReportsMenu && !event.target.closest('.reports-menu-wrapper')) {
        setShowReportsMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showProfileMenu, showReportsMenu])

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div id="app-root">
      {showExportPopup && (
        <div className="export-popup-overlay" onClick={() => setShowExportPopup(false)}>
          <div className="export-popup" onClick={(e) => e.stopPropagation()}>
            <div className="export-popup-header">
              <h3>Export Raport PDF</h3>
              <button 
                className="close-popup-btn"
                onClick={() => setShowExportPopup(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="export-popup-content">
              <div className="export-section">
                <h4>Opțiuni Export</h4>
                
                <label className="export-checkbox">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeConsumption}
                    onChange={(e) => setExportOptions({
                      ...exportOptions,
                      includeConsumption: e.target.checked
                    })}
                  />
                  <span>Include Consum Energie</span>
                </label>

                <label className="export-checkbox">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeEnvironment}
                    onChange={(e) => setExportOptions({
                      ...exportOptions,
                      includeEnvironment: e.target.checked
                    })}
                  />
                  <span>Include Date Mediu</span>
                </label>
              </div>

              <div className="export-section">
                <h4>Perioadă</h4>
                <select 
                  className="export-select"
                  value={exportOptions.period}
                  onChange={(e) => setExportOptions({
                    ...exportOptions,
                    period: e.target.value
                  })}
                >
                  <option value="current">Perioada Curentă</option>
                  <option value="lastMonth">Luna Trecută</option>
                  <option value="lastWeek">Săptămâna Trecută</option>
                  <option value="custom">Personalizat</option>
                </select>
              </div>
            </div>

            <div className="export-popup-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowExportPopup(false)}
              >
                Anulează
              </button>
              <button 
                className="export-pdf-btn"
                onClick={generatePDF}
                disabled={!exportOptions.includeConsumption && !exportOptions.includeEnvironment}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Descarcă PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className="sidebar">
        <div className="sidebar-content">
          <button 
            className={`sidebar-btn ${activePage === 'sala-sport' ? 'active' : ''}`}
            onClick={() => setActivePage('sala-sport')}
          >
            <span>Sala Sport</span>
          </button>
          <div className="reports-menu-wrapper">
            <button 
              className={`sidebar-btn ${activePage === 'rapoarte' ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                setShowReportsMenu(!showReportsMenu)
              }}
            >
              <span>Rapoarte</span>
            </button>

            {showReportsMenu && (
              <div className="reports-popup">
                <button 
                  className="popup-item"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReportsAction('view')
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>View Reports</span>
                </button>
                <button 
                  className="popup-item"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReportsAction('export')
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Export PDF</span>
                </button>
              </div>
            )}
          </div>
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
