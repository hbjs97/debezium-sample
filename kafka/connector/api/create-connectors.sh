#!/bin/sh

curl -X DELETE "http://localhost:8083/connectors/mysql-source"
curl -X DELETE "http://localhost:8083/connectors/mongodb-sink"

curl -X POST -H "Content-Type: application/json" --data @../config/mysql-source.json http://localhost:8083/connectors # | jq
curl -X POST -H "Content-Type: application/json" --data @../config/mongodb-sink.json http://localhost:8083/connectors # | jq

# curl --location --request POST 'http://localhost:8083/connectors' \
# --header 'Content-Type: application/json' \
# --data-raw '{
#   "name": "mysql-source",
#   "config": {
#     "connector.class": "io.debezium.connector.mysql.MySqlConnector",
#     "tasks.max": "1",
#     "database.hostname": "mysql",
#     "database.port": "3306",
#     "database.user": "root",
#     "database.password": "root",
#     "database.server.id": "184054",
#     "database.server.name": "source_mysql_server1",
#     "database.history.kafka.bootstrap.servers": "kafka:19092",
#     "database.history.kafka.topic": "schema-changes.test",
#     "database.whitelist": "test",
#     "database.allowPublicKeyRetrieval": "true",
#     "table.whitelist": "test.user,test.product,test.order",

#     "transforms": "route,unwrap",
#     "transforms.route.type": "org.apache.kafka.connect.transforms.RegexRouter",
#     "transforms.route.regex": "([^.]+)\\.([^.]+)\\.([^.]+)",
#     "transforms.route.replacement": "$3",
#     "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",

#     "key.converter": "io.confluent.connect.avro.AvroConverter",
#     "key.converter.schema.registry.url": "http://schema-registry:8081",
#     "value.converter": "io.confluent.connect.avro.AvroConverter",
#     "value.converter.schema.registry.url": "http://schema-registry:8081"
#   }
# }'

# curl --location --request POST 'http://localhost:8083/connectors' \
# --header 'Content-Type: application/json' \
# --data-raw '{
#   "name": "mongodb-sink",
#   "config": {
#     "connector.class": "com.mongodb.kafka.connect.MongoSinkConnector",
#     "tasks.max": "1",
#     "topics": "user,product,order",
#     "connection.uri": "mongodb://root:root@mongodb:27017/",
#     "database": "test",

#     "transforms": "unwrap",
#     "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
#     "transforms.unwrap.drop.tombstones": "false",
#     "transforms.unwrap.delete.handling.mode": "rewrite",
#     "transforms.unwrap.operation.header": "true",
#     "transforms.unwrap.delete.key.fields": "id",

#     "document.id.strategy": "com.mongodb.kafka.connect.sink.processor.id.strategy.PartialValueStrategy",
#     "document.id.strategy.partial.value.projection.type": "AllowList",
#     "document.id.strategy.partial.value.projection.list": "id",
#     "writemodel.strategy": "com.mongodb.kafka.connect.sink.writemodel.strategy.UpdateOneBusinessKeyTimestampStrategy",

#     "key.converter": "io.confluent.connect.avro.AvroConverter",
#     "key.converter.schema.registry.url": "http://schema-registry:8081",
#     "value.converter": "io.confluent.connect.avro.AvroConverter",
#     "value.converter.schema.registry.url": "http://schema-registry:8081"
#   }
# }'