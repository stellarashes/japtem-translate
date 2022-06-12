FROM digitallyseamless/nodejs-bower-grunt:4


ENTRYPOINT [ "bash", "./build.sh" ]
