.PHONY: image backend ai full-stack all clean

IMAGE := cv-build

image:
	docker build -t $(IMAGE) .

backend ai full-stack:
	docker run --rm -v "$$PWD/$@":/work $(IMAGE)

all: backend ai full-stack

clean:
	find . \( -name "*.aux" -o -name "*.log" -o -name "*.out" -o -name "*.toc" \
	       -o -name "*.fls" -o -name "*.fdb_latexmk" -o -name "*.synctex.gz" \
	       -o -name "*.bbl" -o -name "*.blg" -o -name "*.run.xml" \) -delete
