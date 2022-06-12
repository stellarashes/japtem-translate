FROM digitallyseamless/nodejs-bower-grunt:4

RUN apt update
RUN apt install p7zip-full

ENTRYPOINT [ "bash", "./build.sh" ]
