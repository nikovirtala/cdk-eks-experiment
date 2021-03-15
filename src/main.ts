import { readFileSync } from 'fs';
import * as path from 'path';
import * as eks from '@aws-cdk/aws-eks';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, CfnJson, Construct, Duration, Stack, StackProps } from '@aws-cdk/core';
import * as triggers from 'cdk-triggers';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // create eks cluster
    const cluster = new eks.Cluster(this, 'cluster', {
      version: eks.KubernetesVersion.V1_19,
    });

    // add oidc / service account
    cluster.addServiceAccount('service-account');

    // install vpc cni eks add-on
    new eks.CfnAddon(this, 'vpc-cni', {
      addonName: 'vpc-cni',
      addonVersion: 'v1.7.9-eksbuild.1',
      clusterName: cluster.clusterName,
      resolveConflicts: 'OVERWRITE',
    });

    // create function which installs argocd to the eks cluster
    const argocd = new lambda.DockerImageFunction(this, 'argocd', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, 'argocd')),
      environment: {
        cluster_name: cluster.clusterName,
      },
      timeout: Duration.minutes(10),
    });

    // add describe cluster permission to the lambda role
    argocd.role?.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['eks:DescribeCluster'],
        resources: [cluster.clusterArn],
      }),
    );

    // add the lambda func role to the aws-auth config map as system:masters
    cluster.awsAuth.addMastersRole(argocd.role!);

    // trigger the handler function after cluster is created
    new triggers.AfterCreate(this, 'argocd-trigger', {
      resources: [cluster],
      handler: argocd,
    });

    /* create role and policy role load balancer controller
    https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html
    https://github.com/kubernetes-sigs/aws-load-balancer-controller/blob/main/docs/install/iam_policy.json
    */
    const policy = new iam.Policy(this, 'policy', {
      policyName: 'AmazonEKSLoadBalancerControllerPolicy',
      document: iam.PolicyDocument.fromJson(JSON.parse(readFileSync(path.join(__dirname, 'lb-controller/iam_policy.json'), 'utf8'))),
    });

    const role = new iam.Role(this, 'role', {
      assumedBy: new iam.WebIdentityPrincipal(`arn:aws:iam::${this.account}:oidc-provider/${cluster.clusterOpenIdConnectIssuer}`).withConditions({
        StringEquals: new CfnJson(this, 'condition', {
          value: { [`${cluster.clusterOpenIdConnectIssuer}:sub`]: 'system:serviceaccount:kube-system:aws-load-balancer-controller' },
        }),
      }),
      roleName: 'AmazonEKSLoadBalancerControllerRole',
    });

    policy.attachToRole(role);

    // create function which installs lb-controller to the eks cluster
    const lbcontroller = new lambda.DockerImageFunction(this, 'lb-controller', {
      code: lambda.DockerImageCode.fromImageAsset(path.join(__dirname, 'lb-controller')),
      environment: {
        cluster_name: cluster.clusterName,
        account_id: this.account,
      },
      timeout: Duration.minutes(10),
    });

    // add describe cluster permission to the lambda role
    lbcontroller.role?.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['eks:DescribeCluster'],
        resources: [cluster.clusterArn],
      }),
    );

    // add the lambda func role to the aws-auth config map as system:masters
    cluster.awsAuth.addMastersRole(lbcontroller.role!);

    // trigger the handler function after cluster is created
    new triggers.AfterCreate(this, 'lb-controller-trigger', {
      resources: [cluster],
      handler: lbcontroller,
    });
  }
}

const devEnv = {
  account: '613455550379',
  region: 'eu-west-1',
};

const app = new App();

new MyStack(app, 'eks-experiment-dev', { env: devEnv });

app.synth();
