import React from "react";
import { Card, Placeholder } from "react-bootstrap";

export default function Loading() {
  return (
    <Placeholder as={Card} animation="glow">
      <Placeholder xs={12} style={{ height: "475px" }} />
    </Placeholder>
  );
}
