# SQL语句

## SELECT

`从指定表中查询数据（ * 表示所有列）`

``` sql
SELECT * FROM 表名称
SELECT 列名称 FROM 表名称
SELECT 列名称, 列名称2 FROM 表名称
-- SQL 语句对关键字大小写不敏感
```

## INSERT INTO

`向数据表中插入新的数据行`

``` sql
INSERT INTO 表名称 (列1, 列2, …) VALUES (值1, 值2, …)
```

## UPDATE

`修改表中的数据`

UPDATE 指定要更新的表

SET 指定要更新的列和更新值

WHERE 指定更新的条件（否则会更新整张表）

``` sql
UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值
UPDATE users SET name = 'zhangsan' WHERE id = 3
-- 修改表中的若干列
UPDATE 表名称 SET 列名称 = 新值, 列名称2 = 新值2, … WHERE 列名称 = 某值
```

## DELETE

`删除表中的行`

WHERE 指定删除的条件（否则会删除整张表）

``` sql
DELETE FROM 表名称 WHERE 列名称 = 值
```

## WHERE 子句

`限定选择的标准`

|  运算符   |        描述        |
| :-------: | :----------------: |
|     =     |        等于        |
| <>  或 != |       不等于       |
| >  和  >= | 大于  和  大于等于 |
| <  和  <= | 小于  和  小于等于 |
|  BETWEEN  |    在某个范围内    |
|   LIKE    |    搜索某种模式    |



``` sql
WHERE 列名称 运算符 值
```

## AND 和 OR 运算符

`AND 同时满足多个条件`

`OR 满足任一条件`

## ORDER BY

`根据指定的列对结果集进行排序`

`默认升序，DESC 降序关键字，ASC 升序关键字`

``` sql
SELECT * FROM 表名 ORDER BY 列名 ASC[可省略]
SELECT * FROM 表名 ORDER BY 列名 DESC
```

`多重排序`

``` sql
SELECT * FROM 表名 ORDER BY 列名1 DESC , 列名2 ASC[可省略] , …
```

## COUNT(*)

`返回查询结果的总数据条数`

``` sql
SELECT COUNT(*) FROM 表名
后面可添加 WHERE 的限定条件
```

## 使用 AS 为列设置别名


``` sql
SELECT COUNT(*) AS 别名 FROM 表名 [WHERE 限定条件]
SELECT 列名 AS 别名 , 列名2 AS 别名2 FROM 表名
```

