import { PRIMARY_COLOR_BG } from "@/app/styles/stylesGlobals";
import { CAU_HINH } from "@/config/setting";
import { formatDateFull } from "@/lib/utils-cn";
import Link from "next/link";
import React from "react";
import { Image, ListGroup } from "react-bootstrap";

export default function ItemPosts({ data, isGhim }) {
  return (
    <>
      {data?.map((post, index) => {
        return (
          <ListGroup.Item
            key={index}
            as={Link} //
            href={`post/${post.id}`}
            style={{ backgroundColor: isGhim ? "#fce5e5" : PRIMARY_COLOR_BG }}
            className="px-2 hk-flex-y-start"
          >
            <div
              className="border border-dark border-2 p-1 rounded bg-secondary" //
              style={{ width: "50px", height: "50px" }}
            >
              <Image
                src={post?.player ? `${CAU_HINH.urlImages}${post?.player?.avatar_id}.png` : "/imgs/karin.png"} //
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="mx-1">
              <div className="hk-flex-y-start align-items-center gap-1">
                <p className={`${isGhim ? "fw-bold text-primary text-uppercase" : ""}`}>{post.tieude}</p>
                {post?.new ? <Image src="/imgs/new.gif" alt="new" width={23} height={12} /> : null}
              </div>
              <div className={`hk-flex-x gap-1 ${isGhim ? "fw-bold" : ""}`} style={{ fontSize: "12px" }}>
                <p className={`text-${isGhim ? "danger" : "primary"}`}> {post.username} </p>
                <span> • </span>
                <p className="fst-italic text-muted">{formatDateFull(post.created_at)}</p>
              </div>
            </div>
          </ListGroup.Item>
        );
      })}
    </>
  );
}
