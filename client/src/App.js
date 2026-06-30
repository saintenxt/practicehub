import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Hero from './pages/Hero';
import Header from './pages/Header';
import GameCard from './pages/GameCard';
import Game from './pages/GamePage';
import Companies from './pages/Companies';
import ProtectedRoute from './components/protectedRoute';
import ProfilePage from './pages/ProfilePage';
import MessagePage from './pages/MessagePage';   // ← новый импорт
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/mainpage"
          element={
            <ProtectedRoute>
              <>
                <Header />
                <Hero />
                <Companies />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/match"   // ← новый маршрут
          element={
            <ProtectedRoute>
              <>
                <Header />
                <MessagePage />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/matches/:game"
          element={
            <ProtectedRoute>
              <Game />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/mainpage" />} />
        <Route path="*" element={<Navigate to="/mainpage" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;