import { Badge, Table } from "react-bootstrap";

import Loading from "@/components/loading";
import { formatCurrencyVND, formatDateFull, formatStatusCard } from "@/lib/utils-cn";
import { useNapThe } from "@/context/NapTheContext";

export default function NapTienHistory() {
  const { history, loading } = useNapThe();

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Table striped className="m-0" style={{ borderRadius: "8px" }} responsive="lg">
        <thead>
          <tr>
            <th>Trạng Thái</th>
            <th>Nhận</th>
            <th>Khai</th>
            <th>Nhà Mạng</th>
            <th>Mã Thẻ</th>
            <th>Thời Gian</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((record, index) => (
              <tr key={index}>
                <td>
                  <Badge //
                    bg={record.status === 1 || record.status === 2 ? "success" : "danger"}
                  >
                    {formatStatusCard(record.status)}
                  </Badge>
                </td>
                <td>{record.amount ? formatCurrencyVND(record.amount) : 0}</td>
                <td>{formatCurrencyVND(record.declared_value)}</td>
                <td>{record.telco}</td>
                <td>{record.code}</td>
                <td>{formatDateFull(record.created_at)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                Không có lịch sử nạp tiền
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}
