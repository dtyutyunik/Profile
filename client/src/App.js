import React, { Component } from 'react';
import Info from './components/profile.js';
import Projects from './components/projects.js';
import Skillset from './components/skillset.js';
import Contact from './components/contact.js';
import './App.css';
import { Layout, Menu, Icon, Avatar, Button } from 'antd';
import ReactGA from 'react-ga';



const {
  Header, Sider, Content,
} = Layout;

class App extends Component {

  constructor(props){
    super(props);

    this.state={
      profile: [],
      bio: "Full-Stack Developer with a passion for tech, innovation, and problem solving. I possess a vast growing array of knowledge in many different frontend and backend languages, response frameworks, databases, and best code practices. Adept at creating  responsive Full-Stack CRUD websites from concept to design to deployment. Fully self-sufficient as well as thrive in collaborative group environments. I am dedicated to perfecting my craft by learning from more seasoned developers, remaining humble, and continuously making strides to learn all that i can about development.",
      projects: [],
      skills: ["React.js", "Node.js", "Express.js", "HTML", "CSS", "LocalStorage", "Ant React Library", "Sequelize ", "PostgreSQL ", "Session-storage ", "JWT authentication", "Ruby", "Ruby on Rails", "SQL", "Java", "Javascript"],

      view: ""
    }


this.showProfile=this.showProfile.bind(this);
this.projectData=this.projectData.bind(this);
this.handleMenuClick=this.handleMenuClick.bind(this);
this.initializeReactGA=this.initializeReactGA.bind(this);

  }


  initializeReactGA() {
      ReactGA.initialize('UA-131579085-1');
      ReactGA.pageview('/homepage');
      //test
      // jhkjhjh
  }

async componentDidMount(){
  await this.projectData();
  await this.handleMenuClick("info");
  this.initializeReactGA();

}





projectData(){

  var first={name: "Castle-Crawler",
  imgs: [require("./media/castlecrawler/cc1.png"),require("./media/castlecrawler/cc2.png"),require("./media/castlecrawler/cc3.png"),require("./media/castlecrawler/cc4.png"),require("./media/castlecrawler/cc5.png")],
  details: "8-bit Multi-level maze explorer rescue the princess in a timed basis game with a leaderboard",
  tools: ["Javascript " , "LocalStorage " , "SetInterval ", "Dom Manipulation"],
  github: "https://github.com/dtyutyunik/Castle-Crawler",
  website: "http://colorful-sofa.surge.sh"};

  var second={
    name: "Cocktail Creator",
    imgs: [require("./media/cocktailcreator/cc1.png"),require("./media/cocktailcreator/cc2.png"),require("./media/cocktailcreator/cc3.png"),require("./media/cocktailcreator/cc4.png")],
    details: "Implementation of cocktaildb api to provide the user with a lounge like feel with full access to query for a drink based on categories, name search, randomization, and multi-level ingredient search",
    tools: ["Javascript " , "React.js " , "Thecocktaildb api "],
    github: "https://github.com/dtyutyunik/Drink-Special",
    "website": "https://cocktail_creator.surge.sh/"
  };

  var third={
    name: "Bootcamp Startup",
    imgs: [require("./media/bootcampStartup/bs0.png"),require("./media/bootcampStartup/bs1.png"),require("./media/bootcampStartup/bs2.png"),require("./media/bootcampStartup/bs3.png"),require("./media/bootcampStartup/bs4.png")],
    details: "A full CRUD online template for bootcamps to host their courses provided with unique views and functionality based on guess, student or instructor credentials",
    tools: ["Javascript " , "React.js " , "Express.js ","Ant React Library", "Sequelize ", "PostgreSQL ", "Session-storage ", "JWT authentication"],
    github: "https://github.com/dtyutyunik/react-express-GA-management-app",
    website: "http://bootcamp_startup.surge.sh/"
  };

  var fourth={
    name: "NYC Sports",
    imgs:[require("./media/sportsNYC/maps5.png"),require("./media/sportsNYC/maps2.png"),require("./media/sportsNYC/maps3.png"),require("./media/sportsNYC/maps4.png"),require("./media/sportsNYC/maps1.png")],
    details: "Data scraped NYC Open Data for all public sport courts, implemented Google Maps API, geolocation & distance matrix to provide users with a query and favorites functionality.",
    tools:["Javascript ", "Ruby on Rails ", "Knock JWT Auth ", "React.js ", "PostgreSQL ", "local-storage ", "Google Maps Api ", "Ant-Design React Framework"],
    github: "https://github.com/dtyutyunik/NYC-Sports",
    website: "https://glacial-plateau-18887.herokuapp.com/"

  }

  var fifth={
    name: "Giphy Voice Search",
    imgs:[require("./media/giphyVoice/gv1.png"),require("./media/giphyVoice/gv2.png")],
    details: "Usage of speech recognition api to make axios calls to giphy api",
    tools:["Javascript ", "React.js ", "Speech Recognition API ", "Giphy API"],
    github: "https://github.com/dtyutyunik/Giphy-Voice-Search",
    website: "https://giphy-voice.surge.sh/"

  }

this.setState({
  projects: [fourth,third,second,first,fifth]
})

}

handleMenuClick(e){

  switch(e.key|| e){
    case "info":

    this.setState({
      view: <Info
        showProfile={this.showProfile}
        data={this.state.bio}
        backgroundImage={this.state.backgroundImage}
        />
    });


    break;

    case "Skillset":

    this.setState({
      view: <Skillset skills={this.state.skills}/>
    });
    break;

    case "Projects":
    this.setState({
    view: <Projects
      data={this.state.projects}/>
    });
    break;

    case "Contact":
    this.setState({
      view: <Contact/>

    });
    break;

    default: break;
  }

}



async showProfile(e){


  switch(e){
    case "Accountant":
            await this.setState({
                  bio: "Over 7 years of Financial Fund Accountant Analyst experience undertaking complex assignments, meeting tight deadlines and delivering superior performance to multi-billion dollar clientele on a daily basis. Created new automated systems, taught foreign and local clientele on the systems that are still in place as well as provided notation for future use of the software. Bringing creative concepts to life, automating processes and conversing on all levels from accountants, engineers to clients makes me a valuable asset."
                });
                 break;
    case "Developer":
            await this.setState({
                bio: "Full-Stack Developer with a passion for tech, innovation, and problem solving. I possess a vast growing array of knowledge in many different frontend and backend languages, response frameworks, databases, and best code practices. Adept at creating  responsive Full-Stack CRUD websites from concept to design to deployment. Fully self-sufficient as well as thrive in collaborative group environments. I am dedicated to perfecting my craft by learning from more seasoned developers, remaining humble, and continuously making strides to learn all that i can about development."

                });

                break;
    default:  break;
  }

    this.handleMenuClick("info");



}


  render() {

    let {view}= this.state
    return (


<div>


 <Layout>
        <Menu theme="dark" className="menu"
          onClick={this.handleMenuClick}
          >

          <Menu.Item key="image" className="image">
          <img src={ require("./media/dima.png")}/>
          </Menu.Item>


          <Menu.Item key="info" className="info">

            <Icon type="info" />
          <span className="nav-text">Info</span>

        </Menu.Item>


          <Menu.Item key="Skillset" className="skillset">
            <Icon type="code" />
          <span className="nav-text">Skill Set</span>

          </Menu.Item>



          <Menu.Item key="Projects" className="projects" >

            <Icon type="file" />
          <span className="nav-text">Projects</span>

          </Menu.Item>



          <Menu.Item key="Contact" className="contact">

            <Icon type="mail" />
          <span className="nav-text">Contact</span>

          </Menu.Item>


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




        </Menu>
        </Layout>

<Layout>
{view}
</Layout>




</div>

    );
  }
}



export default App;
