import * as path from 'path';
import * as eks from '@aws-cdk/aws-eks';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, Construct, Duration, Stack, StackProps } from '@aws-cdk/core';
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
  }
}

const devEnv = {
  account: '613455550379',
  region: 'eu-west-1',
};

const app = new App();

new MyStack(app, 'eks-experiment-dev', { env: devEnv });

app.synth();
