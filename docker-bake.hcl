variable "IMAGE_NAME" {
    default = "ghcr.io/aet-devops25/team-404-name-not-found"
}

variable "IMAGE_TAG" {
    default = "latest"
}

group "default" {
    targets = ["server", "normal"]
}

# this is here for future you: if you think you can extract some config in a common target
# that is a thing, the inherit keyword would have done the job, but that wouldn't do much here
# the reason is bc you're too dependent on a matrix-variable and common templates don't take params
# functions, on the other hand, do, but that wouldn't have been much less writing!
target "server" {
    matrix = {
        "ctx" = [ "storage" ]
    }
    name = "app-${ctx}"
    dockerfile = "${ctx}/Dockerfile"
    context = "server"
    tags = ["${IMAGE_NAME}/${ctx}:${IMAGE_TAG}"]
    cache-from = [ "type=registry,ref=${IMAGE_NAME}/${ctx}:buildcache" ]
    cache-to = [ "type=registry,ref=${IMAGE_NAME}/${ctx}:buildcache,mode=max" ]
}

# for normal targets that do not need to take context from a "root" server config
target "normal" {
    matrix = {
        "ctx" = [ "client", "genai" ]
    }
    name = "${ctx}"
    dockerfile = "Dockerfile"
    context = "${ctx}"
    tags = ["${IMAGE_NAME}/${ctx}:${IMAGE_TAG}"]
    cache-from = [ "type=registry,ref=${IMAGE_NAME}/${ctx}:buildcache" ]
    cache-to = [ "type=registry,ref=${IMAGE_NAME}/${ctx}:buildcache,mode=max" ]
}
