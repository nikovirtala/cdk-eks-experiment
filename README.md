# cdk-eks-experiment

This repository contains all kinds of experiments around [Amazon Elastic Kubernetes Service](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html) (EKS), and they implemented using [AWS Cloud Development Kit](https://docs.aws.amazon.com/cdk/latest/guide/home.html) (CDK).

Currently deploys:

- EKS Control Plane
- [VPC CNI](https://docs.aws.amazon.com/eks/latest/userguide/pod-networking.html) as [EKS add-on](https://aws.amazon.com/blogs/containers/introducing-amazon-eks-add-ons/)
- [Argo CD](https://argoproj.github.io/argo-cd/) – using Bash in Lambda and CDK Triggers :)

⚠️ Always under construction. You probably shouldn't try to implement these concepts as is in the production.

## ref.

### CDK Triggers

- https://github.com/awslabs/cdk-triggers
- https://www.npmjs.com/package/cdk-triggers

### Lambda with Docker

- https://sbstjn.com/blog/aws-cdk-lambda-docker-container-example/

### Lambda Custom Runtime

- https://docs.aws.amazon.com/lambda/latest/dg/runtimes-walkthrough.html
- https://docs.aws.amazon.com/lambda/latest/dg/runtimes-images.html
