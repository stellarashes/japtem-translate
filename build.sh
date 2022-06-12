#!/bin/bash

mkdir -p dist

npm i
bower i
grunt

rm extension.7z 2> /dev/null

7z a extension.7z *
