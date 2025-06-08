#!/bin/bash

kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.3.0/standard-install.yaml

helm repo add jetstack https://charts.jetstack.io --force-update

kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.2/cert-manager.crds.yaml

helm install \
  cert-manager jetstack/cert-manager \
  --version v1.17.2 \
  --create-namespace --namespace cert-manager \
  --set config.apiVersion="controller.config.cert-manager.io/v1alpha1" \
  --set config.kind="ControllerConfiguration" \
  --set config.enableGatewayAPI=true

echo "#################################################################################"
helm install envoy oci://docker.io/envoyproxy/gateway-helm --version v1.4.0 -n envoy-gateway-system --create-namespace
kubectl wait --timeout=5m -n envoy-gateway-system deployment/envoy-gateway --for=condition=Available

echo "#################################################################################"
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update
helm install prometheus prometheus-community/prometheus -f metrics/prometheus.yml
helm install grafana grafana/grafana -f metrics/grafana.yml
echo "#################################################################################"

# this assumes you are running the script from project root
helm install fridge ./fridge

kubectl get pods -A
echo "#################################################################################"
