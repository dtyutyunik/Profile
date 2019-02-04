import React from 'react';
import {Button, Card } from 'antd';
import ProjectImages from './projectImages.js';
import ProjectTools from './projectTools.js';

export default function Projects(props){
  return(
    <div className="projectsContainer">


        {props.data.map((e,index)=>{
          return(
            <div className="projectOuter"
              key={index}>
            <Card className="projects"
               title={e.name}
               bordered={true}
               
      >


      <ProjectImages imageFiles={e.imgs}/>


    <p className="details">Details: {e.details}</p>

    <ProjectTools tools={e.tools}/>
    <Button size="large"
      shape="circle"
      href={e.github}
    icon="github"
  />
  <Button size="large"
      shape="circle"
      href={e.website}
    icon="global"
    />

</Card>
  </div>
)}
)

     }


    </div>
  );
}
