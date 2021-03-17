const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.94.1',
  defaultReleaseBranch: 'main',
  jsiiFqn: 'projen.AwsCdkTypeScriptApp',
  name: 'cdk-eks-experiment',
  cdkDependencies: ['@aws-cdk/aws-eks', '@aws-cdk/aws-iam', '@aws-cdk/aws-lambda'],
  deps: ['cdk-triggers'],
  context: { '@aws-cdk/core:newStyleStackSynthesis': true, 'aws-cdk:enableDiffNoFail': true },
  authorName: 'Niko Virtala',
  authorUrl: 'https://cloudgardener.dev',
  authorEmail: 'niko.virtala@hey.com',
  devDeps: ['prettier'],
  license: 'MIT',
  licensed: true,
  repository: 'https://github.com/nikovirtala/cdk-eks-experiment.git',
  jest: false,
  pullRequestTemplate: false,
  buildWorkflow: true,
  dependabot: true,
  mergify: true,
  defaultReleaseBranch: 'main',
});

project.synth();
