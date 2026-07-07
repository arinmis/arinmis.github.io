.PHONY: image all clean

IMAGE := cv-build

image:
	docker build -t $(IMAGE) .

all:
	@echo "Build CV PDFs..."
	docker run --rm -v "$$PWD/clean":/data $(IMAGE)

clean:
	find . \( -name "*.aux" -o -name "*.log" -o -name "*.out" -o -name "*.toc" \
	       -o -name "*.fls" -o -name "*.fdb_latexmk" -o -name "*.synctex.gz" \
	       -o -name "*.bbl" -o -name "*.blg" -o -name "*.run.xml" \
	       -o -name "*.xdv" \) -delete
