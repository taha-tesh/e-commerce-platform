import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  LogOut, Menu, X, ChevronRight, Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'admin.dashboard', href: '/admin' },
  { icon: Package, label: 'admin.products', href: '/admin/products' },
  { icon: ShoppingCart, label: 'admin.orders', href: '/admin/orders' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    toast.success(t('auth.loggedOut') || 'Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] flex">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#1A1D21] text-white transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0 lg:w-20'
        } overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link to="/admin" className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Quincaillerie Nour Essalam" 
                className="h-10 w-auto object-contain"
              />
              {isSidebarOpen && (
                <span className="font-semibold text-sm">Admin</span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/admin' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-[#FF6B35] text-white' 
                      : 'text-[#9AA2AD] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {isSidebarOpen && <span>{t(item.label)}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9AA2AD] hover:bg-white/10 hover:text-white transition-colors"
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span>{t('nav.home')}</span>}
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#9AA2AD] hover:bg-white/10 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span>{t('nav.signOut')}</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:flex"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
              {/* Breadcrumb */}
              <nav className="hidden sm:flex items-center gap-2 text-sm text-[#6B7280]">
                <Link to="/admin" className="hover:text-[#FF6B35]">Admin</Link>
                {location.pathname !== '/admin' && (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-[#1A1D21]">
                      {menuItems.find(item => location.pathname.startsWith(item.href) && item.href !== '/admin')?.label 
                        ? t(menuItems.find(item => location.pathname.startsWith(item.href) && item.href !== '/admin')!.label)
                        : ''}
                    </span>
                  </>
                )}
              </nav>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="font-medium text-[#1A1D21]">{user?.firstName} {user?.lastName}</div>
                <div className="text-sm text-[#6B7280]">{t('auth.admin')}</div>
              </div>
              <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-[#FF6B35]" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
