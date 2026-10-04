import { useEffect, useState } from 'react'
import Header from './components/Header'
import AboutSection from './components/AboutSection'
import DetectionSection from './components/DetectionSection'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import FieldStats from './components/FieldStats'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const sections = ['home', 'about', 'detection', 'analysis']
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visibleSection) setActiveSection(visibleSection.target.id)
      },
      { rootMargin: '-18% 0px -65% 0px', threshold: [0.1, 0.3, 0.6] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`min-h-screen dashboard-shell ${sidebarOpen ? 'sidebar-is-open' : ''}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((isOpen) => !isOpen)}
        activeSection={activeSection}
        onNavigate={() => setSidebarOpen(false)}
      />
      <main className="min-w-0 dashboard-main">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />
        <AboutSection />
        <FieldStats />
        <DetectionSection />
        <Footer />
      </main>
    </div>
  )
}

export default App
