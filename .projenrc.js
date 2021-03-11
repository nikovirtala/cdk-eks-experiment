const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.92.0',
  defaultReleaseBranch: 'main',
  jsiiFqn: 'projen.AwsCdkTypeScriptApp',
  name: 'cdk-eks-experiment',

  cdkDependencies: ['@aws-cdk/aws-eks', '@aws-cdk/aws-iam', '@aws-cdk/aws-lambda'],
  deps: ['cdk-triggers'],
  context: { '@aws-cdk/core:newStyleStackSynthesis': true },
  authorName: 'Niko Virtala',
  authorUrl: 'https://cloudgardener.dev',
  devDeps: ['prettier'],
  license: 'MIT',
  licensed: true,
  repository: 'https://github.com/nikovirtala/cdk-eks-experiment.git',
  jest: false,
  pullRequestTemplate: false,
});

project.synth();
