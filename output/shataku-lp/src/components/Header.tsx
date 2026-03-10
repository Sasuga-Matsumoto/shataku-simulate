'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

type Variant = 'top' | 'contact' | 'download' | 'thanks-contact' | 'thanks-download' | 'privacy';

export default function Header({ variant = 'top' }: { variant?: Variant }) {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const renderNav = () => {
    if (variant === 'top') {
      return (
        <>
          <ul className="header-nav">
            <li><a href="#merit">メリット</a></li>
            <li><a href="#simulator">シミュレーション</a></li>
            <li><a href="#service">サービス詳細</a></li>
            <li><a href="#faq">よくある質問</a></li>
            <li><Link href="/download/" className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '0.82rem', color: 'white' }}>資料ダウンロード</Link></li>
          </ul>
        </>
      );
    }
    if (variant === 'download') {
      return (
        <ul className="header-nav">
          <li><Link href="/">サービスサイト</Link></li>
          <li><Link href="/contact/" className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '0.82rem', color: 'white' }}>お問い合わせ</Link></li>
        </ul>
      );
    }
    if (variant === 'thanks-download') {
      return (
        <ul className="header-nav">
          <li><Link href="/">サービスサイト</Link></li>
          <li><Link href="/contact/" className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '0.82rem', color: 'white' }}>お問い合わせ</Link></li>
        </ul>
      );
    }
    // contact, thanks-contact, privacy
    return (
      <ul className="header-nav">
        <li><Link href="/">サービスサイト</Link></li>
        <li><Link href="/download/" className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '0.82rem', color: 'white' }}>資料ダウンロード</Link></li>
      </ul>
    );
  };

  const renderMobileMenu = () => {
    if (variant === 'top') {
      return (
        <div className={`mobile-menu${isOpen ? ' active' : ''}`}>
          <a href="#merit" onClick={closeMenu}>メリット</a>
          <a href="#simulator" onClick={closeMenu}>シミュレーション</a>
          <a href="#service" onClick={closeMenu}>サービス詳細</a>
          <a href="#faq" onClick={closeMenu}>よくある質問</a>
          <Link href="/contact/" onClick={closeMenu}>お問い合わせ</Link>
          <Link href="/download/" onClick={closeMenu}>資料ダウンロード</Link>
        </div>
      );
    }
    if (variant === 'download') {
      return (
        <div className={`mobile-menu${isOpen ? ' active' : ''}`}>
          <Link href="/" onClick={closeMenu}>サービスサイト</Link>
          <Link href="/contact/" onClick={closeMenu}>お問い合わせ</Link>
        </div>
      );
    }
    if (variant === 'thanks-download') {
      return (
        <div className={`mobile-menu${isOpen ? ' active' : ''}`}>
          <Link href="/" onClick={closeMenu}>サービスサイト</Link>
          <Link href="/contact/" onClick={closeMenu}>お問い合わせ</Link>
        </div>
      );
    }
    // contact, thanks-contact, privacy
    return (
      <div className={`mobile-menu${isOpen ? ' active' : ''}`}>
        <Link href="/" onClick={closeMenu}>サービスサイト</Link>
        <Link href="/download/" onClick={closeMenu}>資料ダウンロード</Link>
      </div>
    );
  };

  return (
    <header className="header" ref={headerRef}>
      <Link href="/" className="header-left">
        <img src="/logo.png" alt="PLEX" className="header-logo-img" />
        <div className="header-logo">PLEX <span>福利厚生社宅</span></div>
      </Link>
      <nav>
        {renderNav()}
      </nav>
      <button
        className={`hamburger${isOpen ? ' active' : ''}`}
        aria-label="メニュー"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span><span></span><span></span>
      </button>
      {renderMobileMenu()}
    </header>
  );
}
