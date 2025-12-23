import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProfile } from '../../api/profile.api'

export default function CreateProfilePage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [info, setInfo] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    if (file) setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    try {
      setLoading(true)

      const fd = new FormData()
      fd.append('name', name)
      fd.append('bio', bio)
      fd.append('info', info)
      if (imageFile) fd.append('image', imageFile)

      console.log('Creating profile:', [...fd.entries()])

      const created = await createProfile(fd)

      navigate(`/dashboard/profile`)
    } catch (err: any) {
      setMessage(err?.message ?? 'Error creating profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-[var(--bg-form)] p-8 rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-semibold text-[var(--Primarylight)] text-center">
          Create Profile
        </h2>

        <div className="grid gap-4">
          <label>
            <span className="text-sm text-white">Name</span>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full mt-1 p-2 rounded bg-[var(--bg-dark)] text-white border border-[var(--Priamrygreen)]"
            />
          </label>

          <label>
            <span className="text-sm text-white">Bio</span>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              className="w-full mt-1 p-2 rounded bg-[var(--bg-dark)] text-white border border-[var(--Priamrygreen)]"
            />
          </label>

          <label>
            <span className="text-sm text-white">Info</span>
            <input
              value={info}
              onChange={e => setInfo(e.target.value)}
              className="w-full mt-1 p-2 rounded bg-[var(--bg-dark)] text-white border border-[var(--Priamrygreen)]"
            />
          </label>

          <label>
            <span className="text-sm text-white">Image</span>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          {imagePreview && (
            <img
              src={imagePreview}
              className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-[var(--Priamrygreen)]"
            />
          )}
        </div>

        {message && <p className="text-center text-red-400">{message}</p>}

        <button
          disabled={loading}
          className="w-full py-2 rounded bg-[var(--Priamrygreen)] text-black font-semibold"
        >
          {loading ? 'Creating...' : 'Create Profile'}
        </button>
      </form>
    </div>
  )
}
