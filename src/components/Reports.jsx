import React from 'react'
import './Reports.css'

const Button = ({ label }) => (
  <button className="report-btn">
    <span>{label}</span>
  </button>
)

export default function Reports() {
  return (
    <main className="reports">
      <div className="reports-card">
        <header className="reports-header">
          <h2>Energy Management</h2>
          <button className="raport-btn-header">Raport</button>
        </header>

        <section className="reports-grid">
          <div className="sections-col">
            <div className="main-sections-row">
              <div className="section-group">
                <h3>SALA SPORT</h3>
                <Button label="Open" />
              </div>
              
              <div className="section-group">
                <h3>CORP A</h3>
                <Button label="Open" />
              </div>
              
              <div className="section-group">
                <h3>CORP B</h3>
                <Button label="Open" />
              </div>
            </div>

            {/* Second row - Aulas */}
            <div className="section-row">
              <div className="section-group">
                <h3>AULA 1</h3>
                <Button label="Open" />
              </div>
              <div className="section-group">
                <h3>AULA 2</h3>
                <Button label="Open" />
              </div>
            </div>

            {/* Consumption values */}
            <div className="consumption-section">
              <h4 className="consumption-title">Consum Energie</h4>
              <div className="consumption-grid">
                <div className="consumption-item">
                  <label>Sala Sport</label>
                  <div className="value-box">
                    <span className="value">3589.07</span>
                    <span className="unit">kWh</span>
                  </div>
                </div>

                <div className="consumption-item">
                  <label>Corp A</label>
                  <div className="value-box">
                    <span className="value">4258.93</span>
                    <span className="unit">kWh</span>
                  </div>
                </div>

                <div className="consumption-item">
                  <label>Corp B</label>
                  <div className="value-box">
                    <span className="value">7892.1</span>
                    <span className="unit">kWh</span>
                  </div>
                </div>

                <div className="consumption-item">
                  <label>AULA 1</label>
                  <div className="value-box">
                    <span className="value">1212.59</span>
                    <span className="unit">kWh</span>
                  </div>
                </div>

                <div className="consumption-item">
                  <label>AULA 2</label>
                  <div className="value-box">
                    <span className="value">1345.06</span>
                    <span className="unit">kWh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Environmental data */}
          <aside className="environment-panel">
            <div className="env-card">
              <div className="env-item">
                <label>Temperatura exterioara</label>
                <div className="env-value">
                  <span className="value-large">33.5</span>
                  <span className="unit-large">°C</span>
                </div>
              </div>

              <div className="env-item">
                <label>UMIDITATE EXTERIOARA</label>
                <div className="env-value">
                  <span className="value-large">42.08</span>
                  <span className="unit-large">%</span>
                </div>
              </div>

              <div className="env-item">
                <label>UMIDITATE AULA 1</label>
                <div className="env-value">
                  <span className="value-large">51.05</span>
                  <span className="unit-large">%</span>
                </div>
              </div>

              <div className="env-item">
                <label>UMIDITATE AULA 1</label>
                <div className="env-value">
                  <span className="value-large">56.72</span>
                  <span className="unit-large">%</span>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
