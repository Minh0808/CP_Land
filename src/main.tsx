import ReactDOM from 'react-dom/client';
import { AuthProvider } from './Contexts/AuthContext';
import App from './App'
import './Style/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
   <AuthProvider>
      <App />
   </AuthProvider>
)
