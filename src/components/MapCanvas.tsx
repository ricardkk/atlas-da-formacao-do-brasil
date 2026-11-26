import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import { feature, merge, mesh } from 'topojson-client';
import type {
  GeometryCollection,
  MultiPolygon,
  Polygon,
  Topology,
} from 'topojson-specification';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { Minus, Plus, RotateCcw, X } from 'lucide-react';
import brazilStatesTopology from '../data/geo/brazil-states.json';
import {
  CARTOGRAPHIC_NOTES,
  DARCY_BRASIS_BOUNDARIES,
  DARCY_BRASIS_REFERENCE_CITIES,
  DARCY_BRASIS_REGIONS,
  IMPERIAL_PROVINCE_GROUPS_1850,
  INDIGENOUS_REGIONS,
  MAJOR_RIVERS,
  TERRITORIAL_OVERLAYS,
  type CartographicNote,
} from '../data/geo/historical-layers';
import {
  CONTINUITY_THREADS,
  DARCY_BRASIS,
  ERAS,
  INDIGENOUS_MATRICES,
  TERRITORIAL_SNAPSHOTS,
} from '../data';
import type {
  DarcyBrasilId,
  HistoricalEvent,
  IndigenousTrunkId,
  LngLat,
  MapLayerState,
  StateCode,
} from '../types';
import { MapSymbol } from './MapSymbols';

const VIEWBOX_SIZE = 900;
const MIN_SCALE = 0.65;
const MAX_SCALE = 4.0;
const DEFAULT_TRANSFORM: TransformState = { scale: 1, x: 0, y: 0 };

interface StateProperties {
  readonly sigla: StateCode;
  readonly nome: string;
  readonly codarea: string;
}

type BrazilTopology = Topology<{
  states: GeometryCollection<StateProperties>;
}>;

type StatePolygonGeom = Polygon<StateProperties> | MultiPolygon<StateProperties>;

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

interface ActiveNotePopup {
  readonly note: CartographicNote;
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

/** Limita a translação e garante finitude numérica para manter o Brasil sempre visível e estável. */
function clampTransform(next: TransformState): TransformState {
  if (
    !Number.isFinite(next.scale) ||
    !Number.isFinite(next.x) ||
    !Number.isFinite(next.y)
  ) {
    return DEFAULT_TRANSFORM;
  }
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

  const [transform, setTransform] = useState<TransformState>(DEFAULT_TRANSFORM);
  const [isDragging, setIsDragging] = useState(false);
  const dragOriginRef = useRef<{
    clientX: number;
    clientY: number;
    startX: number;
    startY: number;
  } | null>(null);

  // Refs para throttling de zoom via requestAnimationFrame
  const pendingZoomFactorRef = useRef<number>(1);
  const zoomRafIdRef = useRef<number | null>(null);

  const [hoveredState, setHoveredState] = useState<StateProperties | null>(null);
  const [hoveredProvinceName, setHoveredProvinceName] = useState<string | null>(
    null
  );
  const [hoveredBrasilId, setHoveredBrasilId] = useState<DarcyBrasilId | null>(
    null
  );
  const didDragRef = useRef<boolean>(false);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [activeNote, setActiveNote] = useState<ActiveNotePopup | null>(null);

  // Fecha o popup contextual "?" ao trocar de recorte territorial ou desativar a camada
  useEffect(() => {
    setActiveNote(null);
    setHoveredProvinceName(null);
  }, [layers.activeTerritorialSnapshot, layers.showTerritorialOverlay]);

  // Listener nativo de wheel com { passive: false } + throttling por requestAnimationFrame
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Normaliza deltaY para evitar saltos bruscos em trackpads ou mouses de alta frequência
      const normalizedDelta = Math.max(-120, Math.min(120, e.deltaY));
      if (normalizedDelta === 0) return;

      const stepFactor = Math.exp(-normalizedDelta * 0.0014);
      pendingZoomFactorRef.current *= stepFactor;

      if (zoomRafIdRef.current === null) {
        zoomRafIdRef.current = window.requestAnimationFrame(() => {
          zoomRafIdRef.current = null;
          const factor = pendingZoomFactorRef.current;
          pendingZoomFactorRef.current = 1;
          if (!Number.isFinite(factor) || Math.abs(factor - 1) < 1e-4) return;

          setTransform((prev) => {
            const nextScale = Math.min(
              MAX_SCALE,
              Math.max(MIN_SCALE, prev.scale * factor)
            );
            const ratio = prev.scale > 0 ? nextScale / prev.scale : 1;
            return clampTransform({
              scale: nextScale,
              x: prev.x * ratio,
              y: prev.y * ratio,
            });
          });
        });
      }
    };

    svgEl.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => {
      svgEl.removeEventListener('wheel', handleNativeWheel);
      if (zoomRafIdRef.current !== null) {
        window.cancelAnimationFrame(zoomRafIdRef.current);
        zoomRafIdRef.current = null;
      }
      pendingZoomFactorRef.current = 1;
    };
  }, []);

  // Classificação do recorte territorial ativo
  const isOverlayActive = layers.showTerritorialOverlay;
  const activeSnapshot = layers.activeTerritorialSnapshot;
  const isPre1903 = isOverlayActive && activeSnapshot !== 'republica_1889';
  const isColonial =
    isOverlayActive &&
    (activeSnapshot === 'tordesilhas_1500' ||
      activeSnapshot === 'capitanias_1534' ||
      activeSnapshot === 'madri_1750');
  const isImperial = isOverlayActive && activeSnapshot === 'imperio_1850';

  // Mapa rápido ID -> metadados de Brasil de Darcy Ribeiro
  const brasilById = useMemo(
    () => new Map(DARCY_BRASIS.map((b) => [b.id, b])),
    []
  );

  // Construção estática da malha do Brasil, silhueta pré-1903, províncias imperiais e camadas fixas
  const geo = useMemo(() => {
    const topo = brazilStatesTopology as unknown as BrazilTopology;
    const allGeoms = topo.objects.states.geometries as StatePolygonGeom[];
    const nonAcreGeoms = allGeoms.filter((g) => g.properties?.sigla !== 'AC');

    const statesFc = feature(
      topo,
      topo.objects.states
    ) as unknown as FeatureCollection<Geometry, StateProperties>;

    const brazilOutline = merge(topo, allGeoms);
    const brazilPre1903Outline = merge(topo, nonAcreGeoms);
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

    const project = (coord: LngLat): readonly [number, number] | null => {
      const pt = projection([coord[0], coord[1]]);
      return pt ? [pt[0], pt[1]] : null;
    };

    // Malha Mercator contínua de alcance global (-300° a +220° lon, -85° a +85° lat)
    // para cobrir 100% da interface em qualquer nível de zoom, pan ou proporção de tela
    const refWest = projection([-60, 0])!;
    const refEast = projection([-50, 0])!;
    const pxPerDegLon = (refEast[0] - refWest[0]) / 10;
    const lonZeroX = refWest[0] + 60 * pxPerDegLon;
    const xForLon = (lon: number) => lonZeroX + lon * pxPerDegLon;
    const yForLat = (lat: number) => projection([-55, lat])![1];

    const minLon = -300;
    const maxLon = 220;
    const minLat = -85;
    const maxLat = 85;
    const xMin = xForLon(minLon);
    const xMax = xForLon(maxLon);
    const yTop = yForLat(maxLat);
    const yBottom = yForLat(minLat);

    const minorSegments: string[] = [];
    const majorSegments: string[] = [];

    for (let lon = minLon; lon <= maxLon; lon += 5) {
      const x = xForLon(lon).toFixed(1);
      const seg = `M ${x} ${yTop.toFixed(1)} L ${x} ${yBottom.toFixed(1)}`;
      if (lon % 10 === 0) {
        majorSegments.push(seg);
      } else {
        minorSegments.push(seg);
      }
    }

    for (let lat = minLat; lat <= maxLat; lat += 5) {
      const y = yForLat(lat).toFixed(1);
      const seg = `M ${xMin.toFixed(1)} ${y} L ${xMax.toFixed(1)} ${y}`;
      if (lat % 10 === 0) {
        majorSegments.push(seg);
      } else {
        minorSegments.push(seg);
      }
    }

    const graticuleMinorPath = minorSegments.join(' ');
    const graticuleMajorPath = majorSegments.join(' ');
    const yEq = yForLat(0).toFixed(1);
    const yCap = yForLat(-23.4367).toFixed(1);
    const yCan = yForLat(23.4367).toFixed(1);
    const equatorPath = `M ${xMin.toFixed(1)} ${yEq} L ${xMax.toFixed(1)} ${yEq}`;
    const capricornPath = `M ${xMin.toFixed(1)} ${yCap} L ${xMax.toFixed(1)} ${yCap}`;
    const cancerPath = `M ${xMin.toFixed(1)} ${yCan} L ${xMax.toFixed(1)} ${yCan}`;

    const formatLonLabel = (lon: number) => {
      if (lon === 0) return '0° · Greenwich';
      return lon < 0 ? `${Math.abs(lon)}° O` : `${lon}° L`;
    };
    const formatLatLabel = (lat: number) => {
      if (lat === 0) return '0° · Equador';
      return lat < 0 ? `${Math.abs(lat)}° S` : `${lat}° N`;
    };

    const graticuleLabels: Array<{
      readonly text: string;
      readonly pt: readonly [number, number];
    }> = [
      { text: 'Trópico de Capricórnio · 23°26′ S', pt: [xForLon(-30.5), yForLat(-22.9)] },
      { text: 'Trópico de Câncer · 23°26′ N', pt: [xForLon(-30.5), yForLat(23.95)] },
    ];

    for (let lat = -60; lat <= 40; lat += 10) {
      graticuleLabels.push({
        text: formatLatLabel(lat),
        pt: [xForLon(-32.5), yForLat(lat + 0.45)],
      });
    }

    for (let lon = -140; lon <= 40; lon += 10) {
      const labelLat = lon >= -75 && lon <= -35 ? (lon <= -55 ? 6.2 : -34.6) : -34.6;
      graticuleLabels.push({
        text: formatLonLabel(lon),
        pt: [xForLon(lon), yForLat(labelLat)],
      });
    }

    const states = statesFc.features.map(
      (feat: Feature<Geometry, StateProperties>) => ({
        properties: feat.properties,
        d: pathGen(feat) ?? '',
      })
    );

    const acreState =
      states.find((s) => s.properties.sigla === 'AC') ?? null;

    // Fusão topológica das 19 províncias imperiais de 1850 (sem AC e sem bordas pós-1850)
    const imperialProvinces1850 = IMPERIAL_PROVINCE_GROUPS_1850.map((group) => {
      const groupGeoms = allGeoms.filter(
        (g) =>
          g.properties?.sigla !== undefined &&
          group.states.includes(g.properties.sigla)
      );
      const mergedGeom = merge(topo, groupGeoms);
      return {
        id: group.id,
        name: group.name,
        states: group.states,
        d: pathGen(mergedGeom) ?? '',
      };
    });

    // Pré-projeção dos Grandes Rios (evita recalcular D3 durante zoom/pan)
    const rivers = MAJOR_RIVERS.map((river) => ({
      ...river,
      d: pathGen(toLineString(river.coordinates)) ?? '',
      labelPt: project(river.labelPosition),
    }));

    // Pré-projeção das Matrizes Indígenas
    const indigenousRegions = INDIGENOUS_REGIONS.map((region) => {
      const meta = INDIGENOUS_MATRICES.find((m) => m.id === region.id) ?? null;
      return {
        id: region.id,
        meta,
        polygonsD: region.polygons.map(
          (poly) => pathGen(toPolygon(poly)) ?? ''
        ),
        labelPt: project(region.labelPosition),
      };
    });

    // Pré-projeção das 5 macroáreas contínuas de Darcy Ribeiro, divisas pontilhadas e cidades-referência
    const darcyBrasisRegions = DARCY_BRASIS_REGIONS.map((region) => ({
      ...region,
      meta: DARCY_BRASIS.find((b) => b.id === region.id) ?? null,
      d: pathGen(toPolygon(region.ring)) ?? '',
    }));

    const darcyBrasisBoundariesD = DARCY_BRASIS_BOUNDARIES.map(
      (line) => pathGen(toLineString(line)) ?? ''
    ).join(' ');

    const darcyBrasisCities = DARCY_BRASIS_REFERENCE_CITIES.map((city) => ({
      ...city,
      pt: project(city.coordinates),
    }));

    // Pré-projeção dos rótulos dos 5 Brasis
    const brasisLabels = DARCY_BRASIS.map((brasil) => ({
      brasil,
      pt: project(brasil.centroid),
    }));

    return {
      projection,
      pathGen,
      project,
      graticuleMinorPath,
      graticuleMajorPath,
      equatorPath,
      capricornPath,
      cancerPath,
      graticuleLabels,
      outlinePath: pathGen(brazilOutline) ?? '',
      outlinePre1903Path: pathGen(brazilPre1903Outline) ?? '',
      internalBordersPath: pathGen(internalBorders) ?? '',
      states,
      acreState,
      imperialProvinces1850,
      rivers,
      indigenousRegions,
      darcyBrasisRegions,
      darcyBrasisBoundariesD,
      darcyBrasisCities,
      brasisLabels,
    };
  }, []);

  // Recorte territorial ativo pré-projetado (recalcula apenas quando activeSnapshot muda)
  const activeSnapshotMeta = useMemo(
    () =>
      TERRITORIAL_SNAPSHOTS.find((s) => s.id === activeSnapshot) ??
      TERRITORIAL_SNAPSHOTS[0],
    [activeSnapshot]
  );

  const projectedOverlay = useMemo(() => {
    const overlay = TERRITORIAL_OVERLAYS[activeSnapshot];
    if (!overlay) return null;

    return {
      id: overlay.id,
      highlightAreaD: overlay.highlightArea
        ? (geo.pathGen(toPolygon(overlay.highlightArea)) ?? '')
        : null,
      spanishAreaD: overlay.spanishArea
        ? (geo.pathGen(toPolygon(overlay.spanishArea)) ?? '')
        : null,
      secondaryLineD: overlay.secondaryLine
        ? (geo.pathGen(toLineString(overlay.secondaryLine)) ?? '')
        : null,
      meridianLineD: overlay.meridianLine
        ? (geo.pathGen(toLineString(overlay.meridianLine)) ?? '')
        : null,
      borderLineD: overlay.borderLine
        ? (geo.pathGen(toLineString(overlay.borderLine)) ?? '')
        : null,
      capitanias: overlay.capitanias?.map((cap, idx) => {
        const bandPoly: LngLat[] = [
          [-48.7, cap.northLat],
          [-33.0, cap.northLat],
          [-33.0, cap.southLat],
          [-48.7, cap.southLat],
          [-48.7, cap.northLat],
        ];
        return {
          id: cap.id,
          name: cap.name,
          fill: idx % 2 === 0 ? '#B85336' : '#C68B2C',
          d: geo.pathGen(toPolygon(bandPoly)) ?? '',
          labelPt: cap.labelPosition ? geo.project(cap.labelPosition) : null,
        };
      }),
      capitalMarker: overlay.capitalMarker
        ? {
            name: overlay.capitalMarker.name,
            pt: geo.project(overlay.capitalMarker.position),
          }
        : null,
      labels: overlay.labels.map((lbl) => ({
        text: lbl.text,
        subtext: lbl.subtext,
        rotation: lbl.rotation,
        pt: geo.project(lbl.position),
      })),
    };
  }, [activeSnapshot, geo]);

  // Pré-projeção dos eventos visíveis e dos Fios de Continuidade
  const projectedEvents = useMemo(
    () =>
      events.map((event) => ({
        event,
        pt: geo.project(event.coordinates),
      })),
    [events, geo]
  );

  const projectedThreads = useMemo(() => {
    const ptById = new Map<string, readonly [number, number]>();
    for (const item of projectedEvents) {
      if (item.pt) ptById.set(item.event.id, item.pt);
    }

    return CONTINUITY_THREADS.map((thread) => {
      const pts = thread.eventIds
        .map((id) => ({ id, pt: ptById.get(id) }))
        .filter(
          (entry): entry is { id: string; pt: readonly [number, number] } =>
            Boolean(entry.pt)
        );
      const segments =
        pts.length >= 2
          ? pts.slice(0, -1).map((curr, idx) => ({
              key: `${thread.id}-${curr.id}-${pts[idx + 1].id}`,
              d: createCurvedArcPath(
                curr.pt,
                pts[idx + 1].pt,
                idx % 2 === 0 ? 0.2 : -0.18
              ),
            }))
          : [];
      return { thread, segments };
    });
  }, [projectedEvents]);

  // Notas cartográficas "?" pré-projetadas para o recorte atual
  const projectedNotes = useMemo(() => {
    if (!isOverlayActive) return [];
    return CARTOGRAPHIC_NOTES.filter((note) =>
      note.snapshots.includes(activeSnapshot)
    ).map((note) => ({
      note,
      pt: geo.project(note.coordinates),
    }));
  }, [isOverlayActive, activeSnapshot, geo]);

  // Zoom por botão (centrado no centro do viewBox)
  const applyZoomFactor = useCallback((factor: number) => {
    setTransform((prev) => {
      const nextScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, prev.scale * factor)
      );
      const ratio = prev.scale > 0 ? nextScale / prev.scale : 1;
      return clampTransform({
        scale: nextScale,
        x: prev.x * ratio,
        y: prev.y * ratio,
      });
    });
  }, []);

  const handleResetView = useCallback(() => {
    setTransform(DEFAULT_TRANSFORM);
  }, []);

  // Pan via pointer events
  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<SVGSVGElement>) => {
      if (e.button !== 0) return;
      const target = e.target as Element | null;
      if (target?.closest('[data-map-interactive="true"]')) return;

      setActiveNote(null);

      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // noop: alguns navegadores/touchpads podem rejeitar setPointerCapture
      }
      setIsDragging(true);
      didDragRef.current = false;
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
      const origin = dragOriginRef.current;
      const svgEl = svgRef.current;
      if (!isDragging || !origin || !svgEl) return;

      if (
        Math.hypot(e.clientX - origin.clientX, e.clientY - origin.clientY) > 4
      ) {
        didDragRef.current = true;
      }

      const rect = svgEl.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const scaleToViewBox = VIEWBOX_SIZE / Math.min(rect.width, rect.height);
      const dx = (e.clientX - origin.clientX) * scaleToViewBox;
      const dy = (e.clientY - origin.clientY) * scaleToViewBox;
      const nextX = origin.startX + dx;
      const nextY = origin.startY + dy;

      setTransform((prev) =>
        clampTransform({
          scale: prev.scale,
          x: nextX,
          y: nextY,
        })
      );
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(
    (e: ReactPointerEvent<SVGSVGElement>) => {
      if (isDragging || dragOriginRef.current !== null) {
        try {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        } catch {
          // noop: ignora NotFoundError / InvalidStateError ao liberar captura
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

  const openNotePopup = useCallback(
    (note: CartographicNote, clientX?: number, clientY?: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (clientX !== undefined && clientY !== undefined) {
        setActiveNote((prev) =>
          prev?.note.id === note.id
            ? null
            : {
                note,
                x: clientX - rect.left,
                y: clientY - rect.top,
              }
        );
      } else {
        setActiveNote((prev) =>
          prev?.note.id === note.id
            ? null
            : {
                note,
                x: rect.width * 0.5,
                y: rect.height * 0.42,
              }
        );
      }
    },
    []
  );

  // Escala inversa suave para marcadores e textos permanecerem legíveis no zoom
  const invScale = 1 / transform.scale;
  const markerInvScale = 1 / Math.sqrt(transform.scale);

  // Clip ativo conforme recorte temporal (sem AC antes de 1903)
  const activeLandClipUrl = isPre1903
    ? 'url(#brazil-pre1903-clip)'
    : 'url(#brazil-land-clip)';

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none"
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        overflow="visible"
        className={`relative w-full h-full block overflow-visible ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        role="img"
        aria-label="Mapa vetorial interativo da formação histórica do Brasil"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onLostPointerCapture={handlePointerUp}
      >
        <defs>
          {/* Recorte (clip) com a silhueta completa do Brasil (27 UFs) */}
          <clipPath id="brazil-land-clip">
            <path d={geo.outlinePath} />
          </clipPath>

          {/* Recorte (clip) pré-1903 (26 UFs, excluindo o Acre) */}
          <clipPath id="brazil-pre1903-clip">
            <path d={geo.outlinePre1903Path} />
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

        {/* Grupo transformável (Zoom + Pan centrado) */}
        <g
          transform={`translate(${VIEWBOX_SIZE / 2 + transform.x}, ${
            VIEWBOX_SIZE / 2 + transform.y
          }) scale(${transform.scale}) translate(${-VIEWBOX_SIZE / 2}, ${
            -VIEWBOX_SIZE / 2
          })`}
        >
          {/* CAMADA 1: Retícula geográfica de carta antiga (meridianos, paralelos e linhas astronômicas) */}
          {layers.showGraticule && (
            <g pointerEvents="none">
              <path
                d={geo.graticuleMinorPath}
                fill="none"
                stroke="#C97338"
                strokeWidth={0.9 * invScale}
                strokeDasharray="4 3"
                opacity={0.58}
              />
              <path
                d={geo.graticuleMajorPath}
                fill="none"
                stroke="#B85E28"
                strokeWidth={1.15 * invScale}
                opacity={0.74}
              />
              <path
                d={geo.equatorPath}
                fill="none"
                stroke="#A84C20"
                strokeWidth={1.35 * invScale}
                strokeDasharray="8 3 2 3"
                opacity={0.82}
              />
              <path
                d={geo.capricornPath}
                fill="none"
                stroke="#A84C20"
                strokeWidth={1.25 * invScale}
                strokeDasharray="6 3 1.5 3"
                opacity={0.78}
              />
              <path
                d={geo.cancerPath}
                fill="none"
                stroke="#A84C20"
                strokeWidth={1.25 * invScale}
                strokeDasharray="6 3 1.5 3"
                opacity={0.78}
              />
            </g>
          )}

          {/* CAMADA 2: Território Base — sombra vetorial leve (sem feDropShadow) + malha histórica */}
          {/* 2A. Contorno de referência do Acre (AC) fora do Brasil antes de 1903 */}
          {isPre1903 && geo.acreState && (
            <path
              d={geo.acreState.d}
              fill="#F3E4CE"
              fillOpacity={0.68}
              stroke="#A67A50"
              strokeWidth={1.1 * invScale}
              strokeDasharray="4 3"
              onMouseEnter={() => {
                setHoveredState(null);
                setHoveredProvinceName(
                  'Território do Acre (Bolívia até 1903)'
                );
              }}
              onMouseLeave={() => setHoveredProvinceName(null)}
            />
          )}

          {/* 2B. Modo Colônia (1500, 1534, 1750): silhueta pré-1903 translúcida como referência espacial */}
          {isColonial && (
            <g>
              <path
                d={geo.outlinePre1903Path}
                transform="translate(0, 3)"
                fill="#5A3014"
                fillOpacity={0.09}
                pointerEvents="none"
              />
              <path
                d={geo.outlinePre1903Path}
                fill="#EEDBC1"
                fillOpacity={activeSnapshot === 'madri_1750' ? 0.82 : 0.62}
                stroke="#B07E4F"
                strokeWidth={1.2 * invScale}
                strokeDasharray={
                  activeSnapshot === 'madri_1750' ? undefined : '4 3'
                }
              />
            </g>
          )}

          {/* 2C. Modo Império (1850): 19 Províncias Imperiais unificadas via topojson.merge */}
          {isImperial && (
            <g>
              <path
                d={geo.outlinePre1903Path}
                transform="translate(0, 3)"
                fill="#5A3014"
                fillOpacity={0.09}
                pointerEvents="none"
              />
              <path
                d={geo.outlinePre1903Path}
                fill="#EEDBC1"
                stroke="#2B4570"
                strokeWidth={1.4 * invScale}
                pointerEvents="none"
              />
              {geo.imperialProvinces1850.map((prov) => {
                const isHovered = hoveredProvinceName === prov.name;
                return (
                  <path
                    key={prov.id}
                    d={prov.d}
                    fill={isHovered ? '#E4CAA6' : '#EEDBC1'}
                    stroke="#2B4570"
                    strokeWidth={(isHovered ? 1.35 : 0.9) * invScale}
                    strokeOpacity={isHovered ? 0.95 : 0.65}
                    className="transition-colors duration-150 cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredState(null);
                      setHoveredProvinceName(prov.name);
                    }}
                    onMouseLeave={() =>
                      setHoveredProvinceName((prev) =>
                        prev === prov.name ? null : prev
                      )
                    }
                    onClick={() => {
                      if (didDragRef.current) return;
                      const firstUf = prov.states[0];
                      if (firstUf) onSelectState?.(firstUf);
                    }}
                  />
                );
              })}
            </g>
          )}

          {/* 2D. Modo República (1889–atual) ou sem recorte territorial: malha completa das 27 UFs */}
          {!isColonial && !isImperial && (
            <g>
              <path
                d={geo.outlinePath}
                transform="translate(0, 3)"
                fill="#5A3014"
                fillOpacity={0.09}
                pointerEvents="none"
              />
              <path
                d={geo.outlinePath}
                fill="#EEDBC1"
                stroke="#B07E4F"
                strokeWidth={1.3 * invScale}
                pointerEvents="none"
              />

              {geo.states.map(({ properties, d }) => {
                const isHovered =
                  !layers.showDarcyBrasis &&
                  hoveredState?.sigla === properties.sigla;

                return (
                  <path
                    key={properties.sigla}
                    d={d}
                    fill={isHovered ? '#E5CCA8' : '#EEDBC1'}
                    stroke={isHovered ? '#7A4E28' : 'none'}
                    strokeWidth={1 * invScale}
                    className="transition-colors duration-150 cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredProvinceName(null);
                      setHoveredState(properties);
                    }}
                    onMouseLeave={() =>
                      setHoveredState((prev) =>
                        prev?.sigla === properties.sigla ? null : prev
                      )
                    }
                    onClick={() => {
                      if (didDragRef.current) return;
                      onSelectState?.(properties.sigla);
                    }}
                  />
                );
              })}
            </g>
          )}

          {/* Prolongamento sutil da retícula sobre o continente (estilo gravura cartográfica antiga) */}
          {layers.showGraticule && (
            <g pointerEvents="none">
              <g clipPath={activeLandClipUrl} style={{ mixBlendMode: 'multiply' }}>
                <path
                  d={geo.graticuleMinorPath}
                  fill="none"
                  stroke="#C97338"
                  strokeWidth={0.8 * invScale}
                  strokeDasharray="4 3"
                  opacity={0.34}
                />
                <path
                  d={geo.graticuleMajorPath}
                  fill="none"
                  stroke="#B85E28"
                  strokeWidth={1.0 * invScale}
                  opacity={0.46}
                />
                <path
                  d={geo.equatorPath}
                  fill="none"
                  stroke="#A84C20"
                  strokeWidth={1.2 * invScale}
                  strokeDasharray="8 3 2 3"
                  opacity={0.55}
                />
                <path
                  d={geo.capricornPath}
                  fill="none"
                  stroke="#A84C20"
                  strokeWidth={1.15 * invScale}
                  strokeDasharray="6 3 1.5 3"
                  opacity={0.52}
                />
              </g>
              {geo.graticuleLabels.map((lbl) => (
                <text
                  key={lbl.text}
                  x={lbl.pt[0]}
                  y={lbl.pt[1]}
                  fill="#9A481E"
                  fontSize={8.5 * markerInvScale}
                  fontFamily="var(--font-serif)"
                  fontStyle="italic"
                  fontWeight={600}
                  letterSpacing="0.04em"
                  textAnchor="middle"
                  opacity={0.82}
                >
                  {lbl.text}
                </text>
              ))}
            </g>
          )}

          {/* CAMADA 3: Os 5 Brasis de Darcy Ribeiro — zonas contínuas sem rigidez estadual */}
          {layers.showDarcyBrasis && (
            <g clipPath={activeLandClipUrl}>
              <g style={{ mixBlendMode: 'multiply' }}>
                {geo.darcyBrasisRegions.map((region) => {
                  const isSelected = selectedBrasilId === region.id;
                  const isHovered = hoveredBrasilId === region.id;
                  const fillOpacity =
                    selectedBrasilId === null
                      ? isHovered
                        ? 0.48
                        : 0.34
                      : isSelected
                        ? 0.56
                        : isHovered
                          ? 0.24
                          : 0.14;

                  return (
                    <path
                      key={`brasil-zone-${region.id}`}
                      d={region.d}
                      fill={region.fillColor}
                      fillOpacity={fillOpacity}
                      className="transition-opacity duration-150 cursor-pointer"
                      onMouseEnter={() => setHoveredBrasilId(region.id)}
                      onMouseLeave={() =>
                        setHoveredBrasilId((prev) =>
                          prev === region.id ? null : prev
                        )
                      }
                      onClick={() => {
                        if (didDragRef.current) return;
                        onSelectBrasil?.(region.id);
                      }}
                    />
                  );
                })}
              </g>

              {/* Fronteiras culturais curvas pontilhadas entre os 5 Brasis */}
              <path
                d={geo.darcyBrasisBoundariesD}
                fill="none"
                stroke="#231B14"
                strokeWidth={2.4 * invScale}
                strokeOpacity={0.34}
                pointerEvents="none"
              />
              <path
                d={geo.darcyBrasisBoundariesD}
                fill="none"
                stroke="#FAF3E6"
                strokeWidth={1.55 * invScale}
                strokeDasharray={`${2.2 * invScale} ${3.4 * invScale}`}
                strokeLinecap="round"
                strokeOpacity={0.95}
                pointerEvents="none"
              />
            </g>
          )}

          {/* CAMADA 4: Matrizes Indígenas com padrões SVG + multiply */}
          {layers.showIndigenousMatrices && (
            <g
              clipPath={activeLandClipUrl}
              style={{ mixBlendMode: 'multiply' }}
              pointerEvents="none"
            >
              {geo.indigenousRegions.map((region) => {
                if (!region.meta) return null;
                const isHighlighted =
                  selectedIndigenousId === null ||
                  selectedIndigenousId === region.id;
                return (
                  <g
                    key={`indig-${region.id}`}
                    opacity={isHighlighted ? 0.92 : 0.25}
                    className="transition-opacity duration-200"
                  >
                    {region.polygonsD.map((d, idx) => (
                      <path
                        key={`${region.id}-${idx}`}
                        d={d}
                        fill={`url(#pattern-${region.meta!.pattern})`}
                        stroke={region.meta!.color}
                        strokeWidth={0.9 * invScale}
                        strokeDasharray="3 3"
                        strokeOpacity={0.55}
                      />
                    ))}
                  </g>
                );
              })}
            </g>
          )}

          {/* Divisas interestaduais modernas (suavizadas quando os 5 Brasis estão ativos para evidenciar a continuidade cultural) */}
          {!isColonial && !isImperial && (
            <path
              d={geo.internalBordersPath}
              fill="none"
              stroke={
                layers.showDarcyBrasis
                  ? '#5C4632'
                  : isOverlayActive
                    ? '#2F5D50'
                    : '#BE9568'
              }
              strokeWidth={
                (layers.showDarcyBrasis ? 0.65 : isOverlayActive ? 1.0 : 0.8) *
                invScale
              }
              strokeOpacity={layers.showDarcyBrasis ? 0.22 : 0.72}
              pointerEvents="none"
            />
          )}

          {/* CAMADA 5: Grandes Rios */}
          {layers.showRivers && (
            <g pointerEvents="none">
              {geo.rivers.map((river) => (
                <g key={river.id}>
                  <path
                    d={river.d}
                    fill="none"
                    stroke="#4A7A96"
                    strokeWidth={river.strokeWidth * markerInvScale}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeOpacity={0.68}
                  />
                  {river.labelPt && (
                    <text
                      x={river.labelPt[0]}
                      y={river.labelPt[1]}
                      transform={
                        river.labelRotation
                          ? `rotate(${river.labelRotation}, ${river.labelPt[0]}, ${river.labelPt[1]})`
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
              ))}
            </g>
          )}

          {/* CAMADA 6: Recorte Territorial Histórico */}
          {isOverlayActive && projectedOverlay && (
            <g key={projectedOverlay.id} pointerEvents="none">
              <g clipPath={activeLandClipUrl}>
                {projectedOverlay.highlightAreaD && (
                  <path
                    d={projectedOverlay.highlightAreaD}
                    fill={activeSnapshotMeta.color}
                    fillOpacity={0.22}
                  />
                )}
                {projectedOverlay.spanishAreaD && (
                  <path
                    d={projectedOverlay.spanishAreaD}
                    fill="#1E242B"
                    fillOpacity={0.05}
                  />
                )}
                {activeSnapshot === 'madri_1750' && (
                  <path
                    d={geo.outlinePre1903Path}
                    fill="#8F3E28"
                    fillOpacity={0.11}
                  />
                )}
                {projectedOverlay.capitanias?.map((cap) => (
                  <g key={cap.id}>
                    <path
                      d={cap.d}
                      fill={cap.fill}
                      fillOpacity={0.18}
                      stroke="#A1462C"
                      strokeWidth={0.95 * invScale}
                      strokeOpacity={0.72}
                    />
                    {cap.labelPt && (
                      <text
                        x={cap.labelPt[0]}
                        y={cap.labelPt[1]}
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
                ))}
              </g>

              {projectedOverlay.secondaryLineD && (
                <path
                  d={projectedOverlay.secondaryLineD}
                  fill="none"
                  stroke="#B85336"
                  strokeWidth={1.25 * invScale}
                  strokeDasharray="4 5"
                  strokeOpacity={0.52}
                />
              )}

              {projectedOverlay.meridianLineD && (
                <path
                  d={projectedOverlay.meridianLineD}
                  fill="none"
                  stroke="#B85336"
                  strokeWidth={2.3 * markerInvScale}
                  strokeDasharray="7 4"
                  strokeOpacity={0.92}
                />
              )}

              {projectedOverlay.borderLineD && (
                <path
                  d={projectedOverlay.borderLineD}
                  fill="none"
                  stroke="#8F3E28"
                  strokeWidth={2.6 * markerInvScale}
                  strokeDasharray="8 3 2 3"
                  strokeLinecap="round"
                  strokeOpacity={0.92}
                />
              )}

              {projectedOverlay.capitalMarker?.pt && (
                <g
                  transform={`translate(${projectedOverlay.capitalMarker.pt[0]}, ${projectedOverlay.capitalMarker.pt[1]})`}
                >
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
                    {projectedOverlay.capitalMarker.name}
                  </text>
                </g>
              )}

              {projectedOverlay.labels.map((lbl, idx) => {
                if (!lbl.pt) return null;
                return (
                  <g
                    key={`overlay-lbl-${idx}`}
                    transform={`translate(${lbl.pt[0]}, ${lbl.pt[1]})${
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

          {/* Rótulos e cidades-referência dos 5 Brasis de Darcy Ribeiro */}
          {layers.showDarcyBrasis && (
            <g pointerEvents="none">
              {geo.darcyBrasisCities.map((city) => {
                if (!city.pt) return null;
                const isDimmed =
                  selectedBrasilId !== null &&
                  selectedBrasilId !== city.brasilId;
                return (
                  <g
                    key={`brasil-city-${city.name}`}
                    transform={`translate(${city.pt[0]}, ${city.pt[1]})`}
                    opacity={isDimmed ? 0.35 : 0.95}
                  >
                    <circle
                      r={2.8 * markerInvScale}
                      fill="#1E242B"
                      stroke="#FAF3E6"
                      strokeWidth={1.1 * markerInvScale}
                    />
                    <text
                      x={city.dx * markerInvScale}
                      y={city.dy * markerInvScale}
                      fill="#1E242B"
                      fontSize={9.5 * markerInvScale}
                      fontFamily="var(--font-serif)"
                      fontWeight={700}
                      textAnchor={city.anchor}
                      stroke="#FAF3E6"
                      strokeWidth={2.5 * markerInvScale}
                      paintOrder="stroke"
                    >
                      {city.name}
                    </text>
                  </g>
                );
              })}

              {geo.brasisLabels.map(({ brasil, pt }) => {
                if (!pt) return null;
                const isSelected = selectedBrasilId === brasil.id;
                const isDimmed =
                  selectedBrasilId !== null && selectedBrasilId !== brasil.id;
                return (
                  <g
                    key={`lbl-brasil-${brasil.id}`}
                    transform={`translate(${pt[0]}, ${pt[1]})`}
                    opacity={isDimmed ? 0.35 : 0.94}
                  >
                    <text
                      fill={brasil.color}
                      fontSize={(isSelected ? 13 : 11.5) * markerInvScale}
                      fontFamily="var(--font-serif)"
                      fontWeight={700}
                      letterSpacing="0.05em"
                      textAnchor="middle"
                      stroke="#FAF3E6"
                      strokeWidth={3.2 * markerInvScale}
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
              {geo.indigenousRegions.map((region) => {
                if (!region.meta || !region.labelPt) return null;
                return (
                  <text
                    key={`lbl-indig-${region.id}`}
                    x={region.labelPt[0]}
                    y={region.labelPt[1]}
                    fill={region.meta.color}
                    fontSize={9.5 * markerInvScale}
                    fontFamily="var(--font-serif)"
                    fontStyle="italic"
                    fontWeight={700}
                    textAnchor="middle"
                    stroke="#F7F3E9"
                    strokeWidth={2.6 * markerInvScale}
                    paintOrder="stroke"
                  >
                    {region.meta.name}
                  </text>
                );
              })}
            </g>
          )}

          {/* CAMADA 7: Fios de Continuidade (arcos Bézier pré-calculados) */}
          {layers.showContinuityArcs && (
            <g pointerEvents="none">
              {projectedThreads.map(({ thread, segments }) => {
                if (segments.length === 0) return null;
                const isSelected = selectedThreadId === thread.id;
                const isDimmed =
                  selectedThreadId !== null && selectedThreadId !== thread.id;

                return (
                  <g
                    key={thread.id}
                    opacity={isDimmed ? 0.16 : isSelected ? 0.95 : 0.58}
                    className="transition-opacity duration-200"
                  >
                    {segments.map((seg) => (
                      <path
                        key={seg.key}
                        d={seg.d}
                        fill="none"
                        stroke={thread.color}
                        strokeWidth={(isSelected ? 2.4 : 1.4) * markerInvScale}
                        strokeDasharray={isSelected ? undefined : '5 4'}
                        strokeLinecap="round"
                      />
                    ))}
                  </g>
                );
              })}
            </g>
          )}

          {/* CAMADA 8: Marcadores dos Eventos Históricos */}
          {layers.showEvents && (
            <g>
              {projectedEvents.map(({ event, pt }) => {
                if (!pt) return null;
                const eraColor = ERAS[event.era].color;
                const isSelected = selectedEventId === event.id;
                const isHovered = tooltip?.event.id === event.id;
                const radius =
                  (isSelected ? 14 : isHovered ? 12.5 : 11) * markerInvScale;

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
                      setActiveNote(null);
                      onSelectEvent(event.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveNote(null);
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

                    <circle
                      r={radius}
                      fill={eraColor}
                      stroke="#F7F3E9"
                      strokeWidth={2 * markerInvScale}
                    />

                    <g
                      transform={`translate(${-6.5 * markerInvScale}, ${
                        -6.5 * markerInvScale
                      }) scale(${markerInvScale})`}
                      className="text-parchment"
                      pointerEvents="none"
                    >
                      <MapSymbol symbol={event.symbol} size={13} />
                    </g>

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

          {/* CAMADA 9: Marcadores contextuais "?" de notas cartográficas */}
          {projectedNotes.length > 0 && (
            <g>
              {projectedNotes.map(({ note, pt }) => {
                if (!pt) return null;
                const isOpen = activeNote?.note.id === note.id;
                const r = (isOpen ? 10 : 8.5) * markerInvScale;

                return (
                  <g
                    key={note.id}
                    data-map-interactive="true"
                    transform={`translate(${pt[0]}, ${pt[1]})`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Nota cartográfica: ${note.title}`}
                    aria-expanded={isOpen}
                    className="cursor-pointer focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      openNotePopup(note, e.clientX, e.clientY);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openNotePopup(note);
                      }
                    }}
                  >
                    {isOpen && (
                      <circle
                        r={r + 4 * markerInvScale}
                        fill="#C68B2C"
                        fillOpacity={0.18}
                        stroke="#C68B2C"
                        strokeWidth={1.1 * markerInvScale}
                        strokeDasharray="2 2"
                      />
                    )}
                    <circle
                      r={r}
                      fill={isOpen ? '#C68B2C' : '#F7F3E9'}
                      stroke="#C68B2C"
                      strokeWidth={1.6 * markerInvScale}
                    />
                    <text
                      y={3.4 * markerInvScale}
                      textAnchor="middle"
                      fontSize={10.5 * markerInvScale}
                      fontFamily="var(--font-serif)"
                      fontWeight={700}
                      fill={isOpen ? '#F7F3E9' : '#8A5B14'}
                      pointerEvents="none"
                    >
                      ?
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </g>

        {/* Ornamento fixo: Rosa dos Ventos Editorial (canto inferior esquerdo) */}
        <g
          transform="translate(64, 824)"
          opacity={0.82}
          pointerEvents="none"
          aria-hidden="true"
        >
          <circle
            cx="0"
            cy="0"
            r="26"
            fill="#F5E8D5"
            fillOpacity="0.78"
            stroke="#B8733E"
            strokeWidth="1"
          />
          <circle
            cx="0"
            cy="0"
            r="22"
            fill="none"
            stroke="#C97338"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          <polygon points="0,-20 3.5,-3.5 0,0" fill="#1E242B" />
          <polygon points="0,-20 -3.5,-3.5 0,0" fill="#B85336" />
          <polygon
            points="0,20 3.5,3.5 0,0"
            fill="#DCD3BE"
            stroke="#555B61"
            strokeWidth="0.5"
          />
          <polygon points="0,20 -3.5,3.5 0,0" fill="#555B61" />
          <polygon points="20,0 3.5,3.5 0,0" fill="#555B61" />
          <polygon
            points="20,0 3.5,-3.5 0,0"
            fill="#DCD3BE"
            stroke="#555B61"
            strokeWidth="0.5"
          />
          <polygon points="-20,0 -3.5,-3.5 0,0" fill="#555B61" />
          <polygon
            points="-20,0 -3.5,3.5 0,0"
            fill="#DCD3BE"
            stroke="#555B61"
            strokeWidth="0.5"
          />
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
      <div className="pointer-events-none absolute top-4 left-4 max-w-xs rounded border border-parchment-border bg-parchment px-3.5 py-2.5 shadow-sm">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
          Carta Histórica · Projeção Mercator
        </p>
        <p className="font-serif text-base font-semibold leading-tight text-ink mt-0.5">
          {isOverlayActive
            ? activeSnapshotMeta.label
            : 'Território Brasileiro (27 UFs)'}
        </p>

        {hoveredProvinceName && (
          <p className="mt-1 text-xs text-ink-muted">
            <span className="font-semibold text-ink">
              {hoveredProvinceName}
            </span>
          </p>
        )}

        {layers.showDarcyBrasis && hoveredBrasilId && (
          <p className="mt-1 text-xs text-ink-muted">
            Área cultural:{' '}
            <span className="font-semibold text-ink">
              {brasilById.get(hoveredBrasilId)?.name}
            </span>
          </p>
        )}

        {!hoveredProvinceName && hoveredState && (
          <p className="mt-1 text-xs text-ink-muted">
            UF:{' '}
            <span className="font-semibold text-ink">
              {hoveredState.nome} ({hoveredState.sigla})
            </span>
          </p>
        )}

        {isColonial && (
          <p className="mt-1.5 pt-1.5 border-t border-parchment-border/80 text-[11px] italic text-ink-muted leading-snug">
            Contorno atual (sem o Acre) exibido apenas como referência
            geográfica. Clique nos selos{' '}
            <span className="font-serif font-bold not-italic text-ochre">?</span>{' '}
            para detalhes.
          </p>
        )}

        {isImperial && (
          <p className="mt-1.5 pt-1.5 border-t border-parchment-border/80 text-[11px] italic text-ink-muted leading-snug">
            Províncias imperiais unificadas (1850); Acre em tracejado (Bolívia
            até 1903). Clique nos selos{' '}
            <span className="font-serif font-bold not-italic text-ochre">?</span>{' '}
            para detalhes.
          </p>
        )}
      </div>

      {/* Legenda interativa "Os Brasis" (fiel ao diagrama de Darcy Ribeiro) */}
      {layers.showDarcyBrasis && (
        <div
          aria-label="Legenda Os Brasis de Darcy Ribeiro"
          className="absolute bottom-4 left-4 z-10 rounded border border-parchment-border bg-parchment px-3 py-2.5 shadow-sm"
        >
          <p className="font-serif text-sm font-bold text-ink pb-1 mb-1.5 border-b border-ink/45">
            Os Brasis
          </p>
          <div className="flex flex-col gap-1">
            {geo.darcyBrasisRegions.map((region) => {
              const isSelected = selectedBrasilId === region.id;
              return (
                <button
                  key={`legend-${region.id}`}
                  type="button"
                  onClick={() => onSelectBrasil?.(region.id)}
                  className={`flex items-center gap-2 rounded px-1.5 py-0.5 text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-parchment-surface font-bold text-ink ring-1 ring-ink/20'
                      : 'text-ink hover:bg-parchment-surface/80'
                  }`}
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-[2px] border border-ink/20"
                    style={{ backgroundColor: region.fillColor }}
                    aria-hidden="true"
                  />
                  <span className="font-serif text-[13px] font-semibold leading-tight">
                    {region.legendLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Controles de Zoom & Pan (canto inferior direito) */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1 rounded-md border border-parchment-border bg-parchment p-1 shadow-sm">
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

      {/* Popup Editorial de Nota Cartográfica "?" */}
      {activeNote && (
        <div
          role="dialog"
          aria-label={activeNote.note.title}
          className="absolute z-30 w-80 max-w-[calc(100%-2rem)] rounded-lg border border-ochre/50 bg-parchment p-4 shadow-xl"
          style={{
            left: Math.max(
              16,
              Math.min(
                activeNote.x + 14,
                (containerRef.current?.clientWidth ?? 800) - 336
              )
            ),
            top: Math.max(
              16,
              Math.min(
                activeNote.y - 24,
                (containerRef.current?.clientHeight ?? 600) - 210
              )
            ),
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-ochre/35 bg-ochre/12 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink">
              <span className="font-serif font-bold text-ochre">?</span>
              {activeNote.note.badgeLabel}
            </span>
            <button
              type="button"
              onClick={() => setActiveNote(null)}
              className="rounded p-1 text-ink-muted hover:bg-parchment-surface hover:text-ink transition-colors"
              aria-label="Fechar nota cartográfica"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <h3 className="font-serif text-lg font-semibold leading-snug text-ink mt-2">
            {activeNote.note.title}
          </h3>
          <p className="font-sans text-xs text-ink-muted leading-relaxed mt-1.5">
            {activeNote.note.explanation}
          </p>
        </div>
      )}

      {/* Tooltip editorial flutuante para eventos históricos */}
      {tooltip && (
        <div
          className="pointer-events-none absolute z-20 w-72 rounded-md border border-parchment-border bg-parchment p-3 shadow-lg transition-opacity duration-100"
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
