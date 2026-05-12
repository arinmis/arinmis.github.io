#!/usr/bin/env bash
set -euo pipefail

tex="${1:-mmayer.tex}"

cd /work

latexmk -pdf -interaction=nonstopmode -halt-on-error "${tex}"
latexmk -c "${tex}" >/dev/null 2>&1 || true

echo "✓ built /work/${tex%.tex}.pdf"
