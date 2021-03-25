import React, { useState } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import Axios from "axios";

// dropzone 다운받아야함
import Dropzone from "react-dropzone";

import { VIDEO_SERVER } from "../../Config";

import { useSelector } from "react-redux";
import { PromiseProvider } from "mongoose";

const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
  { value: 0, label: "Private" },
  { value: 1, label: "Public" },
];

const CategoryOptions = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
  { value: 4, label: "Sports" },
];

function VideoUploadPage(props) {
  const user = useSelector((state) => state.user);

  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState("Film & Animation");

  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, setThumbnailPath] = useState("");

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };

  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value);
  };

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  };

  const onDrop = (files) => {
    let formData = new FormData();

    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    Axios.post(`${VIDEO_SERVER}/uploadfiles`, formData, config).then((res) => {
      if (res.data.success) {
        console.log(res.data);

        let variable = {
          url: res.data.url,
          fileName: res.data.fileName,
        };

        setFilePath(res.data.url);

        Axios.post(`${VIDEO_SERVER}/thumbnail`, variable).then((res) => {
          if (res.data.success) {
            setDuration(res.data.fileDuration);
            setThumbnailPath(res.data.url);
          } else {
            alert("썸네일 생성에 실패했습니다");
          }
        });
      } else {
        alert("비디오 업로드를 실패했습니다");
      }
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    //데이터베이스 스키마에 넣어야하니깐 나눠줌
    const variables = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };

    Axios.post(`${VIDEO_SERVER}/uploadVideo`, variables).then((res) => {
      if (res.data.success) {
        message.success("성공적으로 업로드 했습니다.");
        props.history.push("/");
      } else {
        alert("비디오 업로드에 실패 했습니다");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <Title level={2}>Upload Video</Title>
      </div>

      {/* Form과 button onSubmit={onSubmit} 언제 어떻게 붙여주는지 눈치 싸움 */}
      <Form>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Drop Zone */}
          <Dropzone onDrop={onDrop} multiple={false} /*maxSize={1000000}*/>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <Icon type="plus" style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>
          {/* Drop Zone */}

          {/* thumbnail */}
          {ThumbnailPath && (
            <div>
              <img
                src={`http://localhost:5000/${ThumbnailPath}`}
                alt="thumbnail"
              />
            </div>
          )}
        </div>

        <br />

        <br />
        <label>Title</label>
        <Input onChange={onTitleChange} value={VideoTitle} />
        <br />
        <br />

        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={Description} />
        <br />
        <br />

        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br />
        <br />

        <select onChange={onCategoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <br />
        <br />

        <Button type="primary" size="large" onClick={onSubmit}>
          submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
