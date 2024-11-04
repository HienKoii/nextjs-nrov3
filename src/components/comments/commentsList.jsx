import { CommentArrow, Divider } from "@/app/styles/stylesGlobals";
import { CAU_HINH } from "@/config/setting";
import { useComments } from "@/context/CommentsContext";
import { timeAgo } from "@/lib/utils-cn";
import { Card, Col, Image, Pagination, Row } from "react-bootstrap";

export default function CommentsList() {
  const { comments, handlePageChange, page, totalPages } = useComments();

  return (
    <>
      {comments && comments?.length > 0 && (
        <>
          <Divider />
          {comments?.map((comment, index) => {
            return (
              <Row className="m-1 p-0" key={index}>
                <Col xs={2} sm={1} className="p-0">
                  <div className="w-100 hk-flex border border-dark border-2 p-1 rounded bg-secondary">
                    <Image
                      src={comment?.player ? `${CAU_HINH.urlImages}${comment?.player?.avatar_id}.png` : "/imgs/karin.png"} //
                      alt="avatar" //
                      style={{ objectFit: "cover" }}
                      width={50}
                      height={50}
                    />
                  </div>
                  <p className="text-center text-primary text-wrap">admin</p>
                </Col>
                <Col xs={10} sm={11} className="pe-0">
                  <Card>
                    <CommentArrow />
                    <Card.Body>
                      <p>{comment?.content}</p>
                    </Card.Body>
                    <Card.Footer>
                      <p style={{ fontSize: "0.8rem" }} className="fst-italic">
                        {timeAgo(comment?.created_at)}
                      </p>
                    </Card.Footer>
                  </Card>
                </Col>
              </Row>
            );
          })}

          <div className="hk-flex my-2">
            <Pagination>
              <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
              <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
              {[...Array(totalPages).keys()].map((index) => (
                <Pagination.Item key={index + 1} active={index + 1 === page} onClick={() => handlePageChange(index + 1)}>
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} />
            </Pagination>
          </div>
        </>
      )}
    </>
  );
}
