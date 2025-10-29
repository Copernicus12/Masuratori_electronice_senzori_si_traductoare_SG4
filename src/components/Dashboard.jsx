import React from 'react'
import './Dashboard.css'

const Button = ({ label }) => (
  <button className="dash-btn">{label}
    <span className="btn-sub">Open</span>
  </button>
)

export default function Dashboard() {
  return (
    <main className="dashboard">
      <div className="dashboard-card">
        <header className="dash-header">
          <h2>Energy Management</h2>
          <div className="room">SALA SPORT</div>
        </header>

        <section className="dash-grid">
          <div className="left-col">
            <div className="group-row">
              <div className="group">
                <h4>Incarcare faze</h4>
                <Button label="" />
              </div>
              <div className="group">
                <h4>Tensiune faze</h4>
                <Button label="" />
              </div>
              <div className="group">
                <h4>Diagrama</h4>
                <Button label="" />
              </div>
            </div>

            <div className="metrics-grid">
              <div className="metric">
                <h5>Putere Activa</h5>
                <Button />
              </div>
              <div className="metric">
                <h5>Putere reactiva</h5>
                <Button />
              </div>
              <div className="metric">
                <h5>Putere aparenta</h5>
                <Button />
              </div>

              <div className="metric">
                <h5>Energie Activa</h5>
                <Button />
              </div>
              <div className="metric">
                <h5>Energie Reactiva</h5>
                <Button />
              </div>
              <div className="metric">
                <h5>Energie Aparenta</h5>
                <Button />
              </div>

              <div className="metric w-full">
                <h5>cos φ</h5>
                <Button />
              </div>
            </div>
          </div>

          <aside className="right-panel">
            <div className="values-card">
              <h4>VALORI MARIMI ELECTRICE MASURATE</h4>
              
              <div className="value-cards-grid">
                <div className="value-item-card">
                  <span className="value-label">L1-N</span>
                  <span className="value-number">56.3</span>
                </div>
                <div className="value-item-card">
                  <span className="value-label">L2-N</span>
                  <span className="value-number">55.9</span>
                </div>
                <div className="value-item-card">
                  <span className="value-label">L3-N</span>
                  <span className="value-number">56.7</span>
                </div>
                
                <div className="value-item-card">
                  <span className="value-label">L1-L2</span>
                  <span className="value-number">56.3</span>
                </div>
                <div className="value-item-card">
                  <span className="value-label">L2-L3</span>
                  <span className="value-number">55.9</span>
                </div>
                <div className="value-item-card">
                  <span className="value-label">L3-N</span>
                  <span className="value-number">56.7</span>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
