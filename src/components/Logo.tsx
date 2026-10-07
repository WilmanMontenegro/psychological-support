import Image from 'next/image'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  textColor?: string
  textAlign?: 'left' | 'center' | 'responsive'
  singleLineName?: boolean
  /** Versión clara para fondos oscuros (footer accent) */
  onDark?: boolean
}

export default function Logo({
  size = 'medium',
  textColor = 'text-foreground',
  textAlign = 'left',
  singleLineName = false,
  onDark = false,
}: LogoProps) {
  const sizeClasses = {
    small: {
      image: 'w-12',
      title: 'text-sm font-semibold',
      subtitle: 'text-xs'
    },
    medium: {
      image: 'w-12 md:w-16',
      title: 'text-sm md:text-base font-semibold',
      subtitle: 'text-xs'
    },
    large: {
      image: 'w-20',
      title: 'text-sm lg:text-base font-semibold',
      subtitle: 'text-xs lg:text-sm'
    }
  }

  const getTextAlignClass = () => {
    if (textAlign === 'center') return 'text-center'
    if (textAlign === 'responsive') return 'text-center md:text-left'
    return ''
  }

  return (
    <div className='flex items-center gap-1 md:gap-1.5 flex-shrink-0'>
      <Image
        src={onDark ? '/images/logo-on-dark.png' : '/images/logo.png'}
        alt="Tu Psico Ana"
        width={200}
        height={200}
        className={`${sizeClasses[size].image} h-auto shrink-0`}
        sizes="(max-width: 768px) 48px, 64px"
        priority
      />
      <div className={singleLineName ? 'shrink-0' : 'min-w-0'}>
        <h1
          className={`${sizeClasses[size].title} font-libre-baskerville leading-tight ${getTextAlignClass()} ${textColor} ${singleLineName ? 'whitespace-nowrap' : ''}`}
        >
          Ana Marcela Polo Bastidas
        </h1>
        <p className={`${sizeClasses[size].subtitle} font-montserrat leading-tight ${getTextAlignClass()} ${textColor}`}>
          Psicóloga en formación
        </p>
      </div>
    </div>
  )
}