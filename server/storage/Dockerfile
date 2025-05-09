FROM container-registry.oracle.com/graalvm/native-image:21-muslib AS builder
WORKDIR /workspace

ARG UPX_VERSION=4.2.2
ARG UPX_ARCHIVE=upx-${UPX_VERSION}-amd64_linux.tar.xz
RUN microdnf -y install wget xz unzip zip findutils && \
    wget -q https://github.com/upx/upx/releases/download/v${UPX_VERSION}/${UPX_ARCHIVE} && \
    tar -xJf ${UPX_ARCHIVE} && \
    rm -rf ${UPX_ARCHIVE} && \
    mv upx-${UPX_VERSION}-amd64_linux/upx . && \
    rm -rf upx-${UPX_VERSION}-amd64_linux && \
    wget -O grandel.zip https://services.gradle.org/distributions/gradle-8.14-bin.zip && \
    unzip grandel.zip -d /opt

COPY . .

ENV GRADLE_HOME="/opt/gradle-8.14"
ENV PATH="$GRADLE_HOME/bin:$PATH"
RUN gradle clean nativeCompile
RUN ./upx --best -o app.upx /workspace/build/native/nativeCompile/htmx

FROM gcr.io/distroless/static-debian12:debug
COPY --from=builder /workspace/app.upx /app
ENTRYPOINT [ "/app" ]
