# Building a NodeJS container image with Cloud-Native Buildpacks

This project shows how to build a NodeJS container image with
[Cloud-Native Buildpacks](https://buildpacks.io) (CNB).

You don't need to write a `Dockerfile` anymore: using CNB you get
secured up-to-date container images out of your source code.

You don't need to care about the runtime environment (is my NodeJS runtime up-to-date?):
CNB will automatically provision dependencies and configure your container.

## How to use it?

[Download and install the `pack` CLI](https://github.com/buildpacks/pack/releases).
You'll need a Docker daemon running to build container images.

If you run `pack` CLI for the first time, you need to set a default
builder:
```bash
$ pack set-default-builder cloudfoundry/cnb:bionic
Builder cloudfoundry/cnb:bionic is now the default builder
```

You may select one of the suggested builders:
```bash
$ pack suggest-builders
Suggested builders:
	Cloud Foundry:     cloudfoundry/cnb:bionic         Ubuntu bionic base image with buildpacks for Java, NodeJS and Golang
	Cloud Foundry:     cloudfoundry/cnb:cflinuxfs3     cflinuxfs3 base image with buildpacks for Java, .NET, NodeJS, Python, Golang, PHP, HTTPD and NGINX
	Cloud Foundry:     cloudfoundry/cnb:tiny           Tiny base image (bionic build image, distroless run image) with buildpacks for Golang
	Heroku:            heroku/buildpacks:18            heroku-18 base image with buildpacks for Ruby, Java, Node.js, Python, Golang, & PHP

Tip: Learn more about a specific builder with:
	pack inspect-builder [builder image]
```

You're now ready to use CNB.

Run this command to build a container image:
```bash
$ pack build myorg/cnb-nodejs
...
Successfully built image myorg/cnb-nodejs
```

A lot of dependencies are downloaded in the first run.
These dependencies will be cached so that next runs are faster.

After a couple of minutes, your container image will be published 
to your local Docker daemon:
```bash
$ docker image ls
REPOSITORY                             TAG                  IMAGE ID    
myorg/cnb-nodejs                       latest               b1a0d242e5ec
```

You can run this container right away:
```bash
$ docker run --rm -p 8080:8080/tcp myorg/cnb-nodejs

> cnb-nodejs@1.0.0 start /workspace
> node server.js

Server listening on port 8080
```

## Deploying to Kubernetes

Use these Kubernetes descriptors to deploy this app to your cluster:
```bash
$ kubectl apply -f k8s
```

This app will be deployed to namespace `cnb-nodejs`:
```bash
kubectl -n cnb-nodejs get pod,deployment,svc
NAME                       READY   STATUS    RESTARTS   AGE
pod/app-7c7957cb94-lpmk8   1/1     Running   0          35m

NAME                        READY   UP-TO-DATE   AVAILABLE   AGE
deployment.extensions/app   1/1     1            1           35m

NAME          TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)        AGE
service/app   LoadBalancer   10.100.200.35   35.187.115.254   80:30355/TCP   35m
```

## Contribute

Contributions are always welcome!

Feel free to open issues & send PR.

## License

Copyright &copy; 2020 [VMware, Inc. or its affiliates](https://vmware.com).

This project is licensed under the [Apache Software License version 2.0](https://www.apache.org/licenses/LICENSE-2.0).
