import React from "react";
import { Button, ListGroup, Pagination, Placeholder } from "react-bootstrap";

import { Divider } from "@/app/styles/stylesGlobals";
import { usePosts } from "@/context/PostsContext";
import ItemPosts from "./itemPosts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function ListPosts() {
  const { account } = useAuth();
  const { memberPosts, pinnedPosts, totalPages, page, handlePageChange, loading } = usePosts();

  return (
    <>
      <>
        <ListGroup className="mb-2 bg-danger">
          <ItemPosts data={pinnedPosts} isGhim />
        </ListGroup>

        <Divider />

        {account && (
          <Button
            as={Link}
            href="post/create" //
            variant="light"
            size="sm"
            className="ms-2 mb-2"
          >
            <FontAwesomeIcon icon={faEdit} /> Đăng bài
          </Button>
        )}

        {loading ? (
          <Placeholder as={ListGroup} animation="glow">
            <Placeholder as={ListGroup.Item} xs={12} style={{ height: "67px" }} />
            <Placeholder as={ListGroup.Item} xs={12} style={{ height: "67px" }} />
            <Placeholder as={ListGroup.Item} xs={12} style={{ height: "67px" }} />
            <Placeholder as={ListGroup.Item} xs={12} style={{ height: "67px" }} />
            <Placeholder as={ListGroup.Item} xs={12} style={{ height: "67px" }} />
          </Placeholder>
        ) : (
          <ListGroup>
            <ItemPosts data={memberPosts} />
          </ListGroup>
        )}
      </>

      <div className="hk-flex-y my-3">
        <Pagination>
          {[...Array(totalPages).keys()].map((pageNumber) => (
            <Pagination.Item key={pageNumber + 1} active={pageNumber + 1 === page} onClick={() => handlePageChange(pageNumber + 1)}>
              {pageNumber + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </>
  );
}
