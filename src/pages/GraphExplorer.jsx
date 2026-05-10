import { useState, useEffect, useRef, useCallback } from 'react';
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

export default function GraphExplorer() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(null);
  const containerRef = useRef();
  const [dims, setDims] = useState({ w: 800, h: 600 });

  useEffect(() => {
    getFullGraph().then((data) => {
      setGraphData(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDims({
          w: containerRef.current.offsetWidth,
          h: containerRef.current.offsetHeight,
        });
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const paintNode = useCallback((node, ctx, globalScale) => {
    const color = NODE_COLORS[node.type] || '#ffffff';
    const r = node === hovered ? 8 : 5;

    ctx.shadowBlur = node === hovered ? 20 : 10;
    ctx.shadowColor = color;

    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.shadowBlur = 0;

    if (globalScale > 1.4 || node === hovered) {
      const fontSize = Math.max(8, 11 / globalScale);
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = 'rgba(205, 218, 240, 0.95)';
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
    nodes: graphData.nodes.length,
    links: graphData.links.length,
    types: [...new Set(graphData.nodes.map((n) => n.type))].length,
  };

  return (
    <div className={styles.page}>
      <div className={styles.sidebar}>
        <div className={styles.title}>
          <i className={`fi fi-rr-network ${styles.titleIcon}`} />
          <div>
            <h2>Grafo Dgraph</h2>
            <p>Todos los nodos y aristas</p>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}><span className={styles.statNum}>{stats.nodes}</span><span className={styles.statLabel}>nodos</span></div>
          <div className={styles.statItem}><span className={styles.statNum}>{stats.links}</span><span className={styles.statLabel}>aristas</span></div>
          <div className={styles.statItem}><span className={styles.statNum}>{stats.types}</span><span className={styles.statLabel}>tipos</span></div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Tipos de nodo</div>
          {Object.entries(NODE_COLORS).map(([type, color]) => (
            <div key={type} className={styles.legendItem}>
              <span className={styles.dot} style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
              <span>{type}</span>
            </div>
          ))}
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>Tipos de arista</div>
          {Object.entries(LINK_COLORS).map(([type, color]) => (
            <div key={type} className={styles.legendItem}>
              <span className={styles.line} style={{ background: color }} />
              <span className={styles.edgeLabel}>{type}</span>
            </div>
          ))}
        </div>

        {hovered && (
          <div className={styles.tooltip}>
            <div className={styles.tooltipType} style={{ color: NODE_COLORS[hovered.type] }}>{hovered.type}</div>
            <div className={styles.tooltipName}>{hovered.name}</div>
          </div>
        )}

        <div className={styles.hint}>Scroll para zoom · Arrastra nodos · Hover para ver nombre</div>
      </div>

      <div ref={containerRef} className={styles.canvas}>
        {loading ? (
          <div className={styles.loading}>
            <span className={styles.loadingDot} />
            Cargando grafo...
          </div>
        ) : (
          <ForceGraph2D
            graphData={graphData}
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
