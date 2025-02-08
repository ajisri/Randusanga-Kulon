import React, { useState, useEffect } from "react";
import useSWR from "swr"; // Import SWR
// import axios from "axios";
import { Button, Row, Col } from "reactstrap";
import { Dialog } from "primereact/dialog";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Modall = () => {
  // State untuk masing-masing dialog
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogVisiblekk, setDialogVisiblekk] = useState(false);
  const [dialogVisiblektp, setDialogVisiblektp] = useState(false);
  const [dialogVisiblepn, setDialogVisiblepn] = useState(false);
  const [dialogVisibleabp, setDialogVisibleabp] = useState(false);
  const [dialogVisiblepsktm, setDialogVisiblepsktm] = useState(false);
  const [animationTriggered, setAnimationTriggered] = useState(false);

  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
  const [iconPosition1, setIconPosition1] = useState({ x: 0, y: 0 });
  const [iconPosition2, setIconPosition2] = useState({ x: 0, y: 0 });
  const [iconPosition3, setIconPosition3] = useState({ x: 0, y: 0 });
  const [iconPosition4, setIconPosition4] = useState({ x: 0, y: 0 });
  const [iconPosition5, setIconPosition5] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e, setIconPosition) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    // Hitung posisi mouse relatif terhadap tombol
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    // Batasi pergerakan ikon di dalam tombol
    const limitX = rect.width / 4;
    const limitY = rect.height / 4;

    const clampedX = Math.max(Math.min(offsetX, limitX), -limitX);
    const clampedY = Math.max(Math.min(offsetY, limitY), -limitY);

    setIconPosition({ x: clampedX, y: clampedY });

    // Tambahkan efek ripple
    const ripple = document.createElement("div");
    ripple.className = "ripple";
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 800); // Hapus ripple setelah animasi selesai
  };

  const handleMouseLeave = (setIconPosition) => {
    setIconPosition({ x: 0, y: 0 }); // Kembalikan posisi ikon ke tengah
  };

  // Memastikan animasi hanya terjadi sekali
  useEffect(() => {
    setAnimationTriggered(true);
  }, []);

  //akta kelahiran
  const { data: aktakelahiranData, error: aktakelahiranError } = useSWR(
    "https://randusanga-kulon.osc-fr1.scalingo.io/aktakelahiranpengunjung",
    fetcher
  );

  const loadingAktakelahiran = !aktakelahiranData && !aktakelahiranError;

  // Construct full URL for the image
  const baseAURL = "https://randusanga-kulon.osc-fr1.scalingo.io";
  const imageAURL = aktakelahiranData?.service.file_url
    ? `${baseAURL}${aktakelahiranData.service.file_url}`
    : null;

  //kartu keluarga
  const { data: kartukeluargaData, error: kartukeluargaError } = useSWR(
    "https://randusanga-kulon.osc-fr1.scalingo.io/kartukeluargapengunjung",
    fetcher
  );

  const loadingKartukeluarga = !kartukeluargaData && !kartukeluargaError;

  // Construct full URL for the image
  const baseKKURL = "https://randusanga-kulon.osc-fr1.scalingo.io";
  const imageKKURL = kartukeluargaData?.service.file_url
    ? `${baseKKURL}${kartukeluargaData.service.file_url}`
    : null;

  //ktp
  const { data: kartutandapendudukData, error: kartutandapendudukError } =
    useSWR(
      "https://randusanga-kulon.osc-fr1.scalingo.io/kartutandapendudukpengunjung",
      fetcher
    );

  const loadingKartutandapenduduk =
    !kartutandapendudukData && !kartutandapendudukError;

  // Construct full URL for the image
  const baseKTPURL = "https://randusanga-kulon.osc-fr1.scalingo.io";
  const imageKTPURL = kartutandapendudukData?.service.file_url
    ? `${baseKTPURL}${kartutandapendudukData.service.file_url}`
    : null;

  //pendaftaran nikah
  const { data: pendaftarannikahData, error: pendaftarannikahError } = useSWR(
    "https://randusanga-kulon.osc-fr1.scalingo.io/pendaftarannikahpengunjung",
    fetcher
  );

  const loadingPendaftarannikah =
    !pendaftarannikahData && !pendaftarannikahError;

  // Construct full URL for the image
  const basePNURL = "https://randusanga-kulon.osc-fr1.scalingo.io";
  const imagePNURL = pendaftarannikahData?.service.file_url
    ? `${basePNURL}${pendaftarannikahData.service.file_url}`
    : null;

  //aktifasi bpjs
  const { data: aktifasibpjsData, error: aktifasibpjsError } = useSWR(
    "https://randusanga-kulon.osc-fr1.scalingo.io/aktifasibpjspengunjung",
    fetcher
  );

  const loadingAktifasibpjs = !aktifasibpjsData && !aktifasibpjsError;

  // Construct full URL for the image
  const baseABURL = "https://randusanga-kulon.osc-fr1.scalingo.io";
  const imageABURL = aktifasibpjsData?.service.file_url
    ? `${baseABURL}${aktifasibpjsData.service.file_url}`
    : null;

  //pembuatan sktm
  const { data: pembuatansktmData, error: pembuatansktmError } = useSWR(
    "https://randusanga-kulon.osc-fr1.scalingo.io/pembuatansktmpengunjung",
    fetcher
  );

  const loadingPembuatansktm = !pembuatansktmData && !pembuatansktmError;

  // Construct full URL for the image
  const basePSKTMURL = "https://randusanga-kulon.osc-fr1.scalingo.io";
  const imagePSKTMURL = pembuatansktmData?.service.file_url
    ? `${basePSKTMURL}${pembuatansktmData.service.file_url}`
    : null;

  // Fungsi untuk menampilkan/menghilangkan dialog
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  const showDialogkk = () => setDialogVisiblekk(true);
  const hideDialogkk = () => setDialogVisiblekk(false);

  const showDialogktp = () => setDialogVisiblektp(true);
  const hideDialogktp = () => setDialogVisiblektp(false);

  const showDialogpn = () => setDialogVisiblepn(true);
  const hideDialogpn = () => setDialogVisiblepn(false);

  const showDialogabp = () => setDialogVisibleabp(true);
  const hideDialogabp = () => setDialogVisibleabp(false);

  const showDialogpsktm = () => setDialogVisiblepsktm(true);
  const hideDialogpsktm = () => setDialogVisiblepsktm(false);
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');


          .button-container {
            display: flex;
            justify-content: space-around;
          }

          .button {
            position: relative;
            padding: 3px;
            background-color: #ffffff;
            border: 12px solid #ddd;
            cursor: pointer;
            width: 60px !important;
            height: 50px !important;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .button:hover .cursor-icon {
            animation: magnetEffect 0.2s forwards;
          }
            
          .button-icon {
            position: relative;
            font-size: 80px !important;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            border: none;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s ease, color 0.3s ease;
            z-index: 1;
          }

          .button-icon:before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 10%, transparent 80%);
            transform: translate(-50%, -50%) scale(0);
            border-radius: 50%;
            transition: transform 0.5s ease-out;
            pointer-events: none;
          }

          .button-icon:hover:before {
            transform: translate(-50%, -50%) scale(1);
          }

          .button-icon:hover {
            transform: scale(1.05);
            filter: url('#distortion-filter'); /* SVG filter untuk distorsi */
          }

          .video-button {
            transform: translateX(-100%);
            animation: slideIn 1s forwards;
          }

          .no-animation {
            animation: none; /* Menghilangkan animasi setelah selesai */
          }

          .marquee {
            width: 100%;
            overflow: hidden;
            white-space: nowrap;
            font-size: 14px;
          }

          .marquee span {
            display: inline-block;
            padding-right: 100%;
            animation: marquee 10s linear infinite;
          }

          @keyframes magnetEffect {
            0% {
              transform: scale(1) translate(0, 0);
            }
            100% {
              transform: scale(1.2) translate(10px, -10px);
            }
          }
            
          @keyframes marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }

          @keyframes slideIn {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(0);
            }
          }

          .ripple-container {
            position: relative;
            overflow: hidden;
            display: inline-block;
            border-radius: 8px; /* Sesuaikan sesuai bentuk tombol */
          }
          .ripple {
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
            animation: ripple-animation 0.9s ease-out forwards;
          }

          @keyframes ripple-animation {
            to {
              transform: scale(15);
              opacity: 0;
            }
          }

          .p-dialog-mask {
            backdrop-filter: blur(6px);
            background: rgba(0, 0, 0, 0.5) !important;
          }

          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            60% {
              opacity: 1;
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }

          .bounce-in {
            animation: bounceIn 1s ease-in-out;
          }

          /* Custom Dialog Content */
          .custom-dialog {
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }

          body {
            font-family: 'Roboto', sans-serif;
            font-size: 16px; /* Ukuran font untuk teks */
            line-height: 1.5; /* Jarak antar baris untuk kenyamanan membaca */
            color: #333; /* Warna teks */
          }

          .dialog-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 10px;
            border-bottom: 1px solid #ccc;
          }

          .dialog-title {
            font-size: 24px;
            margin: 0;
            color: #333;
          }

          .dialog-subtitle {
            font-size: 14px;
            color: #777;
          }

          .dialog-text {
            font-family: 'Roboto', sans-serif;
            font-size: 16px; /* Ukuran font untuk teks panjang */
            line-height: 1.5; /* Jarak antar baris untuk kenyamanan membaca */
            color: #333; /* Warna teks */
          }

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: calc(80vh - 40px);
  overflow: hidden;
  position: relative; /* Untuk overlay */
  margin: 20px 0; /* Beri jarak atas dan bawah */
}

.modal-image {
  width: 100%; /* Sesuaikan lebar gambar */
  max-width: 70vw; /* Batasi lebar maksimum */
  height: auto;
  object-fit: cover; /* Pastikan gambar menutupi area */
  border-radius: 12px; /* Rounded */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* Shadow lebih tegas */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Animasi hover */
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-image:hover {
  transform: scale(1.02); /* Zoom sedikit saat hover */
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3); /* Shadow lebih besar saat hover */
}

/* Overlay untuk gambar */
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3); /* Overlay gelap */
  border-radius: 12px; /* Sesuaikan dengan gambar */
  pointer-events: none; /* Biarkan interaksi tetap pada gambar */
}

          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          }

          .loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 2s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .error-message {
            color: #e74c3c;
            font-size: 16px;
            text-align: center;
          }

          /* Mengunci scroll saat modal terbuka */
          body.modal-open {
            overflow: hidden;
          }

          @media screen and (max-width: 1200px) {
            .button {
              width: 50px !important;
              height: 45px !important;
            }

            .button-icon {
              font-size: 60px !important;
            }

            .dialog-title {
              font-size: 20px;
            }

            .dialog-subtitle {
              font-size: 12px;
            }
          }

          @media screen and (max-width: 768px) {
            .button {
              width: 40px !important;
              height: 40px !important;
            }

            .button-icon {
              font-size: 40px !important;
            }

            .marquee {
              font-size: 12px;
            }

            .custom-dialog {
              width: 85vw !important;
            }
          }

          @media screen and (max-width: 480px) {
            .button {
              width: 35px !important;
              height: 35px !important;
            }

            .button-icon {
              font-size: 30px !important;
            }

            .dialog-title {
              font-size: 16px;
            }

            .dialog-subtitle {
              font-size: 10px;
            }
          }
        `}
      </style>
      <svg style={{ display: "none" }}>
        <filter id="distortion-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.03"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <h2 className="mt-sm mb-2">
        <span></span>
      </h2>
      {/* <h3 className="h4 text-success font-weight-bold mb-4">Modals</h3> */}
      <Row>
        <Col
          className="mt-1"
          md="3"
          xs="6"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialog}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition)}
            onMouseLeave={() => handleMouseLeave(setIconPosition)}
          >
            <div
              className="button-icon ripple-container"
              style={{
                transform: `translate(${iconPosition.x}px, ${iconPosition.y}px)`,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/aktakelahiran.png")}
                alt=""
                style={{
                  width: "50%", // Ukuran gambar dikurangi menjadi 50% dari container
                  maxWidth: "150px", // Batas maksimum lebar
                  height: "auto", // Menjaga aspek rasio
                  borderRadius: "inherit", // Menyesuaikan border radius dengan container
                }}
              />
            </div>
            <div className="marquee">
              <span style={{ display: "inline-block" }}>Akta Kelahiran</span>
            </div>
          </Button>
          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">Akta Kelahiran</h2>
                    <p className="dialog-subtitle">
                      Prosedur pengurusan akta kelahiran
                    </p>
                  </div>
                </div>
              }
              visible={dialogVisible}
              style={{ width: "55vw" }}
              maximizable
              modal
              className="custom-dialog bounce-in"
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
                height: "300px",
              }}
              onHide={hideDialog}
            >
              <div className="modal-body col-lg">
                {loadingAktakelahiran ? (
                  <div className="loading-container">
                    <span className="loader"></span>
                  </div>
                ) : aktakelahiranError ? (
                  <p className="error-message">
                    {aktakelahiranError.message || "Failed to load data"}
                  </p>
                ) : (
                  <div>
                    {imageAURL ? (
                      <div
                        className="image-container"
                        style={{ marginBottom: "10px" }}
                      >
                        <img
                          src={imageAURL}
                          alt="Organizational Structure"
                          className="modal-image"
                          // Adjust image size
                        />
                        <div className="image-overlay"></div>
                      </div>
                    ) : (
                      <p>No image available</p>
                    )}
                    <div className="dialog-divider"></div>
                    {aktakelahiranData?.service?.content && (
                      <div
                        className="dialog-text"
                        dangerouslySetInnerHTML={{
                          __html:
                            aktakelahiranData?.service?.content ||
                            "<p>No content available</p>",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </Dialog>
          </div>
        </Col>
        <Col
          className="mt-1"
          md="3"
          xs="6"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <Button
            block
            className={`btn-white btn-icon mb-3 mb-sm-0 video-button ${
              animationTriggered ? "video-button" : "no-animation"
            }`}
            color="black"
            type="button"
            onClick={showDialogkk}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition1)}
            onMouseLeave={() => handleMouseLeave(setIconPosition1)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition1.x}px, ${iconPosition1.y}px)`,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/kartukeluarga.png")}
                alt=""
                style={{
                  marginBottom: "10px",
                  width: "50%", // Ukuran gambar dikurangi menjadi 50% dari container
                  maxWidth: "150px", // Batas maksimum lebar
                  height: "auto", // Menjaga aspek rasio
                  borderRadius: "inherit", // Menyesuaikan border radius dengan container
                }}
              />
            </div>
            Kartu Keluarga
          </Button>
          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">Kartu Keluarga</h2>
                    <p className="dialog-subtitle">
                      Prosedur pengurusan kartu keluarga
                    </p>
                  </div>
                </div>
              }
              visible={dialogVisiblekk}
              style={{ width: "75vw", maxWidth: "800px", height: "auto" }}
              maximizable
              modal
              className="custom-dialog bounce-in"
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
                height: "auto",
              }}
              onHide={hideDialogkk}
              onMouseMove={(e) => handleMouseMove(e, setIconPosition1)}
              onMouseLeave={() => handleMouseLeave(setIconPosition1)}
            >
              <div className="modal-body col-lg">
                {loadingKartukeluarga ? (
                  <div className="loading-container">
                    <span className="loader"></span>
                  </div>
                ) : kartukeluargaError ? (
                  <p className="error-message">
                    {kartukeluargaError.message || "Failed to load data"}
                  </p>
                ) : (
                  <div>
                    {imageKKURL ? (
                      <div
                        className="image-container"
                        style={{ marginBottom: "10px" }}
                      >
                        <img
                          src={imageKKURL}
                          alt="Organizational Structure"
                          className="modal-image"
                          // Adjust image size
                        />
                        <div className="image-overlay"></div>
                      </div>
                    ) : (
                      <p>No image available</p>
                    )}
                    <div className="dialog-divider"></div>
                    {kartukeluargaData?.service?.content && (
                      <div
                        className="dialog-text"
                        dangerouslySetInnerHTML={{
                          __html:
                            kartukeluargaData?.service?.content ||
                            "<p>No content available</p>",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </Dialog>
          </div>
        </Col>
        <Col
          className="mt-1"
          md="3"
          xs="6"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogktp}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition2)}
            onMouseLeave={() => handleMouseLeave(setIconPosition2)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition2.x}px, ${iconPosition2.y}px)`,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/ktp.png")}
                alt=""
                style={{
                  marginBottom: "10px",
                  width: "50%", // Ukuran gambar dikurangi menjadi 50% dari container
                  maxWidth: "150px", // Batas maksimum lebar
                  height: "auto", // Menjaga aspek rasio
                  borderRadius: "inherit", // Menyesuaikan border radius dengan container
                }}
              />
            </div>
            KTP
          </Button>
          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">Kartu Tanda Penduduk</h2>
                    <p className="dialog-subtitle">
                      Prosedur pengurusan kartu tanda penduduk
                    </p>
                  </div>
                </div>
              }
              visible={dialogVisiblektp}
              style={{ width: "55vw" }}
              maximizable
              modal
              className="custom-dialog bounce-in"
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
                height: "300px",
              }}
              onHide={hideDialogktp}
            >
              <div className="modal-body col-lg">
                {loadingKartutandapenduduk ? (
                  <div className="loading-container">
                    <span className="loader"></span>
                  </div>
                ) : kartutandapendudukError ? (
                  <p className="error-message">
                    {kartutandapendudukError.message || "Failed to load data"}
                  </p>
                ) : (
                  <div>
                    {imageKTPURL ? (
                      <div>
                        <img
                          src={imageKTPURL}
                          alt="Organizational Structure"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "20px",
                            maxHeight: "calc(89vh - 60px)",
                            marginBottom: "50px",
                          }} // Adjust image size
                        />
                      </div>
                    ) : (
                      <p>No image available</p>
                    )}
                    <div className="dialog-divider"></div>
                    {kartutandapendudukData?.service?.content && (
                      <div
                        className="dialog-text"
                        dangerouslySetInnerHTML={{
                          __html:
                            kartutandapendudukData?.service?.content ||
                            "<p>No content available</p>",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </Dialog>
          </div>
        </Col>
        <Col
          className="mt-1"
          md="3"
          xs="6"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <Button
            block
            className={`btn-white btn-icon mb-3 mb-sm-0 video-button ${
              animationTriggered ? "video-button" : "no-animation"
            }`}
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogpn}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition3)}
            onMouseLeave={() => handleMouseLeave(setIconPosition3)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition3.x}px, ${iconPosition3.y}px)`,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/pernikahan.png")}
                alt=""
                style={{
                  marginTop: "9px",
                  marginBottom: "10px",
                  width: "50%", // Ukuran gambar dikurangi menjadi 50% dari container
                  maxWidth: "150px", // Batas maksimum lebar
                  height: "auto", // Menjaga aspek rasio
                  borderRadius: "inherit", // Menyesuaikan border radius dengan container
                }}
              />
            </div>
            Pendaftaran Nikah
          </Button>
          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">Pendaftaran Nikah</h2>
                    <p className="dialog-subtitle">
                      Prosedur pengurusan pendaftaran nikah
                    </p>
                  </div>
                </div>
              }
              visible={dialogVisiblepn}
              style={{ width: "55vw" }}
              maximizable
              modal
              className="custom-dialog bounce-in"
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
                height: "300px",
              }}
              onHide={hideDialogpn}
            >
              <div className="modal-body col-lg">
                {loadingPendaftarannikah ? (
                  <div className="loading-container">
                    <span className="loader"></span>
                  </div>
                ) : pendaftarannikahError ? (
                  <p className="error-message">
                    {pendaftarannikahError.message || "Failed to load data"}
                  </p>
                ) : (
                  <div>
                    {imagePNURL ? (
                      <div>
                        <img
                          src={imagePNURL}
                          alt="Organizational Structure"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "20px",
                            maxHeight: "calc(89vh - 60px)",
                            marginBottom: "50px",
                          }} // Adjust image size
                        />
                      </div>
                    ) : (
                      <p>No image available</p>
                    )}
                    <div className="dialog-divider"></div>
                    {pendaftarannikahData?.service?.content && (
                      <div
                        className="dialog-text"
                        dangerouslySetInnerHTML={{
                          __html:
                            pendaftarannikahData?.service?.content ||
                            "<p>No content available</p>",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </Dialog>
          </div>
        </Col>
      </Row>
      <Row>
        <Col
          className="mt-1"
          md="3"
          xs="6"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogabp}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition4)}
            onMouseLeave={() => handleMouseLeave(setIconPosition4)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition4.x}px, ${iconPosition4.y}px)`,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/aktivasibpjs.png")}
                alt=""
                style={{
                  marginTop: "10px",
                  marginBottom: "10px",
                  width: "50%", // Ukuran gambar dikurangi menjadi 50% dari container
                  maxWidth: "150px", // Batas maksimum lebar
                  height: "auto", // Menjaga aspek rasio
                  borderRadius: "inherit", // Menyesuaikan border radius dengan container
                }}
              />
            </div>
            Aktifasi BPJS PBI-JKN
          </Button>
          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">Aktifasi BPJS PBI-JKN</h2>
                    <p className="dialog-subtitle">
                      Prosedur pengurusan aktifasi BPJS PBI-JKN
                    </p>
                  </div>
                </div>
              }
              visible={dialogVisibleabp}
              style={{ width: "55vw" }}
              maximizable
              modal
              className="custom-dialog bounce-in"
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
                height: "300px",
              }}
              onHide={hideDialogabp}
            >
              <div className="modal-body col-lg">
                {loadingAktifasibpjs ? (
                  <div className="loading-container">
                    <span className="loader"></span>
                  </div>
                ) : aktifasibpjsError ? (
                  <p className="error-message">
                    {aktifasibpjsError.message || "Failed to load data"}
                  </p>
                ) : (
                  <div>
                    {imageABURL ? (
                      <div>
                        <img
                          src={imageABURL}
                          alt="Organizational Structure"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "20px",
                            maxHeight: "calc(89vh - 60px)",
                            marginBottom: "50px",
                          }} // Adjust image size
                        />
                      </div>
                    ) : (
                      <p>No image available</p>
                    )}
                    <div className="dialog-divider"></div>
                    {aktifasibpjsData?.service?.content && (
                      <div
                        className="dialog-text"
                        dangerouslySetInnerHTML={{
                          __html:
                            aktifasibpjsData?.service?.content ||
                            "<p>No content available</p>",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </Dialog>
          </div>
        </Col>
        <Col
          className="mt-1"
          md="3"
          xs="6"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <Button
            block
            className={`btn-white btn-icon mb-3 mb-sm-0 video-button ${
              animationTriggered ? "video-button" : "no-animation"
            }`}
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogpsktm}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition5)}
            onMouseLeave={() => handleMouseLeave(setIconPosition5)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition5.x}px, ${iconPosition5.y}px)`,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/sktm.png")}
                alt=""
                style={{
                  marginBottom: "10px",
                  width: "50%", // Ukuran gambar dikurangi menjadi 50% dari container
                  maxWidth: "150px", // Batas maksimum lebar
                  height: "auto", // Menjaga aspek rasio
                  borderRadius: "inherit", // Menyesuaikan border radius dengan container
                }}
              />
            </div>
            Pembuatan SKTM
          </Button>
          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">Pembuatan SKTM</h2>
                    <p className="dialog-subtitle">
                      Prosedur pengurusan pembuatan sktm
                    </p>
                  </div>
                </div>
              }
              visible={dialogVisiblepsktm}
              style={{ width: "55vw" }}
              maximizable
              modal
              className="custom-dialog bounce-in"
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
                height: "300px",
              }}
              onHide={hideDialogpsktm}
            >
              <div className="modal-body col-lg">
                {loadingPembuatansktm ? (
                  <div className="loading-container">
                    <span className="loader"></span>
                  </div>
                ) : pembuatansktmError ? (
                  <p classname="error-message">
                    {pembuatansktmError.message || "Failed to load data"}
                  </p>
                ) : (
                  <div>
                    {imagePSKTMURL ? (
                      <div>
                        <img
                          src={imagePSKTMURL}
                          alt="Organizational Structure"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "20px",
                            maxHeight: "calc(89vh - 60px)",
                            marginBottom: "50px",
                          }} // Adjust image size
                        />
                      </div>
                    ) : (
                      <p>No Image Available</p>
                    )}
                    <div className="dialog-divider"></div>
                    {pembuatansktmData?.service?.content && (
                      <div
                        className="dialog-text"
                        dangerouslySetInnerHTML={{
                          __html:
                            pembuatansktmData?.service?.content ||
                            "<p>No content available</p>",
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </Dialog>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Modall;
