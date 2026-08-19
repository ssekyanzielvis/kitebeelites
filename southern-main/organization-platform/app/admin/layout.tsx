'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import {
  LayoutDashboard,
  Image,
  FileText,
  Target,
  Briefcase,
  Award,
  Heart,
  ImageIcon,
  Newspaper,
  Users,
  Mail,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  Palette,
  BarChart3,
  UserPlus,
  ExternalLink,
  Trophy,
  HandHeart,
  ShieldCheck,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { admin, setAdmin, isSidebarOpen, toggleSidebar } = useAppStore();

  const handleLogout = () => {
    setAdmin(null);
    router.push('/admin/login');
  };

  // If on login page, just render children without admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // If not authenticated, show login prompt
  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access the admin panel.</p>
          <Link
            href="/admin/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard',       href: '/admin/dashboard',       icon: LayoutDashboard },
    { name: 'Hero Slides',     href: '/admin/slides',          icon: Image },
    { name: 'Content',         href: '/admin/content',         icon: FileText },
    { name: 'Pillars',         href: '/admin/programs',        icon: Briefcase },
    { name: 'Achievements',    href: '/admin/achievements',    icon: Award },
    { name: 'Core Values',     href: '/admin/core-values',     icon: Heart },
    { name: 'Gallery',         href: '/admin/gallery',         icon: ImageIcon },
    { name: 'News',            href: '/admin/news',            icon: Newspaper },
    { name: 'Leadership',      href: '/admin/leadership',      icon: ShieldCheck },
    // ── Kitebe-specific ────────────────────
    { name: 'League',          href: '/admin/programs',        icon: Trophy },
    { name: 'Members',         href: '/admin/staff',           icon: Users },
    { name: 'Charity Visits',  href: '/admin/donations',       icon: HandHeart },
    // ── Engagement ─────────────────────────
    { name: 'Contacts',        href: '/admin/contacts',        icon: Mail },
    { name: 'Donations',       href: '/admin/donations',       icon: DollarSign },
    { name: 'Analytics',       href: '/admin/analytics',       icon: BarChart3 },
    { name: 'Theme',           href: '/admin/theme',           icon: Palette },
    { name: 'Settings',        href: '/admin/settings',        icon: Settings },
    { name: 'Users',           href: '/admin/users',           icon: UserPlus },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-30">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold">Kitebe Elites FC — Admin</h1>
          </div>

          <div className="flex items-center space-x-4">
            {admin && (
              <>
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="View visitor site"
                >
                  <ExternalLink size={18} />
                  <span className="hidden sm:inline">View Site</span>
                </a>
                <div className="flex items-center space-x-3">
                  {/* Profile avatar */}
                  {admin.imageUrl ? (
                    <img
                      src={admin.imageUrl}
                      alt={admin.fullName}
                      className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {admin.fullName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium">{admin.fullName}</p>
                    <p className="text-xs text-gray-500">{admin.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out z-20 overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-200 ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-64'
        }`}
      >
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}

