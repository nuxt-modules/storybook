#!/bin/bash

CWD=$(pwd)
ARG1=${1}

if [[ $ARG1 ]]
then
  echo "npx vitest run $ARG1"
  (npx vitest run $ARG1.test)
else
  echo "npx vitest run"
  (npx vitest run)
fi