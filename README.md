# debezium-sample
# Mysql CDC Debezium 을 활용해 생성/수정된 데이터를 MongoDB 에 반영하는 샘플 프로젝트

> Redis 기반 피드저장소를 구현하던 중 ttl 없이 데이터를 계속 쌓으면 너무 자주 확장해야 할 것 같아서 mongoDB 를 피드저장소로 사용해보려고 시작했다.
> 피드검색에 쿼리가 필요해 RedisJson을 사용했으나 아쉬운점이 많았던 이유도 있다.
## Erd
![Screen Shot 2023-01-11 at 6 17 42 PM](https://user-images.githubusercontent.com/57822562/211766504-96be7e05-d4da-4a2f-b337-4bd78ff83c5b.png)

## 아키텍처
![debezium-sample-system drawio](https://user-images.githubusercontent.com/57822562/212319059-00c937de-f840-44f3-a58b-2fc14c95eea6.png)

---

> 피드시스템 구성의 경우 데이터를 조인해 가공하여 새로운 스키마를 가진 데이터를 sink 저장소에 넣어야 했지만, 본 프로젝트는 단순히 테이블정보만 밀어넣는것으로 구성했다.
> 위 경우처럼 진행 시 kafka stream를 추가해 데이터를 가공할 수 있을 것 같은데, Schema Repository 에서 문제가 생기지 않을까 하는 의문이 든다.
> Debezium에서 데이터를 가져와 토픽으로 넣는 과정에 저장소의 스키마 정보를 조회하고, MongoDBSinkConnector에서도 스키마를 조회해 대조할텐데 가공을 거친 후 새로운 스카미의 데이터가 사용되기 때문에 생길수도 있지 않을까 하는 생각이든다. 추후 테스트해볼 필요가있다.

주문 시 생성되는 데이터를 MongoDB에 저장하는 플로우를 테스트한다.

## 커넥터 설정

### Source(Mysql)
```
{
  "name": "mysql-source",
  "config": {
    "connector.class": "io.debezium.connector.mysql.MySqlConnector",
    "tasks.max": "1",
    "database.hostname": "mysql",
    "database.port": "3306",
    "database.user": "root",
    "database.password": "root",
    "database.server.id": "184054",
    "database.server.name": "source_mysql_server1",
    "database.history.kafka.bootstrap.servers": "kafka:19092",
    "database.history.kafka.topic": "schema-changes.test", // 스키마 관련 정보를 저장할 토픽
    "database.whitelist": "test", // 로드할 대상의 데이터베이스
    "database.allowPublicKeyRetrieval": "true", // Mysql8.0 버전 이상부터 true 설정해줘야 함
    "table.whitelist": "test.user,test.product,test.order", // 로드할 대상의 테이블

    "transforms": "route,unwrap",
    "transforms.route.type": "org.apache.kafka.connect.transforms.RegexRouter",
    "transforms.route.regex": "([^.]+)\\.([^.]+)\\.([^.]+)", // 토픽명칭 단순화를 위해 정규식으로 서버.데이터베이스.테이블 정규식으로 잘라낸다
    "transforms.route.replacement": "$3", // 3번째 항목인 테이블명을 토픽이름으로 대체한다
    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState", // 단순히 데이터 추출 시 prev,after,source 등 불필요한 데이터가 많이 존재한다. after 속성의 payload만 사용하기 위한 설정

    "key.converter": "io.confluent.connect.avro.AvroConverter",
    "key.converter.schema.registry.url": "http://schema-registry:8081",
    "value.converter": "io.confluent.connect.avro.AvroConverter",
    "value.converter.schema.registry.url": "http://schema-registry:8081"
  }
}

```

### Sink(MongoDB)
```
{
  "name": "mongodb-sink",
  "config": {
    "connector.class": "com.mongodb.kafka.connect.MongoSinkConnector",
    "tasks.max": "1",
    "topics": "user,product,order",
    "connection.uri": "mongodb://root:root@mongodb:27017/",
    "database": "test",

    // source 데이터를 삭제하거나 pk값을 수정하면 null 이 record로 넘어가는데, 이 경우 sink 커넥터에서 에러발생
    // 에러 방지를위한 설정
    "transforms": "unwrap",
    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",
    "transforms.unwrap.drop.tombstones": "false", // DELETE 이벤트 스트림의 작업에 대한 삭제 표시 레코드를 유지
    "transforms.unwrap.delete.handling.mode": "rewrite",
    "transforms.unwrap.operation.header": "true",
    "transforms.unwrap.delete.key.fields": "id",

    // source 데이터 수정 시 sink에 새로운 데이터가 추가되지 않고, "id"를 기준으로 update 되게 설정
    "document.id.strategy": "com.mongodb.kafka.connect.sink.processor.id.strategy.PartialValueStrategy",
    "document.id.strategy.partial.value.projection.type": "AllowList",
    "document.id.strategy.partial.value.projection.list": "id",
    "writemodel.strategy": "com.mongodb.kafka.connect.sink.writemodel.strategy.UpdateOneBusinessKeyTimestampStrategy",

    "key.converter": "io.confluent.connect.avro.AvroConverter",
    "key.converter.schema.registry.url": "http://schema-registry:8081",
    "value.converter": "io.confluent.connect.avro.AvroConverter",
    "value.converter.schema.registry.url": "http://schema-registry:8081"
  }
}
```


## 카프카 커넥트 실행
```
cd kafka
./start.sh

# 커넥터 생성
cd ./connector/api
./create-connectors.sh
```

```
# 커넥터 조회
http://localhost:8083/connectors?expand=status&expand=info

# 커넥터 토픽 조회
http://localhost:8083/connectors/mysql-source/topics
http://localhost:8083/connectors/mongodb-sink/topics
```

![Screen Shot 2023-01-13 at 10 52 24 PM](https://user-images.githubusercontent.com/57822562/212335696-eea9be4e-7427-46ad-89d2-6e6d3f2465d5.png)

커넥트에 생성된 커넥터들의 정보가 조회된다. 커넥터를 등록하기 전에 조회시 빈 객체가 반환된다.




```
{
  "mysql-source": {
    "topics": [
      "source_mysql_server1"
    ]
  }
}

{
  "mongodb-sink": {
    "topics": []
  }
}

```
각 커넥터의 초기 토픽인데, source 저장소에 데이터가 삽입되어야 해당 테이블의 이름으로 토픽이 생성된다.

```
INSERT INTO test.product (id, name, price, created_at) VALUES (1, '1', 100, DEFAULT)

{
  "mysql-source": {
    "topics": [
      "product",
      "source_mysql_server1"
    ]
  }
}

{
  "mongodb-sink": {
    "topics": [
      "product"
    ]
  }
}
```

![image](https://user-images.githubusercontent.com/57822562/212335608-f01fa077-adbe-4058-906f-89e9e926a81e.png)


데이터 수정시 정상적으로 sink 저장소에 업데이트된다.
```
UPDATE test.product t SET t.price = 200 WHERE t.id = 1
```
![Screen Shot 2023-01-13 at 10 54 41 PM](https://user-images.githubusercontent.com/57822562/212336178-1602ac68-34ac-4071-b03e-ae1d7af5f225.png)


## NestJS 애플리케이션 실행
```
➜  debezium-sample git:(master) pwd
/Users/hbjs/git/debezium-sample

cd application
yarn
yarn start
```

![Screen Shot 2023-01-16 at 3 12 55 PM](https://user-images.githubusercontent.com/57822562/212610145-1d7250f2-fff3-4e38-88dd-125fc295d05b.png)


http://localhost:5020/api-docs

![Screen Shot 2023-01-16 at 3 15 25 PM](https://user-images.githubusercontent.com/57822562/212610463-7b8d2dd4-734a-455d-85e5-08a9b308adaa.png)



![Screen Shot 2023-01-16 at 3 18 55 PM](https://user-images.githubusercontent.com/57822562/212610996-4da62516-81fa-4d4f-8851-a004df19ea27.png)
![Screen Shot 2023-01-16 at 3 19 04 PM](https://user-images.githubusercontent.com/57822562/212611015-04dfbd65-a9ad-4913-88fb-39030d3a1a6e.png)
![Screen Shot 2023-01-16 at 3 19 09 PM](https://user-images.githubusercontent.com/57822562/212611023-8a021529-c04a-4466-a453-44e1360b05ab.png)


![Screen Shot 2023-01-16 at 3 19 45 PM](https://user-images.githubusercontent.com/57822562/212611081-30e5652c-1152-401a-b806-bb1961a2d1b0.png)
![Screen Shot 2023-01-16 at 3 19 50 PM](https://user-images.githubusercontent.com/57822562/212611094-967952ee-d120-44a2-afdf-40c1f397de2b.png)
![Screen Shot 2023-01-16 at 3 19 55 PM](https://user-images.githubusercontent.com/57822562/212611106-fa7937e4-66f7-4d37-a381-1e367a6edd79.png)
