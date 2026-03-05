import { NavLink } from 'react-router-dom';
import { Palette, Home, Sparkles, Users, Box, ChevronDown, Check, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type Theme = 'theme-dreamy' | 'theme-dark' | 'theme-minimalist';

interface NavbarProps {
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

const Navbar = ({ currentTheme, onThemeChange }: NavbarProps) => {
    const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsThemeDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { name: '首页', path: '/', icon: Home },
        { name: '定制工作室', path: '/studio', icon: Sparkles },
        { name: '内容社区', path: '/community', icon: Users },
        { name: '进度追踪', path: '/tracking', icon: Box },
        { name: '协作工作台', path: '/collab', icon: Users },
        { name: '个人中心', path: '/profile', icon: User },
    ];

    return (
        <header className="sticky top-0 z-50 w-full glass-panel" style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0 }}>
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(40px, 1fr) auto minmax(40px, 1fr)', alignItems: 'center', height: '4rem', padding: '0 1rem' }}>

                {/* Left empty spacer to push center to absolute center */}
                <div></div>

                {/* Center Cluster */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifySelf: 'center' }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <img src="/logo.svg" alt="ArtChain Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                    </div>

                    {/* Desktop Navigation */}
                    <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="hidden-mobile">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    style={({ isActive }) => ({
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontWeight: isActive ? 600 : 500,
                                        color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                                        transition: 'color var(--transition-fast)'
                                    })}
                                >
                                    <Icon size={18} />
                                    {link.name}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                {/* Custom Theme Selector (Right side) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifySelf: 'end' }}>
                    <div style={{ position: 'relative' }} className="desktop-theme-selector" ref={dropdownRef}>
                        <button
                            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'var(--glass-bg)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                padding: '0.4rem 0.8rem',
                                fontFamily: 'var(--font-sans)',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)'
                            }}
                            className="hover-scale"
                        >
                            <Palette size={16} color="var(--accent)" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                                {currentTheme === 'theme-dreamy' ? 'Dreamy Pink' :
                                    currentTheme === 'theme-dark' ? 'Dark Mode' : 'Minimalist'}
                            </span>
                            <ChevronDown size={14} style={{
                                transition: 'transform 0.2s',
                                transform: isThemeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                            }} />
                        </button>

                        {/* Dropdown Menu */}
                        {isThemeDropdownOpen && (
                            <div className="glass-panel animate-fade-in" style={{
                                position: 'absolute',
                                top: '120%',
                                right: 0,
                                width: '200px',
                                padding: '0.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.25rem',
                                zIndex: 100
                            }}>
                                {[
                                    { id: 'theme-dreamy', label: '梦幻粉紫', desc: '唯美娃圈感', color: '#fce7f3' },
                                    { id: 'theme-dark', label: '深色模式', desc: '护眼高级黑', color: '#1e293b' },
                                    { id: 'theme-minimalist', label: '清新极简', desc: '纯净清爽风', color: '#f8fafc' },
                                ].map(option => (
                                    <button
                                        key={option.id}
                                        onClick={() => {
                                            onThemeChange(option.id as Theme);
                                            setIsThemeDropdownOpen(false);
                                        }}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '6px',
                                            background: currentTheme === option.id ? 'var(--accent-light)' : 'transparent',
                                            color: currentTheme === option.id ? 'var(--accent)' : 'var(--text-primary)',
                                            textAlign: 'left',
                                            transition: 'background var(--transition-fast)'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-light)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = currentTheme === option.id ? 'var(--accent-light)' : 'transparent'}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: option.color, border: '1px solid var(--glass-border)' }} />
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{option.label}</span>
                                                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{option.desc}</span>
                                            </div>
                                        </div>
                                        {currentTheme === option.id && <Check size={16} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Inline styles for responsive hiding since we used pure CSS -- add this specifically for Navbar */}
            <style>
                {`
          @media (max-width: 768px) {
            .hidden-mobile { display: none !important; }
            .desktop-theme-selector { display: none !important; }
          }
          @media (min-width: 769px) {
            .desktop-theme-selector { display: flex !important; }
          }
        `}
            </style>
        </header>
    );
};

export default Navbar;
