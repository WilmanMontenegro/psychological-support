interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  textColor?: string
  textAlign?: 'left' | 'center' | 'responsive'
}

export default function Logo({
  size = 'medium',
  textColor = 'text-foreground',
  textAlign = 'left'
}: LogoProps) {
  const sizeClasses = {
    small: {
      image: 'w-12',
      title: 'text-sm font-semibold',
      subtitle: 'text-xs'
    },
    medium: {
      image: 'w-12 md:w-20',
      title: 'text-sm md:text-xl font-semibold',
      subtitle: 'text-xs md:text-sm'
    },
    large: {
      image: 'w-16',
      title: 'text-lg font-semibold',
      subtitle: 'text-sm'
    }
  }

  const getTextAlignClass = () => {
    if (textAlign === 'center') return 'text-center'
    if (textAlign === 'responsive') return 'text-center md:text-left'
    return ''
  }

  return (
    <div className='flex items-center gap-2 md:gap-3 flex-shrink-0'>
      <img
        src="/images/logo.png"
        alt="Logo"
        className={sizeClasses[size].image}
      />
      <div className="min-w-0">
        <h1 className={`${sizeClasses[size].title} font-libre-baskerville leading-tight ${getTextAlignClass()} ${textColor}`}>
          Acompañamiento Psicológico
        </h1>
        <p className={`${sizeClasses[size].subtitle} font-montserrat leading-tight ${getTextAlignClass()} ${textColor}`}>
          Con Ana Marcela Polo Bastidas
        </p>
      </div>
    </div>
  )
}