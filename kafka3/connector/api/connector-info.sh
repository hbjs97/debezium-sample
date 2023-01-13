#!/bin/sh

args=("$@")
cdc_url=${args[0]}

if [ "$#" -ne 1 ]; then
    echo "$# is Illegal number of parameters."
    echo "Usage: $0 [cdc_url]"
    echo "Default parameters injected."
    echo "\t host: 127.0.0.1"
    echo "\t port: 8083"
    cdc_url="127.0.0.1:8083"
fi

curl -f -X GET ${cdc_url}/connectors?expand=status&expand=info # | jq

# jq 없으면 설치해야함
# MaxOS > brew install jq