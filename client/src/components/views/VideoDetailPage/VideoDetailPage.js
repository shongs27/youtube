import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar, Divider } from "antd";
import Axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import Comment from "./Sections/Comment";

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const variable = { videoId }; //꼭 객체로 만들어야 하나?
  const [VideoDetail, setVideoDetail] = useState([]);

  //다 가져왔으니 배열형태가 되겠네
  const [Comments, setComments] = useState([]);
  useEffect(() => {
    Axios.post("/api/video/getVideoDetail", variable).then((res) => {
      if (res.data.success) {
        setVideoDetail(res.data.videoDetail);
      } else {
        alert("비디오 정보를 가져오길 실패했습니다.");
      }
    });

    Axios.post("/api/comment/getComments", variable).then((res) => {
      if (res.data.success) {
        setComments(res.data.comments);
      } else {
        alert("코멘트 정보를 가져오는데 실패했습니다.");
      }
    });
  }, []);

  if (VideoDetail.writer) {
    // console.log(VideoDetail.writer);

    //userTo userFrom 서로 달라야 렌더링
    const subscibeButton = VideoDetail.writer._id !==
      localStorage.getItem("userId") && (
      <Subscribe
        userTo={VideoDetail.writer}
        userFrom={localStorage.getItem("userId")}
      />
    );

    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: "100%", padding: "3rem 4rem" }}>
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls
            />
            {/* Action을 배열로 규정해놓은 ant API*/}
            <List.Item actions={[subscibeButton]}>
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.writer.image} />}
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              />
            </List.Item>

            <Comment commentLists={Comments} postId={videoId} />
          </div>
        </Col>

        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div>Loading...</div>;
  }
}

export default VideoDetailPage;
