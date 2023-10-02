#!/bin/bash

CWD=$(pwd)
ARG1=${1}
PLAYGROUND_PATH=$CWD/playground

if [[ $ARG1 == docs ]]
then
PLAYGROUND_PATH=$CWD/docs
(cd $PLAYGROUND_PATH && npx nuxi dev)
else
(cd $PLAYGROUND_PATH && npx nuxi dev)
fi