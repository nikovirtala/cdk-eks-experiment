FROM public.ecr.aws/lambda/provided:al2

RUN yum install -y awscli && \
  curl -o /usr/local/bin/kubectl \
  https://amazon-eks.s3.us-west-2.amazonaws.com/1.19.6/2021-01-05/bin/linux/amd64/kubectl && \
  chmod +x /usr/local/bin/kubectl

COPY ./bootstrap /var/runtime/bootstrap
RUN chmod +x /var/runtime/bootstrap

COPY ./function.sh /var/task/function.sh
RUN chmod +x /var/task/function.sh

WORKDIR /var/task
CMD [ "function.sh.handler" ]
