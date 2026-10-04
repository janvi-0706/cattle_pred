import { useState, useRef, useCallback } from 'react'
import {
  Upload, X, ScanLine, CheckCircle2, AlertCircle, Download,
  Droplets, BarChart3, Loader2, MapPin, Layers, ChevronRight,
  Calculator, ChevronDown
} from 'lucide-react'
import { cattleBreeds, buffaloBreeds } from '../data/breedData'
import { downloadBreedSummary, downloadMilkSummary } from '../utils/downloadUtils'

const allBreedsByType = {
  Cattle: cattleBreeds,
  Buffalo: buffaloBreeds,
}

// ─── Milk Output Card ─────────────────────────────────────────────────────────
function MilkOutputCard({ milkYield, breed, source, onClear }) {
  const milkOutputRef = useRef(null)

  return (
    <div
      ref={milkOutputRef}
      className="mt-8 rounded-2xl overflow-hidden shadow-sm"
      style={{ border: '1px solid #d8cdb5' }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between flex-wrap gap-3"
        style={{ backgroundColor: '#4b4336' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(74,222,128,0.2)' }}>
            <Droplets className="w-5 h-5" style={{ color: '#c49b36' }} />
          </div>
          <div>
            <h3 className="text-white font-bold text-xl">Predicted Milk Yield</h3>
            <p className="text-sm mt-1" style={{ color: '#a18b5b' }}>
              {breed.name} {breed.type} · Source: {source} · ML model output
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadMilkSummary(breed, milkYield, source)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: 'rgba(74,222,128,0.15)', color: '#c49b36', border: '1px solid rgba(74,222,128,0.3)' }}
          >
            <Download className="w-3.5 h-3.5" />
            Download Summary
          </button>
          <button
            onClick={onClear}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: '#a18b5b' }}
            title="Clear output"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6 bg-white">
        <div className="p-6 rounded-xl text-center" style={{ backgroundColor: '#f3efe4', border: '1px solid #d8cdb5' }}>
          <p className="text-4xl font-bold" style={{ color: '#6f5727' }}>{milkYield.toFixed(2)} L/day</p>
          <p className="text-sm text-gray-500 mt-2">Predicted Milk Yield</p>
          <p className="text-sm text-gray-500 mt-4">
            This result is the only prediction produced by the uploaded milk-yield model.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function DetectionSection() {
  // Input 1 — Image detection
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [breedResult, setBreedResult] = useState(null)
  const [imageError, setImageError] = useState('')
  const fileInputRef = useRef(null)

  // Input 2 — Manual form
  const [form, setForm] = useState({
    animalType: 'Cattle',
    breed: '',
    Age_Months: '',
    Weight_kg: '',
    Parity: '',
    Lactation_Stage: 'Mid',
    Days_in_Milk: '',
    Feed_Type: 'Green_Fodder',
    Feed_Quantity_kg: '',
    Water_Intake_L: '',
    Grazing_Duration_hrs: 4,
    Rumination_Time_hrs: 8,
    Resting_Hours: 10,
    Ambient_Temperature_C: 28,
    Humidity_percent: 65,
    Season: 'Summer',
    Housing_Score: 8,
    Previous_Week_Avg_Yield: 10,
    Body_Condition_Score: '',
    Milking_Interval_hrs: 12,
  })
  const [formError, setFormError] = useState('')

  // Shared milk output
  const [milkOutput, setMilkOutput] = useState(null)
  const milkOutputRef = useRef(null)

  // ── Image upload handlers ──
  const handleFile = (file) => {
    if (!file) {
      setImageError('No image selected.')
      return
    }
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setImageError('Invalid file type. Only JPG, JPEG, PNG, or WEBP images are accepted.')
      return
    }
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setBreedResult(null)
    setMilkOutput(null)
    setImageError('')
  }

  const onFileChange = (e) => handleFile(e.target.files[0])
  const onDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [])
  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = () => setIsDragging(false)

  const clearImage = () => {
    setImage(null)
    setPreview(null)
    setBreedResult(null)
    setMilkOutput(null)
    setImageError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const analyzeBreed = async () => {
    if (!image) {
      setImageError('No image selected for analysis.')
      return
    }
    setIsAnalyzing(true)
    setBreedResult(null)
    setMilkOutput(null)
    setImageError('')
    
    try {
      const formData = new FormData()
      formData.append('file', image)

      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        if (data.is_cattle === false) {
          setBreedResult({ isCattle: false, message: data.message })
          return
        }
        throw new Error(data.message || data.detail || 'Prediction failed unexpectedly')
      }

      // Map backend response breed name to frontend breed data
      const matchedBreed = [...cattleBreeds, ...buffaloBreeds].find(
        (b) => b.name.toLowerCase() === data.breed.toLowerCase()
      )

      if (matchedBreed) {
        setBreedResult({
          breed: matchedBreed,
          confidence: data.confidence_percent,
        })
      } else {
        setBreedResult({
          breed: {
            name: data.breed,
            type: data.breed.toLowerCase().includes('buffalo') ? 'Buffalo' : 'Cattle',
            emoji: data.breed.toLowerCase().includes('buffalo') ? '🐃' : '🐄',
            origin: 'Unknown',
            description: 'Breed details not available in local database.'
          },
          confidence: data.confidence_percent,
        })
      }
    } catch (error) {
      console.error('Error analyzing breed:', error)
      setImageError(
        error.message === 'Failed to fetch' 
          ? 'Backend is unavailable. Please ensure the server is running on http://127.0.0.1:8000.' 
          : `Analysis failed: ${error.message}`
      )
    } finally {
      setIsAnalyzing(false)
    }
  }

  const fetchMilkFromBreed = () => {
    if (!breedResult) return
    setForm((prev) => ({
      ...prev,
      breed: breedResult.breed.name,
      animalType: breedResult.breed.type,
    }))
    document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // ── Manual form handlers ──
  const formBreeds = allBreedsByType[form.animalType] || []

  const handleFormChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value }
      if (field === 'animalType') updated.breed = ''
      return updated
    })
    setFormError('')
  }

  const submitForm = () => {
    if (!form.breed) { setFormError('Please select a breed.'); return }
    const breed = [...cattleBreeds, ...buffaloBreeds].find((b) => b.name === form.breed)
    if (!breed) { setFormError('Breed not found.'); return }

    const requiredFields = [
      'Age_Months', 'Weight_kg', 'Parity', 'Days_in_Milk',
      'Feed_Quantity_kg', 'Water_Intake_L', 'Body_Condition_Score',
    ]
    if (requiredFields.some((field) => form[field] === '' || !Number.isFinite(Number(form[field])))) {
      setFormError('Please enter valid values for all milk-analysis fields.')
      return
    }

    setFormError('')
    setMilkOutput(null)
    fetch('http://127.0.0.1:8000/api/milk-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          Breed: breed.name,
          Age_Months: Number(form.Age_Months),
          Weight_kg: Number(form.Weight_kg),
          Parity: Number(form.Parity),
          Lactation_Stage: form.Lactation_Stage,
          Days_in_Milk: Number(form.Days_in_Milk),
          Feed_Type: form.Feed_Type,
          Feed_Quantity_kg: Number(form.Feed_Quantity_kg),
          Water_Intake_L: Number(form.Water_Intake_L),
          Grazing_Duration_hrs: Number(form.Grazing_Duration_hrs),
          Rumination_Time_hrs: Number(form.Rumination_Time_hrs),
          Resting_Hours: Number(form.Resting_Hours),
          Ambient_Temperature_C: Number(form.Ambient_Temperature_C),
          Humidity_percent: Number(form.Humidity_percent),
          Season: form.Season,
          Housing_Score: Number(form.Housing_Score),
          Previous_Week_Avg_Yield: Number(form.Previous_Week_Avg_Yield),
          Body_Condition_Score: Number(form.Body_Condition_Score),
          Milking_Interval_hrs: Number(form.Milking_Interval_hrs),
        },
      ),
    })
      .then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(data.detail || 'Milk prediction failed.')
        return data
      })
      .then((data) => {
        setMilkOutput({ milkYield: data.milk_yield_l, breed, source: 'Milk yield model' })
        setTimeout(() => milkOutputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      })
      .catch((error) => setFormError(`Milk analysis failed: ${error.message}`))
  }

  const clearMilkOutput = () => setMilkOutput(null)

  return (
    <section id="detection" className="px-10 md:px-16 py-16" style={{ backgroundColor: '#f8f5ec', borderTop: '1px solid #ded8c8' }}>
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="mb-10">
          <span
            className="inline-block text-sm font-semibold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full"
            style={{ backgroundColor: '#eee7d7', color: '#6f5727' }}
          >
            Detection &amp; Analysis
          </span>
          <h2 className="text-4xl font-bold" style={{ color: '#4b4336' }}>Breed Detection &amp; Milk Analysis</h2>
          <p className="text-gray-500 mt-3 text-lg max-w-2xl">
            Upload an animal image for AI-based breed identification, or enter parameters manually to estimate milk production and quality.
          </p>
        </div>

        {/* ── INPUT 1: Image upload ─────────────────────────────────────── */}
        <div
          id="detection-input1"
          className="bg-white rounded-2xl p-6 shadow-sm mb-0"
          style={{ border: '1px solid #ded8c8' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#6f5727' }}>1</div>
            <h3 className="font-semibold text-xl" style={{ color: '#4b4336' }}>Image-Based Breed Detection</h3>
          </div>

          {/* Drop zone */}
          {!preview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className="relative rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center justify-center py-14 px-6 text-center"
              style={{
                border: `2px dashed ${isDragging ? '#8c7135' : '#d8cdb5'}`,
                backgroundColor: isDragging ? '#f3efe4' : '#fafafa',
              }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: '#eee7d7' }}>
                <Upload className="w-7 h-7" style={{ color: '#166634' }} />
              </div>
              <p className="font-semibold text-base" style={{ color: '#6f5727' }}>
                {isDragging ? 'Drop image here' : 'Click to upload or drag & drop'}
              </p>
              <p className="text-sm text-gray-400 mt-2">Supported formats: JPG, JPEG, PNG, WEBP</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={onFileChange}
              />
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #ded8c8' }}>
              <div className="relative">
                <img
                  src={preview}
                  alt="Uploaded animal"
                  className="w-full max-h-72 object-contain bg-gray-50"
                />
                <button
                  onClick={clearImage}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors"
                  style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff' }}
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: '#f3efe4' }}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#8c7135' }} />
                <span className="text-xs text-gray-600 truncate">{image?.name}</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 mt-4">
            {preview && (
              <button
                onClick={clearImage}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: '#eee9dd', color: '#374151', border: '1px solid #ded8c8' }}
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
            <button
              onClick={analyzeBreed}
              disabled={!image || isAnalyzing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: image && !isAnalyzing ? '#6f5727' : '#9ca3af', color: '#ffffff' }}
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
              {isAnalyzing ? 'Detecting breed…' : 'Analyze Breed'}
            </button>
          </div>

          {/* Error Message */}
          {imageError && (
            <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
              style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {imageError}
            </div>
          )}

          {/* ── Result card ── */}
          {isAnalyzing && (
            <div className="mt-5 rounded-xl p-5 flex items-center gap-4" style={{ backgroundColor: '#f3efe4', border: '1px solid #d8cdb5' }}>
              <Loader2 className="w-6 h-6 animate-spin flex-shrink-0" style={{ color: '#8c7135' }} />
              <div>
                <p className="font-medium text-base" style={{ color: '#6f5727' }}>Processing image…</p>
                <p className="text-sm text-gray-500 mt-1">Extracting visual features and running breed classification model</p>
              </div>
            </div>
          )}

          {breedResult && !isAnalyzing && breedResult.isCattle === false && (
            <div className="mt-5 rounded-xl p-6 text-center" style={{ border: '1px solid #d8cdb5', backgroundColor: '#f3efe4' }}>
               <AlertCircle className="w-10 h-10 mx-auto mb-3" style={{ color: '#6f5727' }} />
               <h3 className="font-bold text-xl mb-2" style={{ color: '#4b4336' }}>No cattle detected</h3>
               <p className="text-base" style={{ color: '#6f5727' }}>{breedResult.message || 'Please upload a clear image of a cow/cattle for breed identification.'}</p>
            </div>
          )}

          {breedResult && !isAnalyzing && breedResult.isCattle !== false && (
            <div className="mt-5 rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid #d8cdb5' }}>
              <div className="px-5 py-4 flex items-center gap-3 flex-wrap" style={{ backgroundColor: '#4b4336' }}>
                <span className="text-3xl">{breedResult.breed.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-2xl leading-tight">{breedResult.breed.name}</p>
                  <p className="text-base" style={{ color: '#a18b5b' }}>{breedResult.breed.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-base font-bold"
                    style={{ backgroundColor: 'rgba(74,222,128,0.2)', color: '#c49b36' }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {breedResult.confidence}% confidence
                  </div>
                </div>
              </div>
              <div className="bg-white p-5">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Layers className="w-4 h-4 flex-shrink-0" style={{ color: '#8c7135' }} />
                    <span className="text-gray-500 text-base">Animal:</span>
                    <span className="font-medium text-gray-800 text-base">{breedResult.breed.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: '#8c7135' }} />
                    <span className="text-gray-500 text-base">Origin:</span>
                    <span className="font-medium text-gray-800 text-base">{breedResult.breed.origin}</span>
                  </div>
                </div>
                <p className="text-base text-gray-600 mb-5 leading-relaxed">{breedResult.breed.description}</p>
                <div className="flex flex-wrap gap-3 pt-4" style={{ borderTop: '1px solid #eee9dd' }}>
                  <button
                    onClick={fetchMilkFromBreed}
                    className="flex items-center gap-2 px-5 py-3 rounded-lg text-base font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: '#6f5727', color: '#ffffff' }}
                  >
                    <Droplets className="w-4 h-4" />
                    Check Milk Production &amp; Quality
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => downloadBreedSummary(breedResult.breed, breedResult.confidence)}
                    className="flex items-center gap-2 px-5 py-3 rounded-lg text-base font-medium transition-colors"
                    style={{ backgroundColor: '#f3efe4', color: '#6f5727', border: '1px solid #d8cdb5' }}
                  >
                    <Download className="w-4 h-4" />
                    Download Breed Summary
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Divider ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px" style={{ backgroundColor: '#eee7d7' }} />
          <span
            className="text-sm font-semibold px-4 py-1.5 rounded-full"
            style={{ backgroundColor: '#eee7d7', color: '#6f5727', border: '1px solid #d8cdb5' }}
          >
            OR
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: '#eee7d7' }} />
        </div>

        {/* ── INPUT 2: Manual form ────────────────────────────────────────── */}
        <div
          id="analysis"
          className="bg-white rounded-2xl p-6 shadow-sm"
          style={{ border: '1px solid #ded8c8' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: '#6f5727' }}>2</div>
            <h3 className="font-semibold text-xl" style={{ color: '#4b4336' }}>Manual Milk Production Parameters</h3>
          </div>
          <p className="text-base text-gray-500 mb-6">
          Enter the core animal and milking details. Secondary environment and activity fields use editable defaults when you do not have measurements.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Animal type */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>Animal Type *</label>
              <div className="flex gap-3">
                {['Cattle', 'Buffalo'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFormChange('animalType', type)}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all border"
                    style={{
                      backgroundColor: form.animalType === type ? '#6f5727' : '#ffffff',
                      color: form.animalType === type ? '#ffffff' : '#374151',
                      borderColor: form.animalType === type ? '#6f5727' : '#ded8c8',
                    }}
                  >
                    {type === 'Cattle' ? '🐄' : '🐃'} {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Breed */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>Breed *</label>
              <div className="relative">
                <select
                  value={form.breed}
                  onChange={(e) => handleFormChange('breed', e.target.value)}
                  className="w-full appearance-none border rounded-lg px-4 py-3 text-base pr-10 focus:outline-none focus:ring-2 bg-white"
                  style={{ borderColor: '#ded8c8', color: form.breed ? '#111827' : '#9ca3af' }}
                >
                  <option value="">Select breed…</option>
                  {formBreeds.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>Age (months) *</label>
              <input
                type="number"
                min={0}
                value={form.Age_Months}
                onChange={(e) => handleFormChange('Age_Months', e.target.value)}
                placeholder="e.g. 48"
                className="w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2"
                style={{ borderColor: '#ded8c8' }}
              />
            </div>

            {/* Parity */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>Parity *</label>
              <input
                type="number"
                min={0}
                value={form.Parity}
                onChange={(e) => handleFormChange('Parity', e.target.value)}
                placeholder="e.g. 3"
                className="w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2"
                style={{ borderColor: '#ded8c8' }}
              />
            </div>

            {/* Body weight */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>Body Weight (kg)</label>
              <input
                type="number"
                min={100} max={900}
                value={form.Weight_kg}
                onChange={(e) => handleFormChange('Weight_kg', e.target.value)}
                placeholder="e.g. 450"
                className="w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2"
                style={{ borderColor: '#ded8c8' }}
              />
            </div>

            {/* Lactation stage */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>Lactation Stage *</label>
              <div className="relative">
                <select
                  value={form.Lactation_Stage}
                  onChange={(e) => handleFormChange('Lactation_Stage', e.target.value)}
                  className="w-full appearance-none border rounded-lg px-4 py-3 text-base pr-10 focus:outline-none focus:ring-2 bg-white"
                  style={{ borderColor: '#ded8c8', color: form.Lactation_Stage ? '#111827' : '#9ca3af' }}
                >
                  <option value="Early">Early</option>
                  <option value="Mid">Mid</option>
                  <option value="Late">Late</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {[
              ['Days_in_Milk', 'Days in Milk *', 'e.g. 120'],
              ['Feed_Quantity_kg', 'Feed Quantity (kg) *', 'e.g. 15'],
              ['Water_Intake_L', 'Water Intake (L) *', 'e.g. 50'],
              ['Grazing_Duration_hrs', 'Grazing Duration (hours)', 'Default: 4'],
              ['Rumination_Time_hrs', 'Rumination Time (hours)', 'Default: 8'],
              ['Resting_Hours', 'Resting Hours', 'Default: 10'],
              ['Ambient_Temperature_C', 'Ambient Temperature (°C)', 'Default: 28'],
              ['Humidity_percent', 'Humidity (%)', 'Default: 65'],
              ['Housing_Score', 'Housing Score (0–10)', 'Default: 8'],
              ['Previous_Week_Avg_Yield', 'Previous Week Avg. Yield (L)', 'Default: 10'],
              ['Body_Condition_Score', 'Body Condition Score (1–5) *', 'e.g. 3'],
              ['Milking_Interval_hrs', 'Milking Interval (hours)', 'Default: 12'],
            ].map(([field, label, placeholder]) => (
              <div key={field}>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>{label} *</label>
                <input
                  type="number"
                  value={form[field]}
                  onChange={(e) => handleFormChange(field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2"
                  style={{ borderColor: '#ded8c8' }}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>Feed Type *</label>
              <select
                value={form.Feed_Type}
                onChange={(e) => handleFormChange('Feed_Type', e.target.value)}
                className="w-full border rounded-lg px-4 py-3 text-base bg-white"
                style={{ borderColor: '#ded8c8' }}
              >
                {['Concentrates', 'Crop_Residues', 'Dry_Fodder', 'Green_Fodder', 'Hay', 'Mixed_Feed', 'Pasture_Grass', 'Silage'].map((value) => (
                  <option key={value} value={value}>{value.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#374151' }}>Season *</label>
              <select
                value={form.Season}
                onChange={(e) => handleFormChange('Season', e.target.value)}
                className="w-full border rounded-lg px-4 py-3 text-base bg-white"
                style={{ borderColor: '#ded8c8' }}
              >
                {['Autumn', 'Monsoon', 'Spring', 'Summer', 'Winter'].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Error */}
          {formError && (
            <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
              style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {formError}
            </div>
          )}

          <button
            onClick={submitForm}
            className="mt-6 flex items-center gap-2 px-7 py-3.5 rounded-lg text-base font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: '#6f5727', color: '#ffffff' }}
          >
            <Calculator className="w-4 h-4" />
            Predict Milk Yield
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>

        {/* ── Milk Output ─────────────────────────────────────────────────── */}
        <div ref={milkOutputRef}>
          {milkOutput && (
            <MilkOutputCard
              milkYield={milkOutput.milkYield}
              breed={milkOutput.breed}
              source={milkOutput.source}
              onClear={clearMilkOutput}
            />
          )}
        </div>
      </div>
    </section>
  )
}
