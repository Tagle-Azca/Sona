import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { getFullGraph } from '../services/dgraphService';
import styles from './GraphExplorer.module.css';

const NODE_COLORS = {
  Champion:     '#c89b3c',
  Player:       '#0bc4e3',
  ProPlayer:    '#a78bfa',
  Team:         '#00d4a0',
  Organization: '#e84057',
};

const LINK_COLORS = {
  SYNERGIZES_WITH: '#00d4a0',
  COUNTERS:        '#e84057',
  MAINS:           '#c89b3c',
  PLAYED_WITH:     '#0bc4e3',
  HAS_PLAYER:      '#a78bfa',
  HAS_TEAM:        '#a78bfa',
  PLAYED_FOR:      '#7fa2c8',
  RIVAL_OF:        '#ff8c69',
};

const ALL_NODE_TYPES = Object.keys(NODE_COLORS);
const ALL_LINK_TYPES = Object.keys(LINK_COLORS);

function resolveId(ref) {
  return typeof ref === 'object' ? ref.id : ref;
}

export default function GraphExplorer() {
  const [graphData, setGraphData]     = useState({ nodes: [], links: [] });
  const [loading, setLoading]         = useState(true);
  const [hovered, setHovered]         = useState(null);
  const containerRef                  = useRef();
  const [dims, setDims]               = useState({ w: 800, h: 600 });
  const [visibleNodes, setVisibleNodes] = useState(() => new Set(ALL_NODE_TYPES));
  const [visibleLinks, setVisibleLinks] = useState(() => new Set(ALL_LINK_TYPES));

  useEffect(() => {
    getFullGraph().then((data) => {
      setGraphData(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDims({ w: containerRef.current.offsetWidth, h: containerRef.current.offsetHeight });
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const filteredGraph = useMemo(() => {
    const nodes = graphData.nodes.filter((n) => visibleNodes.has(n.type));
    const nodeIds = new Set(nodes.map((n) => n.id));
    const links = graphData.links.filter(
      (l) =>
        visibleLinks.has(l.type) &&
        nodeIds.has(resolveId(l.source)) &&
        nodeIds.has(resolveId(l.target))
    );
    return { nodes, links };
  }, [graphData, visibleNodes, visibleLinks]);

  function toggleNode(type) {
    setVisibleNodes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  }

  function toggleLink(type) {
    setVisibleLinks((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  }

  const paintNode = useCallback((node, ctx, globalScale) => {
    const color = NODE_COLORS[node.type] || '#ffffff';
    const r = node === hovered ? 8 : 5;

    ctx.shadowBlur  = node === hovered ? 20 : 10;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.shadowBlur = 0;

    if (globalScale > 1.4 || node === hovered) {
      const fontSize = Math.max(8, 11 / globalScale);
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign     = 'center';
      ctx.textBaseline  = 'top';
      ctx.fillStyle     = 'rgba(205, 218, 240, 0.95)';
      ctx.fillText(node.name, node.x, node.y + r + 2);
    }
  }, [hovered]);

  const paintPointer = useCallback((node, color, ctx) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }, []);

  const stats = {
    nodes: filteredGraph.nodes.length,
    links: filteredGraph.links.length,
    types: [...new Set(filteredGraph.nodes.map((n) => n.type))].length,
  };

  return (
    <div className={styles.page}>
      <div className={styles.sidebar}>
        <div className={styles.title}>
          <i className={`fi fi-rr-network ${styles.titleIcon}`} />
          <div>
            <h2>Grafo Dgraph</h2>
            <p>Filtros activos</p>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}><span className={styles.statNum}>{stats.nodes}</span><span className={styles.statLabel}>nodos</span></div>
          <div className={styles.statItem}><span className={styles.statNum}>{stats.links}</span><span className={styles.statLabel}>aristas</span></div>
          <div className={styles.statItem}><span className={styles.statNum}>{stats.types}</span><span className={styles.statLabel}>tipos</span></div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Nodos</div>
          {Object.entries(NODE_COLORS).map(([type, color]) => {
            const on = visibleNodes.has(type);
            return (
              <button
                key={type}
                className={`${styles.toggleItem} ${!on ? styles.toggleOff : ''}`}
                onClick={() => toggleNode(type)}
              >
                <span
                  className={styles.dot}
                  style={{ background: on ? color : '#2a3a50', boxShadow: on ? `0 0 6px ${color}` : 'none' }}
                />
                <span>{type}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Aristas</div>
          {Object.entries(LINK_COLORS).map(([type, color]) => {
            const on = visibleLinks.has(type);
            return (
              <button
                key={type}
                className={`${styles.toggleItem} ${!on ? styles.toggleOff : ''}`}
                onClick={() => toggleLink(type)}
              >
                <span className={styles.line} style={{ background: on ? color : '#2a3a50' }} />
                <span className={styles.edgeLabel}>{type}</span>
              </button>
            );
          })}
        </div>

        {hovered && (
          <div className={styles.tooltip}>
            <div className={styles.tooltipType} style={{ color: NODE_COLORS[hovered.type] }}>{hovered.type}</div>
            <div className={styles.tooltipName}>{hovered.name}</div>
          </div>
        )}

        <div className={styles.hint}>Scroll zoom · Drag nodos · Click tipo para mostrar/ocultar</div>
      </div>

      <div ref={containerRef} className={styles.canvas}>
        {loading ? (
          <div className={styles.loading}>
            <span className={styles.loadingDot} />
            Cargando grafo...
          </div>
        ) : (
          <ForceGraph2D
            graphData={filteredGraph}
            width={dims.w}
            height={dims.h}
            backgroundColor="#080f1a"
            nodeCanvasObject={paintNode}
            nodePointerAreaPaint={paintPointer}
            onNodeHover={setHovered}
            linkColor={(l) => LINK_COLORS[l.type] || '#1e3a5f'}
            linkWidth={(l) => l.type === 'RIVAL_OF' ? 2 : 1}
            linkDirectionalArrowLength={4}
            linkDirectionalArrowRelPos={1}
            linkDirectionalParticles={(l) => l.type === 'SYNERGIZES_WITH' ? 2 : 0}
            linkDirectionalParticleColor={(l) => LINK_COLORS[l.type]}
            linkDirectionalParticleSpeed={0.004}
            cooldownTicks={120}
          />
        )}
      </div>
    </div>
  );
}
