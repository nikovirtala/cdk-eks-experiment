import * as eks from '@aws-cdk/aws-eks';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const cluster = new eks.Cluster(this, 'experiment', {
      version: eks.KubernetesVersion.V1_19,
    });

    new eks.CfnAddon(this, 'vpc-cni', {
      addonName: 'vpc-cni',
      addonVersion: 'v1.7.9-eksbuild.1',
      clusterName: cluster.clusterName,
      resolveConflicts: 'OVERWRITE',
    });
  }
}

const devEnv = {
  account: '013651410059',
  region: 'eu-west-1',
};

const app = new App();

new MyStack(app, 'eks-experiment-dev', { env: devEnv });

app.synth();
