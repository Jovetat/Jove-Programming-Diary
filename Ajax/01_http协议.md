# Http
HttP （超文本传输协议），规定了浏览器与万维网服务器之间的互相通讯的规则

## 请求报文

	格式与参数
		1、行
			①	请求类型 GET/POST
			②	url路径
			③	版本：HTTP/1.1
			
		2、头（名字冒号空格+值）
			Host: baidu.com
			Cookie: name=zhangsan
			Content-type: application/x-www-form-urlencoded
			User-Agent:chrome 83
			
		3、空行（固定必须有）
		
		4、体
			GET请求时体为空
			POST请求体可以不为空
			
			eg:username=admin&password=admin

## 响应报文

	1、行
		①、协议版本	HTTP/1.1
		②、响应状态码		200、404
		③、响应状态字符串		OK（与状态码对应）
		
	2、头
		Content-Type: text/html;charset=utf-8
		Content-length: 2048
		Content=encoding: gzip
		
	3、空行（固定必须有）
	
	4、体（主要的返回结果）
		<html>
			<head>
			</head>
			<body>
				<h1>芜湖起飞</h1>
			</body>
		</html>
		