/* 执行简单移动动画的函数 */
		function move_animation(obj,attr,target,speed,callback)
		{
			/* 参数:
			 * - - obj			要执行动画对象
			 * - - attr			要执行动画的样式，eg:left top width height
			 * - - target		执行动画的目标位置
			 * - - speed		速度(正值)
			 * - - callback		回调函数，这个函数将会再动画执行完毕以后执行(传不传都可以)
			 */
			// 点击按钮以后，使box1向右移动(left增大)
			// 在开启定时器之前，将当前元素上的其他定时器关闭
			clearInterval(obj.timer);
			var old_value = parseInt(compatibilityGetStyle(obj,attr));				// 获取当前元素相对于其定位父元素的水平偏移位置
			// 判断速度的正负值(目标在目前为止左侧，速度取负值)
			if(target < old_value)
			{
				speed -= 2*speed;
			}
			// 开启定时器，执行动画效果
			// 重新设计定时器存储，想执行动画的对象中添加一个timer属性，存放定时器
			obj.timer = setInterval(function(){				
				old_value = parseInt(compatibilityGetStyle(obj,attr));				// 获取当前元素相对于其定位父元素的水平偏移位置
				var new_value = old_value + speed;
				if( (speed < 0 && new_value < target) || (speed > 0 && new_value > target) )
				{
					new_value = target;
				}
				// 对象[属性]中才能使用为变量的属性，而不是  对象.属性
				obj.style[attr] = new_value + "px" ;
				if(new_value == target)
				{
					clearInterval(obj.timer);
					// 动画执行完毕，调用回调函数（有回调函数的时候执行）
					callback && callback();
				}
			},30);
		}
		
		
		// 获取元素样式
		function compatibilityGetStyle(obj,style_name)
		{				
			if(window.getComputedStyle)
			{
				return getComputedStyle(obj,null)[style_name];
			}
			else
			{
				return obj.currentStyle[style_name];
			}
		}
		
		
		// 定义一个函数，用来向一个元素中添加指定的class属性值
		/* 
		 * obj			要添加class属性的元素
		 * css_name		要添加的class属性
		 */
		function addClass(obj , css_name)
		{			
			// 判断元素中是否含有指定的class属性，如果已包含此class则不添加
			
			if(!findClass(obj,css_name))					//查询是否包含此class
			{
				// 一行代码修改多个样式
				/* 
				 * 通过修改box的class属性从而将样式改变为另一个预写好的样式
				 * 浏览器只需要重新渲染页面一次，性能比较好
				 * 也可以将表现与行为进一步分离
				 */
				obj.className += " " + css_name;
				/* 
				 * box1.className += " b2";
				 * 在原有值的基础上增加样式，防止b1的样式全部消失(b2作为样式的覆盖)
				 * b2前有一个空格!!!否则会识别为b1b2为一个样式
				 */
			}
		}
		
		// 定义一个函数，用来查找一个元素是否包含指定的class属性值
		/* 
		 * obj			要添加class属性的元素
		 * css_name		要添加的class属性
		 */
		function findClass(obj , css_name)
		{
			var reg = new RegExp("\\b" + css_name + "\\b");
			// var reg = /\bb2\b/;
			// 正则表达式 \b表示单词边界
			return reg.test(obj.className);
		}
		
		// 定义一个函数，删除一个元素中指定的class属性值
		/* 
		 * obj			要添加class属性的元素
		 * css_name		要添加的class属性
		 */
		function removeClass(obj , css_name)
		{
			// 为了class整洁，\b后可以填加一个空格
			var reg = new RegExp("\\b" + css_name + "\\b");
			// 删除class，有救替换，没有也不会错删
			obj.className = obj.className.replace(reg,"");
		}
		
		/* 
		 * toggleClass可以用来切换一个类
		 * 如果元素中具有该类则删除
		 * 如果没有该类则添加
		 */
		function toggleClass(obj , css_name)
		{
			if(findClass(obj,css_name))
			{
				removeClass(obj,css_name);
			}
			else
			{
				addClass(obj,css_name);
			}
		}