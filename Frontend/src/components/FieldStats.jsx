import { ArrowUpRight, Beef, Droplets, MapPinned, ShieldCheck } from 'lucide-react'

const stats = [
  { value: '12', label: 'native breeds', icon: Beef },
  { value: '7', label: 'milk indicators', icon: Droplets },
  { value: '28', label: 'states covered', icon: MapPinned },
  { value: '94%', label: 'target confidence', icon: ShieldCheck },
]

export default function FieldStats() {
  return (
    <section className="field-stats" aria-label="PashuPehchan project highlights">
      <div className="field-stats-intro">
        <span className="eyebrow">At a glance</span>
        <h2>Built for the field.</h2>
        <p>Simple signals for better livestock decisions, from the first photo to the final report.</p>
        <a href="#detection" className="field-stats-link">
          Start identifying <ArrowUpRight size={15} />
        </a>
      </div>
      <div className="field-stats-grid">
        {stats.map(({ value, label, icon: Icon }) => (
          <div className="field-stat" key={label}>
            <Icon size={18} strokeWidth={1.8} />
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
