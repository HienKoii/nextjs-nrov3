"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Col, Row } from "react-bootstrap";
import { faAndroid, faApple, faWindows } from "@fortawesome/free-brands-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";
import { CAU_HINH } from "@/config/setting";

export default function DownloadPage() {
  const getIconHdhTaiGame = (type) => {
    switch (type) {
      case 0:
        return faApple;
      case 1:
        return faAndroid;
      case 2:
        return faWindows;
      default:
        return faDownload;
    }
  };

  return (
    <Row className="p-2">
      {CAU_HINH.taiGame.map((item, index) => {
        return (
          <Col key={index} xs={12} sm={6} lg={6} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title className={`text-${item.variant} fs-5 d-flex align-items-center gap-2`}>
                  <FontAwesomeIcon icon={getIconHdhTaiGame(item.type)} />
                  <span className="text-uppercase"> {item.hdh}</span>
                </Card.Title>
                <Card.Text style={{ minHeight: "48px" }}>{item.content}</Card.Text>
                <Button
                  as={Link} //
                  href={item.link}
                  download
                  variant={item.variant}
                  className="w-100"
                >
                  {item.textSubmit}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
