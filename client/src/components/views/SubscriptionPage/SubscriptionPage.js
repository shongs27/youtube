// 구독한 사람 영상만 보여주는 페이지
import React, { useEffect, useState } from "react";

import { Typography, Card, Icon, Avatar, Col, Row } from "antd";
import Axios from "axios";
import moment from "moment";

const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {
  const [Video, setVideo] = useState([]);

  const variable = {
    userFrom: localStorage.getItem("userId"),
  };

  useEffect(() => {
    Axios.post("/api/video/getSubscriptionVideos", variable).then((res) => {
      console.log(res.data);
      if (res.data.success) {
        setVideo(res.data.videos);
      } else {
        alert("비디오 가져오기를 실패했습니다");
      }
    });
  }, []);

  const renderCards = Video.map((video, index) => {
    var minutes = Math.floor(video.duration / 60);
    var seconds = Math.floor(video.duration - minutes * 60);

    return (
      /* 사이즈 최소: 6*4 / 중간: 8*3 */
      <Col lg={6} md={8} xs={24}>
        {/* 어디지? */}
        <div style={{ position: "relative" }}>
          {/* 주소가 왜이렇지? */}
          <a href={`/video/${video._id}`}>
            <img
              style={{ width: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
            />
            <div className="duration">
              <span>
                {minutes}:{seconds}
              </span>
            </div>
          </a>
        </div>
        <br />
        <Meta
          avartar={<Avatar src={video.writer.image} />}
          title={video.title}
          discription=""
        />
        <span>{video.writer.name}</span>
        <br />
        <span style={{ marginLeft: "3rem" }}>{video.views} views</span>-{" "}
        <span>{moment(video.createdAt).format("MMM Do YY")}</span>
      </Col>
    );
  });

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2}>Recommended</Title>
      <hr />

      <Row gutter={[32, 16]}>{renderCards}</Row>
    </div>
  );
}

export default SubscriptionPage;
