// src/components/Topbar.tsx
import { useEffect, useState } from 'react'
import { IoLanguage, IoMenu } from 'react-icons/io5'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getCurrentUser, type CurrentUserPayload } from '../../api/user.api'

type Props = {
  collapsed: boolean
  onToggle: () => void
}

const Topbar = ({ onToggle }: Props) => {
  const { t, i18n } = useTranslation()

  // local state for user (show immediately from localStorage if present)
  const [user, setUser] = useState<CurrentUserPayload | null>(() => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? (JSON.parse(raw) as CurrentUserPayload) : null
    } catch {
      return null
    }
  })

  // try to refresh the user from API on mount (and cache result)
  useEffect(() => {
    let mounted = true
    async function refresh() {
      try {
        const u = await getCurrentUser()
        if (!mounted) return
        setUser(u)
        try {
          localStorage.setItem('user', JSON.stringify(u))
        } catch {
          /* ignore storage errors */
        }
      } catch {
        // ignore errors here (user may not be logged in)
      }
    }
    refresh()
    return () => {
      mounted = false
    }
  }, [])

  const userName = user?.name || t('user_default')

  // build safe absolute image URL or fallback
const apiHost = (import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000').replace(/\/api\/?$/, '')
const profileImage =
  user?.profile?.image && user.profile.image.length > 0
    ? `${apiHost}/storage/${user.profile.image.replace(/^\//, '')}`  // <- ملاحظة: أضفنا /storage
    : '/assets/images/user.webp'

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-20 z-20 flex items-center justify-between px-6 text-white border-b border-gray-500/30 bg-transparent backdrop-blur-sm">
      {/* left: menu + title */}
      <div className="flex items-center gap-4">
        <button onClick={onToggle} aria-label="Toggle sidebar" className="p-2 rounded-md hover:bg-white/10 transition">
          <IoMenu size={22} />
        </button>
        <span className="font-bold text-lg">{t('dashboard')}</span>
      </div>

      {/* right: language + name + avatar */}
      <div className="flex items-center gap-4">
        <button onClick={toggleLanguage} className="p-2 rounded-md hover:bg-white/10 transition">
          <IoLanguage size={20} />
        </button>

        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold opacity-90">{userName}</span>

          <Link to="/dashboard/profile">
            <img
              src={profileImage}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover cursor-pointer border-2 border-[var(--Priamrygreen)]"
            />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Topbar
