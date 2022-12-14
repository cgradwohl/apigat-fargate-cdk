## CDK Bootstrap

- provision initial resources required to deploy into an AWS Account
- bootstrapping provisions a deployment S3 bucket, IAM deployment roles etc.

#### Useful Bootstrap Command Examples

`cdk bootstrap ACCOUNT-NUMBER/REGION`
`cdk bootstrap 1111111111/us-east-1`
`cdk bootstrap --profile test 1111111111/us-east-1`

## Docker

- Docker is a platform that enables developers to run their applications in containers.
- A `container` is an instance of an image, and run your application in an isolated os process.
- An `image` is the configuration of all application dependencies (filesystem, configurations, scripts, language binaries, environment variables, a default command to run, and other metadata).
- The Docker platform can create `images` automatically by reading a `Dockerfile`.

## Docker File

- A `Dockerfile` is simply a script used to create a docker image.
- Docker can build images automatically by reading the instructions from a `Dockerfile`. A `Dockerfile` is a text document that contains all the commands a user could call on the command line to assemble an image.

## Docker Image

- An *image* is a read-only template with instructions for creating a Docker container.
- it must contain everything needed to run an application - filesystem, all dependencies, configurations, scripts, binaries, environment variables, a default command to run, and other metadata, etc.

## Docker Container

- A container is a runnable instance of an image.
- a process that is isolated from all other processes on the host machine
- an instance of an image
- an environment to run an application

## Lambda Container Image

- a read-only instance of a lambda function and a way to customize the container that executes the lambda.
- A Lambda functions normal operation allows you as a developer to write a little and it then gets uploaded into and executed by a pre-determined environment with a set collection of global libraries and OS installed. **_A Lambda container image allows you to override that and completely control the entire environment your code executes._** We would always recommend sticking to using the default method with AWS Lambda where possible but this added flexibility allows you to accomplish things you couldn't previously.

## ECS

- allows you to deploy, manage, and scale containerized applications
- compute environment that runs containers
- can register images in ECR and then deploy thousands of containers from the image
- [integrates into the Docker Compose CLI](https://aws.amazon.com/blogs/containers/deploy-applications-on-amazon-ecs-using-docker-compose/)
- use [AWS CloudFormation](https://aws.amazon.com/cloudformation/) to provision Amazon ECS clusters, register task definitions, and schedule containers
- There are three ways to launch AWS ECS
  - Fargate Pricing Model
  - EC2 Model
  - AWS Outpost

## Fargate

- built into Amazon ECS
- manages the resources required to run ECS tasks automatically

## VPC

- a private AWS Virtual Cloud / Network
- virtual network closely resembles a traditional network that you'd operate in your own data center, with the benefits of using the scalable infrastructure of AWS

## VPC Subnet

- a range of IP address in the VPC
- `public` subnet
  - public internet traffic is available via an internet gateway
  - public ingress and public egress (`Internet Gateway`)
- `private` subnet
  - no public internet traffic is available unless you use a `NAT Gateway` for egress
  - public egress (`Nat Gateway`), no public ingress
- `vpc-only` subnet
  - an isolated subnet with no access to public internet
  - no public egress, no public ingress
- `NAT Gateway`
  - a NAT Gateway allows instances within your VPC to go out to the internet (public egress).
- `bastion host`
  - a bastion host allows inbound access to specific IP addresses and authenticated users

## Application Load Balancer

- In the micro-service architecture, one service don’t know the location of the other services.
- In the world of containers, container’s IP addresses can’t be reliable since they are constantly being created and torn down by Fargate.
- ALB provides a simple and effective solution to this problem.
- API Gateway communicates via a public subnet to the ALB.
- The ALB then routes the request to an available container.
- As Fargate scales up to more containers, they are registered dynamically to the ALB.
- The ALB will always redirect the traffic to least used node, and thus the traffic is scaled horizontally.

## Repo Setup Notes

1. `mkdir repo-name; cd repo-name; npx cdk init app --language typescript`

2. `echo v16.17.1 >> .nvmrc`

3. `npm init @eslint/config`, follow wizard for typescript setup

4. `npm i -D prettier eslint-config-prettier`, `echo {}> .prettierrc.json`, `(echo node_modules; echo coverage;) >> .prettierignore` add prettier VS Code Extension and settings. add `"prettier"` to the end of the `extends` array in eslintrc.json, `npx prettier --write .`
