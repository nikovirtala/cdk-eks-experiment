function handler () {
  source $LAMBDA_TASK_ROOT/helpers.sh

  logme update kubeconfig
  export KUBECONFIG=/tmp/kubeconfig
  if [[ ! -s /tmp/kubeconfig ]]; then
    aws eks update-kubeconfig --name ${cluster_name}  --kubeconfig ${KUBECONFIG}
  fi

  # https://argoproj.github.io/argo-cd/getting_started/

  logme install argocd
  if [[ ! $(kubectl get namespace argocd) ]]; then
    kubectl create namespace argocd >/dev/null 2>&1
  fi

  kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
  if [[ $? != 0 ]]; then
    logme installation failed!
    return 1
  fi

  logme done!
}