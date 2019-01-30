import React from 'react';
import { Tag } from 'antd';


export default function ProjectTools(props){

  return(
    <div>{props.tools.map(e=>{
        return <Tag  className="projecTags" color="#00000">{e}</Tag>
    })}</div>

  )
}
