import { Leaf, GraduationCap } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#4b4336' }} className="text-white">
      <div className="px-10 md:px-16 py-12">
        <div className="grid sm:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#8c7135' }}>
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg">PashuPehchan</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#a18b5b' }}>
              AI-Based Image Recognition System for Accurate Breed Identification
              of Cattle and Buffaloes in India.
            </p>
          </div>

          {/* Project info */}
          <div>
            <h4 className="font-semibold text-base mb-3" style={{ color: '#c49b36' }}>Project Details</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#eee7d7' }}>
              <li>Industry Project (IPD) — 2025–26</li>
              <li>Problem: AI-based Breed Identification</li>
              <li>Model: CNN / YOLOv8 (Deep Learning)</li>
              <li>Frontend: React + Vite + TailwindCSS</li>
              <li>Backend: Python (Flask / FastAPI)</li>
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <h4 className="font-semibold text-base mb-3" style={{ color: '#c49b36' }}>Supported Breeds</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#eee7d7' }}>
              <li>🐄 Gir, Sahiwal, Tharparkar, Red Sindhi</li>
              <li>🐄 Kankrej, Hariana + crossbreeds</li>
              <li>🐃 Murrah, Nili-Ravi, Jaffarabadi</li>
              <li>🐃 Surti, Bhadawari, Pandharpuri</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="px-10 md:px-16 py-4" style={{ borderTop: '1px solid #6f5727' }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm" style={{ color: '#a18b5b' }}>
          <GraduationCap className="w-4 h-4" />
          <span>IPD College Project — All data is illustrative. Backend model integration pending.</span>
        </div>
        <p className="text-sm" style={{ color: '#c49b36' }}>© 2025–26 PashuPehchan</p>
        </div>
      </div>
    </footer>
  )
}
