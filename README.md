# Team 404 - Name Not Found


![Build](https://img.shields.io/github/actions/workflow/status/AET-DevOps25/team-404-name-not-found/ci.yml)
![License](https://img.shields.io/github/license/AET-DevOps25/team-404-name-not-found)
![Mozilla HTTP Observatory Grade](https://img.shields.io/mozilla-observatory/grade-score/fridge.student.k8s.aet.cit.tum.de)
![Website](https://img.shields.io/website?url=https%3A%2F%2Ffridge.student.k8s.aet.cit.tum.de%2F)


> *"We went looking for a snack and found an error instead."*

A full-stack AI-powered recipe suggestion platform for anyone overwhelmed by decision fatigue or plagued with a lack ofcreativity. Users can manually input ingredients or upload fridge images to receive tailored recipe suggestions based on those ingredients. Built with a microservice architecture and deployed to [Rancher](https://rancher.ase.cit.tum.de/dashboard/home) with monitoring, authentication, and modern DevOps best practices.

## 🧠 Team

- [Franz](https://github.com/kunzef)
- [Kristi](https://github.com/kristi-balla)
- [Marcel](https://github.com/Marcel510)

## 🧪 Technologies Used

* **Frontend:** React + TailwindCSS
* **Backend:** Spring Boot (Java 21)
* **Containerization:** Docker
* **Observability:** Prometheus, Grafana
* **Auth:** GitHub OAuth + JWT
* **CI/CD:** GitHub Actions

## 🧱 Architecture Overview

TODO: rework given UMLs and add a sequence diagram to depict a typical flow

## 🚀 Developing Locally

### Prerequisites

Depending on how you want to run the application, you will have to install different tools. This project takes a container-first approach, so installing `docker` is essential! Installing the following tools depends on your particular use case:

- **Node.js (v18+) and Java 21**: if you want to develop locally
- `minikube`, `kubectl` and `helm` if you want to test the deployment on a k8s cluster

### Docker Compose

You will spin up the app using docker compose. A simple choice for quick development cycles.

1. Generate a self-signed key-pair. This will be used by nginx when serving https. You will get a warning in your browser about an untrusted certificate, but [that's fine](https://www.youtube.com/watch?v=0oBx7Jg4m-o):

```bash
./infra/scripts/generate_key_and_cert.sh
```

2. Start:

```bash
docker compose up
```

When running often, you might want to add the `--force-recreate` flag to docker compose. In addition, if you make changes to the services themselves, the `--build` option is also necessary. The application is available on [https://fridge.localhost/](https://fridge.localhost/).

3. If you want to work with particular services quickly, you can also address them directly, like curl some service:

```bash
curl -X POST -k https://fridge.localhost/api/images/v1/recipes/explore -F "file=@fruit-and-veg-in-a-fridge.png;type=image/png" -F "numRecipes=2"
```

For debugging purposes, it might help to add `-vvv` to curl for increased logging. Bear in mind that this request can take up to 1min to complete.

4. Finish:

```bash
docker compose down --volumes --remove-orphans
```

### Minikube

You will spin up a minikube cluster. Choose this to emulate the AET cluster we are given:

1. Start:

```bash
minikube start --cpus=6 --memory=6sG
```

Due to our self-chosen service requests in the corresponding deployments, each service (users, recipes, images, genai, prometheus and grafana) needs half a CPU core. Empirical trials have shown the services function optimally in such setting. If your pods start failing with scheduling errors because the kubelet couldn't satisfy the requests, then you know where to change it

1. Install our chart:

```bash
./infra/scripts/setup.sh
```

This will install all necessary CRDs as well as our chart with the `values.local.yml`: tailored for local development. Empirical tests show that this command takes about 3-6min, depending on how fast your internet connection is and the machine you are minikube on.

3. Adapt your hosts file to point to the cluster. After this, the website will be available on [https://fridge.example/](https://fridge.localhost/).

```bash
echo "$(minikube ip) fridge.example" | sudo tee -a /etc/hosts
```

4. Again, you can dial up services independently. However, for some you might need to authorize yourself via a bearer token. You get that if you look into the requests when logging in, or the logs of the `client` pod:

```bash
curl -vvv -X POST -k https://fridge.example/api/images/v1/recipes/explore -F "file=@fruit-and-veg-in-a-fridge.png;type=image/png" -F "numRecipes=2" -H "Authorization: Bearer <your token>"
```

5. Yeet

```bash
minikube delete
```

This request will also take about 1min to complete, but in the end, you will see the recipes! 

#### Things to consider

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

## 📈 Metrics & Monitoring

Prometheus scrapes data from all microservices of the server, as well as genai. The data is aggregated in 3 grafana dashboards, depicting the state of each application, the JVM and genai-specific stats. You can view the dashboards by appending `/grafana` to whatever host you are running the app on. 

In addition, grafana alerts are also configured. An alert fires if a request takes longer than 60s to complete or if the spring-boot apps start hogging more than 500MiB of the JVM heap.

## 📁 Repository Structure

```
client/               # React + Tailwind web UI
genai/                # FastAPI AI service
server/
  images/             # Accepts image uploads and queries GenAI
  recipes/            # Provides recipes based on ingredients
  users/              # Handles OAuth & JWT issuance
  ingredients/        # manages ingredients on the fridge
infra/
  fridge/             # Helm templates, config files
  ec2/                # terraform ansible config to provision and deploy on an ec2 instance
  nginx/              # proxy configuration
  scripts/            # a summary of convenience scripts
.github/              # GitHub Actions CI pipelines
```

### Server

TODO: describe microservice responsabilities, how they interact, your buildSrc logic and how you build the docker images

## 🧪 Future Improvements

- Add retry logic on inter-service communication
- Improve UI polish and mobile responsiveness
- Integrate image preprocessing (e.g., resizing, normalization)
- Better error handling & fallback recipes
- A proper GitOps approach and sops

## 🐛 Frequenctly Encountered Errors

Here is a summary of sanity checks to go through when debugging an error. The list isn't exhaustive, but rather a compilation of what we came through often.

### The Application Doesn't Reflect Your Changes?

Make sure you aren't loading older values from the cache! It might help to rebuild with `--no-cache` or just `docker system prune -f --volumes` if you want to go nuclear. If running on minikube, the images are pulled from the GHCR, so make sure your changes are properly synchronized

### Your Pods Complain About Lacking Resources?

Maybe you are pushing the limits of your local minikube cluster. Consider giving your cluster more juice.

---

> "404? Not this time. We found the ingredients for success."
