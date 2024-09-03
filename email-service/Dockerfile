FROM openjdk:21-jdk-slim

WORKDIR /app

COPY target/email-service-0.0.1-SNAPSHOT.jar /app/email-service.jar

EXPOSE 8080

CMD ["java", "-jar", "/app/email-service.jar"]