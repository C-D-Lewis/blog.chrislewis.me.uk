#!/bin/bash

echo ""

if [[ -z $(git status -s) ]]
then
  echo "No uncommitted changes"
else
  echo "There are uncommitted changes after build!"
  exit 1
fi
