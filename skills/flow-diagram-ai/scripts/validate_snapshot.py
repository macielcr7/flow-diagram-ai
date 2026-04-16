#!/usr/bin/env python3

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path


NODE_TYPES = {
    "SERVICE",
    "DATABASE",
    "QUEUE",
    "EXTERNAL",
    "WORKER",
    "CACHE",
    "GATEWAY",
    "LOAD_BALANCER",
    "AUTH_PROVIDER",
    "OBJECT_STORAGE",
    "CDN",
    "OBSERVABILITY",
    "FEATURE_FLAGS",
    "SEARCH_ENGINE",
    "EMAIL_GATEWAY",
}

HTTP_METHODS = {"GET", "POST", "PUT", "DELETE", "PATCH"}
META_STATUS = {"draft", "analyzed"}
ANALYSIS_SOURCE = {"mock", "ai"}
ROUTE_AXES = {"x", "y"}


def parse_iso_datetime(value: object) -> bool:
    if not isinstance(value, str) or not value:
        return False
    try:
        datetime.fromisoformat(value.replace("Z", "+00:00"))
        return True
    except ValueError:
        return False


def expect(condition: bool, message: str, errors: list[str]) -> None:
    if not condition:
        errors.append(message)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate FlowChartAI dashboard snapshot JSON."
    )
    parser.add_argument("file", help="Path to the JSON snapshot file")
    args = parser.parse_args()

    path = Path(args.file)
    if not path.exists():
        print(f"[ERROR] File not found: {path}", file=sys.stderr)
        return 1

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"[ERROR] Invalid JSON: {exc}", file=sys.stderr)
        return 1

    errors: list[str] = []
    warnings: list[str] = []

    expect(isinstance(data, dict), "Root must be a JSON object.", errors)
    if errors:
        print_errors(errors, warnings)
        return 1

    expect(data.get("version") == 1, "version must be 1.", errors)

    meta = data.get("meta")
    expect(isinstance(meta, dict), "meta must be an object.", errors)
    if isinstance(meta, dict):
        expect(isinstance(meta.get("id"), str) and meta["id"], "meta.id must be a non-empty string.", errors)
        expect(isinstance(meta.get("name"), str) and meta["name"], "meta.name must be a non-empty string.", errors)
        expect(
            isinstance(meta.get("description"), str) and meta["description"],
            "meta.description must be a non-empty string.",
            errors,
        )
        expect(
            isinstance(meta.get("systemSlug"), str) and meta["systemSlug"],
            "meta.systemSlug must be a non-empty string.",
            errors,
        )
        expect(meta.get("status") in META_STATUS, "meta.status must be 'draft' or 'analyzed'.", errors)
        expect(parse_iso_datetime(meta.get("createdAt")), "meta.createdAt must be an ISO-8601 datetime.", errors)
        expect(parse_iso_datetime(meta.get("updatedAt")), "meta.updatedAt must be an ISO-8601 datetime.", errors)

    diagrams = data.get("diagrams")
    expect(isinstance(diagrams, list) and len(diagrams) >= 1, "diagrams must be a non-empty array.", errors)
    if isinstance(diagrams, list):
        if len(diagrams) > 1:
            warnings.append("More than one diagram entry found. The current UI usually uses a single primary diagram.")
        for index, diagram in enumerate(diagrams):
            expect(isinstance(diagram, dict), f"diagrams[{index}] must be an object.", errors)
            if isinstance(diagram, dict):
                expect(isinstance(diagram.get("id"), str) and diagram["id"], f"diagrams[{index}].id must be a non-empty string.", errors)
                expect(isinstance(diagram.get("name"), str) and diagram["name"], f"diagrams[{index}].name must be a non-empty string.", errors)
                expect(isinstance(diagram.get("desc"), str) and diagram["desc"], f"diagrams[{index}].desc must be a non-empty string.", errors)
                expect(isinstance(diagram.get("dot"), bool), f"diagrams[{index}].dot must be a boolean.", errors)

    layout = data.get("layout")
    expect(isinstance(layout, dict), "layout must be an object.", errors)
    nodes = []
    connections = []
    if isinstance(layout, dict):
        nodes = layout.get("nodes", [])
        connections = layout.get("connections", [])
        expect(isinstance(nodes, list), "layout.nodes must be an array.", errors)
        expect(isinstance(connections, list), "layout.connections must be an array.", errors)

    node_ids: set[str] = set()
    if isinstance(nodes, list):
        for index, node in enumerate(nodes):
            expect(isinstance(node, dict), f"layout.nodes[{index}] must be an object.", errors)
            if not isinstance(node, dict):
                continue
            node_id = node.get("id")
            expect(isinstance(node_id, str) and node_id, f"layout.nodes[{index}].id must be a non-empty string.", errors)
            if isinstance(node_id, str) and node_id:
                expect(node_id not in node_ids, f"Duplicate node id: {node_id}", errors)
                node_ids.add(node_id)
            expect(isinstance(node.get("label"), str) and node["label"], f"layout.nodes[{index}].label must be a non-empty string.", errors)
            expect(isinstance(node.get("sublabel"), str) and node["sublabel"], f"layout.nodes[{index}].sublabel must be a non-empty string.", errors)
            expect(node.get("type") in NODE_TYPES, f"layout.nodes[{index}].type is invalid.", errors)
            expect(isinstance(node.get("tech"), str), f"layout.nodes[{index}].tech must be a string.", errors)
            expect(isinstance(node.get("x"), (int, float)), f"layout.nodes[{index}].x must be numeric.", errors)
            expect(isinstance(node.get("y"), (int, float)), f"layout.nodes[{index}].y must be numeric.", errors)
            expect(isinstance(node.get("w"), (int, float)) and node["w"] > 0, f"layout.nodes[{index}].w must be positive.", errors)
            expect(isinstance(node.get("h"), (int, float)) and node["h"] > 0, f"layout.nodes[{index}].h must be positive.", errors)
            expect(isinstance(node.get("ops"), list), f"layout.nodes[{index}].ops must be an array.", errors)

    conn_ids: set[str] = set()
    if isinstance(connections, list):
        for index, conn in enumerate(connections):
            expect(isinstance(conn, dict), f"layout.connections[{index}] must be an object.", errors)
            if not isinstance(conn, dict):
                continue
            conn_id = conn.get("id")
            expect(isinstance(conn_id, str) and conn_id, f"layout.connections[{index}].id must be a non-empty string.", errors)
            if isinstance(conn_id, str) and conn_id:
                expect(conn_id not in conn_ids, f"Duplicate connection id: {conn_id}", errors)
                conn_ids.add(conn_id)
            from_id = conn.get("from")
            to_id = conn.get("to")
            expect(isinstance(from_id, str) and from_id in node_ids, f"layout.connections[{index}].from must reference an existing node.", errors)
            expect(isinstance(to_id, str) and to_id in node_ids, f"layout.connections[{index}].to must reference an existing node.", errors)
            expect(isinstance(conn.get("label"), str), f"layout.connections[{index}].label must be a string.", errors)
            expect(isinstance(conn.get("dashed"), bool), f"layout.connections[{index}].dashed must be a boolean.", errors)
            routing = conn.get("routing")
            expect(
                routing is None or isinstance(routing, dict),
                f"layout.connections[{index}].routing must be an object when present.",
                errors,
            )
            if isinstance(routing, dict):
                expect(
                    routing.get("axis") in ROUTE_AXES,
                    f"layout.connections[{index}].routing.axis must be 'x' or 'y'.",
                    errors,
                )
                expect(
                    isinstance(routing.get("value"), (int, float)),
                    f"layout.connections[{index}].routing.value must be numeric.",
                    errors,
                )

    endpoints_by_node = data.get("endpointsByNode")
    expect(isinstance(endpoints_by_node, dict), "endpointsByNode must be an object.", errors)
    endpoint_total = 0
    if isinstance(endpoints_by_node, dict):
        for node_id in node_ids:
            expect(node_id in endpoints_by_node, f"endpointsByNode is missing key for node '{node_id}'.", errors)
        for key, endpoints in endpoints_by_node.items():
            expect(key in node_ids, f"endpointsByNode contains unknown node id '{key}'.", errors)
            expect(isinstance(endpoints, list), f"endpointsByNode['{key}'] must be an array.", errors)
            if not isinstance(endpoints, list):
                continue
            endpoint_total += len(endpoints)
            for index, endpoint in enumerate(endpoints):
                expect(isinstance(endpoint, dict), f"endpointsByNode['{key}'][{index}] must be an object.", errors)
                if not isinstance(endpoint, dict):
                    continue
                expect(
                    endpoint.get("method") in HTTP_METHODS,
                    f"endpointsByNode['{key}'][{index}].method is invalid.",
                    errors,
                )
                expect(
                    isinstance(endpoint.get("path"), str) and endpoint["path"],
                    f"endpointsByNode['{key}'][{index}].path must be a non-empty string.",
                    errors,
                )

    analysis = data.get("analysis")
    expect(isinstance(analysis, dict), "analysis must be an object.", errors)
    if isinstance(analysis, dict):
        expect(analysis.get("source") in ANALYSIS_SOURCE, "analysis.source must be 'mock' or 'ai'.", errors)
        analyzed_at = analysis.get("lastAnalyzedAt")
        expect(
            analyzed_at is None or parse_iso_datetime(analyzed_at),
            "analysis.lastAnalyzedAt must be null or an ISO-8601 datetime.",
            errors,
        )
        stats = analysis.get("stats")
        expect(isinstance(stats, dict), "analysis.stats must be an object.", errors)
        if isinstance(stats, dict):
            expect(
                stats.get("services") == len(node_ids),
                f"analysis.stats.services must equal {len(node_ids)}.",
                errors,
            )
            expect(
                stats.get("endpoints") == endpoint_total,
                f"analysis.stats.endpoints must equal {endpoint_total}.",
                errors,
            )
            expect(
                stats.get("flows") == len(conn_ids),
                f"analysis.stats.flows must equal {len(conn_ids)}.",
                errors,
            )

    print_errors(errors, warnings)
    if errors:
        return 1

    print(
        "[OK] Snapshot valid "
        f"(nodes={len(node_ids)}, connections={len(conn_ids)}, endpoints={endpoint_total})"
    )
    return 0


def print_errors(errors: list[str], warnings: list[str]) -> None:
    for warning in warnings:
        print(f"[WARN] {warning}")
    for error in errors:
        print(f"[ERROR] {error}", file=sys.stderr)


if __name__ == "__main__":
    raise SystemExit(main())
