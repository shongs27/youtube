import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar, Divider } from "antd";
import Axios from "axios";
import SideVideo from "./Sections/SideVideo";
import Subscriber from "./Sections/Subscriber";

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const variable = { videoId }; //꼭 객체로 만들어야 하나?
  const [VideoDetail, setVideoDetail] = useState([]);

  useEffect(() => {
    Axios.post("/api/video/getVideoDetail", variable).then((res) => {
      if (res.data.success) {
        setVideoDetail(res.data.videoDetail);
      } else {
        alert("비디오 정보를 가져오길 실패했습니다.");
      }
    });
  }, []);

  if (VideoDetail.writer) {
    console.log(VideoDetail.writer);
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
            <List.Item
              actions={[
                <Subscriber
                  userTo={VideoDetail.writer._id}
                  userFrom={localStorage.getItem("userId")}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.writer.image} />}
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              />
            </List.Item>
            {/* comment */}
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
