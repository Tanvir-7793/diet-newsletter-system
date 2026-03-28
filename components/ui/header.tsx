"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { onAuthChange, logout, type AuthUser } from "@/lib/auth";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      if (authUser) {
        setUser({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/');
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-50 border-b ${isDark ? 'bg-slate-800/95 backdrop-blur-sm border-slate-700' : 'bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 border-slate-200'}`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative h-10 w-10">
                  <Image
                    src="/logo.jpeg"
                    alt="Dnyanshree Institute Logo"
                    fill
                    className="object-contain rounded-full"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-tight">DIET Newsletter</span>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-muted-foreground'}`}>Dnyanshree Institute, Satara</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            {!pathname.includes('/login') && (
              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/dashboard" ? "text-primary" : isDark ? "text-slate-300" : "text-muted-foreground"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/editor"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === "/editor" ? "text-primary" : isDark ? "text-slate-300" : "text-muted-foreground"
                  }`}
                >
                  Editor
                </Link>
              </nav>
            )}
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              
              
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <div className="relative h-8 w-8">
                      <Image
                        src={user.photoURL || "/logo.jpeg"}
                        alt="User Avatar"
                        fill
                        className="object-contain rounded-full"
                      />
                    </div>
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {user.displayName || user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className={`text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-lg ${
                      isDark ? 'text-slate-300 hover:bg-slate-700/50' : 'text-muted-foreground hover:bg-slate-100/50'
                    }`}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className={`text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-lg ${
                    isDark ? 'text-slate-300 hover:bg-slate-700/50' : 'text-muted-foreground hover:bg-slate-100/50'
                  }`}
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              
              
              <button
                onClick={toggleMobileMenu}
                className={`p-2 rounded-lg transition-all hover:scale-105 ${
                  isDark 
                    ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50' 
                    : 'bg-slate-100/50 text-slate-600 hover:bg-slate-200/50'
                }`}
                title="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`md:hidden fixed inset-x-0 top-16 z-40 border-b ${isDark ? 'bg-slate-800/95 backdrop-blur-sm border-slate-700' : 'bg-white/95 backdrop-blur-sm border-slate-200'}`}>
          <div className="container mx-auto px-4 py-4 space-y-2">
            <div className="pt-2 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}">
              {!pathname.includes('/login') && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/dashboard" 
                        ? "bg-primary/10 text-primary" 
                        : isDark 
                          ? "text-slate-300 hover:bg-slate-700/50" 
                          : "text-muted-foreground hover:bg-slate-100/50"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/editor"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/editor" 
                        ? "bg-primary/10 text-primary" 
                        : isDark 
                          ? "text-slate-300 hover:bg-slate-700/50" 
                          : "text-muted-foreground hover:bg-slate-100/50"
                    }`}
                  >
                    Editor
                  </Link>
                </>
              )}
              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                    <div className="relative h-8 w-8">
                      <Image
                        src={user.photoURL || "/logo.jpeg"}
                        alt="User Avatar"
                        fill
                        className="object-contain rounded-full"
                      />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {user.displayName || user.email}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className={`block w-full text-center px-4 py-3 rounded-lg text-sm font-medium transition-all hover:scale-105 ${
                      isDark 
                        ? 'text-slate-300 hover:bg-slate-700/50' 
                        : 'text-muted-foreground hover:bg-slate-100/50'
                    }`}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 rounded-lg text-sm font-medium transition-all hover:scale-105 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
