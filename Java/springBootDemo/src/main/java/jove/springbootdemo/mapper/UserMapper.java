package jove.springbootdemo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import jove.springbootdemo.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {

}