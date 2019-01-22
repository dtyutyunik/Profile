import React from 'react';
import { Button } from 'antd';

function Info(props){

  return(
    <div className="profile">


    <Button

      value="large"
       id="Developer"
       style={{ margin: 10 }}
       onClick={()=>props.showProfile("Developer")}
       >
       Developer
     </Button>

  <Button
    value="large"
    id="Accountant"
    onClick={()=>props.showProfile("Accountant")}
  >
    Accountant
  </Button>


        <div className="profileInfo">
       <p>{props.data}</p>
        </div>
    </div>



  )
}

export default Info;
