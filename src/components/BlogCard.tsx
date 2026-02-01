import Image from 'next/image';
import Link from 'next/link';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
}

export default function BlogCard({ slug, title, excerpt, image, category, date }: BlogCardProps) {
  const formatDateParts = (dateStr: string) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const [year, month, day] = dateStr.split('-');
    return { day, month: months[parseInt(month) - 1], year };
  };

  const { day, month, year } = formatDateParts(date);

  return (
    <Link href={`/blog/${slug}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border-2 border-secondary h-full flex flex-col">
        {/* Imagen */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            priority={false}
          />
          {/* Categoría */}
          <div className="absolute top-4 left-4">
            <span className="px-4 py-1 text-white text-sm font-medium rounded-full" style={{ backgroundColor: 'var(--color-secondary)' }}>
              {category}
            </span>
          </div>
          {/* Fecha */}
          <div className="absolute top-4 right-4 bg-white rounded-xl shadow-md flex flex-col items-center justify-center p-2 min-w-[70px] aspect-square border border-gray-100">
            <div className="text-3xl font-bold text-accent leading-none mb-0.5">{day}</div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide leading-tight">
              {month} - {year}
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold text-accent mb-3 font-libre-baskerville">
            {title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
            {excerpt}
          </p>
          <div className="text-secondary font-medium text-sm hover:underline">
            Leer más →
          </div>
        </div>
      </div>
    </Link>
  );
}
