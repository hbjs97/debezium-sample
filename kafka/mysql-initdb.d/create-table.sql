DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
	`id`	bigint	NOT NULL,
	`name`	varchar(20)	NOT NULL,
	`email`	varchar(30)	NOT NULL,
	`address`	varchar(255)	NOT NULL,
	`created_at`	datetime(6)	NOT NULL	DEFAULT current_timestamp(6)
);

DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
	`id`	bigint	NOT NULL,
	`name`	varchar(100)	NOT NULL,
	`price`	int(11)	NOT NULL,
	`created_at`	datetime(6)	NOT NULL	DEFAULT current_timestamp(6)
);

DROP TABLE IF EXISTS `order`;

CREATE TABLE `order` (
	`id`	bigint	NOT NULL,
	`user_id`	bigint	NOT NULL,
	`product_id`	bigint	NOT NULL,
	`created_at`	datetime(6)	NOT NULL	DEFAULT current_timestamp(6)
);

ALTER TABLE `user` ADD CONSTRAINT `PK_USER` PRIMARY KEY (
	`id`
);

ALTER TABLE `product` ADD CONSTRAINT `PK_PRODUCT` PRIMARY KEY (
	`id`
);

ALTER TABLE `order` ADD CONSTRAINT `PK_ORDER` PRIMARY KEY (
	`id`
);

ALTER TABLE `order` ADD CONSTRAINT `FK_user_TO_order_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `user` (
	`id`
);

ALTER TABLE `order` ADD CONSTRAINT `FK_product_TO_order_1` FOREIGN KEY (
	`product_id`
)
REFERENCES `product` (
	`id`
);

