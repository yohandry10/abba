"use client"

export function MissionVision() {
  const pillars = [
    {
      title: "Misión",
      description:
        "En Abba Cambios facilitamos el intercambio de divisas con las mejores tasas del mercado, brindando un servicio rápido, seguro y confiable que supere las expectativas de nuestros clientes.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
      gradient: "from-primary to-accent",
    },
    {
      title: "Visión",
      description:
        "Ser la casa de cambio líder en la región, reconocida por nuestra excelencia en el servicio, innovación tecnológica y compromiso inquebrantable con la satisfacción del cliente.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      gradient: "from-accent to-primary",
    },
    {
      title: "Política",
      description:
        "En Abba Cambios operamos con total transparencia, cumpliendo estrictamente con todas las regulaciones financieras. Protegemos la información de nuestros clientes y garantizamos transacciones 100% seguras.",
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      gradient: "from-primary via-accent to-primary",
    },
  ]

  return (
    <section id="mision" className="py-24 px-4 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl mb-6 text-balance">
            Conoce <span className="text-primary">Abba Cambios</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Nuestros valores y compromiso con la excelencia
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="group bg-card/80 backdrop-blur-sm p-10 rounded-3xl border-2 border-border hover:border-primary transition-all duration-500 hover:shadow-2xl hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div
                className={`w-20 h-20 bg-gradient-to-br ${pillar.gradient} rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-xl text-white group-hover:rotate-12 transition-transform duration-300`}
              >
                {pillar.icon}
              </div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-center mb-6 text-primary">
                {pillar.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-center">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
