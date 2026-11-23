import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react';
import { geoGraticule, geoMercator, geoPath } from 'd3-geo';
import { feature, merge, mesh } from 'topojson-client';
import type {
  GeometryCollection,
  MultiPolygon,
  Polygon,
  Topology,
} from 'topojson-specification';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import brazilStatesTopology from '../data/geo/brazil-states.json';
import {
  INDIGENOUS_REGIONS,
  MAJOR_RIVERS,
  TERRITORIAL_OVERLAYS,
} from '../data/geo/historical-layers';
import {
  CONTINUITY_THREADS,
  DARCY_BRASIS,
  ERAS,
  INDIGENOUS_MATRICES,
  TERRITORIAL_SNAPSHOTS,
} from '../data';
import type {
  DarcyBrasil,
  DarcyBrasilId,
  HistoricalEvent,
  IndigenousTrunkId,
  LngLat,
  MapLayerState,
  StateCode,
} from '../types';
import { MapSymbol } from './MapSymbols';

const VIEWBOX_SIZE = 900;
const MIN_SCALE = 0.85;
const MAX_SCALE = 4.0;

interface StateProperties {
  readonly sigla: StateCode;
  readonly nome: string;
  readonly codarea: string;
}

type BrazilTopology = Topology<{
  states: GeometryCollection<StateProperties>;
}>;

interface TransformState {
  readonly scale: number;
  readonly x: number;
  readonly y: number;
}

interface TooltipState {
  readonly event: HistoricalEvent;
  readonly x: number;
  readonly y: number;
}

export interface MapCanvasProps {
  readonly events: readonly HistoricalEvent[];
  readonly layers: MapLayerState;
  readonly selectedEventId: string | null;
  readonly selectedBrasilId: DarcyBrasilId | null;
  readonly selectedThreadId: string | null;
  readonly selectedIndigenousId?: IndigenousTrunkId | null;
  readonly onSelectEvent: (eventId: string) => void;
  readonly onSelectBrasil?: (brasilId: DarcyBrasilId) => void;
  readonly onSelectState?: (stateCode: StateCode) => void;
  readonly onClearSelection?: () => void;
}

/** Limita a translação para manter o Brasil sempre acessível dentro do viewport. */
function clampTransform(next: TransformState): TransformState {
  const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next.scale));
  const maxOffset = VIEWBOX_SIZE * 0.45 * scale;
  const x = Math.min(maxOffset, Math.max(-maxOffset, next.x));
  const y = Math.min(maxOffset, Math.max(-maxOffset, next.y));
  return { scale, x, y };
}

/** Gera um arco quadrático Bézier suave entre dois pontos projetados. */
function createCurvedArcPath(
  from: readonly [number, number],
  to: readonly [number, number],
  curvature = 0.22
): string {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  if (dist < 1) return '';
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // Normal perpendicular consistente para dar arco elegante
  const nx = -dy / dist;
  const ny = dx / dist;
  const offset = Math.min(95, dist * curvature);
  const cx = mx + nx * offset;
  const cy = my + ny * offset;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

/** Converte um array de LngLat em GeoJSON LineString para o d3-geo. */
function toLineString(coords: readonly LngLat[]): GeoJSON.LineString {
  return {
    type: 'LineString',
    coordinates: coords.map(([lon, lat]) => [lon, lat]),
  };
}

/** Converte um anel de LngLat em GeoJSON Polygon para o d3-geo. */
function toPolygon(ring: readonly LngLat[]): GeoJSON.Polygon {
  return {
    type: 'Polygon',
    coordinates: [ring.map(([lon, lat]) => [lon, lat])],
  };
}

export function MapCanvas({
  events,
  layers,
  selectedEventId,
  selectedBrasilId,
  selectedThreadId,
  selectedIndigenousId = null,
  onSelectEvent,
  onSelectBrasil,
  onSelectState,
}: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [transform, setTransform] = useState<TransformState>({
    scale: 1,
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragOriginRef = useRef<{
    clientX: number;
    clientY: number;
    startX: number;
    startY: number;
  } | null>(null);

  const [hoveredState, setHoveredState] = useState<StateProperties | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // Mapa rápido UF -> Brasil de Darcy Ribeiro
  const brasilByState = useMemo(() => {
    const map = new Map<StateCode, DarcyBrasil>();
    for (const brasil of DARCY_BRASIS) {
      for (const uf of brasil.states) {
        map.set(uf, brasil);
      }
    }
    return map;
  }, []);

  // Construção estática da malha do Brasil e projeção Mercator centrada
  const geo = useMemo(() => {
    const topo = brazilStatesTopology as unknown as BrazilTopology;
    const statesFc = feature(
      topo,
      topo.objects.states
    ) as unknown as FeatureCollection<Geometry, StateProperties>;
    const brazilOutline = merge(
      topo,
      topo.objects.states.geometries as Array<
        Polygon<StateProperties> | MultiPolygon<StateProperties>
      >
    );
    const internalBorders = mesh(
      topo,
      topo.objects.states,
      (a, b) => a !== b
    );

    const projection = geoMercator().fitExtent(
      [
        [62, 56],
        [VIEWBOX_SIZE - 62, VIEWBOX_SIZE - 56],
      ],
      statesFc
    );
    const pathGen = geoPath(projection);
    const graticulePath = pathGen(geoGraticule().step([5, 5])()) ?? '';

    const states = statesFc.features.map(
      (feat: Feature<Geometry, StateProperties>) => ({
        properties: feat.properties,
        d: pathGen(feat) ?? '',
        centroid: pathGen.centroid(feat),
      })
    );

    return {
      projection,
      pathGen,
      graticulePath,
      outlinePath: pathGen(brazilOutline) ?? '',
      internalBordersPath: pathGen(internalBorders) ?? '',
      states,
    };
  }, []);

  const projectPoint = useCallback(
    (coord: LngLat): readonly [number, number] | null => {
      const pt = geo.projection([coord[0], coord[1]]);
      return pt ? [pt[0], pt[1]] : null;
    },
    [geo.projection]
  );

  // Índice rápido de eventos visíveis para desenhar Fios de Continuidade
  const eventsById = useMemo(() => {
    const map = new Map<string, HistoricalEvent>();
    for (const ev of events) {
      map.set(ev.id, ev);
    }
    return map;
  }, [events]);

  // Recorte territorial ativo
  const activeSnapshotMeta = useMemo(
    () =>
      TERRITORIAL_SNAPSHOTS.find(
        (s) => s.id === layers.activeTerritorialSnapshot
      ) ?? TERRITORIAL_SNAPSHOTS[0],
    [layers.activeTerritorialSnapshot]
  );

  const activeOverlay = TERRITORIAL_OVERLAYS[layers.activeTerritorialSnapshot];

  // Zoom por botão (centrado no centro do viewBox)
  const applyZoomFactor = useCallback((factor: number) => {
    setTransform((prev) => {
      const nextScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, prev.scale * factor)
      );
      const ratio = nextScale / prev.scale;
      return clampTransform({
        scale: nextScale,
        x: prev.x * ratio,
        y: prev.y * ratio,
      });
    });
  }, []);

  const handleResetView = useCallback(() => {
    setTransform({ scale: 1, x: 0, y: 0 });
  }, []);

  // Zoom com roda do mouse
  const handleWheel = useCallback((e: ReactWheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.14 : 1 / 1.14;
    setTransform((prev) => {
      const nextScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, prev.scale * factor)
      );
      const ratio = nextScale / prev.scale;
      return clampTransform({
        scale: nextScale,
        x: prev.x * ratio,
        y: prev.y * ratio,
      });
    });
  }, []);

  // Pan via pointer events
  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<SVGSVGElement>) => {
      if (e.button !== 0) return;
      // Não iniciar drag se clicou em um marcador de evento
      const target = e.target as Element | null;
      if (target?.closest('[data-map-interactive="true"]')) return;

      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
      dragOriginRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        startX: transform.x,
        startY: transform.y,
      };
    },
    [transform.x, transform.y]
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<SVGSVGElement>) => {
      if (!isDragging || !dragOriginRef.current || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const scaleToViewBox = VIEWBOX_SIZE / Math.min(rect.width, rect.height);
      const dx = (e.clientX - dragOriginRef.current.clientX) * scaleToViewBox;
      const dy = (e.clientY - dragOriginRef.current.clientY) * scaleToViewBox;

      setTransform((prev) =>
        clampTransform({
          scale: prev.scale,
          x: dragOriginRef.current!.startX + dx,
          y: dragOriginRef.current!.startY + dy,
        })
      );
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent<SVGSVGElement>) => {
      if (isDragging) {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        setIsDragging(false);
        dragOriginRef.current = null;
      }
    },
    [isDragging]
  );

  const updateTooltipPosition = useCallback(
    (event: HistoricalEvent, clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      setTooltip({
        event,
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
    },
    []
  );

  // Escala inversa suave para marcadores e textos permanecerem legíveis no zoom
  const markerInvScale = 1 / Math.sqrt(transform.scale);

  // Cor das divisas internas conforme o recorte territorial ativo
  const internalBorderStroke = useMemo(() => {
    if (!layers.showTerritorialOverlay) return '#C5BA9F';
    switch (layers.activeTerritorialSnapshot) {
      case 'imperio_1850':
        return '#2B4570';
      case 'republica_1889':
        return '#2F5D50';
      default:
        return '#CFC4AA';
    }
  }, [layers.showTerritorialOverlay, layers.activeTerritorialSnapshot]);

  const internalBorderOpacity =
    layers.showTerritorialOverlay &&
    (layers.activeTerritorialSnapshot === 'tordesilhas_1500' ||
      layers.activeTerritorialSnapshot === 'capitanias_1534')
      ? 0.35
      : 0.72;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-parchment select-none"
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        className={`w-full h-full block ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        role="img"
        aria-label="Mapa vetorial interativo da formação histórica do Brasil"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          {/* Textura sutil de papel pergaminho */}
          <filter
            id="paper-texture"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="grayNoise"
            />
            <feComponentTransfer in="grayNoise">
              <feFuncA type="linear" slope="0.04" />
            </feComponentTransfer>
          </filter>

          {/* Sombra cartográfica discreta sob o território */}
          <filter
            id="land-shadow"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
          >
            <feDropShadow
              dx="0"
              dy="3"
              stdDeviation="5"
              floodColor="#1E242B"
              floodOpacity="0.09"
            />
          </filter>

          {/* Recorte (clip) com a silhueta oficial do Brasil */}
          <clipPath id="brazil-land-clip">
            <path d={geo.outlinePath} />
          </clipPath>

          {/* Padrões SVG editoriais para as 4 Matrizes Indígenas */}
          <pattern
            id="pattern-waves"
            width="14"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 4 Q 3.5 1, 7 4 T 14 4"
              fill="none"
              stroke="#2F5D50"
              strokeWidth="1.15"
              strokeOpacity="0.55"
            />
          </pattern>

          <pattern
            id="pattern-hatch"
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(42)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="9"
              stroke="#B85336"
              strokeWidth="1.25"
              strokeOpacity="0.5"
            />
          </pattern>

          <pattern
            id="pattern-dots"
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="4.5"
              cy="4.5"
              r="1.4"
              fill="#2B4570"
              fillOpacity="0.52"
            />
          </pattern>

          <pattern
            id="pattern-cross"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 2 2 L 8 8 M 8 2 L 2 8"
              stroke="#7A5C38"
              strokeWidth="1.05"
              strokeOpacity="0.52"
            />
          </pattern>
        </defs>

        {/* Fundo papel pergaminho + textura */}
        <rect
          width={VIEWBOX_SIZE}
          height={VIEWBOX_SIZE}
          fill="#F7F3E9"
        />
        <rect
          width={VIEWBOX_SIZE}
          height={VIEWBOX_SIZE}
          filter="url(#paper-texture)"
          pointerEvents="none"
        />

        {/* Grupo transformável (Zoom + Pan centrado) */}
        <g
          transform={`translate(${VIEWBOX_SIZE / 2 + transform.x}, ${
            VIEWBOX_SIZE / 2 + transform.y
          }) scale(${transform.scale}) translate(${-VIEWBOX_SIZE / 2}, ${
            -VIEWBOX_SIZE / 2
          })`}
        >
          {/* CAMADA 1: Retícula geográfica (Graticule) */}
          {layers.showGraticule && (
            <g className="transition-opacity duration-300" pointerEvents="none">
              <path
                d={geo.graticulePath}
                fill="none"
                stroke="#DCD3BE"
                strokeWidth={0.75 / transform.scale}
                strokeDasharray="3 4"
                opacity={0.75}
              />
            </g>
          )}

          {/* CAMADA 2: Silhueta base do Brasil + Malha dos 27 estados */}
          <g filter="url(#land-shadow)">
            <path
              d={geo.outlinePath}
              fill="#EFE9DA"
              stroke="#B7AA8E"
              strokeWidth={1.25 / transform.scale}
            />
          </g>

          <g>
            {geo.states.map(({ properties, d }) => {
              const isHovered = hoveredState?.sigla === properties.sigla;
              const brasil = brasilByState.get(properties.sigla);
              const isBrasilSelected =
                layers.showDarcyBrasis &&
                selectedBrasilId !== null &&
                brasil?.id === selectedBrasilId;

              return (
                <path
                  key={properties.sigla}
                  d={d}
                  fill={isHovered ? '#E7DEC9' : '#EFE9DA'}
                  stroke={
                    isBrasilSelected
                      ? brasil?.color ?? '#1E242B'
                      : isHovered
                        ? '#555B61'
                        : 'none'
                  }
                  strokeWidth={(isBrasilSelected ? 1.5 : 1) / transform.scale}
                  className="transition-colors duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredState(properties)}
                  onMouseLeave={() =>
                    setHoveredState((prev) =>
                      prev?.sigla === properties.sigla ? null : prev
                    )
                  }
                  onClick={() => {
                    if (layers.showDarcyBrasis && brasil && onSelectBrasil) {
                      onSelectBrasil(brasil.id);
                    }
                    onSelectState?.(properties.sigla);
                  }}
                />
              );
            })}
          </g>

          {/* CAMADA 3: Coroplético dos 5 Brasis de Darcy Ribeiro */}
          {layers.showDarcyBrasis && (
            <g
              style={{ mixBlendMode: 'multiply' }}
              className="transition-opacity duration-300"
              pointerEvents="none"
            >
              {geo.states.map(({ properties, d }) => {
                const brasil = brasilByState.get(properties.sigla);
                if (!brasil) return null;
                const isSelected = selectedBrasilId === brasil.id;
                const opacity =
                  selectedBrasilId === null
                    ? 0.24
                    : isSelected
                      ? 0.44
                      : 0.1;

                return (
                  <path
                    key={`brasil-${properties.sigla}`}
                    d={d}
                    fill={brasil.color}
                    fillOpacity={opacity}
                    className="transition-all duration-300"
                  />
                );
              })}
            </g>
          )}

          {/* CAMADA 4: Matrizes Indígenas com padrões SVG + multiply */}
          {layers.showIndigenousMatrices && (
            <g
              clipPath="url(#brazil-land-clip)"
              style={{ mixBlendMode: 'multiply' }}
              className="transition-opacity duration-300"
              pointerEvents="none"
            >
              {INDIGENOUS_REGIONS.map((region) => {
                const meta = INDIGENOUS_MATRICES.find(
                  (m) => m.id === region.id
                );
                if (!meta) return null;
                const isHighlighted =
                  selectedIndigenousId === null ||
                  selectedIndigenousId === region.id;
                return (
                  <g
                    key={`indig-${region.id}`}
                    opacity={isHighlighted ? 0.92 : 0.25}
                  >
                    {region.polygons.map((poly, idx) => {
                      const d = geo.pathGen(toPolygon(poly)) ?? '';
                      return (
                        <path
                          key={`${region.id}-${idx}`}
                          d={d}
                          fill={`url(#pattern-${meta.pattern})`}
                          stroke={meta.color}
                          strokeWidth={0.9 / transform.scale}
                          strokeDasharray="3 3"
                          strokeOpacity={0.55}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>
          )}

          {/* Divisas interestaduais / provinciais */}
          <path
            d={geo.internalBordersPath}
            fill="none"
            stroke={internalBorderStroke}
            strokeWidth={
              (layers.showTerritorialOverlay &&
              (layers.activeTerritorialSnapshot === 'imperio_1850' ||
                layers.activeTerritorialSnapshot === 'republica_1889')
                ? 1.05
                : 0.75) / transform.scale
            }
            strokeOpacity={internalBorderOpacity}
            strokeDasharray={
              layers.showTerritorialOverlay &&
              layers.activeTerritorialSnapshot === 'imperio_1850'
                ? '4 2'
                : undefined
            }
            pointerEvents="none"
            className="transition-all duration-300"
          />

          {/* CAMADA 5: Grandes Rios */}
          {layers.showRivers && (
            <g className="transition-opacity duration-300" pointerEvents="none">
              {MAJOR_RIVERS.map((river) => {
                const d = geo.pathGen(toLineString(river.coordinates)) ?? '';
                const labelPt = projectPoint(river.labelPosition);
                return (
                  <g key={river.id}>
                    <path
                      d={d}
                      fill="none"
                      stroke="#4A7A96"
                      strokeWidth={river.strokeWidth / Math.sqrt(transform.scale)}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeOpacity={0.68}
                    />
                    {labelPt && (
                      <text
                        x={labelPt[0]}
                        y={labelPt[1]}
                        transform={
                          river.labelRotation
                            ? `rotate(${river.labelRotation}, ${labelPt[0]}, ${labelPt[1]})`
                            : undefined
                        }
                        fill="#355F78"
                        fontSize={9.5 * markerInvScale}
                        fontFamily="var(--font-serif)"
                        fontStyle="italic"
                        fontWeight={600}
                        textAnchor="middle"
                        opacity={0.85}
                      >
                        {river.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* CAMADA 6: Recorte Territorial Histórico */}
          {layers.showTerritorialOverlay && activeOverlay && (
            <g
              key={activeOverlay.id}
              className="transition-opacity duration-300"
              pointerEvents="none"
            >
              {/* Áreas clipadas à silhueta do Brasil */}
              <g clipPath="url(#brazil-land-clip)">
                {activeOverlay.highlightArea && (
                  <path
                    d={geo.pathGen(toPolygon(activeOverlay.highlightArea)) ?? ''}
                    fill={activeSnapshotMeta.color}
                    fillOpacity={0.13}
                  />
                )}
                {activeOverlay.spanishArea && (
                  <path
                    d={geo.pathGen(toPolygon(activeOverlay.spanishArea)) ?? ''}
                    fill="#1E242B"
                    fillOpacity={0.07}
                  />
                )}
                {activeOverlay.capitanias?.map((cap, idx) => {
                  const bandPoly: LngLat[] = [
                    [-48.7, cap.northLat],
                    [-33.0, cap.northLat],
                    [-33.0, cap.southLat],
                    [-48.7, cap.southLat],
                    [-48.7, cap.northLat],
                  ];
                  const d = geo.pathGen(toPolygon(bandPoly)) ?? '';
                  const labelPt = cap.labelPosition
                    ? projectPoint(cap.labelPosition)
                    : null;
                  return (
                    <g key={cap.id}>
                      <path
                        d={d}
                        fill={idx % 2 === 0 ? '#B85336' : '#C68B2C'}
                        fillOpacity={0.11}
                        stroke="#A1462C"
                        strokeWidth={0.85 / transform.scale}
                        strokeOpacity={0.65}
                      />
                      {labelPt && (
                        <text
                          x={labelPt[0]}
                          y={labelPt[1]}
                          fill="#7A311D"
                          fontSize={8.5 * markerInvScale}
                          fontFamily="var(--font-serif)"
                          fontWeight={600}
                          letterSpacing="0.04em"
                          textAnchor="middle"
                        >
                          {cap.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>

              {/* Linha secundária (ex: antiga linha de Tordesilhas em Madri 1750) */}
              {activeOverlay.secondaryLine && (
                <path
                  d={
                    geo.pathGen(toLineString(activeOverlay.secondaryLine)) ?? ''
                  }
                  fill="none"
                  stroke="#B85336"
                  strokeWidth={1.25 / transform.scale}
                  strokeDasharray="4 5"
                  strokeOpacity={0.5}
                />
              )}

              {/* Linha principal do Meridiano de Tordesilhas */}
              {activeOverlay.meridianLine && (
                <path
                  d={
                    geo.pathGen(toLineString(activeOverlay.meridianLine)) ?? ''
                  }
                  fill="none"
                  stroke="#B85336"
                  strokeWidth={2.2 / Math.sqrt(transform.scale)}
                  strokeDasharray="7 4"
                  strokeOpacity={0.9}
                />
              )}

              {/* Fronteira do Tratado de Madri (1750) */}
              {activeOverlay.borderLine && (
                <path
                  d={geo.pathGen(toLineString(activeOverlay.borderLine)) ?? ''}
                  fill="none"
                  stroke="#8F3E28"
                  strokeWidth={2.5 / Math.sqrt(transform.scale)}
                  strokeDasharray="8 3 2 3"
                  strokeLinecap="round"
                  strokeOpacity={0.9}
                />
              )}

              {/* Marcador de Capital (Corte Imperial / Brasília) */}
              {activeOverlay.capitalMarker &&
                (() => {
                  const pt = projectPoint(activeOverlay.capitalMarker.position);
                  if (!pt) return null;
                  return (
                    <g transform={`translate(${pt[0]}, ${pt[1]})`}>
                      <circle
                        r={6.5 * markerInvScale}
                        fill="none"
                        stroke={activeSnapshotMeta.color}
                        strokeWidth={1.2 * markerInvScale}
                        strokeDasharray="2 2"
                      />
                      <circle
                        r={3 * markerInvScale}
                        fill={activeSnapshotMeta.color}
                      />
                      <text
                        x={9 * markerInvScale}
                        y={3 * markerInvScale}
                        fill={activeSnapshotMeta.color}
                        fontSize={9.5 * markerInvScale}
                        fontFamily="var(--font-serif)"
                        fontWeight={700}
                      >
                        {activeOverlay.capitalMarker.name}
                      </text>
                    </g>
                  );
                })()}

              {/* Rótulos do recorte territorial */}
              {activeOverlay.labels.map((lbl, idx) => {
                const pt = projectPoint(lbl.position);
                if (!pt) return null;
                return (
                  <g
                    key={`overlay-lbl-${idx}`}
                    transform={`translate(${pt[0]}, ${pt[1]})${
                      lbl.rotation ? ` rotate(${lbl.rotation})` : ''
                    }`}
                  >
                    <text
                      fill={activeSnapshotMeta.color}
                      fontSize={10.5 * markerInvScale}
                      fontFamily="var(--font-serif)"
                      fontWeight={700}
                      letterSpacing="0.06em"
                      textAnchor="middle"
                      opacity={0.9}
                    >
                      {lbl.text.toUpperCase()}
                    </text>
                    {lbl.subtext && (
                      <text
                        y={11 * markerInvScale}
                        fill="#555B61"
                        fontSize={8.5 * markerInvScale}
                        fontFamily="var(--font-sans)"
                        fontWeight={500}
                        textAnchor="middle"
                        opacity={0.85}
                      >
                        {lbl.subtext}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* Rótulos dos 5 Brasis de Darcy Ribeiro */}
          {layers.showDarcyBrasis && (
            <g pointerEvents="none">
              {DARCY_BRASIS.map((brasil) => {
                const pt = projectPoint(brasil.centroid);
                if (!pt) return null;
                const isSelected = selectedBrasilId === brasil.id;
                const isDimmed =
                  selectedBrasilId !== null && selectedBrasilId !== brasil.id;
                return (
                  <g
                    key={`lbl-brasil-${brasil.id}`}
                    transform={`translate(${pt[0]}, ${pt[1]})`}
                    opacity={isDimmed ? 0.35 : 0.92}
                  >
                    <text
                      fill={brasil.color}
                      fontSize={(isSelected ? 13 : 11.5) * markerInvScale}
                      fontFamily="var(--font-serif)"
                      fontWeight={700}
                      letterSpacing="0.05em"
                      textAnchor="middle"
                      stroke="#F7F3E9"
                      strokeWidth={3 * markerInvScale}
                      paintOrder="stroke"
                    >
                      {brasil.name}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Rótulos das Matrizes Indígenas */}
          {layers.showIndigenousMatrices && (
            <g pointerEvents="none">
              {INDIGENOUS_REGIONS.map((region) => {
                const meta = INDIGENOUS_MATRICES.find(
                  (m) => m.id === region.id
                );
                const pt = projectPoint(region.labelPosition);
                if (!meta || !pt) return null;
                return (
                  <text
                    key={`lbl-indig-${region.id}`}
                    x={pt[0]}
                    y={pt[1]}
                    fill={meta.color}
                    fontSize={9.5 * markerInvScale}
                    fontFamily="var(--font-serif)"
                    fontStyle="italic"
                    fontWeight={700}
                    textAnchor="middle"
                    stroke="#F7F3E9"
                    strokeWidth={2.6 * markerInvScale}
                    paintOrder="stroke"
                  >
                    {meta.name}
                  </text>
                );
              })}
            </g>
          )}

          {/* CAMADA 7: Fios de Continuidade (arcos Bézier) */}
          {layers.showContinuityArcs && (
            <g className="transition-opacity duration-300" pointerEvents="none">
              {CONTINUITY_THREADS.map((thread) => {
                const isSelected = selectedThreadId === thread.id;
                const isDimmed =
                  selectedThreadId !== null && selectedThreadId !== thread.id;
                const threadEvents = thread.eventIds
                  .map((id) => eventsById.get(id))
                  .filter((ev): ev is HistoricalEvent => Boolean(ev));

                if (threadEvents.length < 2) return null;

                return (
                  <g
                    key={thread.id}
                    opacity={isDimmed ? 0.16 : isSelected ? 0.95 : 0.58}
                  >
                    {threadEvents.slice(0, -1).map((ev, idx) => {
                      const nextEv = threadEvents[idx + 1];
                      const p1 = projectPoint(ev.coordinates);
                      const p2 = projectPoint(nextEv.coordinates);
                      if (!p1 || !p2) return null;
                      const d = createCurvedArcPath(
                        p1,
                        p2,
                        idx % 2 === 0 ? 0.2 : -0.18
                      );
                      return (
                        <path
                          key={`${thread.id}-${ev.id}-${nextEv.id}`}
                          d={d}
                          fill="none"
                          stroke={thread.color}
                          strokeWidth={
                            (isSelected ? 2.4 : 1.4) * markerInvScale
                          }
                          strokeDasharray={isSelected ? undefined : '5 4'}
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>
          )}

          {/* CAMADA 8: Marcadores dos Eventos Históricos */}
          {layers.showEvents && (
            <g>
              {events.map((event) => {
                const pt = projectPoint(event.coordinates);
                if (!pt) return null;
                const eraColor = ERAS[event.era].color;
                const isSelected = selectedEventId === event.id;
                const isHovered = tooltip?.event.id === event.id;
                const radius = (isSelected ? 14 : isHovered ? 12.5 : 11) * markerInvScale;

                return (
                  <g
                    key={event.id}
                    data-map-interactive="true"
                    transform={`translate(${pt[0]}, ${pt[1]})`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${event.yearLabel} — ${event.title} (${event.locationName})`}
                    className="cursor-pointer focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent(event.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectEvent(event.id);
                      }
                    }}
                    onMouseEnter={(e) =>
                      updateTooltipPosition(event, e.clientX, e.clientY)
                    }
                    onMouseMove={(e) =>
                      updateTooltipPosition(event, e.clientX, e.clientY)
                    }
                    onMouseLeave={() =>
                      setTooltip((prev) =>
                        prev?.event.id === event.id ? null : prev
                      )
                    }
                  >
                    {/* Anel de destaque quando selecionado */}
                    {isSelected && (
                      <>
                        <circle
                          r={radius + 6 * markerInvScale}
                          fill={eraColor}
                          fillOpacity={0.14}
                          stroke={eraColor}
                          strokeWidth={1.3 * markerInvScale}
                          strokeDasharray="3 2"
                        />
                        <circle
                          r={radius + 2.5 * markerInvScale}
                          fill="none"
                          stroke="#F7F3E9"
                          strokeWidth={1.8 * markerInvScale}
                        />
                      </>
                    )}

                    {/* Medalhão do marcador */}
                    <circle
                      r={radius}
                      fill={eraColor}
                      stroke="#F7F3E9"
                      strokeWidth={2 * markerInvScale}
                      className="transition-all duration-150"
                    />

                    {/* Símbolo cartográfico temático */}
                    <g
                      transform={`translate(${-6.5 * markerInvScale}, ${
                        -6.5 * markerInvScale
                      }) scale(${markerInvScale})`}
                      className="text-parchment"
                      pointerEvents="none"
                    >
                      <MapSymbol symbol={event.symbol} size={13} />
                    </g>

                    {/* Rótulo discreto do ano sob o marcador quando selecionado ou em zoom alto */}
                    {(isSelected || transform.scale >= 1.75) && (
                      <text
                        y={radius + 11 * markerInvScale}
                        fill="#1E242B"
                        fontSize={9 * markerInvScale}
                        fontFamily="var(--font-sans)"
                        fontWeight={600}
                        textAnchor="middle"
                        stroke="#F7F3E9"
                        strokeWidth={2.5 * markerInvScale}
                        paintOrder="stroke"
                        pointerEvents="none"
                      >
                        {event.year}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}
        </g>

        {/* Ornamento fixo: Rosa dos Ventos Editorial (canto inferior esquerdo) */}
        <g
          transform="translate(64, 824)"
          opacity={0.72}
          pointerEvents="none"
          aria-hidden="true"
        >
          <circle
            cx="0"
            cy="0"
            r="26"
            fill="#F7F3E9"
            fillOpacity="0.65"
            stroke="#B7AA8E"
            strokeWidth="0.9"
          />
          <circle
            cx="0"
            cy="0"
            r="22"
            fill="none"
            stroke="#DCD3BE"
            strokeWidth="0.7"
            strokeDasharray="2 2"
          />
          {/* Estrela principal N-S-L-O */}
          <polygon points="0,-20 3.5,-3.5 0,0" fill="#1E242B" />
          <polygon points="0,-20 -3.5,-3.5 0,0" fill="#B85336" />
          <polygon points="0,20 3.5,3.5 0,0" fill="#DCD3BE" stroke="#555B61" strokeWidth="0.5" />
          <polygon points="0,20 -3.5,3.5 0,0" fill="#555B61" />
          <polygon points="20,0 3.5,3.5 0,0" fill="#555B61" />
          <polygon points="20,0 3.5,-3.5 0,0" fill="#DCD3BE" stroke="#555B61" strokeWidth="0.5" />
          <polygon points="-20,0 -3.5,-3.5 0,0" fill="#555B61" />
          <polygon points="-20,0 -3.5,3.5 0,0" fill="#DCD3BE" stroke="#555B61" strokeWidth="0.5" />
          <text
            x="0"
            y="-29"
            textAnchor="middle"
            fontSize="9"
            fontFamily="var(--font-serif)"
            fontWeight="700"
            fill="#1E242B"
          >
            N
          </text>
          <text
            x="0"
            y="36"
            textAnchor="middle"
            fontSize="8"
            fontFamily="var(--font-serif)"
            fill="#555B61"
          >
            S
          </text>
          <text
            x="33"
            y="3"
            textAnchor="middle"
            fontSize="8"
            fontFamily="var(--font-serif)"
            fill="#555B61"
          >
            L
          </text>
          <text
            x="-33"
            y="3"
            textAnchor="middle"
            fontSize="8"
            fontFamily="var(--font-serif)"
            fill="#555B61"
          >
            O
          </text>
        </g>
      </svg>

      {/* Cartela Cartográfica Editorial (canto superior esquerdo) */}
      <div className="pointer-events-none absolute top-4 left-4 max-w-xs rounded border border-parchment-border bg-parchment/90 px-3.5 py-2.5 shadow-sm backdrop-blur-sm">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
          Carta Histórica · Projeção Mercator
        </p>
        <p className="font-serif text-base font-semibold leading-tight text-ink mt-0.5">
          {layers.showTerritorialOverlay
            ? activeSnapshotMeta.label
            : 'Território Brasileiro (27 UFs)'}
        </p>
        {hoveredState && (
          <p className="mt-1 text-xs text-ink-muted">
            UF:{' '}
            <span className="font-semibold text-ink">
              {hoveredState.nome} ({hoveredState.sigla})
            </span>
            {layers.showDarcyBrasis && brasilByState.get(hoveredState.sigla) && (
              <span>
                {' '}
                · {brasilByState.get(hoveredState.sigla)?.name}
              </span>
            )}
          </p>
        )}
      </div>

      {/* Controles de Zoom & Pan (canto inferior direito) */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 rounded-md border border-parchment-border bg-parchment/95 p-1 shadow-sm backdrop-blur-sm">
        <button
          type="button"
          onClick={() => applyZoomFactor(1.25)}
          className="flex h-8 w-8 items-center justify-center rounded text-ink hover:bg-parchment-surface transition-colors"
          aria-label="Aproximar mapa"
          title="Aproximar (+)"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => applyZoomFactor(1 / 1.25)}
          className="flex h-8 w-8 items-center justify-center rounded text-ink hover:bg-parchment-surface transition-colors"
          aria-label="Afastar mapa"
          title="Afastar (-)"
        >
          <Minus className="h-4 w-4" />
        </button>
        <div className="my-0.5 h-px bg-parchment-border" />
        <button
          type="button"
          onClick={handleResetView}
          className="flex h-8 w-8 items-center justify-center rounded text-ink-muted hover:bg-parchment-surface hover:text-ink transition-colors"
          aria-label="Resetar visualização do mapa"
          title="Resetar visualização"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Tooltip editorial flutuante para eventos históricos */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-20 w-72 rounded-md border border-parchment-border bg-parchment/95 p-3 shadow-lg backdrop-blur-sm transition-opacity duration-100"
          style={{
            left: Math.min(
              tooltip.x + 16,
              (containerRef.current?.clientWidth ?? 800) - 304
            ),
            top: Math.max(
              12,
              Math.min(
                tooltip.y - 16,
                (containerRef.current?.clientHeight ?? 600) - 165
              )
            ),
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-parchment"
              style={{ backgroundColor: ERAS[tooltip.event.era].color }}
            >
              {ERAS[tooltip.event.era].shortLabel}
            </span>
            <span className="text-xs font-semibold text-ink-muted">
              {tooltip.event.yearLabel}
            </span>
          </div>
          <h3 className="font-serif text-base font-semibold leading-snug text-ink">
            {tooltip.event.title}
          </h3>
          <p className="text-[11px] font-medium text-ink-muted mt-0.5">
            {tooltip.event.locationName}
          </p>
          <p className="text-xs text-ink-muted leading-relaxed mt-1.5 line-clamp-3">
            {tooltip.event.summary}
          </p>
        </div>
      )}
    </div>
  );
}

export default MapCanvas;
