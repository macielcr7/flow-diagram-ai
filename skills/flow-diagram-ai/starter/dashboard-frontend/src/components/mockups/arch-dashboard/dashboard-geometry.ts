import type { ArchNode, Conn } from "./dashboard-types";

export type OrthPathResult = {
  d: string;
  lx: number;
  ly: number;
  ex: number;
  ey: number;
  handleX: number;
  handleY: number;
  routeAxis: "x" | "y";
  dragAxis: "x" | "y";
};

function getAxisXPath(
  fn: ArchNode,
  tn: ArchNode,
  conn?: Pick<Conn, "routing">,
): OrthPathResult {
  const fcx = fn.x + fn.w / 2;
  const fcy = fn.y + fn.h / 2;
  const tcx = tn.x + tn.w / 2;
  const tcy = tn.y + tn.h / 2;
  const manualX = conn?.routing?.axis === "x" ? conn.routing.value : null;

  const sx =
    manualX === null
      ? tcx >= fcx
        ? fn.x + fn.w
        : fn.x
      : manualX >= fcx
        ? fn.x + fn.w
        : fn.x;
  const sy = fcy;
  const ex =
    manualX === null
      ? tcx >= fcx
        ? tn.x
        : tn.x + tn.w
      : manualX >= tcx
        ? tn.x + tn.w
        : tn.x;
  const ey = tcy;
  const midX = manualX ?? (sx + ex) / 2;
  const isStraight = manualX === null && Math.abs(sy - ey) < 2;

  if (isStraight) {
    return {
      d: `M${sx},${sy} L${ex},${ey}`,
      lx: (sx + ex) / 2,
      ly: sy - 10,
      ex,
      ey,
      handleX: (sx + ex) / 2,
      handleY: sy,
      routeAxis: "x",
      dragAxis: "y",
    };
  }

  return {
    d: `M${sx},${sy} L${midX},${sy} L${midX},${ey} L${ex},${ey}`,
    lx: midX,
    ly: (sy + ey) / 2 - 10,
    ex,
    ey,
    handleX: midX,
    handleY: (sy + ey) / 2,
    routeAxis: "x",
    dragAxis: "x",
  };
}

function getAxisYPath(
  fn: ArchNode,
  tn: ArchNode,
  conn?: Pick<Conn, "routing">,
): OrthPathResult {
  const fcx = fn.x + fn.w / 2;
  const fcy = fn.y + fn.h / 2;
  const tcx = tn.x + tn.w / 2;
  const tcy = tn.y + tn.h / 2;
  const manualY = conn?.routing?.axis === "y" ? conn.routing.value : null;

  const sx = fcx;
  const sy =
    manualY === null
      ? tcy >= fcy
        ? fn.y + fn.h
        : fn.y
      : manualY >= fcy
        ? fn.y + fn.h
        : fn.y;
  const ex = tcx;
  const ey =
    manualY === null
      ? tcy >= fcy
        ? tn.y
        : tn.y + tn.h
      : manualY >= tcy
        ? tn.y + tn.h
        : tn.y;
  const midY = manualY ?? (sy + ey) / 2;
  const isStraight = manualY === null && Math.abs(sx - ex) < 2;

  if (isStraight) {
    return {
      d: `M${sx},${sy} L${ex},${ey}`,
      lx: sx + 6,
      ly: (sy + ey) / 2,
      ex,
      ey,
      handleX: sx,
      handleY: (sy + ey) / 2,
      routeAxis: "y",
      dragAxis: "x",
    };
  }

  return {
    d: `M${sx},${sy} L${sx},${midY} L${ex},${midY} L${ex},${ey}`,
    lx: (sx + ex) / 2,
    ly: midY - 10,
    ex,
    ey,
    handleX: (sx + ex) / 2,
    handleY: midY,
    routeAxis: "y",
    dragAxis: "y",
  };
}

export function orthPath(
  fn: ArchNode,
  tn: ArchNode,
  conn?: Pick<Conn, "routing">,
): OrthPathResult {
  if (conn?.routing?.axis === "x") {
    return getAxisXPath(fn, tn, conn);
  }

  if (conn?.routing?.axis === "y") {
    return getAxisYPath(fn, tn, conn);
  }

  const fcx = fn.x + fn.w / 2;
  const fcy = fn.y + fn.h / 2;
  const tcx = tn.x + tn.w / 2;
  const tcy = tn.y + tn.h / 2;
  const dx = tcx - fcx;
  const dy = tcy - fcy;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return getAxisXPath(fn, tn, conn);
  }

  return getAxisYPath(fn, tn, conn);
}
