FROM openjdk:21-jdk-slim

WORKDIR /app

COPY target/search-service-0.0.1-SNAPSHOT.jar /app/search-service.jar

EXPOSE 8080

CMD ["java", "-jar", "/app/search-service.jar"]