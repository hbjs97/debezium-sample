#!/bin/sh


if [ "$#" -ne 1 ]; then
    echo "$# is Illegal number of parameters."
    echo "Usage: $0 [connector_name]"
    exit 1
fi
args=("$@")
connector_name=${args[0]}

curl -X GET http://localhost:8083/connectors/{connector_name}/topics # | jq
