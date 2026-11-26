import './index.css';
import { requestExpandedMode } from '@devvit/web/client';
import { createRoot } from 'react-dom/client';
import { MatatuMark } from './components/MatatuMark';

export const Splash = () => (
  <main className="splash">
    <div className="brand-mark">
      <MatatuMark />
    </div>
    <p className="eyebrow">A DAILY MATATU PUZZLE · UNTIMED</p>
    <h1>
      One Stop Left<span>.</span>
    </h1>
    <p>
      Daily errands. Tight moves.
      <br />
      One matatu map.
    </p>
    <div className="mini-map" aria-hidden="true">
      <span>
        ●<small>YOU</small>
      </span>
      <i />
      <span>
        ★<small>MARKET</small>
      </span>
      <i />
      <span>
        ★<small>CLINIC</small>
      </span>
      <i />
      <span>
        ★<small>LIBRARY</small>
      </span>
    </div>
    <p>
      Plan every stop. Ride the shortest route.
      <br />
      Can you get everything done?
    </p>
    <button
      className="primary"
      onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
    >
      Play today’s route →
    </button>
    <p className="eyebrow" style={{ marginTop: 16 }}>
      NEW MAP AT 00:00 UTC · PRACTICE INSIDE
    </p>
  </main>
);
createRoot(document.getElementById('root')!).render(<Splash />);
