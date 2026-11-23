import type { MapSymbolId } from '../types';

export interface MapSymbolProps {
  readonly symbol: MapSymbolId;
  readonly size?: number;
  readonly className?: string;
}

/**
 * Símbolos cartográficos temáticos em SVG puro para os 11 tipos de marcos do Atlas.
 * Herdam cor via `currentColor` e seguem o traço fino editorial do projeto.
 */
export function MapSymbol({ symbol, size = 14, className }: MapSymbolProps) {
  const sharedProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true as const,
  };

  switch (symbol) {
    case 'engenho':
      // Roda d'água / moenda de engenho
      return (
        <svg {...sharedProps}>
          <circle cx="12" cy="12" r="7" />
          <circle cx="12" cy="12" r="2.2" />
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
        </svg>
      );

    case 'ouro':
      // Pepita / cristal facetado de mineração
      return (
        <svg {...sharedProps}>
          <polygon points="12 3 19 9 16 20 8 20 5 9 12 3" />
          <path d="M5 9h14M12 3l-2 6 2 11 2-11-2-6z" />
        </svg>
      );

    case 'bandeira':
      // Estandarte / bandeira de expedição e fronteira
      return (
        <svg {...sharedProps}>
          <path d="M6 21V4" />
          <path d="M6 5h12l-2.5 4L18 13H6" />
        </svg>
      );

    case 'embarcacao':
      // Caravela / embarcação atlântica e fluvial
      return (
        <svg {...sharedProps}>
          <path d="M12 4v11" />
          <path d="M12 5c3.5 1.5 5.5 4.2 5.5 8H12" />
          <path d="M12 7c-2.5 1.2-4 3.2-4 6h4" />
          <path d="M4 16h16l-2 3.5H6L4 16z" />
        </svg>
      );

    case 'cafe':
      // Grão de café estilizado
      return (
        <svg {...sharedProps}>
          <ellipse cx="12" cy="12" rx="6.5" ry="8.5" transform="rotate(-22 12 12)" />
          <path d="M9.5 4.8c2.6 3.2 2.4 11.2 5 14.4" />
        </svg>
      );

    case 'industria':
      // Fábrica / chaminé industrial com telhado dente-de-serra
      return (
        <svg {...sharedProps}>
          <path d="M3 20V11l6 3v-3l6 3V8h4v12H3z" />
          <path d="M17 8V4h2v4" />
          <path d="M7 17h2M12 17h2" />
        </svg>
      );

    case 'cultura':
      // Estrela solar / sincretismo e criação cultural
      return (
        <svg {...sharedProps}>
          <path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3z" />
          <circle cx="12" cy="11" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );

    case 'aldeia':
      // Oca / habitação originária e floresta
      return (
        <svg {...sharedProps}>
          <path d="M3.5 19h17" />
          <path d="M5 19c0-6.5 3.1-12 7-13 3.9 1 7 6.5 7 13" />
          <path d="M10 19v-4.2a2 2 0 0 1 4 0V19" />
          <path d="M12 6V3.5" />
        </svg>
      );

    case 'politica':
      // Pórtico cívico / Estado e Constituição
      return (
        <svg {...sharedProps}>
          <path d="M3 9l9-5 9 5H3z" />
          <path d="M5 19h14" />
          <path d="M7 9v10M12 9v10M17 9v10" />
        </svg>
      );

    case 'pecuaria':
      // Cabeça bovina / currais do sertão e estâncias
      return (
        <svg {...sharedProps}>
          <path d="M4 7c1.5 2.5 3.8 3.5 8 3.5s6.5-1 8-3.5" />
          <path d="M7.5 10.5L9 18.5h6l1.5-8" />
          <path d="M10 15.5h4" />
        </svg>
      );

    case 'urbanizacao':
      // Horizonte urbano / arquitetura modernista
      return (
        <svg {...sharedProps}>
          <path d="M3 20h18" />
          <path d="M5 20V10h5v10" />
          <path d="M10 20V5h6v15" />
          <path d="M16 20v-7h3v7" />
          <path d="M12.5 8.5h1M12.5 12h1M7 13h1" />
        </svg>
      );
  }
}

export default MapSymbol;
