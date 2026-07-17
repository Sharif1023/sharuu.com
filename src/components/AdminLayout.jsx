import {
  Boxes,
  CircleGauge,
  ExternalLink,
  FileText,
  FolderTree,
  LogOut,
  Menu,
  Settings,
  ShoppingCart,
  Store,
  Tags,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useStore } from '../contexts/StoreContext';

const navItems = [
  {
    label: 'Dashboard',
    path: '/admin',
    icon: CircleGauge
  },
  {
    label: 'Products',
    path: '/admin/products',
    icon: Boxes
  },
  {
    label: 'Categories',
    path: '/admin/categories',
    icon: FolderTree
  },
  {
    label: 'Coupons',
    path: '/admin/coupons',
    icon: Tags
  },
  {
    label: 'Orders',
    path: '/admin/orders',
    icon: ShoppingCart
  },
  {
    label: 'CMS Pages',
    path: '/admin/pages',
    icon: FileText
  },
  {
    label: 'Settings',
    path: '/admin/settings',
    icon: Settings
  }
];

const DEFAULT_PRIMARY = '#0f172a';
const DEFAULT_SECONDARY = '#d97706';

function getValidColor(value, fallback) {
  const color = String(value || '').trim();

  if (/^#[0-9a-fA-F]{6}$/.test(color)) {
    return color;
  }

  return fallback;
}

function hexToRgba(hex, opacity) {
  const cleanHex = getValidColor(
    hex,
    DEFAULT_SECONDARY
  ).replace('#', '');

  const number = Number.parseInt(cleanHex, 16);

  const red = (number >> 16) & 255;
  const green = (number >> 8) & 255;
  const blue = number & 255;

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  const { admin, logout } = useAdminAuth();
  const { settings } = useStore();

  const navigate = useNavigate();
  const location = useLocation();

  const primaryColor = getValidColor(
    settings?.primaryColor,
    DEFAULT_PRIMARY
  );

  const secondaryColor = getValidColor(
    settings?.secondaryColor,
    DEFAULT_SECONDARY
  );

  const storeName = settings?.storeName || 'Sharuu';

  const storeInitial =
    storeName.trim().charAt(0).toUpperCase() || 'S';

  const themeVariables = {
    '--admin-primary': primaryColor,
    '--admin-secondary': secondaryColor,

    '--admin-primary-soft': hexToRgba(
      primaryColor,
      0.12
    ),

    '--admin-secondary-soft': hexToRgba(
      secondaryColor,
      0.14
    ),

    '--admin-secondary-border': hexToRgba(
      secondaryColor,
      0.35
    ),

    '--admin-secondary-shadow': hexToRgba(
      secondaryColor,
      0.28
    )
  };

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open
      ? 'hidden'
      : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const exit = async () => {
    await logout();

    navigate('/admin/login', {
      replace: true
    });
  };

  return (
    <div
      className="admin-shell premium-admin-shell"
      style={themeVariables}
    >
      <style>{`
        .premium-admin-shell {
          min-height: 100vh;
          display: block;
          background:
            radial-gradient(
              circle at top right,
              var(--admin-secondary-soft),
              transparent 32%
            ),
            #f5f7fb;
        }

        .premium-admin-shell .admin-sidebar {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 100;
          width: 280px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          border-right: 1px solid rgba(255,255,255,0.08);
          background: var(--admin-primary);
          padding: 20px 16px 16px;
          color: #ffffff;
          box-shadow: 18px 0 50px rgba(15,23,42,0.12);
        }

        .premium-admin-shell .admin-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 64px;
          padding: 4px 4px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.10);
        }

        .premium-admin-shell .admin-brand-link {
          min-width: 0;
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #ffffff;
          text-decoration: none;
        }

        .premium-admin-shell .brand-mark {
          width: 48px;
          height: 48px;
          flex: 0 0 48px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 16px;
          background: var(--admin-secondary);
          color: #ffffff;
          font-size: 20px;
          font-weight: 900;
          box-shadow:
            0 12px 26px var(--admin-secondary-shadow),
            inset 0 1px rgba(255,255,255,0.25);
        }

        .premium-admin-shell .brand-mark img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .premium-admin-shell .admin-brand-copy {
          min-width: 0;
        }

        .premium-admin-shell .admin-brand-copy strong {
          display: block;
          overflow: hidden;
          color: #ffffff;
          font-size: 15px;
          font-weight: 900;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .premium-admin-shell .admin-brand-copy small {
          display: block;
          margin-top: 5px;
          color: rgba(255,255,255,0.52);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.10em;
          text-transform: uppercase;
        }

        .premium-admin-shell .admin-close-button {
          display: none;
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          place-items: center;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          background: rgba(255,255,255,0.07);
          color: #ffffff;
          cursor: pointer;
        }

        .premium-admin-shell .admin-store-card {
          margin: 18px 0 16px;
          border: 1px solid var(--admin-secondary-border);
          border-radius: 18px;
          background: var(--admin-secondary-soft);
          padding: 14px;
        }

        .premium-admin-shell .admin-store-card-top {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .premium-admin-shell .admin-store-icon {
          width: 40px;
          height: 40px;
          flex: 0 0 40px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: var(--admin-secondary);
          color: #ffffff;
          box-shadow: 0 10px 22px
            var(--admin-secondary-shadow);
        }

        .premium-admin-shell .admin-store-card small,
        .premium-admin-shell .admin-store-card strong {
          display: block;
        }

        .premium-admin-shell .admin-store-card small {
          color: rgba(255,255,255,0.52);
          font-size: 9px;
          font-weight: 700;
        }

        .premium-admin-shell .admin-store-card strong {
          margin-top: 3px;
          color: #ffffff;
          font-size: 12px;
          font-weight: 900;
        }

        .premium-admin-shell .admin-view-store {
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 13px;
          border-radius: 12px;
          background: var(--admin-secondary);
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
          text-decoration: none;
          box-shadow: 0 10px 23px
            var(--admin-secondary-shadow);
          transition:
            transform 180ms ease,
            filter 180ms ease;
        }

        .premium-admin-shell .admin-view-store:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
        }

        .premium-admin-shell .admin-menu-title {
          display: block;
          margin: 6px 12px 10px;
          color: rgba(255,255,255,0.36);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .premium-admin-shell .admin-sidebar nav {
          flex: 1;
        }

        .premium-admin-shell .admin-sidebar nav a {
          display: flex;
          align-items: center;
          gap: 11px;
          min-height: 52px;
          margin-bottom: 5px;
          border: 1px solid transparent;
          border-radius: 15px;
          padding: 8px 11px;
          color: rgba(255,255,255,0.66);
          text-decoration: none;
          transition:
            background 180ms ease,
            color 180ms ease,
            border-color 180ms ease,
            transform 180ms ease;
        }

        .premium-admin-shell .admin-sidebar nav a:hover {
          border-color: rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.07);
          color: #ffffff;
          transform: translateX(2px);
        }

        .premium-admin-shell .admin-sidebar nav a.active {
          border-color: var(--admin-secondary-border);
          background: var(--admin-secondary-soft);
          color: #ffffff;
          box-shadow:
            inset 3px 0 var(--admin-secondary),
            0 10px 24px rgba(0,0,0,0.12);
        }

        .premium-admin-shell .admin-nav-icon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.68);
        }

        .premium-admin-shell
        .admin-sidebar nav a.active
        .admin-nav-icon {
          background: var(--admin-secondary);
          color: #ffffff;
          box-shadow: 0 9px 20px
            var(--admin-secondary-shadow);
        }

        .premium-admin-shell .admin-nav-label {
          flex: 1;
          font-size: 12px;
          font-weight: 850;
        }

        .premium-admin-shell .admin-user {
          display: grid;
          grid-template-columns:
            42px minmax(0, 1fr) 39px;
          align-items: center;
          gap: 10px;
          margin-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.10);
          padding: 16px 4px 0;
        }

        .premium-admin-shell .admin-user-avatar {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #ffffff;
          color: var(--admin-primary);
          font-size: 14px;
          font-weight: 900;
        }

        .premium-admin-shell .admin-user-info {
          min-width: 0;
        }

        .premium-admin-shell .admin-user-info strong,
        .premium-admin-shell .admin-user-info small {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .premium-admin-shell .admin-user-info strong {
          color: #ffffff;
          font-size: 11px;
          font-weight: 900;
        }

        .premium-admin-shell .admin-user-info small {
          margin-top: 4px;
          color: rgba(255,255,255,0.40);
          font-size: 9px;
        }

        .premium-admin-shell .admin-logout-button {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(248,113,113,0.24);
          border-radius: 12px;
          background: rgba(248,113,113,0.10);
          color: #fca5a5;
          cursor: pointer;
          transition:
            background 180ms ease,
            color 180ms ease;
        }

        .premium-admin-shell
        .admin-logout-button:hover {
          background: #ef4444;
          color: #ffffff;
        }

        .premium-admin-shell .admin-main {
          min-height: 100vh;
          width: calc(100% - 280px);
          margin-left: 280px;
          background: transparent;
        }

        .premium-admin-shell .admin-topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          min-height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid rgba(148,163,184,0.20);
          background: rgba(255,255,255,0.90);
          padding: 12px 26px;
          backdrop-filter: blur(18px);
        }

        .premium-admin-shell .admin-topbar-title span {
          display: block;
          color: #64748b;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.10em;
          text-transform: uppercase;
        }

        .premium-admin-shell .admin-topbar-title strong {
          display: block;
          margin-top: 4px;
          color: var(--admin-primary);
          font-size: 18px;
          font-weight: 900;
        }

        .premium-admin-shell .admin-topbar-store {
          min-height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          border: 1px solid var(--admin-secondary-border);
          border-radius: 13px;
          background: var(--admin-secondary-soft);
          padding: 0 14px;
          color: var(--admin-secondary);
          font-size: 11px;
          font-weight: 900;
          text-decoration: none;
          transition:
            background 180ms ease,
            color 180ms ease;
        }

        .premium-admin-shell .admin-topbar-store:hover {
          background: var(--admin-secondary);
          color: #ffffff;
        }

        .premium-admin-shell .admin-content {
          padding: 25px;
        }

        .premium-admin-shell .admin-mobile-toggle {
          position: fixed;
          top: 14px;
          left: 14px;
          z-index: 80;
          display: none;
          width: 44px;
          height: 44px;
          place-items: center;
          border: 0;
          border-radius: 13px;
          background: var(--admin-primary);
          color: #ffffff;
          cursor: pointer;
          box-shadow: 0 12px 28px rgba(15,23,42,0.22);
        }

        .premium-admin-shell .admin-overlay {
          position: fixed;
          inset: 0;
          z-index: 90;
          border: 0;
          background: rgba(2,6,23,0.62);
          backdrop-filter: blur(3px);
          cursor: pointer;
        }

        @media (max-width: 1024px) {
          .premium-admin-shell .admin-sidebar {
            transform: translateX(-105%);
            transition: transform 220ms ease;
          }

          .premium-admin-shell .admin-sidebar.open {
            transform: translateX(0);
          }

          .premium-admin-shell .admin-close-button {
            display: grid;
          }

          .premium-admin-shell .admin-mobile-toggle {
            display: grid;
          }

          .premium-admin-shell .admin-main {
            width: 100%;
            margin-left: 0;
          }

          .premium-admin-shell .admin-topbar {
            padding-left: 72px;
          }
        }

        @media (max-width: 640px) {
          .premium-admin-shell .admin-sidebar {
            width: min(88vw, 300px);
          }

          .premium-admin-shell .admin-content {
            padding: 15px;
          }

          .premium-admin-shell .admin-topbar {
            padding-right: 14px;
          }

          .premium-admin-shell
          .admin-topbar-store span {
            display: none;
          }

          .premium-admin-shell .admin-topbar-store {
            width: 42px;
            padding: 0;
          }

          .premium-admin-shell
          .admin-topbar-title strong {
            font-size: 15px;
          }
        }
      `}</style>

      <button
        type="button"
        className="admin-mobile-toggle"
        onClick={() => setOpen(true)}
        aria-label="Open admin menu"
      >
        <Menu size={21} />
      </button>

      <aside
        className={`admin-sidebar ${
          open ? 'open' : ''
        }`}
      >
        <div className="admin-brand">
          <Link
            to="/"
            className="admin-brand-link"
            onClick={() => setOpen(false)}
          >
            <span className="brand-mark">
              {settings?.logo ? (
                <img
                  src={settings.logo}
                  alt={storeName}
                />
              ) : (
                storeInitial
              )}
            </span>

            <span className="admin-brand-copy">
              <strong>{storeName}</strong>
              <small>Admin Workspace</small>
            </span>
          </Link>

          <button
            type="button"
            className="admin-close-button"
            onClick={() => setOpen(false)}
            aria-label="Close admin menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="admin-store-card">
          <div className="admin-store-card-top">
            <span className="admin-store-icon">
              <Store size={18} />
            </span>

            <div>
              <small>Public website</small>
              <strong>View your storefront</strong>
            </div>
          </div>

          <Link
            to="/"
            className="admin-view-store"
            onClick={() => setOpen(false)}
          >
            View Store
            <ExternalLink size={15} />
          </Link>
        </div>

        <nav>
          <span className="admin-menu-title">
            Management
          </span>

          {navItems.map(item => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive ? 'active' : ''
                }
              >
                <span className="admin-nav-icon">
                  <Icon size={19} />
                </span>

                <span className="admin-nav-label">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-user">
          <span className="admin-user-avatar">
            {(admin?.name || admin?.email || 'A')
              .charAt(0)
              .toUpperCase()}
          </span>

          <span className="admin-user-info">
            <strong>
              {admin?.name || 'Administrator'}
            </strong>

            <small>
              {admin?.email || 'Admin account'}
            </small>
          </span>

          <button
            type="button"
            className="admin-logout-button"
            onClick={exit}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">
            <span>Store Management</span>
            <strong>{storeName} Admin</strong>
          </div>

          <Link
            to="/"
            className="admin-topbar-store"
          >
            <Store size={17} />
            <span>View Store</span>
            <ExternalLink size={14} />
          </Link>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>

      {open && (
        <button
          type="button"
          className="admin-overlay"
          onClick={() => setOpen(false)}
          aria-label="Close admin menu"
        />
      )}
    </div>
  );
}