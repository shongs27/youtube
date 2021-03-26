import React, { useState } from "react";
import SingleComment from "./SingleComment";
import Axios from "axios";
import { useSelector } from "react-redux";

function Comment(props) {
  const [CommentValue, setCommentValue] = useState("");

  const user = useSelector((state) => state.user);
  const videoId = props.postId;

  const onSubmit = (e) => {
    e.preventDefault();
    const variables = {
      content: CommentValue,
      writer: user.userData._id, //1. localStorage - userId 2. 리덕스
      postId: videoId,
      //1. 라우터의 props전달 2.
    };
    Axios.post("/api/comment/saveComment", variables).then((res) => {
      if (res.data.success) {
        console.log(res.data.result);
        setCommentValue("");
      } else {
        alert("comment를 저장하지 못했습니다.");
      }
    });
  };

  const onHandleChange = (e) => {
    setCommentValue(e.currentTarget.value);
  };
  return (
    <div>
      <br />
      <p> Replies </p>
      <hr />

      {/* Comment Lists */}
      {props.commentLists &&
        props.commentLists.map((comments, index) => (
          <SingleComment comment={comments} postId={props.postId} />
        ))}

      {/* Root Comment Form */}

      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <textarea
          style={{ width: "100%", borderRadius: "5px" }}
          placeholder="코멘트를 작성해 주세요"
          onChange={onHandleChange}
          value={CommentValue}
        />
        <br />
        <button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comment;
