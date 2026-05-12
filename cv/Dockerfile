# CV build environment — TeX Live full + AltaCV's dependencies.
#
# Build the image once:
#   docker build -t cv-build .
#
# Compile a variant (writes mmayer.pdf next to mmayer.tex):
#   docker run --rm -v "$PWD/backend":/work cv-build

FROM texlive/texlive:latest

WORKDIR /work

COPY build.sh /usr/local/bin/build-cv
RUN chmod +x /usr/local/bin/build-cv

ENTRYPOINT ["/usr/local/bin/build-cv"]
CMD ["mmayer.tex"]
