import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button, Image, Nav, NavDropdown } from "react-bootstrap";

import { NAV_DROP_DOWN } from "@/lib/nav";
import { useAuth } from "@/context/AuthContext";
import { CAU_HINH } from "@/config/setting";

export default function AuthLogin() {
  const pathname = usePathname();
  const { handleLogout, account: user, player } = useAuth();

  return (
    <div>
      <Nav className=" d-flex justify-content-center align-items-center">
        <NavDropdown
          id="nav-dropdown-dark-example hi"
          title={
            <div className="d-flex flex-column justify-content-center align-items-center gap-1">
              <Image
                src={player ? `${CAU_HINH.urlImages}${player?.avatar_id}.png` : "/imgs/karin.png"} //
                alt="avatar"
                width={50}
              />
              <Button variant="outline-light">
                <span className="text-muted"> Xin chào: </span>
                <span className="text-primary">{user.username}</span>
              </Button>
            </div>
          }
          menuVariant="dark"
          className="custom-dropdown-toggle"
        >
          {NAV_DROP_DOWN.map((item, index) => {
            return (
              <React.Fragment key={index}>
                {item.isAdmin ? (
                  <>
                    {user.is_admin ? (
                      <NavDropdown.Item as={Link} href={item.path} active={pathname === item.path}>
                        <span> {item.icon}</span> <span>{item.name}</span>
                      </NavDropdown.Item>
                    ) : null}
                    <NavDropdown.Divider />
                  </>
                ) : (
                  <NavDropdown.Item as={Link} href={item.path} active={pathname === item.path}>
                    <span> {item.icon}</span> <span>{item.name}</span>
                  </NavDropdown.Item>
                )}
              </React.Fragment>
            );
          })}

          <NavDropdown.Item onClick={() => handleLogout()}>
            <span>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </span>
            <span> Đăng xuất</span>
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
    </div>
  );
}
