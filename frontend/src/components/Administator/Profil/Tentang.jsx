import React, { useState, useEffect, useCallback, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { RadioButton } from "primereact/radiobutton";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "./Editor.css";

const Tentang = () => {
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  const [title, setTitle] = useState("");
  const [file_url, setFileUrl] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [pname, setPname] = useState("tentang");
  const [visionContent, setVisionContent] = useState("");
  const navigate = useNavigate();
  const toast = useRef(null);

  const axiosJWT = useAuth(navigate);

  const fetcher = useCallback(
    async (url) => {
      try {
        console.log("Fetching data dari URL:", url);
        const response = await axiosJWT.get(url);
        console.log("Data berhasil diambil:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error mengambil data:", error);
        throw error;
      }
    },
    [axiosJWT]
  );

  const { data, error, isLoading } = useSWR(
    "https://randusanga-kulonbackend-production.up.railway.app/tentang",
    fetcher
  );

  useEffect(() => {
    if (data?.profile) {
      setTitle(data.profile.title);
      setVisionContent(data.profile.content);
      setFileUrl(data.profile.file_url);
      setStatus(data.profile.status);
      setPname(data.profile.pname);
    }
  }, [data]);

  useEffect(() => {
    axiosJWT
      .get("https://randusanga-kulonbackend-production.up.railway.app/tentang")
      .then((response) => console.log("Data fetched manually:", response.data))
      .catch((error) =>
        console.error("Error fetching Tentang manually:", error)
      );
  }, [axiosJWT]);

  const handleTextChange = useCallback((value) => {
    setVisionContent(value);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    formData.append("title", title);
    formData.append("pname", pname);
    formData.append("visionContent", visionContent);
    formData.append("status", status);

    try {
      setIsLoadingProcess(true);
      await axiosJWT.post(
        "https://randusanga-kulonbackend-production.up.railway.app/ctentang",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSelectedFile(null); // Reset file
      setPreview(null); // Reset preview

      // Memastikan re-render setelah penyimpanan berhasil
      await mutate(
        "https://randusanga-kulonbackend-production.up.railway.app/tentang"
      );

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "File uploaded successfully!",
        life: 3000,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to upload data.",
        life: 3000,
      });
    } finally {
      setIsLoadingProcess(false); // Nonaktifkan loading setelah proses selesai
    }
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div className="tentang-container">
      <Toast ref={toast} />
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="content-wrapper">
          {/* Left Column */}
          <div className="left-column">
            <h3 className="section-title">Create New Post</h3>
            <div className="post-content-container scrollable-container">
              <Card className="cart">
                <div className="p-field input-text">
                  <label htmlFor="title">Title</label>
                  <InputText
                    id="title"
                    className="input-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="p-field file-input">
                  <label htmlFor="file">Upload File</label>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                    className="custom-file-input"
                  />
                  {selectedFile && preview && (
                    <>
                      <div className="image-preview">
                        <p>File Name: {selectedFile.name}</p>
                        <p>
                          File Size: {(selectedFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <div className="image-container">
                        <img
                          src={preview}
                          alt="Preview"
                          className="preview-image"
                        />
                      </div>
                    </>
                  )}
                  {file_url && !preview && (
                    <div className="image-container">
                      <img
                        src={`https://randusanga-kulonbackend-production.up.railway.app${file_url}`}
                        alt="Database"
                      />
                    </div>
                  )}
                </div>
                <div className="p-field custom-editor">
                  <label htmlFor="content">Content</label>
                  <div className="quill-wrapper">
                    <ReactQuill
                      value={visionContent}
                      onChange={handleTextChange}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column */}
          <div className="right-column">
            <Card className="cardr" title="Publish Options">
              <div>
                <div className="publish-options-top">
                  <div className="radio-button-container">
                    <RadioButton
                      inputId="draft"
                      name="status"
                      value="DRAFT"
                      onChange={(e) => setStatus(e.target.value)}
                      checked={status === "DRAFT"}
                    />
                    <label htmlFor="draft">Draft</label>
                  </div>
                  <div className="radio-button-container">
                    <RadioButton
                      inputId="publish"
                      name="status"
                      value="PUBLISH"
                      onChange={(e) => setStatus(e.target.value)}
                      checked={status === "PUBLISH"}
                    />
                    <label htmlFor="publish">Publish</label>
                  </div>
                </div>

                <div className="publish-options-bottom">
                  <Button
                    label="Save"
                    disabled={isLoadingProcess}
                    raised
                    className="p-buttonadmin"
                    onClick={handleSaveClick}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Tentang;
