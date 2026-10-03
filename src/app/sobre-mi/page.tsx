import AboutMe from '@/components/AboutMe'
import WhyChooseMe from '@/components/WhyChooseMe'
import PhotoGallery from '@/components/PhotoGallery'

const galleryPhotos = [
  {
    src: "/images/gallery/ana_2.png",
    alt: "Ana Marcela Polo Bastidas"
  },
  {
    src: "/images/gallery/ana-marcela.webp",
    alt: "Ana Marcela Polo Bastidas"
  },
  {
    src: "/images/gallery/marcela4-Photoroom.png",
    alt: "Ana Marcela Polo Bastidas"
  },
  {
    src: "/images/gallery/ana-marcela-libros-cerebro.jpg",
    alt: "Ana Marcela con libros de psicología y modelo de cerebro"
  },
]

export default function SobreMiPage() {
  return (
    <>
      <AboutMe showButton={false} bgColor="bg-pastel-light" />
      <WhyChooseMe />
      <PhotoGallery photos={galleryPhotos} />
    </>
  )
}