FROM gradle:8.14.0-jdk21 AS builder
WORKDIR /app

COPY build.gradle .
RUN gradle --no-daemon dependencies

COPY ./src /app/src
RUN gradle bootJar

FROM gcr.io/distroless/java21-debian12:debug
COPY --from=builder /app/build/libs/app-0.0.1-SNAPSHOT.jar /app.jar
CMD [ "/app.jar" ]
