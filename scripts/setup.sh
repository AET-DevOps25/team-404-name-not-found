#!/bin/bash

kubectl create ns team-404-name-not-found

minikube addons enable ingress

helm repo add jetstack https://charts.jetstack.io --force-update

kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.2/cert-manager.crds.yaml

helm install \
  cert-manager jetstack/cert-manager \
  --version v1.17.2 \
  --create-namespace --namespace cert-manager \
  --set config.apiVersion="controller.config.cert-manager.io/v1alpha1"

echo "#################################################################################"

# this assumes you are running the script from project root
helm upgrade --install fridge ./fridge --namespace team-404-name-not-found --create-namespace --atomic -f fridge/values.local.yaml

kubectl get pods -A
echo "#################################################################################"
