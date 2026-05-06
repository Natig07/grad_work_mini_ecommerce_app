'use client';

import Link from 'next/link';
import { LogOut, User, Menu, X, ChevronDown, Zap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export function Navbar() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/[0.08] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="text-2xl font-bold gradient-text flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-400" />
              RenderLab
            </div>
            <span className="hidden md:inline text-xs text-gray-400 uppercase tracking-[0.24em]">Performance Observatory</span>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/metrics">Metrics</NavLink>
            <NavLink href="/simulator">Simulator</NavLink>
            <NavLink href="/csr/products">CSR Lab</NavLink>
            <NavLink href="/edge/products">Edge Lab</NavLink>
          </div>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-10 h-10 bg-white/[0.1] rounded-lg animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] transition duration-300"
                >
                  <User className="w-5 h-5 text-cyan-300" />
                  <span className="text-sm font-medium hidden sm:inline text-gray-200">
                    {user.fullName || user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-300" />
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-xl overflow-hidden border border-white/[0.1]">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:text-cyan-400 hover:bg-white/[0.05] transition"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition flex items-center gap-2 border-t border-white/[0.05]"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition duration-300 text-sm font-semibold"
              >
                Login
              </Link>
            )}

            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 space-y-2">
            <MobileNavLink href="/">Home</MobileNavLink>
            <MobileNavLink href="/metrics">Metrics</MobileNavLink>
            <MobileNavLink href="/simulator">Simulator</MobileNavLink>
            <MobileNavLink href="/csr/products">CSR Lab</MobileNavLink>
            <MobileNavLink href="/edge/products">Edge Lab</MobileNavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-cyan-400 hover:bg-white/[0.05] rounded-lg transition duration-300"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm font-medium text-gray-300 hover:text-cyan-400 hover:bg-white/[0.05] rounded-lg transition duration-300"
    >
      {children}
    </Link>
  );
}
