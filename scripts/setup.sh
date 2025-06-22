#!/bin/bash

kubectl create ns team-404-name-not-found

helm repo add jetstack https://charts.jetstack.io --force-update

kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.2/cert-manager.crds.yaml

helm install \
  cert-manager jetstack/cert-manager \
  --version v1.17.2 \
  --create-namespace --namespace cert-manager \
  --set config.apiVersion="controller.config.cert-manager.io/v1alpha1"

echo "#################################################################################"

# this assumes you are running the script from project root
helm install fridge ./fridge

echo "#################################################################################"
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/prometheus -n team-404-name-not-found -f metrics/prometheus.yml
helm install grafana grafana/grafana -n team-404-name-not-found -f metrics/grafana.yml
echo "#################################################################################"

kubectl get pods -A
echo "#################################################################################"
