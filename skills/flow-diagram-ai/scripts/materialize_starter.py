#!/usr/bin/env python3

import argparse
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
STARTER_DIR = ROOT / "starter" / "dashboard-frontend"
VALIDATOR = ROOT / "scripts" / "validate_snapshot.py"
STARTER_SNAPSHOT_PATH = Path(
    "src/components/mockups/arch-dashboard/infrastructure/mock/dashboard-snapshot.json"
)
ROOT_SNAPSHOT_FILENAME = "diagram.snapshot.json"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Copy the FlowChartAI dashboard starter into a target folder and inject a validated snapshot JSON."
    )
    parser.add_argument("--target", required=True, help="Directory that will receive the starter project.")
    parser.add_argument(
        "--snapshot-file",
        required=True,
        help="Path to the snapshot JSON file, or '-' to read JSON from stdin.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Remove the target directory first if it already exists.",
    )
    parser.add_argument(
        "--install",
        action="store_true",
        help="Run 'npm install' inside the generated project.",
    )
    parser.add_argument(
        "--validate",
        action="store_true",
        help="After install, run typecheck, lint, and build inside the generated project.",
    )
    return parser.parse_args()


def read_snapshot_text(snapshot_file: str) -> str:
    if snapshot_file == "-":
        return sys.stdin.read()
    return Path(snapshot_file).read_text(encoding="utf-8")


def normalize_snapshot(snapshot_text: str) -> str:
    parsed = json.loads(snapshot_text)
    return json.dumps(parsed, ensure_ascii=False, indent=2) + "\n"


def validate_snapshot(snapshot_text: str) -> None:
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as temp_file:
        temp_file.write(snapshot_text)
        temp_path = Path(temp_file.name)

    try:
        completed = subprocess.run(
            [sys.executable, str(VALIDATOR), str(temp_path)],
            check=False,
            capture_output=True,
            text=True,
        )
        if completed.returncode != 0:
            sys.stderr.write(completed.stdout)
            sys.stderr.write(completed.stderr)
            raise SystemExit(1)
    finally:
        temp_path.unlink(missing_ok=True)


def ensure_target(target_dir: Path, force: bool) -> None:
    if target_dir.exists():
        if not force:
            raise SystemExit(
                f"[ERROR] Target directory already exists: {target_dir}. Use --force to replace it."
            )
        shutil.rmtree(target_dir)

    target_dir.parent.mkdir(parents=True, exist_ok=True)


def copy_starter(target_dir: Path) -> None:
    if not STARTER_DIR.exists():
        raise SystemExit(f"[ERROR] Starter directory not found: {STARTER_DIR}")
    shutil.copytree(STARTER_DIR, target_dir)


def write_snapshot_files(target_dir: Path, snapshot_text: str) -> None:
    starter_snapshot = target_dir / STARTER_SNAPSHOT_PATH
    starter_snapshot.parent.mkdir(parents=True, exist_ok=True)
    starter_snapshot.write_text(snapshot_text, encoding="utf-8")

    root_snapshot = target_dir / ROOT_SNAPSHOT_FILENAME
    root_snapshot.write_text(snapshot_text, encoding="utf-8")


def run_cmd(args: list[str], cwd: Path) -> None:
    completed = subprocess.run(args, cwd=cwd, check=False)
    if completed.returncode != 0:
        raise SystemExit(completed.returncode)


def main() -> int:
    args = parse_args()
    target_dir = Path(args.target).expanduser().resolve()
    snapshot_text = normalize_snapshot(read_snapshot_text(args.snapshot_file))

    validate_snapshot(snapshot_text)
    ensure_target(target_dir, args.force)
    copy_starter(target_dir)
    write_snapshot_files(target_dir, snapshot_text)

    if args.install or args.validate:
        run_cmd(["npm", "install"], cwd=target_dir)

    if args.validate:
        run_cmd(["npm", "run", "typecheck"], cwd=target_dir)
        run_cmd(["npm", "run", "lint"], cwd=target_dir)
        run_cmd(["npm", "run", "build"], cwd=target_dir)

    print(f"[OK] Starter materialized at {target_dir}")
    print(f"[OK] Snapshot written to {target_dir / STARTER_SNAPSHOT_PATH}")
    print(f"[OK] Snapshot copy written to {target_dir / ROOT_SNAPSHOT_FILENAME}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
