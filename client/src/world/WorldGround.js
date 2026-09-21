import { useMemo } from "react";
import { buildLandscape, buildBackdrop } from "./diorama/landscape";
export default function WorldGround() {
  const landscape = useMemo(buildLandscape, []),
    backdrop = useMemo(buildBackdrop, []);
  return (
    <>
      <primitive object={landscape} />
      <primitive object={backdrop} />
    </>
  );
}
