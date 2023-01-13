# debezium-sample
# Mysql CDC Debezium 을 활용해 생성/수정된 데이터를 MongoDB 에 반영하는 샘플 프로젝트

> Redis 기반 피드저장소를 구현하던 중 ttl 없이 데이터를 계속 쌓으면 너무 자주 확장해야 할 것 같아서 mongoDB 를 피드저장소로 사용해보려고 시작했다.
> 피드검색에 쿼리가 필요해 RedisJson을 사용했으나 아쉬운점이 많았던 이유도 있다.
> 이번기회에 CDC를 써보기에도 나쁘지 않은것같아 사용한다.
## Erd
![Screen Shot 2023-01-11 at 6 17 42 PM](https://user-images.githubusercontent.com/57822562/211766504-96be7e05-d4da-4a2f-b337-4bd78ff83c5b.png)

## Architecture
![debezium-sample-system drawio](https://user-images.githubusercontent.com/57822562/212319059-00c937de-f840-44f3-a58b-2fc14c95eea6.png)

---

주문 시 생성되는 데이터를 MongoDB에 저장하는 플로우를 테스트한다.
> 피드시스템 구성의 경우 데이터를 조인해 가공하여 새로운 스키마를 가진 데이터를 sink 저장소에 넣어야 했지만, 본 프로젝트는 단순히 테이블정보만 밀어넣는것으로 구성했다.
> 위 경우처럼 진행 시 kafka stream를 추가해 데이터를 가공할 수 있을 것 같은데, Schema Repository 에서 문제가 생기지 않을까 하는 의문이 든다.
> Debezium에서 데이터를 가져와 토픽으로 넣는 과정에 저장소의 스키마 정보를 조회하고, MongoDBSinkConnector에서도 스키마를 조회해 대조할텐데 가공을 거친 후 새로운 스카미의 데이터가 사용되기 때문에 생길수도 있지 않을까 하는 생각이든다. 추후 테스트해볼 필요가있다.

