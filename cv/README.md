# CV — LaTeX (AltaCV)

Three variants, each maintained as a standalone Overleaf-style project:

| Folder         | Audience                       |
| -------------- | ------------------------------ |
| `backend/`     | Backend Software Engineer      |
| `ai/`          | AI / ML focus                  |
| `full-stack/`  | Full Stack                     |

Each directory is self-contained: `mmayer.tex`, `altacv.cls`, plus asset
images. Edit `mmayer.tex` in any variant and rebuild.

## Build a PDF

Requires Docker. From this directory:

```bash
# One-time: build the image (~5GB pull from texlive/texlive:latest)
make image
# or: docker build -t cv-build .

# Compile one variant — produces mmayer.pdf next to mmayer.tex
make backend
make ai
make full-stack
make all                                  # build all three

# Without Make:
docker run --rm -v "$PWD/backend":/work cv-build
```

The container runs `latexmk -pdf mmayer.tex` and cleans up the LaTeX
intermediate files. Output: `<variant>/mmayer.pdf`.

## Custom tex filename

```bash
docker run --rm -v "$PWD/backend":/work cv-build my_cv.tex
```

## Syncing with Overleaf

- **From Overleaf → here:** download the project as a zip, replace the
  contents of the variant directory.
- **From here → Overleaf:** zip the variant directory and upload it.

## Clean intermediate files

```bash
make clean
```
