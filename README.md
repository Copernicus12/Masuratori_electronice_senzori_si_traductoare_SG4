# Energy Management System

## Descriere
Aplicație web pentru monitorizarea și gestionarea consumului energetic în clădiri (Sala Sport, Corp A, Corp B, Aule).

## Instalare și Pornire
```bash
npm install
npm run dev
```

## Funcționalități

### Autentificare
- Pagină de login cu design liquid glass
- Validare email (obligatoriu să conțină @)
- Validare parolă (minimum 6 caractere)
- Buton logout funcțional în sidebar
- Avatar utilizator cu inițială
- Session management cu localStorage (refresh păstrează starea)
- Persistență pagină activă (dacă ești pe Rapoarte și faci refresh, rămâi pe Rapoarte)
- **Durata sesiune:** 30 minute de inactivitate - sesiunea expiră automat după 30 minute fără activitate

### Dashboard
- Monitorizare parametri electrici în timp real
- Vizualizare valori măsurate (tensiune, putere, energie)
- Diagrame și grafice interactive
- Secțiune pentru fiecare zonă a clădirii

### Rapoarte
- Rapoarte de consum energie pe zone
- Vizualizare date mediu (temperatură, umiditate, CO2)
- Export date și statistici

## Credențiale Test
Orice combinație validă funcționează (demo):
- Email: user@test.com
- Parolă: 123456

**IMPORTANT:** Această versiune nu are backend implementat. Autentificarea este doar pentru demonstrație UI/UX - orice email valid (care conține @) și parolă cu minimum 6 caractere vor fi acceptate. Nu există verificare reală a credențialelor în baze de date.

## Structură Fișiere

### Componente
- `Login.jsx` - Pagina de autentificare
- `Dashboard.jsx` - Dashboard principal monitorizare
- `Reports.jsx` - Pagina de rapoarte
- `App.jsx` - Componentă principală cu routing și state management

### Stiluri
- `Login.css` - Stiluri pagină login (liquid glass effect)
- `Dashboard.css` - Stiluri dashboard
- `Reports.css` - Stiluri rapoarte
- `App.css` - Stiluri globale și sidebar

## Tehnologii
- React 18
- Vite
- CSS3 (Glassmorphism effects)
- localStorage pentru session management

## Session Management
Sesiunea folosește localStorage cu timeout de inactivitate:
- **Durata:** 30 minute de inactivitate
- **Auto-logout:** Sesiunea expiră automat după 30 minute fără activitate
- **Tracking activitate:** Mouse, keyboard, scroll, touch, click resetează timerul
- **Verificare:** La fiecare minut și la încărcarea paginii
- **Notificare:** Alert când sesiunea expiră
- Orice interacțiune cu aplicația prelungește automat sesiunea cu 30 minute

## Note Dezvoltare
Implementare demo pentru UI/UX. Pentru producție, necesită:
- Backend API pentru autentificare reală
- Database pentru utilizatori
- JWT tokens pentru sesiuni
- Criptare parole (bcrypt)
- HTTPS și rate limiting

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```
