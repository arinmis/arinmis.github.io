FROM texlive/texlive:latest

WORKDIR /data

COPY clean/build.sh /usr/local/bin/build-cv
RUN chmod +x /usr/local/bin/build-cv

ENTRYPOINT ["/usr/local/bin/build-cv"]
