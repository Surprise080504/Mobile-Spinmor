import React from "react";

export default function useDimensions() {
  const ref = React.useRef();
  const [dimensions, setDimensions] = React.useState({});

  React.useLayoutEffect(() => {
    setDimensions(ref.current.getBoundingClientRect().toJSON());
  }, [ref.current]);

  return [ref, dimensions];
}
