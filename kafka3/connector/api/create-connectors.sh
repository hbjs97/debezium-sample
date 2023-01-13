#!/bin/sh

curl -X DELETE "http://localhost:8083/connectors/mysql-source"
curl -X DELETE "http://localhost:8083/connectors/mongodb-sink"

curl -X POST -H "Content-Type: application/json" --data @../config/mysql-source.json http://localhost:8083/connectors # | jq
curl -X POST -H "Content-Type: application/json" --data @../config/mongodb-sink.json http://localhost:8083/connectors # | jq