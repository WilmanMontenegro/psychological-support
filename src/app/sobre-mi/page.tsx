import AboutMe from '@/components/AboutMe'
import WhyChooseMe from '@/components/WhyChooseMe'
import PhotoGallery from '@/components/PhotoGallery'

const galleryPhotos = [
  {
    src: "/images/marcela1.jpg",
    alt: "Ana Marcela Polo Bastidas"
  },
  {
    src: "/images/marcela2.jpg",
    alt: "Ana Marcela Polo Bastidas"
  },
  {
    src: "/images/marcela3.jpg",
    alt: "Ana Marcela Polo Bastidas"
  },
  {
    src: "/images/marcela4.jpg",
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