# CV: LaTeX (Clean Resume)

| File                             | Audience                  |
| -------------------------------- | ------------------------- |
| `Mustafa_Arinmis_AI.tex`         | AI / ML focus             |
| `Mustafa_Arinmis_AI_TR.tex`      | AI Engineer (Türkçe)      |
| `Mustafa_Arinmis_Backend.tex`    | Backend Software Engineer |
| `Mustafa_Arinmis_Backend_TR.tex` | Backend Software Engineer (Türkçe) |
| `Mustafa_Arinmis_Full_Stack.tex` | Full Stack                |
| `Mustafa_Arinmis_IoT.tex`        | IoT Backend / Platform Engineer |

## Build

Requires Docker.

```bash
make image   # one-time
make all     # builds all CV PDFs
```

## AI PDF rendering on macOS

The English and Turkish AI PDFs can also be generated from their LaTeX content using ReportLab and the macOS Charter font. From the repository root, with `reportlab` installed in your Python environment:

```bash
python3 cv/render_ai.py
python3 cv/render_ai.py --language tr
```

Outputs are written to `output/pdf/`. Copy the reviewed PDFs to `cv/ai/` and `cv/clean/` when updating the distributed versions.

## Clean

```bash
make clean
```
