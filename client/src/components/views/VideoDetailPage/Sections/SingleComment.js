import React, { useState } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";

const { TextArea } = Input;

function SingleComment(props) {
  const [OpenReply, setOpenReply] = useState(false);
  const [CommentValue, setCommentValue] = useState("");

  const user = useSelector((state) => state.user);
  const videoId = props.postId;

  const variables = {
    content: CommentValue,
    writer: user.userData._id, //1. localStorage - userId 2. 리덕스
    postId: videoId,
    //1. 라우터의 props전달 2.
    // responseTo :
  };
  Axios.post("/api/comment/saveComment", variables).then((res) => {
    if (res.data.success) {
      console.log(res.data.result);
      setCommentValue("");
    } else {
      alert("comment를 저장하지 못했습니다.");
    }
  });

  const onSubmit = (e) => {
    e.preventDefault();
  };

  const onHandleChange = (e) => {
    setCommentValue(e.currentTarget.CommentValue);
  };

  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply);
  };

  const actions = [
    <span onClick={onClickReplyOpen} key="comment-basic=reply-to">
      Reply to
    </span>,
  ];
  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt />}
        content={<p>{props.comment.content}</p>}
      />

      {OpenReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <textarea
            style={{ width: "100%", borderRadius: "5px" }}
            onChange={onHandleChange}
            value={CommentValue}
            placeholder="코멘트를 작성해 주세요"
          />
          <br />
          <button style={{ width: "20%", height: "52px" }} onClick>
            {/* // 버튼에 꼭 해줘야 하나?/ */} Submit{" "}
          </button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
