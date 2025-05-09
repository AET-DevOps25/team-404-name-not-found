# Meeting Results

Here's a summary of what was discussed in our latest meeting.

## Appointment Alternatives

Our availability in the upcoming week looks like this:

- Monday, 05.05. from 17:00 onwards,
- Wednesday, 07.07 until 16:00

## Project Idea

Have you ever looked inside your fridge and had no idea what to cook? That is what we're trying to address with this app. 

### Phone Scenario

This is applicable when physically standing in front of the fridge with a phone at hand. The user should be able to upload a picture or take one directly from the app. Then, the user gets some *AI-generated* recipes doable with the provided ingredients. The user can then pick which recipe to cook, save or alter, in a somewhat chat-bot-like manner.

### Desktop Scenario

This is applicable when pondering on some philosophical question with a laptop in front of you. The user should be able to manage all past recipes and get new ones by manually inputting ingredients. The user can also put items in a shopping list. In addition, the user can also check nutritional values of the ingredients.

TODO: think about carbon footprint to shop more sustainably
TODO: think about giving the AI model some degree of freedom and allow it to suggest recipes that don't 100% match the available ingredients

## Tech Stack

To achieve our goal, these are the technologies we are willing to use for each component. It is worth noting that while we state someone mainly responsible for each part, it doesn't mean the other two can't get involved with that aspect at all!

### Client

A React application with the mantine component library. Marcel will be mainly responsible for this.

### Server

A Spring Boot application with all bells and whistles. Kristi will be mainly responsible for this.

The microservices comprising the backend will be:

- storage (a wrapper for the database)
- suggestions (a wrapper for the ai-gen-features)
- recipes (the main contact point for the client)

Based on the need we are bound to discover throughout the project, we do not exclude renaming or adding other services to the list. This is just an overview.

#### User Management

We were planning on providing GitHub as SSO signup and login, but have to evaluate the feasibility of this.

### GenAI

Python's LangChain framework. Franz will be mainly responsible for this.

### DB

PostgreSQL

## Project Management

We plan on following the Kanban approach for this project. Issueboards with priorities are the way to go.

## K8s

We were planning on writing raw manifests and packaging them in a helm release. In addition, we wanted to follow a GitOps-based approach, keeping our repository as the single source of truth. To implement this, flux will also be used. Here's a non-exhaustive list of the charts/tools/plugins we plan on using:

- istio (maybe ambient mode), with some kind of plugin for OAuth
- flux (with some support from `sops` for added security)
- prometheus (implies each microservice will have to dish out own metrics)
- grafana

## Questions:

1. Can we get owner rights for projects?
2. What do you mean with a dockerfile for the db?
3. Where is the github wiki?
4. What do you mean with custom operators in the advanced k8s features?
