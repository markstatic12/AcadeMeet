@echo off
echo Starting AcadeMeet Backend...
echo.
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local"
