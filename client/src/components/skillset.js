import React from 'react';
import Typist from 'react-typist';
import { Tag } from 'antd';

export default function Skillset(props){
  return(
    <div className="skillsets">
      <div className="titles">Skillset</div>
      {
        props.skills.map(e=>{
          return <Typist className="skills" key={e} cursor={{show: false}} avgTypingSpeed={5}><Tag color="#3C769F">{e}</Tag></Typist>
        })
      }
    </div>
  )
}
