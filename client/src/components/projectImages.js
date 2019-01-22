import React from 'react';
import { Carousel } from 'antd';

export default function ProjectImages(props){
  return(
    <div >

<Carousel autoplay={true} effect="scrollx" dots={true}>

{props.imageFiles.map(e=>{
  return <img className="projectImages" src={e} alt={e}/>
})}
  </Carousel>

    </div>
  )
}
