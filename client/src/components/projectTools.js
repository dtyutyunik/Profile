import React from 'react';
import { Tag } from 'antd';


export default function ProjectTools(props){

  return(
    <div className="tools">{props.tools.map(e=>{
        return <Tag key={e} className="projecTags" color="#00000">{e}</Tag>
    })}</div>

  )
}
