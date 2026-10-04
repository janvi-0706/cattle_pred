import { CheckCircle2, Upload, Cpu, FileCheck } from 'lucide-react'
import BreedCarousel from './BreedCarousel'

const objectives = [
  'Develop an AI-driven system that identifies cattle and buffalo breeds using images.',
  'Build a robust breed database covering major indigenous and crossbred breeds in India.',
  'Ensure recognition works under variable field conditions — lighting, background, movement.',
  'Provide milk production and quality estimates per detected breed for informed livestock management.',
]

const steps = [
  {
    icon: Upload,
    title: 'Upload Image',
    desc: 'Capture or upload a clear photograph of the animal. Supports JPG, JPEG, and PNG formats.',
  },
  {
    icon: Cpu,
    title: 'AI Processing',
    desc: 'Deep learning model (CNN/YOLOv8) analyzes muzzle patterns, coat markings, and body structure.',
  },
  {
    icon: FileCheck,
    title: 'Get Results',
    desc: 'Receive breed name, confidence score, and optional milk production & quality report.',
  },
]

export default function AboutSection() {
  return (
    <section id="about" className="bg-white">

      {/* About intro */}
      <div className="px-10 md:px-16 py-16 border-b border-green-100">
        <div className="max-w-6xl mx-auto">
          <span
            className="inline-block text-sm font-semibold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full"
            style={{ backgroundColor: '#eee7d7', color: '#6f5727' }}
          >
            About the Project
          </span>
          <h2 className="text-4xl font-bold mb-5" style={{ color: '#4b4336' }}>
            AI-Powered Breed Identification for Indian Livestock
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-3xl">
            PashuPehchan is an image-based deep learning system developed as a college IPD project to accurately
            classify cattle and buffalo breeds found across India. The system leverages CNN and YOLOv8 architectures
            trained on curated datasets of indigenous and crossbred animals. Beyond breed detection, it offers
            milk production and quality estimates to support farmers, veterinarians, and researchers in making
            informed livestock management decisions.
          </p>

          {/* Objectives */}
          <h3 className="text-xl font-semibold mb-5" style={{ color: '#4b4336' }}>Key Objectives</h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: '#f3efe4', border: '1px solid #d8cdb5' }}>
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#8c7135' }} />
                <span className="text-base text-gray-700 leading-snug">{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* How it works */}
      <div className="px-10 md:px-16 py-14 border-b border-green-100" style={{ backgroundColor: '#f3efe4' }}>
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold mb-8" style={{ color: '#4b4336' }}>How It Works</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {steps.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="relative flex flex-col items-start p-6 rounded-2xl bg-white shadow-sm" style={{ border: '1px solid #d8cdb5' }}>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#eee7d7' }}
                >
                  <Icon className="w-6 h-6" style={{ color: '#6f5727' }} />
                </div>
                <span className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: '#a18b5b' }}>Step {i + 1}</span>
                <h4 className="font-semibold text-lg mb-2" style={{ color: '#4b4336' }}>{title}</h4>
                <p className="text-base text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Breed Showcase */}
      <div className="px-10 md:px-16 py-16 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <span
                className="inline-block text-base font-semibold uppercase tracking-widest mb-3 px-4 py-1.5 rounded-full"
                style={{ backgroundColor: '#eee7d7', color: '#6f5727' }}
              >
                Supported Breeds
              </span>
              <h3 className="text-3xl font-bold" style={{ color: '#4b4336' }}>
                Sample Breed Identification Outputs
              </h3>
              <p className="text-lg text-gray-500 mt-2">
                Representative breeds the model is trained to classify, with their key milk metrics.
              </p>
            </div>
          </div>

          <BreedCarousel />
        </div>
      </div>
    </section>
  )
}
