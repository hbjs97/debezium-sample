# debezium-sample
# Mysql CDC Debezium 을 활용해 생성/수정된 데이터를 MongoDB 에 반영하는 샘플 프로젝트

> Redis 기반 피드저장소를 구현하던 중 ttl 없이 데이터를 계속 쌓으면 너무 자주 확장해야 할 것 같아서 mongoDB 를 피드저장소로 사용해보려고 시작했다.
> 피드검색에 쿼리가 필요해 RedisJson을 사용했으나 아쉬운점이 많았던 이유도 있다.
> 이번기회에 CDC를 써보기에도 나쁘지 않은것같아 사용한다.
## Erd
![Screen Shot 2023-01-11 at 6 17 42 PM](https://user-images.githubusercontent.com/57822562/211766504-96be7e05-d4da-4a2f-b337-4bd78ff83c5b.png)

## Architecture
![system drawio](https://user-images.githubusercontent.com/57822562/212315554-eccdeed3-dbbc-42bb-9014-b0bde6b0205f.png)

---

사용자가 물품을 주문 시 주문자와 물품의 데이터를 join해 하나의 Document로 MongoDB에 저장하는 플로우를 테스트한다.
