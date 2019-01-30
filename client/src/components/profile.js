import React from 'react';
import { Button } from 'antd';
import Skillset from './skillset.js';

function Profile(props){

  return(
    <div className="profile">

<div className="aboutMe">

<div className="img">
<img src={ require("../media/dima.png")}/>
</div>



       <div className="text">
<div>

</div>
       {props.data}

       </div>
        </div>
      <div className="skillInfo">  <Skillset skills={props.skills}/></div>
    </div>



  )
}

export default Profile;
