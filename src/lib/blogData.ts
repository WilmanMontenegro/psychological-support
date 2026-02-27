export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    date: string;
}

export const blogPosts: BlogPost[] = [
    {
        slug: 'la-ansiedad',
        title: 'La ansiedad: Cuándo es normal y cuándo buscar ayuda',
        excerpt: 'Todos hemos sentido ansiedad. Aprende a identificar cuándo es adaptativa y cuándo se vuelve patológica. Entiende este mecanismo de defensa y cómo manejarlo mejor.',
        image: '/images/blog/la-ansiedad.jpg',
        category: 'Salud Mental',
        date: '2026-02-26'
    },
    {
        slug: 'la-ilusion-de-las-redes-sociales',
        title: 'La ilusión de las redes sociales',
        excerpt: 'Las redes sociales son como una ventana abierta donde vemos vidas que parecen perfectas, pero detrás de la pantalla hay una historia que no se muestra. Aprende a usarlas de manera consciente.',
        image: '/images/blog/la-ilusion-de-las-redes-sociales.jpg',
        category: 'Salud Mental',
        date: '2026-02-19'
    },
    {
        slug: 'como-decir-no-sin-sentir-culpa',
        title: 'Cómo decir "NO" sin sentirte culpable',
        excerpt: 'Aprender a decir no de manera adecuada es crucial. Descubre por qué la culpa aparece y cómo fortalecer tus límites sin miedo. Diciendo no te dices sí a ti misma.',
        image: '/images/blog/decir-no.jpeg',
        category: 'Autoestima',
        date: '2026-02-12'
    },
    {
        slug: 'cuido-emocional-postparto',
        title: 'El cuidado emocional en el postparto de una mujer que nadie mira',
        excerpt: 'El postparto es un tema muy complejo del que todos deberíamos hablar. Descubre cómo manejar las emociones, la soledad y el autocuidado mientras nace una nueva madre.',
        image: '/images/blog/post-parto.jpeg',
        category: 'Maternidad',
        date: '2026-01-29'
    },
    {
        slug: 'como-construir-el-amor-propio',
        title: 'Cómo construir el amor propio en nuestra vida cotidiana',
        excerpt: 'El amor propio no es perfección ni sentirse bien siempre; es cómo te hablas, te cuidas, te respetas y pones límites. Aquí te comparto pasos prácticos para acompañarte sin abandonarte.',
        image: '/images/blog/amor-propio.jpeg',
        category: 'Autoestima',
        date: '2026-01-22'
    },
    {
        slug: 'aprendamos-a-identificar-y-manejar-nuestras-emociones',
        title: 'Aprendamos a identificar y sobre todo a manejar nuestras emociones',
        excerpt: 'Cuando pensamos que manejar nuestras emociones significa mantenerlas ocultas, que nadie sepa cómo te sientes, o cuando te haces el fuerte cuando estás triste, eso se llama fingir que no existen. Saber manejar las emociones no se trata de ignorarlas, sino de reconocerlas...',
        image: '/images/blog/portada-emociones.jpg',
        category: 'Bienestar',
        date: '2025-10-17'
    },
    {
        slug: 'cuando-ir-al-psicologo',
        title: '¿Cuándo ir al psicólogo? Rompiendo mitos',
        excerpt: 'El error más grande es pensar que ir al psicólogo es solo para "los locos" o cuando ya no puedes más. Descubre por qué el acompañamiento psicológico es un acto de cuidado y amor propio.',
        image: '/images/blog/acompanamiento-psicologico.jpeg',
        category: 'Salud Mental',
        date: '2026-02-05'
    }
];
