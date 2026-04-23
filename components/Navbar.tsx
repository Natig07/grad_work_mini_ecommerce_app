'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, LogOut, User, Menu, X, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';

export function Navbar() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const { cart } = useCart();
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
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              StoreFront
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/csr/products">CSR</NavLink>
            <NavLink href="/ssr/products">SSR</NavLink>
            <NavLink href="/edge/products">Edge</NavLink>
            <NavLink href="/metrics">Metrics</NavLink>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/wishlist"
              className="relative p-2 text-gray-700 hover:text-blue-600 transition"
            >
              <Heart className="w-6 h-6" />
            </Link>

            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600 transition">
              <ShoppingCart className="w-6 h-6" />
              {cart.itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Math.min(cart.itemCount, 99)}
                </span>
              )}
            </Link>

            {isLoading ? (
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
            ) : isAuthenticated && user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {user.fullName || user.email.split('@')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2 border-t border-gray-200"
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                Login
              </Link>
            )}

            <button
              className="md:hidden p-2"
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
          <div className="md:hidden pb-4 space-y-2">
            <MobileNavLink href="/csr/products">CSR</MobileNavLink>
            <MobileNavLink href="/ssr/products">SSR</MobileNavLink>
            <MobileNavLink href="/edge/products">Edge</MobileNavLink>
            <MobileNavLink href="/metrics">Metrics</MobileNavLink>
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
      className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition"
    >
      {children}
    </Link>
  );
}
