import gatewayAuthEdgeSnapshotJson from "./gateway-auth-edge.snapshot.json";
import microservicesCommerceSnapshotJson from "./microservices-commerce.snapshot.json";
import monolithCrmSnapshotJson from "./monolith-crm.snapshot.json";
import observabilitySearchEmailSnapshotJson from "./observability-search-email.snapshot.json";
import queueWorkerMediaSnapshotJson from "./queue-worker-media.snapshot.json";

import {
  cloneDashboardSnapshot,
  parseDashboardSnapshot,
  type DashboardSnapshot,
} from "../../dashboard-snapshot";

export type DashboardExampleCatalogItem = {
  id: string;
  name: string;
  description: string;
  filename: string;
  stats: DashboardSnapshot["analysis"]["stats"];
};

type DashboardExampleCatalogRecord = DashboardExampleCatalogItem & {
  snapshot: DashboardSnapshot;
};

const exampleCatalogRecords: DashboardExampleCatalogRecord[] = [
  createRecord(
    "microservices-commerce.snapshot.json",
    microservicesCommerceSnapshotJson,
  ),
  createRecord("monolith-crm.snapshot.json", monolithCrmSnapshotJson),
  createRecord("queue-worker-media.snapshot.json", queueWorkerMediaSnapshotJson),
  createRecord("gateway-auth-edge.snapshot.json", gatewayAuthEdgeSnapshotJson),
  createRecord(
    "observability-search-email.snapshot.json",
    observabilitySearchEmailSnapshotJson,
  ),
];

function createRecord(
  filename: string,
  input: unknown,
): DashboardExampleCatalogRecord {
  const snapshot = parseDashboardSnapshot(input);

  return {
    id: snapshot.meta.id,
    name: snapshot.meta.name,
    description: snapshot.meta.description,
    filename,
    stats: snapshot.analysis.stats,
    snapshot,
  };
}

export function getDashboardExampleCatalog(): DashboardExampleCatalogItem[] {
  return exampleCatalogRecords.map((record) => ({
    id: record.id,
    name: record.name,
    description: record.description,
    filename: record.filename,
    stats: record.stats,
  }));
}

export function getDashboardExampleSnapshot(
  exampleId: string,
): DashboardSnapshot | null {
  const record = exampleCatalogRecords.find((item) => item.id === exampleId);
  if (!record) {
    return null;
  }

  return cloneDashboardSnapshot(record.snapshot);
}
