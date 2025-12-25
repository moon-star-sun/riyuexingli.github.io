import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MainContent } from './components/layout/MainContent';
import { HtmlContent } from './components/common/HtmlContent';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-secondary-50">
        <Header />
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/早读检测仪" element={<HtmlContent path="早读检测仪.html" />} />
          <Route path="/乘法小达人闯关赛" element={<HtmlContent path="乘法小达人闯关赛.html" />} />
          <Route path="/古诗检测" element={<HtmlContent path="古诗检测.html" />} />
          <Route path="/成绩分析" element={<HtmlContent path="成绩分析.html" />} />
          <Route path="/星励成长积分系统" element={<HtmlContent path="星励成长积分系统.html" />} />
          <Route path="/水果单词消消乐" element={<HtmlContent path="水果单词消消乐.html" />} />
          <Route path="/违规物品检测" element={<HtmlContent path="违规物品检测.html" />} />
          <Route path="/静学智能哨兵" element={<HtmlContent path="静学智能哨兵.html" />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;