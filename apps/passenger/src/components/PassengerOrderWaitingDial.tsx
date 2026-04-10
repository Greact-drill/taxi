import { Box, Text } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';

export type PassengerOrderWaitingDialProps = {
  /** UTC instant, ISO 8601 (как у заказа). */
  createdAt: string;
};

const CX = 100;
const CY = 100;
const SECTOR_R = 100;
/** Заливка кругового сектора (клин от центра до дуги), не «кольцо». */
const SECTOR_FILL = 'rgba(37, 99, 235, 0.38)';

function formatElapsed(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Сектор от 12 часов по часовой; угол в градусах 0..360. */
function minuteSectorPath(sweepDeg: number): string {
  if (sweepDeg <= 0) return '';
  const startRad = (-90 * Math.PI) / 180;
  const endRad = ((-90 + sweepDeg) * Math.PI) / 180;
  const x1 = CX + SECTOR_R * Math.cos(startRad);
  const y1 = CY + SECTOR_R * Math.sin(startRad);
  const x2 = CX + SECTOR_R * Math.cos(endRad);
  const y2 = CY + SECTOR_R * Math.sin(endRad);
  const largeArc = sweepDeg > 180 ? 1 : 0;
  return `M ${CX} ${CY} L ${x1} ${y1} A ${SECTOR_R} ${SECTOR_R} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

function useRafNow(): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let frame = 0;
    const loop = () => {
      setNow(Date.now());
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  return now;
}

export function PassengerOrderWaitingDial({ createdAt }: PassengerOrderWaitingDialProps) {
  const createdMs = useMemo(() => new Date(createdAt).getTime(), [createdAt]);
  const now = useRafNow();
  const elapsed = Math.max(0, now - createdMs);

  const wholeMinutes = Math.floor(elapsed / 60_000);
  const minuteSweepDeg = Math.min(360, (wholeMinutes / 60) * 360);
  const secondDeg = ((elapsed / 1000) % 60) * 6;

  const ticks = Array.from({ length: 12 }, (_, i) => {
    const deg = i * 30 - 90;
    const rad = (deg * Math.PI) / 180;
    const x1 = CX + Math.cos(rad) * 82;
    const y1 = CY + Math.sin(rad) * 82;
    const x2 = CX + Math.cos(rad) * 92;
    const y2 = CY + Math.sin(rad) * 92;
    const isMajor = i % 3 === 0;
    return (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth={isMajor ? 2 : 1}
        opacity={isMajor ? 0.45 : 0.25}
      />
    );
  });

  return (
    <Box mt="4" textAlign="center" userSelect="none" pointerEvents="none" color="gray.700">
      <Text fontSize="xs" color="gray.500" mb="2" fontWeight="medium">
        Прошло времени
      </Text>
      <Box maxW="14rem" mx="auto" position="relative">
        <svg
          viewBox="0 0 200 200"
          width="100%"
          height="auto"
          aria-hidden
          style={{ display: 'block' }}
        >
          <circle
            cx={CX}
            cy={CY}
            r="94"
            fill="#f4f4f5"
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="2"
          />

          {minuteSweepDeg >= 360 ? (
            <circle cx={CX} cy={CY} r={SECTOR_R} fill={SECTOR_FILL} />
          ) : minuteSweepDeg > 0 ? (
            <path d={minuteSectorPath(minuteSweepDeg)} fill={SECTOR_FILL} />
          ) : null}

          <g>{ticks}</g>

          <g transform={`rotate(${secondDeg} ${CX} ${CY})`}>
            <line
              x1={CX}
              y1={CY}
              x2={CX}
              y2={42}
              stroke="#e53e3e"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>

          <circle cx={CX} cy={CY} r="5" fill="currentColor" opacity={0.9} />

          <text
            x={CX}
            y={138}
            textAnchor="middle"
            fill="currentColor"
            fontSize="15"
            fontFamily="ui-monospace, monospace"
            fontWeight="600"
            opacity={0.92}
          >
            {formatElapsed(elapsed)}
          </text>
        </svg>
      </Box>
    </Box>
  );
}
