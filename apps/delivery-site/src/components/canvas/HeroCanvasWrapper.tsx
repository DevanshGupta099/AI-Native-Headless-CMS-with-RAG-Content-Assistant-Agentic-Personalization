'use client';

import dynamic from 'next/dynamic';

const NeuralFlowCanvas = dynamic(
  () => import('./NeuralFlowCanvas'),
  {
    ssr: false,
    loading: () => <div className="h-[360px] w-full rounded-3xl bg-[#080b11] animate-pulse" />,
  }
);

export default function HeroCanvasWrapper() {
  return <NeuralFlowCanvas />;
}
