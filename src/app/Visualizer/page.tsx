"use client";

import SortingVisualizer from '@/components/SortingVisualizer';
import CodeEditor from "@/components/CodeEditor";


export default function VisualizerPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sorting Visualizer</h1>
      <SortingVisualizer isPlaying={true} speed={2} onComplete={() => {}} />
    </div>
  );
}