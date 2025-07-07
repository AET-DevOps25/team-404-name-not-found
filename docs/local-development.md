# Local Dev

This document addresses how to run and test this app locally.

## Docker Compose

You will spin up the app using docker compose. A simple choice for quick development cycles.

1. Generate a self-signed key-pair. This will be used by nginx when serving https. You will get a warning in your browser about an untrusted certificate, but that's fine:

```bash
./infra/scripts/generate_key_and_cert.sh
```

2. Start:

```bash
docker compose up
```

When running often, you might want to add the `--force-recreate` flag to docker compose. In addition, if you make changes to the services themselves, the `--build` option is also necessary.

3. Do stuff, like curl some service:

```bash
curl -X POST -k https://fridge.localhost/api/images/v1/recipes/explore -F "file=@fruit-and-veg-in-a-fridge.png;type=image/png" -F "numRecipes=2"
```

For debugging purposes, it might help to add `-vvv` to curl for increased logging. Bear in mind that this request can take up to 1min to complete.

4. Finish:

```bash
docker compose down --volumes --remove-orphans
```

## Minikube

You will spin up a minikube cluster. Choose this to emulate the AET cluster we are given:

1. Start:

```bash
minikube start --cpus=7 --memory=9G
```

Due to our self-chosen service requests in the corresponding deployments, each service (users, recipes, images, genai, prometheus and grafana) needs a CPU core. We could also go for virtual parts, but I'd like to keep things simple as long as I can. If your pods start failing with scheduling errors because the kubelet couldn't satisfy the requests, then you know where to change it

2. Install our chart:

```bash
./infra/scripts/setup.sh
```

This will install all necessary CRDs as well as our chart with the `values.local.yml`: tailored for local development. Empirical tests show that this command takes about 3-6min, depending on how fast your internet connection is and the machine you are minikube on.

3. Adapt your hosts file to point to the cluster:

```bash
echo "$(minikube ip) fridge.example" | sudo tee -a /etc/hosts
```

4. Login! For this, in your browser, visit `https://fridge.example/api/users/login`. Depending on how often you've done this, you will either see a token on the screen, or have to login to github first. Either way, **save that token**!

5. Do stuff:

```bash
curl -vvv -X POST -k https://fridge.example/api/images/v1/recipes/explore -F "file=@fruit-and-veg-in-a-fridge.png;type=image/png" -F "numRecipes=2" -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmcmlkZ2UtYXV0aC1hcGkiLCJzdWIiOiIxNTU5MTQ5OTciLCJleHAiOjE3NTE5MDA3MjZ9.bpbYQk6RPhvltjwN0SDNE9nMuB-MYueJN64ytOO_OcTUb1MggGGqNZt9wl2Op38mFA7Gjde7QSP5cl1kozebmvZGY-ojH7Bu6hcva8x6tQCYUMAHFk0Z8YtnevXnywIaT9JejPfSsxKl1kbOkIYtdhl_zqHNxiJixFXtG3pW1tNcdJrSIr_QqBzJaD9ODa4LVGcAc3_vZcuXMX535_nXbxYm_cyX12VBP73FxggqVUXUTpzUdAcx0DjQw7pYgs1rvskhCpyo5hc8SxT1E_8rgLnK5Q5nmBiZNlBHysFJnaZAZIvzFhMKi4mwGwnZ8mXrthli5tGrBW3OveuDdMRAuA"
```

6. Yeet

```bash
minikube delete
```

This request will also take about 1min to complete, but in the end, you will see the recipes! 

### Things to consider

Whenever something goes wrong or doesn't behave correctly, minikube can be a pain to delete. If you changed something in the services, you can also try the following to get the changes to your cluster:

1. Rebuild the image(s):

```bash
BRANCH="the branch you're working on" docker compose build
```

2. Push to our registry! This is a workaround, that is why I insist on specifying the branch name! That way, we do not clutter main.

```bash
docker push <image>
```

Make sure you are logged into the ghcr and your token has the correct permissions!

3. Trigger a manual upgrade:

```bash
helm upgrade --install fridge ./infra/fridge --namespace team-404-name-not-found --create-namespace --atomic -f infra/fridge/values.local.yaml
```
