#!/usr/bin/env python3

import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
VALIDATOR = ROOT / "scripts" / "validate_snapshot.py"
EXAMPLES_DIR = ROOT / "examples"
STARTER_DIR = ROOT / "starter" / "dashboard-frontend"
MATERIALIZE_STARTER = ROOT / "scripts" / "materialize_starter.py"

REQUIRED_STARTER_FILES = [
    "README.md",
    "package.json",
    "package-lock.json",
    "vite.config.ts",
    "tsconfig.app.json",
    "src/App.tsx",
    "src/main.tsx",
    "src/components/mockups/arch-dashboard/Dashboard.tsx",
    "src/components/mockups/arch-dashboard/use-dashboard-snapshot.ts",
    "src/components/mockups/arch-dashboard/infrastructure/mock/dashboard-snapshot.json",
]


def run_validator(json_file: Path) -> None:
    completed = subprocess.run(
        [sys.executable, str(VALIDATOR), str(json_file)],
        check=False,
        capture_output=True,
        text=True,
    )
    if completed.returncode != 0:
        sys.stderr.write(completed.stdout)
        sys.stderr.write(completed.stderr)
        raise SystemExit(1)


def ensure_examples() -> None:
    json_files = sorted(EXAMPLES_DIR.glob("*.json"))
    if not json_files:
        raise SystemExit("[ERROR] No example snapshots found.")

    for json_file in json_files:
        print(f"[INFO] Validating example {json_file.name}")
        run_validator(json_file)


def ensure_starter() -> None:
    if not STARTER_DIR.exists():
        raise SystemExit("[ERROR] Starter directory is missing.")

    for relative_path in REQUIRED_STARTER_FILES:
        if not (STARTER_DIR / relative_path).exists():
            raise SystemExit(f"[ERROR] Starter is missing required file: {relative_path}")

    if (STARTER_DIR / "node_modules").exists():
        raise SystemExit("[ERROR] Starter must not include node_modules.")

    if (STARTER_DIR / "dist").exists():
        raise SystemExit("[ERROR] Starter must not include dist.")

    print("[INFO] Starter structure OK")


def ensure_materialize_script() -> None:
    if not MATERIALIZE_STARTER.exists():
        raise SystemExit("[ERROR] Starter materialization script is missing.")

    sample_snapshot = EXAMPLES_DIR / "gateway-auth-edge.snapshot.json"
    if not sample_snapshot.exists():
        raise SystemExit("[ERROR] Sample snapshot for starter materialization is missing.")

    with tempfile.TemporaryDirectory() as temp_dir:
        target_dir = Path(temp_dir) / "materialized-dashboard"
        completed = subprocess.run(
            [
                sys.executable,
                str(MATERIALIZE_STARTER),
                "--target",
                str(target_dir),
                "--snapshot-file",
                str(sample_snapshot),
            ],
            check=False,
            capture_output=True,
            text=True,
        )
        if completed.returncode != 0:
            sys.stderr.write(completed.stdout)
            sys.stderr.write(completed.stderr)
            raise SystemExit(1)

        starter_snapshot = target_dir / "src/components/mockups/arch-dashboard/infrastructure/mock/dashboard-snapshot.json"
        root_snapshot = target_dir / "diagram.snapshot.json"
        if not starter_snapshot.exists():
            raise SystemExit("[ERROR] Materialized starter is missing injected dashboard snapshot.")
        if not root_snapshot.exists():
            raise SystemExit("[ERROR] Materialized starter is missing root snapshot copy.")

    print("[INFO] Starter materialization OK")


def main() -> int:
    ensure_examples()
    ensure_starter()
    ensure_materialize_script()
    print("[OK] FlowChartAI skill smoke test passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
