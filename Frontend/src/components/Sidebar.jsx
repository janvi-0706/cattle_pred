import { Home, Info, ScanLine, BarChart3, ChevronLeft, ChevronRight, Leaf, GraduationCap } from 'lucide-react'

const navItems = [
  { id: 'home',      label: 'Home',            icon: Home },
  { id: 'about',     label: 'About',           icon: Info },
  { id: 'detection', label: 'Breed Detection', icon: ScanLine },
  { id: 'analysis',  label: 'Milk Analysis',   icon: BarChart3 },
]

export default function Sidebar({ isOpen, onToggle, activeSection, onNavigate }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      onNavigate?.()
    }
  }

  return (
    <aside
      className={`dashboard-sidebar fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-300 shadow-lg
        ${isOpen ? 'w-64' : 'w-16'}`}
      style={{ backgroundColor: '#4b4336' }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 border-b flex-shrink-0"
        style={{ borderColor: '#6f5727' }}
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#8c7135' }}
        >
          <Leaf className="w-5 h-5 text-white" />
        </div>
        {isOpen && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-base leading-tight whitespace-nowrap">PashuPehchan</p>
            <p className="text-sm whitespace-nowrap" style={{ color: '#a18b5b' }}>AI Breed Identifier</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-hidden">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="w-full flex items-center gap-3 px-4 py-3 transition-all duration-150 text-left group"
              style={{
                backgroundColor: isActive ? '#6f5727' : 'transparent',
                borderRight: isActive ? '3px solid #c49b36' : '3px solid transparent',
              }}
            >
              <Icon
                className="w-5 h-5 flex-shrink-0 transition-colors"
                style={{ color: isActive ? '#c49b36' : '#a18b5b' }}
              />
              {isOpen && (
                <span
                  className="text-base font-medium whitespace-nowrap transition-colors"
                  style={{ color: isActive ? '#ffffff' : '#eee7d7' }}
                >
                  {label}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-colors"
        style={{ backgroundColor: '#15803d' }}
        title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isOpen
          ? <ChevronLeft className="w-4 h-4 text-white" />
          : <ChevronRight className="w-4 h-4 text-white" />
        }
      </button>

      {/* Footer */}
      <div
        className="px-4 py-4 border-t flex-shrink-0"
        style={{ borderColor: '#6f5727' }}
      >
        {isOpen ? (
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 flex-shrink-0" style={{ color: '#a18b5b' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: '#a18b5b' }}>IPD Project</p>
              <p className="text-sm" style={{ color: '#c49b36' }}>2025 – 26</p>
            </div>
          </div>
        ) : (
          <div className="w-2 h-2 rounded-full mx-auto" style={{ backgroundColor: '#c49b36' }} />
        )}
      </div>
    </aside>
  )
}
