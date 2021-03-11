function handler () {
  EVENT_DATA=$1
  echo "$EVENT_DATA" 1>&2;

  echo "update kubeconfig..."
  export KUBECONFIG=/tmp/kubeconfig
  aws eks update-kubeconfig --name ${cluster_name}  --kubeconfig /tmp/kubeconfig

  echo "install argocd..."
  kubectl create namespace argocd
  kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

  RESPONSE="Echoing request: '$EVENT_DATA'"
  echo $RESPONSE
}