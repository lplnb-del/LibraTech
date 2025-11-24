
import React, { useState, useEffect } from 'react';
import { User, AppRoute, Book, BorrowRecord } from './types';
import { db } from './services/mockDatabase';
import Layout from './components/Layout';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, BookOpen, AlertCircle, CheckCircle, Plus, Trash2, Search, MoreVertical,
  Calendar, CreditCard, Mail, Edit, X, ArrowRight, Library, Star, ChevronRight, Clock, ShieldCheck, LibraryBig
} from 'lucide-react';
import { getBookInsight } from './services/geminiService';

// --- SHARED COMPONENTS ---

const Loading = () => (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
            <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-transparent border-b-indigo-400 opacity-50 animate-ping"></div>
        </div>
        <p className="text-indigo-600 font-medium animate-pulse">正在加载数据...</p>
    </div>
);

const Toast: React.FC<{ message: string, type: 'success' | 'error', onClose: () => void }> = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
            {type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            <span className="font-medium">{message}</span>
        </div>
    );
}

// 1. Beautiful Login Component
const Login: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'student'>('student');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    setLoading(true);
    // Simulate network delay for realistic feel
    setTimeout(async () => {
        try {
            const allUsers = await db.getUsers();
            const user = allUsers.find(u => u.role === activeTab);
            if (user) onLogin(user);
            else alert('未找到演示用户');
        } catch (e) {
            alert('登录失败');
        } finally {
            setLoading(false);
        }
    }, 800);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl animate-[blob_7s_infinite]"></div>
        <div className="absolute top-[10%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl animate-[blob_7s_infinite_2s]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-screen filter blur-3xl animate-[blob_7s_infinite_4s]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 text-center border-b border-white/10">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg transform rotate-3">
                <BookOpen className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">LibraTech</h1>
            <p className="text-indigo-200 text-sm">新一代智慧图书管理系统</p>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex bg-slate-900/50 p-1 rounded-xl">
              <button 
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'admin' ? 'bg-white text-indigo-900 shadow-md' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setActiveTab('admin')}
              >
                管理员入口
              </button>
              <button 
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${activeTab === 'student' ? 'bg-white text-indigo-900 shadow-md' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setActiveTab('student')}
              >
                学生入口
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 text-indigo-300 group-focus-within:text-white transition-colors" size={18} />
                <input 
                  type="text" 
                  defaultValue={activeTab === 'admin' ? 'admin@lms.edu' : 'STU2024000'}
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder={activeTab === 'admin' ? "管理员邮箱" : "学号"}
                />
              </div>
              <div className="relative group">
                <ShieldCheck className="absolute left-3 top-3.5 text-indigo-300 group-focus-within:text-white transition-colors" size={18} />
                <input 
                  type="password" 
                  defaultValue="password"
                  className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="密码"
                />
              </div>
            </div>

            <button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-900/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> : '立即登录'}
            </button>
          </div>
          <div className="bg-slate-900/80 p-4 text-center">
             <p className="text-xs text-slate-500">演示账号已预填，直接点击登录即可体验</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Admin Dashboard Component
const Dashboard = () => {
  const [stats, setStats] = useState({ books: 0, users: 0, activeLoans: 0, available: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        const [books, users, borrows] = await Promise.all([
            db.getBooks(),
            db.getUsers(),
            db.getBorrowRecords()
        ]);
        const activeLoans = borrows.filter(r => !r.return_date).length;
        const totalBooks = books.reduce((acc, b) => acc + b.total_copies, 0);
        const available = books.reduce((acc, b) => acc + b.available_copies, 0);
        setStats({ books: totalBooks, users: users.length, activeLoans, available });
        setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <Loading />;

  const data = [
    { name: '周一', loans: 4 },
    { name: '周二', loans: 7 },
    { name: '周三', loans: 5 },
    { name: '周四', loans: 10 },
    { name: '周五', loans: 12 },
    { name: '周六', loans: 8 },
    { name: '周日', loans: 3 },
  ];

  const pieData = [
    { name: '可借', value: stats.available },
    { name: '已借出', value: stats.books - stats.available },
  ];
  const COLORS = ['#10b981', '#6366f1'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '馆藏总数', val: stats.books, icon: BookOpen, color: 'bg-blue-500' },
          { label: '注册用户', val: stats.users, icon: Users, color: 'bg-purple-500' },
          { label: '当前借出', val: stats.activeLoans, icon: Calendar, color: 'bg-orange-500' },
          { label: '逾期未还', val: 2, icon: AlertCircle, color: 'bg-red-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${stat.color} bg-opacity-10 mr-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800">借阅流量分析</h3>
             <select className="text-sm border-slate-200 rounded-lg text-slate-500 bg-slate-50">
                 <option>最近7天</option>
                 <option>本月</option>
             </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="loans" stroke="#6366f1" strokeWidth={4} dot={{ r: 0, strokeWidth: 0, fill: '#6366f1' }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-slate-800 mb-4 w-full">库存状态</h3>
          <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={6}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{borderRadius: '12px'}} />
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-sm w-full mt-4">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></span> 可借阅</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm"></span> 已借出</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Book Management
const BookManager = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', total_copies: 1 });

  const loadBooks = async () => {
    setLoading(true);
    const data = await db.getBooks();
    setBooks(data);
    setLoading(false);
  };

  useEffect(() => { loadBooks(); }, []);

  const handleAdd = async () => {
    await db.addBook(newBook);
    setIsModalOpen(false);
    setNewBook({ title: '', author: '', isbn: '', total_copies: 1 });
    loadBooks();
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('确定要删除这本书吗？')) {
        await db.deleteBook(id);
        loadBooks();
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">馆藏书目管理</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-200 flex items-center gap-2 transition-all hover:scale-105"
        >
          <Plus size={18} /> 入库新书
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-5 text-sm font-semibold text-slate-500 pl-8">图书信息</th>
              <th className="p-5 text-sm font-semibold text-slate-500">ISBN</th>
              <th className="p-5 text-sm font-semibold text-slate-500">库存情况</th>
              <th className="p-5 text-sm font-semibold text-slate-500 text-right pr-8">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {books.map(book => (
              <tr key={book.id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="p-5 pl-8">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-8 bg-slate-200 rounded shadow-sm overflow-hidden flex-shrink-0">
                            {book.coverUrl && <img src={book.coverUrl} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                            <div className="font-bold text-slate-800">{book.title}</div>
                            <div className="text-xs text-slate-500">{book.author}</div>
                        </div>
                    </div>
                </td>
                <td className="p-5 text-slate-500 font-mono text-sm">{book.isbn}</td>
                <td className="p-5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${book.available_copies > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {book.available_copies} / {book.total_copies}
                  </span>
                </td>
                <td className="p-5 text-right pr-8">
                  <div className="flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-slate-400 hover:text-indigo-600 bg-slate-100 p-2 rounded-lg"><Edit size={16}/></button>
                    <button onClick={() => handleDelete(book.id)} className="text-slate-400 hover:text-red-600 bg-slate-100 p-2 rounded-lg"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">添加新书</h3>
            <div className="space-y-4">
              <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">书名</label>
                  <input 
                    className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newBook.title}
                    onChange={e => setNewBook({...newBook, title: e.target.value})}
                  />
              </div>
              <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">作者</label>
                  <input 
                    className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newBook.author}
                    onChange={e => setNewBook({...newBook, author: e.target.value})}
                  />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">ISBN</label>
                    <input 
                        className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={newBook.isbn}
                        onChange={e => setNewBook({...newBook, isbn: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">数量</label>
                    <input 
                        type="number"
                        className="w-full border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={newBook.total_copies}
                        onChange={e => setNewBook({...newBook, total_copies: parseInt(e.target.value)})}
                    />
                 </div>
              </div>
              
              <div className="flex gap-3 justify-end mt-8">
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-800 px-5 py-2.5 font-medium transition-colors">取消</button>
                <button onClick={handleAdd} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 shadow-md transition-all hover:-translate-y-0.5">保存图书</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 4. User Management
const UserManager = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        db.getUsers().then(data => {
            setUsers(data);
            setLoading(false);
        });
    }, []);

    if (loading) return <Loading />;
  
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800">用户目录</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-all duration-300">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shadow-inner ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 truncate text-lg">{user.name}</h4>
                <p className="text-sm text-slate-500 truncate mb-2">{user.email}</p>
                <div className="flex items-center gap-2">
                    <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono border border-slate-200">{user.student_id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded capitalize font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role === 'admin' ? '管理员' : '学生'}
                    </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
};

// 5. Active Loans (Borrow Management)
const BorrowActive = () => {
    const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        setLoading(true);
        const [bData, uData, rData] = await Promise.all([
            db.getBooks(), db.getUsers(), db.getBorrowRecords()
        ]);
        setBooks(bData);
        setUsers(uData);
        setBorrows(rData);
        setLoading(false);
    }

    useEffect(() => { refresh(); }, []);

    const activeBorrows = borrows.filter(b => !b.return_date);

    const handleReturn = async (id: string) => {
        try {
            await db.returnBook(id);
            refresh();
        } catch (e) {
            alert('归还失败');
        }
    };

    const getDetails = (record: BorrowRecord) => {
        const book = books.find(b => b.id === record.book_id);
        const user = users.find(u => u.id === record.user_id);
        return { book, user };
    };

    if (loading) return <Loading />;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">借阅管理</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="p-5 text-sm font-semibold text-slate-500 pl-8">图书</th>
                            <th className="p-5 text-sm font-semibold text-slate-500">借阅人</th>
                            <th className="p-5 text-sm font-semibold text-slate-500">截止日期</th>
                            <th className="p-5 text-sm font-semibold text-slate-500">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {activeBorrows.map(record => {
                            const { book, user } = getDetails(record);
                            const isOverdue = new Date(record.due_date) < new Date();
                            return (
                                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-5 pl-8 font-medium text-slate-800">{book?.title || 'Unknown'}</td>
                                    <td className="p-5 text-slate-600">{user?.name || 'Unknown'}</td>
                                    <td className="p-5">
                                        <span className={`text-sm ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                                            {new Date(record.due_date).toLocaleDateString('zh-CN')}
                                            {isOverdue && <span className="ml-2 text-xs bg-red-100 px-2 py-0.5 rounded-full">已逾期</span>}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <button 
                                            onClick={() => handleReturn(record.id)}
                                            className="text-sm bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition-all font-medium"
                                        >
                                            归还
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                        {activeBorrows.length === 0 && (
                            <tr><td colSpan={5} className="p-12 text-center text-slate-400">目前没有活跃的借阅记录。</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// 6. Student Components

const StudentHome: React.FC<{ onNavigate: (route: AppRoute) => void, user: User }> = ({ onNavigate, user }) => {
    return (
        <div className="max-w-4xl mx-auto py-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <BookOpen className="text-white w-12 h-12" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">欢迎回来，{user.name} 👋</h2>
            <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto">
                图书馆目前共有数千本藏书等待您的探索。查看最新上架图书或管理您的当前借阅。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button 
                    onClick={() => onNavigate(AppRoute.STUDENT_SEARCH)}
                    className="group bg-white p-8 rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-xl border border-transparent hover:border-indigo-100 transition-all duration-300 text-left"
                >
                    <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Search className="text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">浏览馆藏</h3>
                    <p className="text-slate-500 text-sm">搜索图书、查看AI简介并进行借阅。</p>
                </button>

                <button 
                    onClick={() => onNavigate(AppRoute.STUDENT_SHELF)}
                    className="group bg-white p-8 rounded-2xl shadow-lg shadow-purple-100 hover:shadow-xl border border-transparent hover:border-purple-100 transition-all duration-300 text-left"
                >
                    <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Library className="text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">我的书架</h3>
                    <p className="text-slate-500 text-sm">查看已借阅图书、阅读进度及归还期限。</p>
                </button>
            </div>
        </div>
    );
};

const StudentBrowse: React.FC<{ user: User, onNavigate: (route: AppRoute, data?: any) => void }> = ({ user, onNavigate }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [aiSummary, setAiSummary] = useState<string>('');
    const [loadingAi, setLoadingAi] = useState(false);
    const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

    const loadBooks = async () => {
        setLoading(true);
        const data = await db.getBooks();
        setBooks(data);
        setLoading(false);
    };

    useEffect(() => { loadBooks(); }, []);

    const filteredBooks = books.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.author.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleBorrow = async (book: Book) => {
        try {
            await db.borrowBook(book.id, user.id);
            // Navigate to success page instead of alert
            onNavigate(AppRoute.STUDENT_SUCCESS, { book });
        } catch (e: any) {
            setToast({ msg: e.message, type: 'error' });
        }
    };

    const handleSelectBook = async (book: Book) => {
        setSelectedBook(book);
        setLoadingAi(true);
        setAiSummary('');
        const summary = await getBookInsight(book.title, book.author);
        setAiSummary(summary);
        setLoadingAi(false);
    };

    if (loading) return <Loading />;

    return (
        <div className="space-y-8 pb-10">
            {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
            
            <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur py-4">
                <div className="relative max-w-2xl mx-auto">
                    <Search className="absolute left-4 top-3.5 text-indigo-400 pointer-events-none" size={20} />
                    <input 
                        className="w-full pl-12 pr-6 py-3.5 border-none shadow-lg shadow-indigo-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 placeholder:text-slate-400 transition-shadow"
                        placeholder="搜索书名、作者或ISBN..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredBooks.map(book => (
                    <div key={book.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full border border-slate-100">
                        <div className="aspect-[2/3] relative overflow-hidden bg-slate-200">
                             {book.coverUrl ? (
                                <img src={book.coverUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={book.title} />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <BookOpen size={48} />
                                </div>
                             )}
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                                <button 
                                    onClick={() => handleSelectBook(book)}
                                    className="bg-white/90 text-slate-900 font-bold py-2 px-4 rounded-full text-sm hover:bg-white shadow-lg backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                >
                                    查看详情
                                </button>
                             </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-slate-800 leading-snug mb-1 line-clamp-2" title={book.title}>{book.title}</h3>
                            <p className="text-slate-500 text-xs mb-3">{book.author}</p>
                            
                            <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${book.available_copies > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                    {book.available_copies > 0 ? `${book.available_copies}本在馆` : '暂时借空'}
                                </span>
                                {book.available_copies > 0 && (
                                    <button 
                                        onClick={() => handleBorrow(book)}
                                        className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors"
                                        title="快速借阅"
                                    >
                                        <Plus size={20} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Insight Modal */}
            {selectedBook && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row h-[600px] animate-in zoom-in-95 duration-300">
                        {/* Left: Image */}
                        <div className="w-full md:w-1/3 h-64 md:h-full bg-slate-100 relative">
                             {selectedBook.coverUrl && <img src={selectedBook.coverUrl} className="w-full h-full object-cover" alt="" />}
                             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6 md:hidden">
                                <h2 className="text-white font-bold text-2xl shadow-black drop-shadow-md">{selectedBook.title}</h2>
                             </div>
                        </div>

                        {/* Right: Content */}
                        <div className="flex-1 p-8 flex flex-col overflow-y-auto">
                            <div className="flex justify-between items-start mb-6">
                                <div className="hidden md:block">
                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedBook.title}</h2>
                                    <p className="text-lg text-slate-500">{selectedBook.author}</p>
                                </div>
                                <button onClick={() => setSelectedBook(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors self-end md:self-start">
                                    <X className="text-slate-400" />
                                </button>
                            </div>

                            <div className="mb-6 grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-xs text-slate-400 uppercase font-bold block mb-1">ISBN</span>
                                    <span className="font-mono text-slate-700">{selectedBook.isbn}</span>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span className="text-xs text-slate-400 uppercase font-bold block mb-1">分类</span>
                                    <span className="text-slate-700">{selectedBook.category || '通识'}</span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wide mb-3">
                                    <Star className="w-4 h-4 fill-indigo-600" />
                                    AI 智能导读
                                </div>
                                <div className="prose prose-slate bg-indigo-50/50 p-6 rounded-2xl text-slate-600 leading-relaxed border border-indigo-50">
                                    {loadingAi ? (
                                        <div className="flex flex-col gap-2">
                                            <div className="h-4 bg-indigo-200/50 rounded w-3/4 animate-pulse"></div>
                                            <div className="h-4 bg-indigo-200/50 rounded w-full animate-pulse"></div>
                                            <div className="h-4 bg-indigo-200/50 rounded w-5/6 animate-pulse"></div>
                                        </div>
                                    ) : (
                                        aiSummary
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-4 border-t border-slate-100 pt-6">
                                <button 
                                    onClick={() => setSelectedBook(null)}
                                    className="px-6 py-3 rounded-xl text-slate-500 hover:bg-slate-50 font-medium transition-colors"
                                >
                                    再看看
                                </button>
                                <button 
                                    onClick={() => {
                                        handleBorrow(selectedBook);
                                        setSelectedBook(null);
                                    }}
                                    disabled={selectedBook.available_copies === 0}
                                    className="bg-indigo-600 disabled:bg-slate-300 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all hover:scale-105 font-bold shadow-lg shadow-indigo-200 flex items-center gap-2"
                                >
                                    {selectedBook.available_copies > 0 ? '立即借阅' : '暂时缺货'}
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const BorrowSuccess: React.FC<{ book: Book, onNavigate: (route: AppRoute) => void }> = ({ book, onNavigate }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle className="text-emerald-600 w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">借阅成功！</h2>
            <p className="text-slate-500 mb-8">请爱护图书，并按时归还。</p>
            
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
                <div className="flex gap-4">
                    <div className="w-20 h-28 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden shadow-inner">
                        {book.coverUrl && <img src={book.coverUrl} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{book.title}</h3>
                        <p className="text-slate-500 text-sm mb-4">{book.author}</p>
                        <div className="text-xs text-slate-400 bg-slate-50 p-2 rounded">
                            归还期限: <span className="font-bold text-slate-700">{new Date(Date.now() + 14 * 86400000).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button onClick={() => onNavigate(AppRoute.STUDENT_SHELF)} className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors">
                    查看我的书架
                </button>
                <button onClick={() => onNavigate(AppRoute.STUDENT_SEARCH)} className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors">
                    继续浏览
                </button>
            </div>
        </div>
    );
}

const StudentBookshelf: React.FC<{ user: User }> = ({ user }) => {
    const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([db.getBorrowRecords(), db.getBooks()]).then(([bData, bookData]) => {
            const myBorrows = bData.filter(r => r.user_id === user.id && !r.return_date);
            setBorrows(myBorrows);
            setBooks(bookData);
            setLoading(false);
        });
    }, [user.id]);

    const getBook = (id: string) => books.find(b => b.id === id);

    if (loading) return <Loading />;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <LibraryBig className="text-indigo-600" /> 我的云书架
            </h2>

            {borrows.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-4">
                        <BookOpen className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">书架空空如也</h3>
                    <p className="text-slate-500 mb-6">您当前没有借阅任何图书。</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {borrows.map(record => {
                        const book = getBook(record.book_id);
                        if (!book) return null;
                        const daysLeft = Math.ceil((new Date(record.due_date).getTime() - Date.now()) / (1000 * 3600 * 24));
                        const progress = Math.min(100, Math.max(0, ((14 - daysLeft) / 14) * 100));

                        return (
                            <div key={record.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex gap-6 hover:shadow-lg transition-all duration-300 group">
                                <div className="w-32 flex-shrink-0 shadow-lg rounded-lg overflow-hidden relative group-hover:-translate-y-2 transition-transform duration-300">
                                    {book.coverUrl ? (
                                        <img src={book.coverUrl} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-200 flex items-center justify-center"><BookOpen /></div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-1 line-clamp-2">{book.title}</h3>
                                        <p className="text-slate-500 mb-4">{book.author}</p>
                                        
                                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4">
                                            <div className="flex justify-between text-xs font-semibold uppercase text-slate-400 mb-1">
                                                <span>阅读期限</span>
                                                <span className={daysLeft < 3 ? 'text-red-500' : 'text-indigo-500'}>剩余 {daysLeft} 天</span>
                                            </div>
                                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${daysLeft < 3 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400 flex items-center gap-1">
                                            <Clock size={14} /> {new Date(record.due_date).toLocaleDateString()} 归还
                                        </span>
                                        {/* In a real app, 'Return' might happen at a desk, but we simulate it here? No, let's keep it read-only for students for realism */}
                                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">借阅中</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}

// --- Main App Component ---

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [route, setRoute] = useState<AppRoute>(AppRoute.DASHBOARD);
  const [navData, setNavData] = useState<any>(null);

  // Initialize data on mount
  useEffect(() => {
    // Check local storage for session (simulated)
    const storedUser = localStorage.getItem('lms_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
     if (user) {
        if (user.role === 'admin' && route.startsWith('student')) setRoute(AppRoute.DASHBOARD);
        if (user.role === 'student' && !route.startsWith('student')) setRoute(AppRoute.STUDENT_HOME);
     } else {
        setRoute(AppRoute.LOGIN);
     }
  }, [user, route]);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('lms_current_user', JSON.stringify(u));
    setRoute(u.role === 'admin' ? AppRoute.DASHBOARD : AppRoute.STUDENT_HOME);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lms_current_user');
    setRoute(AppRoute.LOGIN);
  };

  const handleNavigate = (newRoute: AppRoute, data?: any) => {
      setNavData(data);
      setRoute(newRoute);
  };

  const renderContent = () => {
    switch (route) {
      case AppRoute.DASHBOARD: return <Dashboard />;
      case AppRoute.BOOKS: return <BookManager />;
      case AppRoute.USERS: return <UserManager />;
      case AppRoute.BORROW_ACTIVE: return <BorrowActive />;
      
      case AppRoute.STUDENT_HOME: return <StudentHome onNavigate={handleNavigate} user={user!} />;
      case AppRoute.STUDENT_SEARCH: return <StudentBrowse user={user!} onNavigate={handleNavigate} />;
      case AppRoute.STUDENT_SHELF: return <StudentBookshelf user={user!} />;
      case AppRoute.STUDENT_SUCCESS: return <BorrowSuccess book={navData?.book} onNavigate={handleNavigate} />;
      
      default: return <div className="text-center py-20 text-slate-400">页面开发中...</div>;
    }
  };

  if (route === AppRoute.LOGIN) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      currentUser={user} 
      currentRoute={route} 
      onNavigate={handleNavigate} 
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
