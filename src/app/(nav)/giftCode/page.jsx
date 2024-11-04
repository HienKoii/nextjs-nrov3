"use client";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Image, Table } from "react-bootstrap";
import { toast } from "react-toastify";

import Loading from "@/components/loading";
import TextDivider from "@/components/divider/textDivider";
import { formatOptions } from "@/lib/utils-cn";
import { CAU_HINH } from "@/config/setting";

export default function GiftCodePage() {
  const [loading, setLoading] = useState(true);
  const [dataGiftCode, setDataGiftCode] = useState(null);

  useEffect(() => {
    const fetchDataGiftCode = async () => {
      try {
        const response = await axios.get(`/api/giftcode`);
        console.log("Lấy danh sách giftcode: ", response.data.giftCodes);
        setDataGiftCode(response.data.giftCodes);
      } catch (error) {
        console.log("Lỗi lấy danh sách giftcode");
      } finally {
        setLoading(false);
      }
    };
    fetchDataGiftCode();
  }, []);

  const handleCopy = (textToCopy) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success("Sao chép thành công!");
      })
      .catch(() => {
        toast.error("Sao chép thất bại!");
      });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-100 p-1" style={{ overflow: "hidden" }}>
      <Table bordered>
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Quà</th>
          </tr>
        </thead>
        <tbody>
          {dataGiftCode?.map((item, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className="fw-bold">
                  <span className="text-primary"> {item.code} </span>
                  <FontAwesomeIcon
                    icon={faCopy}
                    style={{ cursor: "pointer" }} ///
                    onClick={() => handleCopy(`${item.code}`)}
                    className="text-dark"
                  />
                </td>
                <td>
                  <TextDivider text={"Vật phẩm"} />
                  <ul>
                    {item?.listItem.map((itemCode, inx) => {
                      return (
                        <li key={inx} className="hk-flex-x gap-1 mb-2">
                          <span>x{itemCode.quantity}</span>
                          <Image src={`${CAU_HINH.urlImages}${itemCode.icon_id}.png`} alt={itemCode.name} width={25} height={25} />
                          <span>{itemCode.name}</span>
                        </li>
                      );
                    })}
                  </ul>

                  {item?.itemoption && (
                    <>
                      <TextDivider text={"Options"} />
                      <ul>
                        {item?.itemoption.map((option, inx) => {
                          return (
                            <li key={inx} className="hk-flex-x gap-1 mb-2">
                              <span className="text-success">{formatOptions(option.name, option.param)} </span>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>{" "}
    </div>
  );
}
