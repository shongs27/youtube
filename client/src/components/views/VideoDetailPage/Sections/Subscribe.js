import Axios from "axios";
import React, { useEffect, useState } from "react";

function Subscribe(props) {
  const [SubscribeNumber, setSubscribeNumber] = useState(0);
  const [Subscribed, setSubscribed] = useState(false);

  //////////////////////// 구독 정보 /////////////////////////
  useEffect(() => {
    //구독자 수 정보 가져오기
    let variable = { userTo: props.userTo };

    Axios.post("/api/subscribe/subscribeNumber", variable).then((res) => {
      if (res.data.success) {
        setSubscribeNumber(res.data.subscribeNumber);
      } else {
        alert("구독자 수 정보를 받아오지 못했습니다");
      }
    });

    //로그인한 내가 구독 유무 정보 가져오기
    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: localStorage.getItem("userId"),
    };

    Axios.post("/api/subscribe/subscribed", subscribedVariable).then((res) => {
      if (res.data.success) {
        setSubscribed(res.data.subscribed);
      } else {
        alert("정보를 받아오지 못했습니다");
      }
    });
  }, []);

  /////////////////////////// 구독 클릭 /////////////////////////
  const onSubscribe = () => {
    let subscribedVariable = {
      userTo: props.userTo,
      userFrom: props.userFrom, // 2) props설정으로 가져와도 된다
    };
    // 이미 구독중이라면 구독취소
    if (Subscribed) {
      Axios.post("/api/subscribe/unsubscribe", subscribedVariable).then(
        (res) => {
          if (res.data.success) {
            setSubscribeNumber(SubscribeNumber - 1);
            setSubscribed(!Subscribed);
          } else {
            alert("구독 취소하는데 실패했습니다");
          }
        }
      );
      // 이미 구독중이 아니라면 구독등록
    } else {
      Axios.post("/api/subscribe/subscribe", subscribedVariable).then((res) => {
        if (res.data.success) {
          setSubscribeNumber(SubscribeNumber + 1);
          setSubscribed(!Subscribed);
        } else {
          alert("구독 하는데 실패했습니다");
        }
      });
    }
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: `${Subscribed ? "#AAAAAA" : "#cc0000"}`,
          borderRadius: "3px",
          color: "white",
          padding: "10px 16px",
          fontWeight: "500",
          fontSize: "1rem",
          textTransform: "uppercase",
        }}
        onClick={onSubscribe}
      >
        {SubscribeNumber} {Subscribed ? "Subscribed" : "Subscribe"}
      </button>
    </div>
  );
}

export default Subscribe;
