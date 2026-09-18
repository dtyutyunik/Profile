import { Html } from '@react-three/drei';

const COLORS = { relive:'#d88b6c', agents:'#6cc4d7', support:'#8fc486', 'travel-agent':'#d8b45d', 'tag-agent':'#9fcf83' };

function ReliveProp({ color }) {
  return <group position={[0,.77,-.08]}>
    <mesh rotation={[-.08,0,-.08]}><boxGeometry args={[.52,.42,.035]} /><meshStandardMaterial color="#f4ead7" /></mesh>
    {[[-.16,.1],[-.05,.02],[.08,-.08],[.18,.08]].map(([x,y],i)=><mesh key={i} position={[x,y,.025]}><torusGeometry args={[.035,.008,5,10]} /><meshBasicMaterial color={color} /></mesh>)}
    {[-.18,0,.18].map((x,i)=><mesh key={x} position={[x,-.34,.12]} rotation={[0,0,(i-1)*.18]}><cylinderGeometry args={[.025,.025,.38,8]} /><meshStandardMaterial color={['#d86c6c','#e2b75d','#69a8b6'][i]} /></mesh>)}
  </group>;
}
function AgentProp({ color }) {
  return <group position={[0,.76,-.06]}>
    <mesh><boxGeometry args={[.25,.25,.25]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.3} /></mesh>
    {[[-.38,0],[.38,0],[0,.34]].map(([x,y],i)=><group key={i}><mesh position={[x,y,0]}><sphereGeometry args={[.08,10,8]} /><meshStandardMaterial color="#d9e4df" /></mesh><mesh position={[x/2,y/2,0]} rotation={[0,0,Math.atan2(y,x)]}><boxGeometry args={[Math.hypot(x,y),.025,.025]} /><meshStandardMaterial color={color} /></mesh></group>)}
  </group>;
}
function SupportProp({ color }) {
  return <group position={[0,.72,-.08]}>
    {[-.22,0,.22].map((x,i)=><mesh key={x} position={[x,i*.06,0]} rotation={[0,0,(i-1)*.08]}><boxGeometry args={[.28,.42,.035]} /><meshStandardMaterial color={i===2?color:'#e6dfcf'} /></mesh>)}
    <mesh position={[.32,.22,.05]}><sphereGeometry args={[.11,12,8]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={.3} /></mesh>
  </group>;
}
function TravelProp({ color }) {
  return <group position={[0,.74,-.05]}>
    <mesh rotation={[-.05,0,.03]}><boxGeometry args={[.65,.4,.035]} /><meshStandardMaterial color="#d9cda7" /></mesh>
    {[-.2,.16].map((x)=><mesh key={x} position={[x,.04,.03]}><sphereGeometry args={[.055,10,8]} /><meshStandardMaterial color={color} /></mesh>)}
    <mesh position={[-.02,.05,.04]} rotation={[0,0,-.2]}><torusGeometry args={[.19,.018,6,18,2.8]} /><meshStandardMaterial color={color} /></mesh>
    <mesh position={[.38,-.28,.08]}><boxGeometry args={[.26,.3,.18]} /><meshStandardMaterial color="#b66b4e" /></mesh>
  </group>;
}
function TagProp({ color }) {
  return <group position={[0,.75,-.06]}>
    <mesh><boxGeometry args={[.62,.42,.035]} /><meshStandardMaterial color="#edf0e8" /></mesh>
    {[-.2,0,.2].map(x=><mesh key={x} position={[x,0,.025]}><boxGeometry args={[.012,.36,.01]} /><meshBasicMaterial color="#94a29a" /></mesh>)}
    {[-.12,.02,.16].map(y=><mesh key={y} position={[0,y,.025]}><boxGeometry args={[.56,.012,.01]} /><meshBasicMaterial color="#94a29a" /></mesh>)}
    <mesh position={[.35,.18,.06]} rotation={[0,0,-.65]}><torusGeometry args={[.1,.025,6,18,4.8]} /><meshStandardMaterial color={color} /></mesh>
  </group>;
}
const PROPS={ relive:ReliveProp, agents:AgentProp, support:SupportProp, 'travel-agent':TravelProp, 'tag-agent':TagProp };

function ProjectExhibit({ project, position, onSelect }) {
  const color=COLORS[project.id]||'#d8b45d'; const Prop=PROPS[project.id]||AgentProp;
  return <group position={position} onClick={(event)=>{event.stopPropagation();onSelect(project.id);}}>
    <mesh castShadow position={[0,.42,0]}><boxGeometry args={[1.15,.14,.72]} /><meshStandardMaterial color="#513825" /></mesh>
    <mesh castShadow position={[-.43,.16,-.22]}><boxGeometry args={[.08,.52,.08]} /><meshStandardMaterial color="#49311f" /></mesh>
    <mesh castShadow position={[.43,.16,-.22]}><boxGeometry args={[.08,.52,.08]} /><meshStandardMaterial color="#49311f" /></mesh>
    <Prop color={color} />
    <Html center distanceFactor={9} position={[0,1.25,0]}><button className="exhibit-label" type="button" onClick={(event)=>{event.stopPropagation();onSelect(project.id);}}>{project.title}</button></Html>
  </group>;
}
export default ProjectExhibit;
