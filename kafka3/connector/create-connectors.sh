#!/bin/sh

curl -X PUT "http://localhost:8083/connectors/mysql-source/topics/reset"
curl -X PUT "http://localhost:8083/connectors/mongodb-sink/topics/reset"


curl -X DELETE "http://localhost:8083/connectors/mysql-source"
curl -X DELETE "http://localhost:8083/connectors/mongodb-sink"

curl -X POST -H "Content-Type: application/json" --data @mysql-source.json http://localhost:8083/connectors | jq
curl -X POST -H "Content-Type: application/json" --data @mongodb-sink.json http://localhost:8083/connectors | jq