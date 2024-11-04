"use client";
import { Button, Card, Col, Image, Row } from "react-bootstrap";

import { PATH_NAME } from "@/lib/path";
import { BoxPage, Divider } from "@/app/styles/stylesGlobals";
import Link from "next/link";

export default function NapTienPage() {
  const dataCard = [
    {
      path: PATH_NAME.napTien.napThe,
      title: "Nạp thẻ",
      urlImg: "/imgs/napthe.png",
      content: "Nạp thẻ hoàn toàn tự động. Tốc độ xử lý nhanh",
      textBtn: "Nạp ngay",
    },
    {
      path: PATH_NAME.napTien.napAtm,
      title: "Nạp Atm",
      urlImg: "/imgs/napatm.png",
      content: "Nạp atm hoàn toàn tự động. Tốc độ xử lý nhanh",
      textBtn: "Nạp ngay",
    },
    {
      path: PATH_NAME.napTien.lichSu,
      title: "Lịch sử nạp",
      urlImg: "/imgs/lichsunap.png",
      content: "Xem lại lịch sử nạp của bạn !",
      textBtn: "Xem ngay",
    },
  ];

  return (
    <BoxPage>
      <Row className="p-2">
        {dataCard.map((item, index) => {
          return (
            <Col sm={6} className="mb-3" key={index}>
              <Card>
                <Card.Body>
                  <Card.Title style={{ maxHeight: "46px" }}>
                    <Image src={item.urlImg} alt={item.title} width={46} /> {item.title}
                    <Divider className="mt-2 mb-2" />
                  </Card.Title>
                  <Card.Text style={{ minHeight: "48px" }} className="my-3">
                    {item.content}
                  </Card.Text>
                  <Button className="w-100" as={Link} href={item.path}>
                    {item.textBtn}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </BoxPage>
  );
}
