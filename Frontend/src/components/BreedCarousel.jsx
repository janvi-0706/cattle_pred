import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Droplets, MapPin, Pause, Play } from 'lucide-react'
import { allBreeds } from '../data/breedData'

const breedBg = {
  Cattle: 'linear-gradient(135deg, #4b4336 0%, #6f5727 100%)',
  Buffalo: 'linear-gradient(135deg, #211e1a 0%, #332d25 100%)',
}

function getVisibleCount() {
  if (typeof window === 'undefined') return 3
  if (window.innerWidth < 640) return 1
  if (window.innerWidth < 1024) return 2
  return 3
}

export default function BreedCarousel() {
  const [index, setIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(getVisibleCount)
  const [isPlaying, setIsPlaying] = useState(true)
  const [slideDistance, setSlideDistance] = useState(0)
  const viewportRef = useRef(null)
  const maxIndex = Math.max(0, allBreeds.length - visibleCount)

  useEffect(() => {
    const onResize = () => setVisibleCount(getVisibleCount())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    setIndex((current) => Math.min(current, maxIndex))
  }, [maxIndex])

  useEffect(() => {
    const measureSlide = () => {
      const cards = viewportRef.current?.querySelectorAll('.breed-carousel-card')
      if (cards?.length > 1) {
        setSlideDistance(cards[1].offsetLeft - cards[0].offsetLeft)
      }
    }
    measureSlide()
    window.addEventListener('resize', measureSlide)
    return () => window.removeEventListener('resize', measureSlide)
  }, [visibleCount])

  useEffect(() => {
    if (!isPlaying) return undefined
    const timer = window.setInterval(() => {
      setIndex((current) => (current >= maxIndex ? 0 : current + 1))
    }, 4200)
    return () => window.clearInterval(timer)
  }, [isPlaying, maxIndex])

  const move = (direction) => {
    setIndex((current) => {
      if (direction === 'next') return current >= maxIndex ? 0 : current + 1
      return current <= 0 ? maxIndex : current - 1
    })
  }

  return (
    <div className="breed-carousel" aria-label="Supported Indian livestock breeds">
      <div className="breed-carousel-toolbar">
        <p><strong>{index + 1}–{Math.min(index + visibleCount, allBreeds.length)}</strong> of {allBreeds.length} breeds</p>
        <div className="breed-carousel-actions">
          <button onClick={() => setIsPlaying((playing) => !playing)} aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}>
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button onClick={() => move('previous')} aria-label="Previous breeds"><ChevronLeft size={18} /></button>
          <button onClick={() => move('next')} aria-label="Next breeds"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="breed-carousel-viewport" ref={viewportRef}>
        <div
          className="breed-carousel-track"
          style={{ transform: `translateX(-${index * slideDistance}px)` }}
        >
          {allBreeds.map((breed) => (
            <article className="breed-carousel-card" key={breed.id}>
              <div className="breed-card-visual" style={{ background: breedBg[breed.type] }}>
                <span className="breed-card-emoji">{breed.emoji}</span>
                <span className="breed-card-type">{breed.type}</span>
                <span className="breed-card-confidence">AI Confidence: 88–96%</span>
              </div>
              <div className="breed-card-content">
                <h4>{breed.name}</h4>
                <p className="breed-card-origin"><MapPin size={14} /> {breed.origin}</p>
                <p className="breed-card-description">{breed.description}</p>
                <div className="breed-card-metrics">
                  <span><Droplets size={14} /><strong>{breed.milk.toLocaleString()} L</strong><small>per lactation</small></span>
                  <span><strong>{breed.fat}%</strong><small>Fat</small></span>
                  <span><strong>{breed.snf}%</strong><small>SNF</small></span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="breed-carousel-dots" aria-label="Choose breed carousel position">
        {Array.from({ length: maxIndex + 1 }, (_, dot) => (
          <button
            key={dot}
            className={dot === index ? 'is-active' : ''}
            onClick={() => setIndex(dot)}
            aria-label={`Show breeds ${dot + 1} to ${Math.min(dot + visibleCount, allBreeds.length)}`}
          />
        ))}
      </div>
    </div>
  )
}
