function now () {
  echo -n $(date +%s)
}

function logme () {
  echo \{\"timestamp\":\"$(now)\",\"message\":\"$@\"\} 1>&2
}