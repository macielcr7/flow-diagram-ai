import { useRef, useState, type MouseEvent } from "react";

import type { ArchNode } from "../dashboard-types";
import {
  DEFAULT_PAN,
  DEFAULT_ZOOM,
  type Point,
} from "./diagram-editor-types";

type PanRef = {
  sx: number;
  sy: number;
  px: number;
  py: number;
};

export function useDiagramViewport() {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [pan, setPan] = useState<Point>(DEFAULT_PAN);
  const [isPanning, setIsPanning] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const panRef = useRef<PanRef | null>(null);

  const svgPt = (e: { clientX: number; clientY: number }) => {
    const rect = svgRef.current!.getBoundingClientRect();

    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom,
    };
  };

  const beginPan = (e: MouseEvent<SVGSVGElement>) => {
    panRef.current = { sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y };
    setIsPanning(true);
  };

  const updatePan = (e: MouseEvent<HTMLDivElement>) => {
    if (!panRef.current) return;

    setPan({
      x: panRef.current.px + (e.clientX - panRef.current.sx),
      y: panRef.current.py + (e.clientY - panRef.current.sy),
    });
  };

  const stopPan = () => {
    panRef.current = null;
    setIsPanning(false);
  };

  const zoomIn = () => {
    setZoom((value) => Math.min(value + 0.1, 2.5));
  };

  const zoomOut = () => {
    setZoom((value) => Math.max(value - 0.1, 0.25));
  };

  const resetViewport = () => {
    setZoom(DEFAULT_ZOOM);
    setPan(DEFAULT_PAN);
  };

  const focusNode = (node: ArchNode) => {
    const bounds = svgRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const nodeCenterX = node.x + node.w / 2;
    const nodeCenterY = node.y + node.h / 2;

    setPan({
      x: bounds.width / 2 - nodeCenterX * zoom,
      y: bounds.height / 2 - nodeCenterY * zoom,
    });
  };

  return {
    zoom,
    pan,
    svgRef,
    isPanning,
    svgPt,
    beginPan,
    updatePan,
    stopPan,
    zoomIn,
    zoomOut,
    resetViewport,
    focusNode,
  };
}
