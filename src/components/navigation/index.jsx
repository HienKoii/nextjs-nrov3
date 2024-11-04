import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "react-bootstrap";

import { BoxPage } from "@/app/styles/stylesGlobals";
import { LIST_NAVIGATION } from "@/lib/nav";

export default function Navigation() {
  const pathname = usePathname();
  return (
    <BoxPage className="p-0 d-flex mt-3 mb-3">
      {LIST_NAVIGATION.map((item, index) => {
        return (
          <Button
            key={index}
            as={Link} //
            variant={pathname === item.path ? "danger" : "link"}
            href={item.path}
            className={`w-100  px-0 ${pathname === item.path ? "active" : ""}`}
          >
            {item.text}
          </Button>
        );
      })}
    </BoxPage>
  );
}
