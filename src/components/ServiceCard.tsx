import { ReactNode } from 'react'

interface ServiceCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-4 bg-secondary rounded-full">
          {icon}
        </div>
        <h3 className="text-xl font-semibold font-montserrat text-accent">
          {title}
        </h3>
        <p className="text-gray-600 font-lato leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}