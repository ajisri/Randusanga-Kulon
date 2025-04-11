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
    "http://localhost:8080/aktakelahiranpengunjung",
    fetcher
  );

  const loadingAktakelahiran = !aktakelahiranData && !aktakelahiranError;

  // Construct full URL for the image
  const baseAURL = "http://localhost:8080";
  const imageAURL = aktakelahiranData?.service.file_url
    ? `${baseAURL}${aktakelahiranData.service.file_url}`
    : null;

  //kartu keluarga
  const { data: kartukeluargaData, error: kartukeluargaError } = useSWR(
    "http://localhost:8080/kartukeluargapengunjung",
    fetcher
  );

  const loadingKartukeluarga = !kartukeluargaData && !kartukeluargaError;

  // Construct full URL for the image
  const baseKKURL = "http://localhost:8080";
  const imageKKURL = kartukeluargaData?.service.file_url
    ? `${baseKKURL}${kartukeluargaData.service.file_url}`
    : null;

  //ktp
  const { data: kartutandapendudukData, error: kartutandapendudukError } =
    useSWR("http://localhost:8080/kartutandapendudukpengunjung", fetcher);

  const loadingKartutandapenduduk =
    !kartutandapendudukData && !kartutandapendudukError;

  // Construct full URL for the image
  const baseKTPURL = "http://localhost:8080";
  const imageKTPURL = kartutandapendudukData?.service.file_url
    ? `${baseKTPURL}${kartutandapendudukData.service.file_url}`
    : null;

  //pendaftaran nikah
  const { data: pendaftarannikahData, error: pendaftarannikahError } = useSWR(
    "http://localhost:8080/pendaftarannikahpengunjung",
    fetcher
  );

  const loadingPendaftarannikah =
    !pendaftarannikahData && !pendaftarannikahError;

  // Construct full URL for the image
  const basePNURL = "http://localhost:8080";
  const imagePNURL = pendaftarannikahData?.service.file_url
    ? `${basePNURL}${pendaftarannikahData.service.file_url}`
    : null;

  //aktifasi bpjs
  const { data: aktifasibpjsData, error: aktifasibpjsError } = useSWR(
    "http://localhost:8080/aktifasibpjspengunjung",
    fetcher
  );

  const loadingAktifasibpjs = !aktifasibpjsData && !aktifasibpjsError;

  // Construct full URL for the image
  const baseABURL = "http://localhost:8080";
  const imageABURL = aktifasibpjsData?.service.file_url
    ? `${baseABURL}${aktifasibpjsData.service.file_url}`
    : null;

  //pembuatan sktm
  const { data: pembuatansktmData, error: pembuatansktmError } = useSWR(
    "http://localhost:8080/pembuatansktmpengunjung",
    fetcher
  );

  const loadingPembuatansktm = !pembuatansktmData && !pembuatansktmError;

  // Construct full URL for the image
  const basePSKTMURL = "http://localhost:8080";
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
            border-radius: 12px; /* Sesuaikan sesuai bentuk tombol */
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

          .dialog-text {
            font-family: 'Roboto', sans-serif;
            font-size: 16px; /* Ukuran font untuk teks panjang */
            line-height: 1.5; /* Jarak antar baris untuk kenyamanan membaca */
            color: #333; /* Warna teks */
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

          .custom-button {
            overflow: visible;
            border-radius: 12px;
            border: 3px solid rgba(255, 255, 255, 0.8);
            padding: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: clamp(100px, 10vh, 100px);
            gap: 6px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            max-width: 30vw; /* 1/3 layar laptop */
            width: 95%;
            z-index: 1;
          }

          .custom-button:hover {
              background: rgba(255, 255, 255, 0.05);  /* transparansi lebih rendah saat hover */
              border: 3px solid rgba(255, 255, 255, 0.5); /* membuat border sedikit lebih terang saat hover */
              box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3); /* menambahkan efek bayangan lebih besar pada hover */
              transform: translateY(-3px);
          }

          .video-button {
            transform: translateX(-100%);
            animation: slideIn 1s forwards;
          }

          .video-button:hover {
            transform: translateY(-3px);
          }

          @media (max-width: 1024px) {
              .custom-button {
                  max-width: 50vw; /* Setengah layar untuk tablet */
              }
          }

          @media (max-width: 768px) {
              .custom-button {
                  max-width: 80vw; /* Hampir seluruh layar pada ponsel */
                  height: clamp(60px, 8vh, 80px);
              }
          }

          @media (min-width: 1440px) {
              .custom-button {
                  max-width: 25vw; /* Lebih kecil agar tidak terlalu lebar di layar besar */
              }
          }

          @media (min-width: 1920px) {
              .custom-button {
                  max-width: 20vw; /* Di layar 4K, tombol lebih kecil dan tetap proporsional */
              }
          }

          .button-icon {
            overflow: visible;
            position: relative;
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: center;
            width: 100% !important;
            height: 100%;
            min-height: 70px !important;
            border-radius: 12px;
            margin: 0px
            cursor: pointer;
            transition: transform 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
            z-index: 1;
            background: linear-gradient(145deg, #ffffff, #e0e0e0); /* Efek timbul */
            box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2), -5px -5px 10px rgba(255, 255, 255, 0.8); /* Efek timbul */
          }

          .button-icon img {
              width: 80%; /* Ukuran gambar lebih besar agar lebih jelas */
              max-width: clamp(30px, 8vw, 40px);
              transition: transform 0.3s ease, opacity 0.3s ease;
          }

          .button-icon:hover img {
              transform: translateY(-4px); /* Gambar sedikit naik saat hover */
              opacity: 1;
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
            box-shadow: 8px 8px 14px rgba(0, 0, 0, 0.3), -5px -5px 10px rgba(255, 255, 255, 0.9);
            filter: url('#distortion-filter'); /* SVG filter untuk distorsi */
          }
          
          .img-custom {
            transform: translateY(-3px);
            width: 80%;
            max-width: clamp(100px, 15vw, 150px);
            height: auto;
            border-radius: inherit;
          }

          .icon-button-text {
            display: block;
            text-align: center;
            font-size: clamp(8px, 2vw, 10px);
            font-weight: 600;
            transform: translateY(-15px);
            color: #fff;
          }

          @media (max-width: 768px) {
              .button-icon {
                  min-height: 50px;
              }

              .icon-button-text {
                  font-size: clamp(7px, 1.8vw, 9px);
              }
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

            .custom-button {
                max-width: 70vw; /* Lebih kecil dari sebelumnya (80vw) */
                height: clamp(50px, 7vh, 70px); /* Tinggi lebih kecil */
                gap: 5px; /* Mengurangi jarak antar elemen */
            }

            .button-icon {
                min-height: 45px; /* Lebih kecil dari sebelumnya */
            }

            .button-icon img {
                max-width: clamp(25px, 7vw, 35px); /* Ikon lebih kecil */
            }

            .icon-button-text {
                font-size: clamp(6px, 1.5vw, 8px); /* Ukuran teks lebih kecil */
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

            .custom-button {
              max-width: 30vw !important; /* Lebih kecil dari sebelumnya (70vw) */
              height: clamp(120px, 40vh, 120px); /* Tinggi lebih kecil */
              gap: 2px !important; /* Mengurangi jarak antar elemen */
            }

            .button-icon {
                width: 20vw !important;
                height: 80%;
                min-height: 60px; /* Lebih kecil untuk layar sempit */
            }

            .button-icon img {
                max-width: clamp(20px, 6vw, 30px); /* Ikon lebih kecil */
            }

            .icon-button-text {
                font-size: clamp(12px, 1.5vw, 12px); /* Teks lebih kecil */
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
          md="4"
          xs="4"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <Button
            block
            className="custom-button video-button mb-3 mb-sm-0"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialog}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition)}
            onMouseLeave={() => handleMouseLeave(setIconPosition)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition.x}px, ${iconPosition.y}px) translateY(-15px)`,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/aktakelahiran.png")}
                alt=""
              />
            </div>
            <div>
              <span className="icon-button-text">AKTA KELAHIRAN</span>
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
              style={{ width: "75vw", maxWidth: "800px", height: "auto" }}
              maximizable
              modal
              className="custom-dialog bounce-in"
              contentStyle={{
                overflowY: "auto",
                padding: "15px 15px 10px 15px",
                height: "auto",
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
          md="4"
          xs="4"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <Button
            block
            className="custom-button mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogkk}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition1)}
            onMouseLeave={() => handleMouseLeave(setIconPosition1)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition1.x}px, ${iconPosition1.y}px) translateY(-15px)`,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/kartukeluarga.png")}
                alt=""
              />
            </div>
            <div>
              <span className="icon-button-text">KARTU KELUARGA</span>
            </div>
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
          md="4"
          xs="4"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <Button
            block
            className="custom-button video-button mb-3 mb-sm-0"
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
                transform: `translate(${iconPosition2.x}px, ${iconPosition2.y}px) translateY(-19px)`,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/ktp.png")}
                alt=""
              />
            </div>
            <div>
              <span className="icon-button-text">KTP</span>
            </div>
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
                padding: "15px 15px 10px 15px",
                height: "auto",
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
                      <div
                        className="image-container"
                        style={{ marginBottom: "10px" }}
                      >
                        <img
                          src={imageKTPURL}
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
      </Row>
      <Row>
        <Col
          className="mt-1"
          md="4"
          xs="4"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <Button
            block
            className="mb-3 mb-sm-0 custom-button video-button"
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
                transform: `translate(${iconPosition3.x}px, ${iconPosition3.y}px) translateY(-15px)`,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/pernikahan.png")}
                alt=""
              />
            </div>
            <div>
              <span className="icon-button-text">PENDAFTARAN NIKAH</span>
            </div>
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
                      <div
                        className="image-container"
                        style={{ marginBottom: "10px" }}
                      >
                        <img
                          src={imagePNURL}
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
        <Col
          className="mt-1"
          md="4"
          xs="4"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <Button
            block
            className="custom-button video-button mb-3 mb-sm-0"
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
                overflow: "visible",
                transform: `translate(${iconPosition4.x}px, ${iconPosition4.y}px) translateY(-15px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <img
                className="img-fluid custom-icon"
                src={require("assets/img/theme/aktivasibpjs.png")}
                alt=""
              />
            </div>
            <div>
              <span className="icon-button-text">AKTIFASI BPJS PBI</span>
            </div>
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
                padding: "15px 15px 10px 15px",
                height: "auto",
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
                      <div
                        className="image-container"
                        style={{ marginBottom: "10px" }}
                      >
                        <img
                          src={imageABURL}
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
          md="4"
          xs="4"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <Button
            block
            className={`custom-button mb-3 mb-sm-0 video-button ${
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
                transform: `translate(${iconPosition5.x}px, ${iconPosition5.y}px) translateY(-15px)`,
              }}
            >
              <img
                className="img-fluid custom-icon"
                src={require("assets/img/theme/sktm.png")}
                alt=""
              />
            </div>
            <div>
              <span className="icon-button-text">PEMBUATAN SKTM</span>
            </div>
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
                padding: "15px 15px 10px 15px",
                height: "auto",
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
                      <div
                        className="image-container"
                        style={{ marginBottom: "10px" }}
                      >
                        <img
                          src={imagePSKTMURL}
                          alt="Organizational Structure"
                          className="modal-image"
                          // Adjust image size
                        />
                        <div className="image-overlay"></div>
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
