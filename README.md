# ReportingApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.4.

## Build

1. Build Angular
```
ng build -c production
```
2. Build and Tag Docker with new version
```
docker build --platform=linux/amd64 --tag anescontainerregistry1.azurecr.io/anes-reporting-app:[version] .
```
3. Login to Azure if not already
```
az login
```
4. Log into container registry if not already
```
az acr login --name anescontainerregistry1
```
5. Push to registry 
```
docker push anescontainerregistry1.azurecr.io/anes-reporting-app:[version]
```
