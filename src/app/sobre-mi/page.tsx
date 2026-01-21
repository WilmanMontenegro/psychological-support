import AboutMe from '@/components/AboutMe'
import WhyChooseMe from '@/components/WhyChooseMe'
import PhotoGallery from '@/components/PhotoGallery'

const galleryPhotos = [
  {
    src: "/images/gallery/ana_2.png",
    alt: "Ana Marcela Polo Bastidas"
  },
  {
    src: "/images/gallery/marcela2.jpg",
    alt: "Ana Marcela Polo Bastidas"
  },
  {
    src: "/images/gallery/marcela4-Photoroom.png",
    alt: "Ana Marcela Polo Bastidas"
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