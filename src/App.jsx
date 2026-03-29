import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import AboutPage from './pages/AboutPage';
import ArchiveStatsPage from './pages/ArchiveStatsPage';
import MeetingSummaryPage from './pages/MeetingSummaryPage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="archive-stats" element={<ArchiveStatsPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="category/:id" element={<CategoryPage />} />
          <Route path="meeting/:docId" element={<MeetingSummaryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
