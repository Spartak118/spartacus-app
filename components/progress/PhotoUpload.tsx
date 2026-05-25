'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Camera, Image, Trash2 } from 'lucide-react'

export function PhotoUpload() {
  const [photos, setPhotos] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPhotos(prev => [ev.target?.result as string, ...prev])
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  function removePhoto(index: number) {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={() => fileRef.current?.click()}
        className="w-full py-8 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center gap-3 active:scale-98 transition-transform"
      >
        {isUploading ? (
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Camera size={28} className="text-[#888]" />
            <span className="text-[#888] text-sm font-medium">Upload Progress Photo</span>
            <span className="text-[#555] text-xs">Tap to add from camera or gallery</span>
          </>
        )}
      </button>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden"
            >
              <img src={photo} alt={`Progress ${i + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center active:scale-90 transition-transform"
              >
                <Trash2 size={14} className="text-[#ff4444]" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black/60 rounded-lg px-2 py-0.5">
                <span className="text-[10px] text-[#888]">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <div className="text-center py-4">
          <Image size={32} className="text-[#333] mx-auto mb-2" />
          <p className="text-[#555] text-xs">Your progress photos will appear here</p>
        </div>
      )}
    </div>
  )
}
