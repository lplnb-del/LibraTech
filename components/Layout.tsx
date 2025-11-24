
import React from 'react';
import { AppRoute, User } from '../types';
import { 
  Library, 
  Users, 
  BookOpen, 
  History, 
  LogOut, 
  LayoutDashboard,
  Menu,
  X,
  Search,
  BookMarked,
  LibraryBig
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User | null;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, currentRoute, onNavigate, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const adminMenu = [
    { icon: LayoutDashboard, label: '仪表盘', route: AppRoute.DASHBOARD },
    { icon: Library, label: '图书管理', route: AppRoute.BOOKS },
    { icon: Users, label: '用户管理', route: AppRoute.USERS },
    { icon: BookOpen, label: '借阅管理', route: AppRoute.BORROW_ACTIVE },
  ];

  const studentMenu = [
    { icon: LayoutDashboard, label: '我的主页', route: AppRoute.STUDENT_HOME },
    { icon: Search, label: '浏览图书', route: AppRoute.STUDENT_SEARCH },
    { icon: LibraryBig, label: '我的书架', route: AppRoute.STUDENT_SHELF },
    // { icon: History, label: '历史记录', route: AppRoute.BORROW_HISTORY },
  ];

  const menuItems = currentUser?.role === 'admin' ? adminMenu : studentMenu;

  const getRouteName = (route: string) => {
      const map: Record<string, string> = {
        [AppRoute.DASHBOARD]: '系统概览',
        [AppRoute.BOOKS]: '馆藏管理',
        [AppRoute.USERS]: '用户中心',
        [AppRoute.BORROW_ACTIVE]: '借阅流通',
        [AppRoute.STUDENT_HOME]: '学生中心',
        [AppRoute.STUDENT_SEARCH]: '图书检索',
        [AppRoute.STUDENT_SHELF]: '我的书架',
        [AppRoute.STUDENT_SUCCESS]: '借阅详情'
      };
      return map[route] || 'LibraTech';
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center z-20 relative">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
          <BookMarked /> <span>LibraTech</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 transition duration-300 ease-out
        w-64 bg-slate-900 text-slate-100 flex flex-col z-20 shadow-2xl
      `}>
        <div className="p-8 flex items-center gap-3 font-bold text-2xl text-white border-b border-slate-800">
          <BookMarked className="text-indigo-400 w-8 h-8" />
          <span className="tracking-tight">LibraTech</span>
        </div>

        <div className="p-6 border-b border-slate-800 bg-slate-800/50 backdrop-blur-sm">
          <p className="text-xs text-indigo-300 uppercase tracking-widest mb-2 font-semibold">当前用户</p>
          <div className="font-bold text-lg truncate">{currentUser?.name}</div>
          <div className="text-xs text-slate-400 capitalize mt-1 flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${currentUser?.role === 'admin' ? 'bg-purple-500' : 'bg-emerald-500'}`}></span>
            {currentUser?.role === 'admin' ? '超级管理员' : '在校学生'}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onNavigate(item.route);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group
                ${currentRoute === item.route 
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-900/50 scale-105' 
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white hover:translate-x-1'}
              `}
            >
              <item.icon size={20} className={currentRoute === item.route ? 'animate-pulse' : 'group-hover:text-indigo-300'} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">退出登录</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden h-screen bg-slate-50 relative">
        <header className="bg-white/80 backdrop-blur-md shadow-sm h-16 flex items-center px-8 justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {getRouteName(currentRoute)}
          </h1>
          <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
             {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
