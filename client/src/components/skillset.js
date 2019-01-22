import React from 'react';
import Typist from 'react-typist';
import { Tag } from 'antd';

export default function Skillset(props){
  return(
    <div className="skillsets">{props.skills.map(e=>{
        return <Typist className="skills" key={e} cursor={{show: false}} avgTypingSpeed={5}><Tag color="#108ee9">{e}</Tag></Typist>
      })}</div>
  )
}
