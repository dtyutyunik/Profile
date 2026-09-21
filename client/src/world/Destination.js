import { useMemo } from "react";
import { Html } from "@react-three/drei";
import {
  buildCinema,
  buildWorkshop,
  buildPublisher,
  buildTraveler,
} from "./diorama/architecture";
const BUILDERS = {
  cinema: buildCinema,
  workshop: buildWorkshop,
  publisher: buildPublisher,
  traveler: buildTraveler,
};
const NUMBERS = {
  cinema: "01",
  workshop: "02",
  traveler: "03",
  publisher: "04",
};
export default function Destination({
  destination,
  selected,
  overview,
  onSelect,
}) {
  const model = useMemo(() => BUILDERS[destination.id](), [destination.id]);
  const select = (event) => {
    event.stopPropagation();
    onSelect(destination.id);
  };
  return (
    <group position={destination.position}>
      <primitive
        object={model}
        onClick={select}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      />
      {(overview || selected) && (
        <Html
          center
          position={[0, destination.id === "cinema" ? 4.1 : 3.8, 0]}
          zIndexRange={[8, 2]}
        >
          <button
            className={`destination-pin ${selected ? "destination-pin--active" : ""}`}
            onClick={select}
            aria-label={`Explore ${destination.title}`}
          >
            <span>{NUMBERS[destination.id]}</span>
            <b>{destination.navLabel}</b>
            <i>↗</i>
          </button>
        </Html>
      )}
    </group>
  );
}
