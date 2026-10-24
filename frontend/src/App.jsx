import { Route, Routes, Navigate } from 'react-router-dom';
import FooterLinks from './app/components/FooterLinks';
import HomePage from './app/page';
import LoginPage from './app/login/page';
import RegisterPage from './app/register/page';
import ProfilePage from './app/profile/page';
import AuthSuccessPage from './app/auth/success/page';
import TeacherDashboard from './app/dashboard/teacher/page';
import StudentDashboard from './app/dashboard/student/page';
import ChatbotPage from './app/dashboard/chatbot/page';
import EarthquakesPage from './app/dashboard/student/earthquakes/page';
import EarthquakeAssignmentPage from './app/dashboard/student/earthquakes/assignment/page';
import FirePage from './app/dashboard/student/fire/page';
import FloodPage from './app/dashboard/student/flood/page';
import NearbyPage from './app/dashboard/student/nearby/page';
import LeaderboardPage from './app/dashboard/student/leaderboard/page';
import ReelsPage from './app/dashboard/student/reels/page';
import CapAlertPage from './pages/CapAlertPage';

export default function App() {
  return (
    <>
      <main className="fade-in slide-up">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth/success" element={<AuthSuccessPage />} />
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/chatbot" element={<ChatbotPage />} />
          <Route path="/dashboard/student/earthquakes" element={<EarthquakesPage />} />
          <Route path="/dashboard/student/earthquakes/assignment" element={<EarthquakeAssignmentPage />} />
          <Route path="/dashboard/student/fire" element={<FirePage />} />
          <Route path="/dashboard/student/flood" element={<FloodPage />} />
          <Route path="/dashboard/student/nearby" element={<NearbyPage />} />
          <Route path="/dashboard/student/leaderboard" element={<LeaderboardPage />} />
          <Route path="/dashboard/student/reels" element={<ReelsPage />} />
          <Route path="/alerts/cap/:identifier" element={<CapAlertPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Disaster Management</h3>
              <p className="text-gray-400">A comprehensive platform for disaster management education and training.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <FooterLinks />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">Email: info@disastermanagement.edu</p>
              <p className="text-gray-400">Phone: +91 123-456-7890</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Disaster Management Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
