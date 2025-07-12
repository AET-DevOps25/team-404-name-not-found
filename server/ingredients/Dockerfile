FROM gradle:8.14.0-jdk21 AS builder
WORKDIR /app

# this is def not the best i've written, but hey, 
# there's a .dockerignore in the folder!
COPY . .
RUN gradle :ingredients:bootJar

FROM gcr.io/distroless/java21-debian12:debug
COPY --from=builder /app/ingredients/build/libs/ingredients.jar /app.jar
CMD [ "/app.jar" ]
