function handler () {
  source $LAMBDA_TASK_ROOT/helpers.sh

  logme update kubeconfig
  export KUBECONFIG=/tmp/kubeconfig
  if [[ ! -s /tmp/kubeconfig ]]; then
    aws eks update-kubeconfig --name ${cluster_name}  --kubeconfig ${KUBECONFIG}
  fi

  logme set account id
  cp $LAMBDA_TASK_ROOT/aws-load-balancer-controller-service-account.yaml /tmp/aws-load-balancer-controller-service-account.yaml
  sed -i'.bak' -e "s/<AWS_ACCOUNT_ID>/${account_id}/g" /tmp/aws-load-balancer-controller-service-account.yaml
  if [[ $? != 0 ]]; then
    logme installation failed!
    return 1
  fi

  logme create service account
  kubectl apply -f /tmp/aws-load-balancer-controller-service-account.yaml
  if [[ $? != 0 ]]; then
    logme installation failed!
    return 1
  fi

  logme install cert manager
  kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.1.1/cert-manager.yaml
  if [[ $? != 0 ]]; then
    logme installation failed!
    return 1
  fi

  logme install load balancer controller
  kubectl apply -f https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.1.3/docs/install/v2_1_3_full.yaml
  if [[ $? != 0 ]]; then
    logme installation failed!
    return 1
  fi

  logme done!
}