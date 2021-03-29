import SingleComment from "./SingleComment";
import React, { useEffect, useState } from "react";

function ReplyComment(props) {
  const [ChildCommentNumber, setChildCommentNumber] = useState(0);
  const [OpenReplyComments, setOpenReplyComments] = useState(false);

  useEffect(() => {
    let commentNumber = 0;

    props.commentLists.map((comment) => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
    });
    setChildCommentNumber(commentNumber);
  }, [props.commentLists]);

  const renderReplyComment = (parentCommentId) =>
    props.commentLists.map((comment, index) => (
      <>
        {parentCommentId === comment.responseTo && (
          <div style={{ width: "80%", marginLeft: "40px" }}>
            <SingleComment
              refreshFunction={props.refreshFunction}
              comment={comment}
              postId={props.videoId}
            />
            <ReplyComment
              refreshFunction={props.refreshFunction}
              parentCommentId={comment._id}
              commentLists={props.commentLists}
              postId={props.videoId}
            />
          </div>
        )}
      </>
    ));

  const onHandleChange = () => {
    setOpenReplyComments(!OpenReplyComments);
  };
  return (
    <>
      {ChildCommentNumber > 0 && (
        <div
          style={{
            fontSize: "14px",
            fontWeight: "500",
            margin: 0,
            color: "gray",
            marginLeft: "20px",
          }}
          onClick={onHandleChange}
        >
          View {ChildCommentNumber} more comment(s)
        </div>
      )}

      {OpenReplyComments && renderReplyComment(props.parentCommentId)}
    </>
  );
}

export default ReplyComment;
