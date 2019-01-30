import React from 'react';
import { Icon, Button } from 'antd';

export default function Contact(props){
  return(
    <div className="contacts">
    <h1>Get In Touch</h1>
  <h2>Please feel free to contact me about any employment opportunities.</h2>

<div className="icons">
  <div><Icon type="home" /> New York City, NY</div>
<div><Icon type="phone" />347-962-7905</div>
<div><Icon type="mail"  /> Dmitriy.Tyutyunik@gmail.com</div>
</div>


<div className="buttons">
    <Button size="large"
      shape="circle"
      ghost="true"
      href="https://github.com/dtyutyunik"
    icon="github"
  />

<Button size="large"
    shape="circle"
    ghost="true"
    href="https://www.linkedin.com/in/dmitriy-tyutyunik"
  icon="linkedin"
  />

  <Button size="large"
      shape="circle"
      ghost="true"
      href="https://medium.com/@dmitriy.tyutyunik"
    icon="medium"
    />

  <Button size="large"
      shape="circle"
      ghost="true"
      href="mailto:dmitriy.tyutyunik@gmail.com"
    icon="mail"
    />

</div>

</div>
  )




}
