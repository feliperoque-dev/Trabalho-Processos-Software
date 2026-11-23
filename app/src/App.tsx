import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './shell/PhoneLayout';
import { Toast } from './components/ui';
import Welcome from './screens/Welcome';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Home from './screens/Home';
import MyComplaints from './screens/MyComplaints';
import Details from './screens/Details';
import Profile from './screens/Profile';
import Settings from './screens/Settings';
import Admin from './screens/Admin';
import { CategoryStep, DetailsStep, LocationStep, MediaStep, NewComplaint, ReviewStep, Success } from './screens/NewComplaint';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/complaint/new" element={<NewComplaint />} />
        <Route path="/complaint/new/category" element={<CategoryStep />} />
        <Route path="/complaint/new/details" element={<DetailsStep />} />
        <Route path="/complaint/new/media" element={<MediaStep />} />
        <Route path="/complaint/new/location" element={<LocationStep />} />
        <Route path="/complaint/new/review" element={<ReviewStep />} />
        <Route path="/complaint/success" element={<Success />} />
        <Route path="/complaints" element={<MyComplaints />} />
        <Route path="/complaint/:id" element={<Details />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route
        path="/admin"
        element={
          <div className="admin-page">
            <Admin />
            <Toast />
          </div>
        }
      />
      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  );
}
