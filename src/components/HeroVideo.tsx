"use client"

import Link from "next/link"
import { useEffect, useLayoutEffect, useRef, type RefObject } from "react"

const QUOTE =
  "La curiosa paradoja es que cuando me acepto tal como soy, entonces puedo cambiar."
const AUTHOR = "Carl R. Rogers"
const SOURCE = "El proceso de convertirse en persona (1961)"

const POSTER = "/videos/hero-bienestar-poster.jpg"
const SRC_MOBILE = "/videos/hero-bienestar-720.mp4"
const SRC_DESKTOP = "/videos/hero-bienestar-1080.mp4"

function useHeroViewportHeight(sectionRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const applyHeight = () => {
      const header = document.querySelector<HTMLElement>("[data-site-header]")
      const bottomNav = document.querySelector<HTMLElement>("[data-mobile-nav]")
      const headerH = header?.getBoundingClientRect().height ?? 112
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches
      const bottomH =
        !isDesktop && bottomNav
          ? bottomNav.getBoundingClientRect().height
          : 0
      const available = Math.round(window.innerHeight - headerH - bottomH)
      section.style.height = `${Math.max(available, 280)}px`
    }

    applyHeight()
    window.addEventListener("resize", applyHeight)
    window.visualViewport?.addEventListener("resize", applyHeight)

    const header = document.querySelector("[data-site-header]")
    const ro = header ? new ResizeObserver(applyHeight) : null
    if (header && ro) ro.observe(header)

    return () => {
      window.removeEventListener("resize", applyHeight)
      window.visualViewport?.removeEventListener("resize", applyHeight)
      ro?.disconnect()
    }
  }, [sectionRef])
}

export default function HeroVideo() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useHeroViewportHeight(sectionRef)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let alive = true

    video.muted = true
    video.defaultMuted = true
    video.setAttribute("muted", "")
    video.playsInline = true
    video.loop = true

    const tryPlay = async () => {
      if (!alive || document.visibilityState !== "visible") return
      try {
        video.muted = true
        await video.play()
      } catch {
        // Autoplay bloqueado: el poster nativo del <video> queda visible
      }
    }

    const onVis = () => {
      if (document.visibilityState === "visible") void tryPlay()
    }
    const onCanPlay = () => void tryPlay()

    video.addEventListener("canplay", onCanPlay)
    document.addEventListener("visibilitychange", onVis)

    void tryPlay()

    return () => {
      alive = false
      video.removeEventListener("canplay", onCanPlay)
      document.removeEventListener("visibilitychange", onVis)
      video.pause()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[280px] overflow-hidden h-[calc(100dvh-5.5rem-4rem)] lg:h-[calc(100dvh-5.5rem)]"
      aria-label="Reflexión"
    >
      <video
        ref={videoRef}
        poster={POSTER}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={SRC_DESKTOP} media="(min-width: 768px)" type="video/mp4" />
        <source src={SRC_MOBILE} type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-black/10"
        aria-hidden="true"
      />

      <div className="absolute inset-0 flex items-center justify-center px-5 sm:px-8 md:px-12">
        <div className="max-w-3xl w-full text-center text-white">
          <figure>
            <blockquote>
              <p className="font-libre-baskerville text-xl sm:text-2xl md:text-3xl lg:text-[2.15rem] leading-snug md:leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                “{QUOTE}”
              </p>
            </blockquote>
            <figcaption className="mt-5 sm:mt-6 font-montserrat">
              <cite className="not-italic text-sm sm:text-base font-semibold tracking-wide">
                — {AUTHOR}
              </cite>
              <p className="mt-1 text-xs sm:text-sm text-white/90">{SOURCE}</p>
            </figcaption>
          </figure>

          <div className="mt-7 sm:mt-8">
            <Link
              href="/sobre-mi"
              className="inline-block rounded-lg bg-accent-dark px-6 py-2.5 font-montserrat text-base font-semibold text-white shadow-md transition duration-300 hover:opacity-90 hover:shadow-lg focus:outline-none"
            >
              Conóceme
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
