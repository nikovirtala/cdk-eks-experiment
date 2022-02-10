const { awscdk } = require('projen');

const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.12.0',
  defaultReleaseBranch: 'main',
  jsiiFqn: 'projen.AwsCdkTypeScriptApp',
  name: 'cdk-eks-experiment',
  // cdkDependencies: ['@aws-cdk/aws-eks', '@aws-cdk/aws-iam', '@aws-cdk/aws-lambda'],
  deps: ['cdk-triggers'],
  // context: { '@aws-cdk/core:newStyleStackSynthesis': true, 'aws-cdk:enableDiffNoFail': true },
  authorName: 'Niko Virtala',
  authorUrl: 'https://cloudgardener.dev',
  authorEmail: 'niko.virtala@hey.com',
  devDeps: ['prettier'],
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      secret: 'AUTOMATION_TOKEN',
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['nikovirtala'],
  },
  eslint: true,
  eslintOptions: {
    prettier: true,
  },
  license: 'MIT',
  licensed: true,
  repository: 'https://github.com/nikovirtala/cdk-eks-experiment.git',
  jest: false,
  pullRequestTemplate: false,
  buildWorkflow: true,
  dependabot: false,
  mergify: true,
  defaultReleaseBranch: 'main',
});

project.synth();
