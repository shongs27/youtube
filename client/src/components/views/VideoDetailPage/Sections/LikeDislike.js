import React, { useEffect, useState } from "react";
import { Tooltip, Icon } from "antd";
import Axios from "axios";

function LikeDislike(props) {
  const [Likes, setLikes] = useState(0);
  const [Dislikes, setDislikes] = useState(0);

  const [LikeAction, setLikeAction] = useState(null);
  const [DislikeAction, setDislikeAction] = useState(null);

  let variable = {};
  //video 정보 있는 like라면
  if (props.video) {
    variable = { videoId: props.videoId, userId: props.userid };
  } else {
    //그럼 comment에 있는 like겠네
    variable = { commentId: props.commentId, userId: props.userId };
  }

  //좋아요, 싫어요에 대한 DB정보 가져오기
  useEffect(() => {
    Axios.post("/api/like/getLikes", variable).then((res) => {
      if (res.data.success) {
        //얼마나 많은 좋아요를 받았는지
        setLikes(res.data.likes.length);

        //내가 이미 그 좋아요를 눌렀는지
        res.data.likes.map((like) => {
          if (like.userId === props.userId) {
            setLikeAction("liked");
          }
        });
      } else {
        alert("likes에 정보를 가져오지 못했습니다");
      }
    });

    Axios.post("/api/like/getDislikes", variable).then((res) => {
      if (res.data.success) {
        //얼마나 많은 좋아요를 받았는지
        setDislikes(res.data.dislikes.length);

        //내가 이미 그 좋아요를 눌렀는지
        res.data.dislikes.map((dislike) => {
          //누른 사람중에 내 아이디가 있는지 확인
          if (dislike.userId === props.userId) {
            setDislikeAction("disliked");
          }
        });
      } else {
        alert("DisLikes에 정보를 가져오지 못했습니다");
      }
    });
  });

  const onLike = () => {
    // 1. 아직 클릭이 안되어있을때
    if (LikeAction === null) {
      Axios.post("/api/like/uplike", variable).then((res) => {
        if (res.data.success) {
          setLikes(Likes + 1);
          setLikeAction("liked");

          //dislike는 클릭이 되어 있다면
          if (DislikeAction !== null) {
            setDislikeAction(null);
            setDislikes(Dislikes - 1);
          }
        } else {
          alert("Like를 올리지 못했습니다");
        }
      });
    } else {
      //2. 이미 클릭이 되어있을때
      Axios.post("/api/like/unlike", variable).then((res) => {
        if (res.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);
        } else {
          alert("Like를 내리지 못했습니다");
        }
      });
    }
  };

  const onDislike = () => {
    if (DislikeAction !== null) {
      Axios.post("/api/like/unDislike", variable).then((res) => {
        if (res.data.success) {
          setDislikes(Dislikes - 1);
          setDislikeAction(null);
        } else {
          alert("dislike를 지우지 못했습니다");
        }
      });
    } else {
      Axios.post("/api/like/upDislike", variable).then((res) => {
        if (res.data.success) {
          setDislikes(Dislikes + 1);
          setDislikeAction("disliked");

          if (LikeAction !== null) {
            setLikeAction(null);
            setLikes(Likes - 1);
          }
        } else {
          alert("dislike를 지우지 못했습니다");
        }
      });
    }
  };

  return (
    <div>
      {/* FontIcon이 아닌 SVGIcon */}
      <span key="comment-basic-like">
        <Tooltip title="like">
          <Icon
            type="like"
            theme={LikeAction === "liked" ? "filled" : "outlined"}
            onClick={onLike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>{Likes}</span>
      </span>
      &nbsp;&nbsp;
      <span key="comment-basic-dislike">
        <Tooltip title="dislike">
          <Icon
            type="dislike"
            theme={DislikeAction === "disliked" ? "filled" : "outlined"}
            onClick={onDislike}
          />
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}>{Dislikes}</span>
      </span>
    </div>
  );
}

export default LikeDislike;
