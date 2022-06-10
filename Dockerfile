FROM digitallyseamless/nodejs-bower-grunt:4

COPY . .

RUN npm i && \
    bower i && \
    grunt