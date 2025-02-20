import React, { useState, useEffect } from "react";
import useSWR from "swr"; // Import SWR
import { TabView, TabPanel } from "primereact/tabview";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// reactstrap components
import { Button, Row, Col } from "reactstrap";

import "primereact/resources/themes/saga-blue/theme.css"; // Import tema
import "primereact/resources/primereact.min.css"; // Import CSS utama PrimeReact

const fetcher = (url) => fetch(url).then((res) => res.json());

const Modalt = () => {
  const [ankorpList, setAnkorpList] = useState([]);
  const [apbdpList, setApbdpList] = useState([]);
  const [isDetailDialogVisible, setDetailDialogVisible] = useState(false);
  const [selectedKeuangan, setSelectedKeuangan] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogVisiblePH, setDialogVisiblePH] = useState(false);
  const [dialogVisibleAPB, setDialogVisibleAPB] = useState(false);
  // const [dialogVisibleD, setDialogVisibleD] = useState(false);

  const { data: produkhukumData, error: produkhukumError } = useSWR(
    "https://randusanga-kulon.osc-fr1.scalingo.io/produk_hukump",
    fetcher
  );
  const loadingProdukhukum = !produkhukumData && !produkhukumError;

  const produkhukumList = produkhukumData?.produkHukump || [];

  // Fetch APBD data
  const { data: allapbdData, error: allapbdError } = useSWR(
    "https://randusanga-kulon.osc-fr1.scalingo.io/allapbdp",
    fetcher
  );
  const loadingApbd = !allapbdData && !allapbdError;

  // Ambil data APBD dari API dan simpan ke state
  useEffect(() => {
    if (allapbdData?.data) {
      setApbdpList(allapbdData.data);
    }
  }, [allapbdData]);

  // Debugging: log struktur data
  useEffect(() => {
    if (allapbdData) {
      console.log(
        "Struktur data dari API:",
        JSON.stringify(allapbdData, null, 2)
      );
    }
  }, [allapbdData]);

  //ankor
  const { data: allankorData } = useSWR(
    "https://randusanga-kulon.osc-fr1.scalingo.io/ankorp",
    fetcher
  );

  // Ambil data APBD dari API dan simpan ke state
  useEffect(() => {
    if (allankorData?.data) {
      setAnkorpList(allankorData.data);
    }
  }, [allankorData]);

  // Debugging: log struktur data
  useEffect(() => {
    if (allankorData) {
      console.log(
        "Struktur data dari API:",
        JSON.stringify(allankorData, null, 2)
      );
    }
  }, [allankorData]);

  const showDialog = () => {
    setDialogVisible(true);
  };

  const showDialogPH = () => {
    setDialogVisiblePH(true);
  };

  const showDialogAPB = () => {
    setDialogVisibleAPB(true);
  };

  // const showDialogD = () => {
  //   setDialogVisibleD(true);
  // };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  // const hideDialogD = () => {
  //   setDialogVisibleD(false);
  // };

  const hideDialogAPB = () => {
    setDialogVisibleAPB(false);
  };

  const hideDialogPH = () => {
    setDialogVisiblePH(false);
  };

  // Fungsi untuk membuat header tab secara dinamis
  const createTabHeaderTemplate = (icon, label) => (options) =>
    (
      <div
        className="flex align-items-center gap-2 p-3"
        style={{ cursor: "pointer" }}
        onClick={options.onClick}
      >
        <i className={icon}></i>
        <span className="font-bold white-space-nowrap">{label}</span>
      </div>
    );

  const [visibleapbd, setVisibleapbd] = useState(false);

  const openDetailDialog = (rowData) => {
    if (Array.isArray(rowData.keuangan) && rowData.keuangan.length > 0) {
      setSelectedKeuangan(rowData.keuangan);
      setDetailDialogVisible(true);
    } else {
      setVisibleapbd(true);
    }
  };

  const closeDetailDialog = () => {
    setDetailDialogVisible(false);
    setSelectedKeuangan(null);
  };

  const [animationTriggered, setAnimationTriggered] = useState(false);

  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
  const [iconPosition1, setIconPosition1] = useState({ x: 0, y: 0 });
  const [iconPosition2, setIconPosition2] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    setAnimationTriggered(true);
  }, []);

  const isValidURL = (text) => {
    return (
      typeof text === "string" &&
      (text.startsWith("http://") || text.startsWith("https://"))
    );
  };

  return (
    <>
      <style jsx>
        {`
          .custom-tabpanel-header .p-tabview-title {
            color: black !important; /* Ubah warna teks header Tab ke hitam */
          }
          .custom-accordion-header .p-accordion-header-link {
            color: black !important; /* Ubah warna teks header Accordion ke hitam */
          }

          @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");
          @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

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
            min-height: 70px !important;
            border: none;
            border-radius: 12px;
            margin: 0px
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
            z-index: 1;
            background: linear-gradient(145deg, #ffffff, #e0e0e0); /* Efek timbul */
            box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2), -5px -5px 10px rgba(255, 255, 255, 0.8); /* Efek timbul */
          }

          .button-icon img {
            width: 80%; /* Ukuran gambar lebih besar agar lebih jelas */
            max-width: 40px;
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

          .dialog-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 10px;
            border-bottom: 1px solid #ccc;
          }

          .dialog-title {
            font-family: "Roboto", sans-serif;
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
            font-family: "Roboto", sans-serif;
            font-size: 16px; /* Ukuran font untuk teks */
            line-height: 1.5; /* Jarak antar baris untuk kenyamanan membaca */
            color: #333; /* Warna teks */
          }

          .dialog-text {
            font-family: "Roboto", sans-serif;
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

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
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
      <Row>
        <Col
          className="mt-1"
          md="4"
          xs="6"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialog}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition)}
            onMouseLeave={() => handleMouseLeave(setIconPosition)}
            style={{
              overflow: "visible",
              borderRadius: "12px",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "30vw !important",
              minHeight: "120px !important",
              height: "120px !important",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <div
              className="button-icon"
              style={{
                overflow: "visible",
                transform: `translate(${iconPosition.x}px, ${iconPosition.y}px) translateY(-15px)`,
                display: "flex",
                alignItems: "center",
                maxWidth: "30vw !important",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/desaankor.png")}
                alt=""
                style={{
                  transform: "translateY(-8px)",
                  width: "80%",
                  maxWidth: "40vh !important",
                  height: "auto",
                  borderRadius: "inherit",
                }}
              />
            </div>
            <div>
              <span
                style={{
                  display: "block",
                  textAlign: "center",
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "#fff", // Warna teks agar lebih kontras
                }}
              >
                DESA ANKOR
              </span>
            </div>
          </Button>
          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">Desa Ankor</h2>
                    <p className="dialog-subtitle">
                      Informasi mengenai desa anti korupsi
                    </p>
                  </div>
                </div>
              }
              visible={dialogVisible}
              style={{ width: "75vw" }}
              maximizable
              modal
              className="custom-dialog bounce-in"
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
                height: "auto",
              }}
              onHide={hideDialog}
            >
              <TabView>
                {ankorpList.length > 0 ? (
                  ankorpList.map((tab, index) => (
                    <TabPanel
                      key={index}
                      headerTemplate={createTabHeaderTemplate(
                        tab.icon || "pi pi-folder", // Ikon default jika `tab.icon` kosong
                        tab.name || "Unknown Tab" // Nama tab dari data API
                      )}
                    >
                      {/* Konten tab berdasarkan data API */}
                      {Array.isArray(tab.kategoriankor) &&
                        tab.kategoriankor.map((kategori, kategoriIdx) => (
                          <Accordion
                            key={kategoriIdx}
                            activeIndex={0}
                            className="custom-accordion-header dialog-text"
                          >
                            <AccordionTab
                              key={kategoriIdx}
                              header={kategori.name || "No Title"}
                            >
                              {/* Data SubkategoriAnkor */}
                              {Array.isArray(kategori.subkategoriankor) &&
                                kategori.subkategoriankor.map(
                                  (subkategori, subIdx) => (
                                    <div
                                      key={subIdx}
                                      className="subkategori-section dialog-text"
                                    >
                                      <p className="dialog-text">
                                        {subkategori.name ||
                                          "No Subcategory Title"}
                                      </p>
                                      <ul>
                                        {Array.isArray(
                                          subkategori.poinsubkategoriankor
                                        ) &&
                                          subkategori.poinsubkategoriankor.map(
                                            (poin, poinIdx) => (
                                              <li key={poinIdx}>
                                                {isValidURL(poin.url) ? (
                                                  <a
                                                    href={poin.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                  >
                                                    {poin.name}
                                                  </a>
                                                ) : (
                                                  poin.name || "No Content"
                                                )}
                                              </li>
                                            )
                                          )}
                                      </ul>
                                    </div>
                                  )
                                )}
                            </AccordionTab>
                          </Accordion>
                        ))}
                    </TabPanel>
                  ))
                ) : (
                  <p>Data tidak tersedia</p>
                )}
              </TabView>
            </Dialog>
          </div>
        </Col>
        <Col
          className="mt-1"
          md="4"
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
            onClick={showDialogPH}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition1)}
            onMouseLeave={() => handleMouseLeave(setIconPosition1)}
            style={{
              overflow: "visible",
              borderRadius: "12px",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "30vw",
              minHeight: "120px",
              height: "120px",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <div
              className="button-icon"
              style={{
                overflow: "visible",
                transform: `translate(${iconPosition1.x}px, ${iconPosition1.y}px) translateY(-15px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/law.png")}
                alt=""
                style={{
                  transform: "translateY(-8px)",
                  width: "80%",
                  maxWidth: "30vh",
                  height: "auto",
                  borderRadius: "inherit",
                }}
              />
            </div>
            <div>
              <span
                style={{
                  display: "block",
                  textAlign: "center",
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "#fff", // Warna teks agar lebih kontras
                }}
              >
                PRODUK HUKUM
              </span>
            </div>
          </Button>
          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">Produk Hukum</h2>
                    <p className="dialog-subtitle">
                      Informasi mengenai produk hukum yang ada di desa
                    </p>
                  </div>
                </div>
              }
              visible={dialogVisiblePH}
              style={{ width: "85vw" }}
              maximizable
              modal
              className="custom-dialog bounce-in"
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
                height: "auto",
              }}
              onHide={hideDialogPH}
            >
              <div className="dialog-divider"></div>
              {loadingProdukhukum ? (
                <div className="loading-container">
                  <span className="loader"></span>
                </div>
              ) : produkhukumError ? (
                <p className="error-message">
                  Error loading data: {produkhukumError.message}
                </p>
              ) : produkhukumList.length === 0 ? (
                <p>No data available.</p>
              ) : (
                <DataTable
                  value={produkhukumList}
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  tableStyle={{ minWidth: "50rem" }}
                  className="dialog-text"
                >
                  <Column
                    field="name"
                    header="Name"
                    style={{ width: "25%", minWidth: "15%" }}
                  ></Column>
                  <Column
                    field="deskripsi"
                    header="Deskripsi"
                    style={{ width: "45%", minWidth: "15%" }}
                    headerStyle={{
                      textAlign: "center !important",
                    }}
                  />
                  <Column
                    field="waktu"
                    style={{ width: "20%", minWidth: "10%" }}
                    header="Tanggal SK"
                    body={(rowData) =>
                      new Date(rowData.waktu).toLocaleDateString()
                    } // Formatting the date
                  ></Column>
                  <Column
                    field="file_url"
                    style={{ width: "5%", minWidth: "5%" }}
                    header="Download"
                    body={(rowData) => {
                      const fileName = rowData.file_url.split("/").pop(); // Ambil nama file saja
                      return (
                        <a
                          href={`https://randusanga-kulon.osc-fr1.scalingo.io/download/${fileName}`} // Mengarahkan ke controller di backend
                          download
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            label="Download"
                            style={{
                              backgroundColor: "#008080", // Background teal
                              color: "white", // Warna teks
                              borderRadius: "8px", // Radius border
                              border: "none", // Tanpa border
                              padding: "10px 20px", // Padding
                              fontWeight: "bold", // Tebal teks
                              transition: "background-color 0.3s", // Efek transisi
                              cursor: "pointer", // Cursor pointer
                            }}
                          >
                            Download
                          </Button>
                        </a>
                      );
                    }}
                  ></Column>
                </DataTable>
              )}
            </Dialog>
          </div>
        </Col>
        <Col
          className="mt-1"
          md="4"
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
            onClick={showDialogAPB}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition2)}
            onMouseLeave={() => handleMouseLeave(setIconPosition2)}
            style={{
              overflow: "visible",
              borderRadius: "12px",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "30vw",
              minHeight: "120px",
              height: "120px",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <div
              className="button-icon"
              style={{
                overflow: "visible",
                transform: `translate(${iconPosition2.x}px, ${iconPosition2.y}px) translateY(-15px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/payroll.png")}
                alt=""
                style={{
                  transform: "translateY(-8px)",
                  width: "80%",
                  maxWidth: "30vh",
                  height: "auto",
                  borderRadius: "inherit",
                }}
              />
            </div>
            <div>
              <span
                style={{
                  display: "block",
                  textAlign: "center",
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "#fff", // Warna teks agar lebih kontras
                }}
              >
                APB DESA
              </span>
            </div>
          </Button>
          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">APB Desa</h2>
                    <p className="dialog-subtitle">
                      Informasi mengenai apb desa
                    </p>
                  </div>
                </div>
              }
              visible={dialogVisibleAPB}
              style={{ width: "55vw", maxWidth: "none" }}
              maximizable
              modal
              className="custom-dialog bounce-in"
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
                height: "auto",
              }}
              onHide={hideDialogAPB}
            >
              <div className="dialog-divider"></div>
              {loadingApbd ? (
                <div className="loading-container">
                  <span className="loader"></span>
                </div>
              ) : allapbdError ? (
                <div className="error-container">
                  <p className="error-message">
                    Error loading data: {allapbdError.message}
                  </p>
                </div>
              ) : apbdpList.length === 0 ? (
                <div className="no-data-container">
                  <p>No data available.</p>
                </div>
              ) : (
                <>
                  <DataTable
                    value={apbdpList}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    style={{ marginBottom: "1rem" }}
                    className="dialog-text"
                  >
                    <Column
                      field="name"
                      header="Name"
                      body={(rowData) => `${rowData.name} (${rowData.year})`}
                      style={{ width: "40%", minWidth: "30%" }}
                    ></Column>
                    <Column
                      header="Detail"
                      body={(rowData) => (
                        <Button
                          label="Lihat Detail"
                          onClick={() => openDetailDialog(rowData)}
                          className="p-button-rounded p-button-info"
                          style={{
                            backgroundColor: "#008080",
                            color: "white",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          Detail
                        </Button>
                      )}
                      style={{ width: "20%", minWidth: "15%" }}
                    />
                    <Column
                      field="download"
                      header="Download"
                      body={(rowData) => (
                        <Button
                          label="Download"
                          style={{
                            backgroundColor: "#008080",
                            color: "white",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                          icon="pi pi-download"
                          onClick={() =>
                            console.log("Download data for:", rowData.name)
                          }
                        >
                          Download
                        </Button>
                      )}
                      style={{ width: "20%", minWidth: "15%" }}
                    />
                  </DataTable>

                  <Dialog
                    header={
                      <div className="dialog-header">
                        <div>
                          <p className="dialog-title">Detail Keuangan</p>
                        </div>
                      </div>
                    }
                    visible={isDetailDialogVisible}
                    onHide={closeDetailDialog}
                    style={{
                      width: "90vw",
                      height: "90vh",
                      margin: "0",
                      padding: "0",
                    }}
                    modal
                    dismissableMask
                    maximizable
                    className="custom-dialog bounce-in"
                    contentStyle={{
                      overflowY: "auto",
                      padding: "24px 24px 10px 24px",
                      height: "auto",
                    }}
                  >
                    <div style={{ height: "calc(100% - 50px)" }}>
                      <div
                        className="dialog-header dialog-text"
                        style={{ padding: "1rem" }}
                      ></div>
                      {selectedKeuangan && (
                        <div
                          className="detail-content dialog-text"
                          style={{
                            height: "calc(100% - 80px)",
                            width: "100%",
                            padding: "0",
                            margin: "0",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            className="table-responsive dialog-text"
                            style={{
                              overflow: "auto",
                              height: "100%",
                              width: "100%",
                              border: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              padding: "1rem",
                            }}
                          >
                            <table
                              style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                backgroundColor: "#ffffff",
                              }}
                            >
                              <thead>
                                <tr
                                  style={{
                                    background:
                                      "linear-gradient(90deg, #3366cc, #5588ff)",
                                    color: "#ffffff",
                                  }}
                                >
                                  <th
                                    style={{
                                      padding: "0.8rem",
                                      border: "1px solid #dddddd",
                                      textAlign: "center",
                                    }}
                                  >
                                    No
                                  </th>
                                  <th
                                    style={{
                                      padding: "0.8rem",
                                      border: "1px solid #dddddd",
                                      textAlign: "center",
                                    }}
                                  >
                                    Kategori
                                  </th>
                                  <th
                                    style={{
                                      padding: "0.8rem",
                                      border: "1px solid #dddddd",
                                      textAlign: "center",
                                    }}
                                  >
                                    Subkategori
                                  </th>
                                  <th
                                    style={{
                                      padding: "0.8rem",
                                      border: "1px solid #dddddd",
                                      textAlign: "center",
                                    }}
                                  >
                                    Total Budget
                                  </th>
                                  <th
                                    style={{
                                      padding: "0.8rem",
                                      border: "1px solid #dddddd",
                                      textAlign: "center",
                                    }}
                                  >
                                    Total Realization
                                  </th>
                                  <th
                                    style={{
                                      padding: "0.8rem",
                                      border: "1px solid #dddddd",
                                      textAlign: "center",
                                    }}
                                  >
                                    Remaining
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedKeuangan?.length > 0 ? (
                                  selectedKeuangan.map(
                                    (keuangan, keuanganIndex) => (
                                      <React.Fragment
                                        key={keuangan.uuid || keuanganIndex}
                                      >
                                        {/* Header for Keuangan */}
                                        <tr>
                                          <td
                                            colSpan="6"
                                            style={{
                                              padding: "1rem",
                                              backgroundColor: "#f0f0f0",
                                            }}
                                          >
                                            <strong>{keuangan.name}</strong>{" "}
                                            <br />
                                            <span
                                              style={{
                                                fontSize: "0.9rem",
                                                color: "#666",
                                              }}
                                            ></span>
                                          </td>
                                        </tr>

                                        {/* Kategori Iteration */}
                                        {keuangan.kategori?.length > 0 ? (
                                          keuangan.kategori.map(
                                            (kategori, kategoriIndex) => (
                                              <React.Fragment
                                                key={
                                                  kategori.uuid || kategoriIndex
                                                }
                                              >
                                                <tr>
                                                  <td
                                                    colSpan="6"
                                                    style={{
                                                      backgroundColor:
                                                        "#e8f4fc",
                                                      padding: "0.8rem",
                                                    }}
                                                  >
                                                    <strong>
                                                      {kategori.number}.
                                                    </strong>{" "}
                                                    <strong>
                                                      {kategori.name}
                                                    </strong>
                                                  </td>
                                                </tr>

                                                {/* Subkategori Iteration */}
                                                {kategori.subkategori?.length >
                                                0 ? (
                                                  kategori.subkategori.map(
                                                    (sub, subIndex) => {
                                                      const formattedBudget =
                                                        new Intl.NumberFormat(
                                                          "id-ID",
                                                          {
                                                            style: "currency",
                                                            currency: "IDR",
                                                          }
                                                        ).format(
                                                          Number(
                                                            sub.totalBudget
                                                          ) || 0
                                                        );

                                                      const formattedRealization =
                                                        new Intl.NumberFormat(
                                                          "id-ID",
                                                          {
                                                            style: "currency",
                                                            currency: "IDR",
                                                          }
                                                        ).format(
                                                          Number(
                                                            sub.totalRealization
                                                          ) || 0
                                                        );

                                                      const formattedRemaining =
                                                        new Intl.NumberFormat(
                                                          "id-ID",
                                                          {
                                                            style: "currency",
                                                            currency: "IDR",
                                                          }
                                                        ).format(
                                                          Number(
                                                            sub.remaining
                                                          ) || 0
                                                        );

                                                      return (
                                                        <tr
                                                          key={
                                                            sub.uuid || subIndex
                                                          }
                                                        >
                                                          <td
                                                            style={{
                                                              padding: "0.8rem",
                                                            }}
                                                          ></td>
                                                          <td
                                                            colSpan="2"
                                                            style={{
                                                              padding: "0.8rem",
                                                              backgroundColor:
                                                                "#f8f8f8",
                                                            }}
                                                          >
                                                            {sub.name}
                                                          </td>
                                                          <td
                                                            style={{
                                                              textAlign:
                                                                "right",
                                                              padding: "0.8rem",
                                                            }}
                                                          >
                                                            {formattedBudget}
                                                          </td>
                                                          <td
                                                            style={{
                                                              textAlign:
                                                                "right",
                                                              padding: "0.8rem",
                                                            }}
                                                          >
                                                            {
                                                              formattedRealization
                                                            }
                                                          </td>
                                                          <td
                                                            style={{
                                                              textAlign:
                                                                "right",
                                                              padding: "0.8rem",
                                                            }}
                                                          >
                                                            {formattedRemaining}
                                                          </td>
                                                        </tr>
                                                      );
                                                    }
                                                  )
                                                ) : (
                                                  <tr>
                                                    <td
                                                      colSpan="6"
                                                      style={{
                                                        padding: "1rem",
                                                        textAlign: "center",
                                                      }}
                                                    >
                                                      Tidak ada subkategori
                                                    </td>
                                                  </tr>
                                                )}
                                              </React.Fragment>
                                            )
                                          )
                                        ) : (
                                          <tr>
                                            <td
                                              colSpan="6"
                                              style={{
                                                padding: "1rem",
                                                textAlign: "center",
                                              }}
                                            >
                                              Tidak ada kategori
                                            </td>
                                          </tr>
                                        )}
                                      </React.Fragment>
                                    )
                                  )
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="6"
                                      style={{
                                        padding: "1rem",
                                        textAlign: "center",
                                      }}
                                    >
                                      Tidak ada data keuangan.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </Dialog>
                </>
              )}
            </Dialog>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <p className="dialog-title">⚠️ Peringatan</p>
                  </div>
                </div>
              }
              visible={visibleapbd}
              onHide={() => setVisibleapbd(false)}
              modal
              style={{ width: "30vw", textAlign: "center" }}
            >
              <p
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "1.2rem",
                  color: "#ff4d4f",
                  fontWeight: "bold",
                }}
              >
                Data keuangan kosong!
              </p>
            </Dialog>
          </div>
        </Col>
        {/* <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogD}
          >
            Download (menu informasi)
          </Button>
          <div>
            <Dialog
              header="Download"
              apbd={dialogVisibleD}
              styleapbd={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={hideDialogD}
              footer={dialogFooterTemplate}
            >
              <DataTable
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableSapbdtyle={{
                  width: "100%",
                  minWidth: "70rem",
                  maxWidth: "85rem",
                }}
                breakpoints={{
                  "960px": {
                    columns: [
                      { field: "name", header: "Name" },
                      { field: "deskripsi", header: "Deskripsi" },
                      // Add other columns you want to display for smaller screens
                    ],
                  },
                  "640px": {
                    columns: [
                      { field: "name", header: "Name" }, // You can hide columns based on screen size
                    ],
                  },
                }}
              >
                <Column field="name" header="Name"></Column>
                <Column field="description" header="description"></Column>
                <Column field="date" header="date"></Column>
                <Column
                  field="download"
                  header="download"
                  style={{ width: "5%" }}
                >
                  <Button label="Primary" text raised />
                </Column>
              </DataTable>
            </Dialog>
          </div>
        </Col> */}
      </Row>
    </>
  );
};

export default Modalt;
