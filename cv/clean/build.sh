#!/bin/sh
cd /data
for f in *.tex; do
  echo "=== Building $f ==="
  latexmk -xelatex -interaction=nonstopmode -halt-on-error "$f"
done
