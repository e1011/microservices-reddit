FROM openjdk:21-jdk-slim

WORKDIR /app

COPY target/filter-service-0.0.1-SNAPSHOT.jar /app/filter-service.jar

EXPOSE 8080

CMD ["java", "-jar", "/app/filter-service.jar"]