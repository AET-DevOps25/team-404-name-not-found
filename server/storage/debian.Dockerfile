FROM debian:12 AS builder
WORKDIR /workspace

RUN apt-get -qqy update && \
    apt-get -qqy install \
    curl \ 
    zip \
    unzip \
    gcc \
    build-essential \ 
    zlib1g-dev && \
    curl -s https://beta.sdkman.io?ci=true | bash

SHELL ["/bin/bash", "-c"]  

RUN source "/root/.sdkman/bin/sdkman-init.sh" && \
    sdk install java 21.0.7-graal && \
    sdk install gradle

COPY . .

ENV JAVA_HOME="/root/.sdkman/candidates/java/current"
ENV GRADLE_HOME="/root/.sdkman/candidates/gradle/current"
ENV PATH="$GRADLE_HOME/bin:$JAVA_HOME/bin:$PATH"
RUN gradle clean nativeCompile

FROM scratch

COPY --from=builder /workspace/build/native/nativeCompile/htmx /htmx
ENTRYPOINT [ "/htmx" ]
