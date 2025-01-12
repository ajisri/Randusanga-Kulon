import React, { useState, useEffect } from "react";
import useSWR from "swr"; // Import SWR
// import axios from "axios";
import { Chart } from "primereact/chart";
import { Button, Row, Col } from "reactstrap";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Geografix from "../../components/Administator/Profil/Geografix";
import "primeicons/primeicons.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Modals = () => {
  const [dialogVisiblevm, setDialogVisiblevm] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedLembaga, setSelectedLembaga] = useState(null);
  const [detailDialogVisible, setDetailDialogVisible] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [dialogVisiblettg, setDialogVisiblettg] = useState(false);
  const [dialogVisiblesd, setDialogVisiblesd] = useState(false);
  const [dialogVisibleso, setDialogVisibleso] = useState(false);
  const [dialogVisiblele, setDialogVisiblele] = useState(false);
  const [dialogVisiblege, setDialogVisiblege] = useState(false);

  // const [customers, setCustomers] = useState([]);
  // const [chartData, setChartData] = useState({});
  // const [chartOptions, setChartOptions] = useState({});

  const { data: tentangData, error: tentangError } = useSWR(
    "http://localhost:8080/tentangpengunjung",
    fetcher
  );
  const loadingTentang = !tentangData && !tentangError;

  const { data: sejarahData, error: sejarahError } = useSWR(
    "http://localhost:8080/sejarahpengunjung",
    fetcher
  );
  const loadingSejarah = !sejarahData && !sejarahError;

  const { data: visionData, error: visionError } = useSWR(
    "http://localhost:8080/visimisipengunjung",
    fetcher
  );
  const loadingVision = !visionData && !visionError;

  const { data: strukturorganisasiData, error: strukturorganisasiError } =
    useSWR("http://localhost:8080/strukturorganisasipengunjung", fetcher);

  const loadingStrukturorganisasi =
    !strukturorganisasiData && !strukturorganisasiError;

  // Construct full URL for the image
  const baseURL = "http://localhost:8080";
  const imageURL = strukturorganisasiData?.profile.file_url
    ? `${baseURL}${strukturorganisasiData.profile.file_url}`
    : null;

  const { data: demografiData, error: demografiError } = useSWR(
    "http://localhost:8080/demografipengunjung",
    fetcher
  );

  //lembaga
  const { data: lembagaData, error: lembagaError } = useSWR(
    "http://localhost:8080/lembagapengunjung",
    fetcher
  );
  const loadingLembaga = !lembagaData && !lembagaError;

  const lembagaList = lembagaData?.lembagap || [];
  const baseLURL = "http://localhost:8080/";

  const renderAnggota = (anggotaList) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {anggotaList.map((member, index) => (
        <div
          key={index}
          style={{
            flex: "1 0 45%",
            padding: "5px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          <p>
            <strong>{member.jabatan}</strong>
          </p>
          <p>{member.demografi?.name}</p>
          <p>NIK: {member.demografi?.nik}</p>
          <p>
            Pendidikan: {member.demografi?.education?.level || "Tidak ada data"}
          </p>
        </div>
      ))}
    </div>
  );

  const openDetailDialog = (lembaga) => {
    setSelectedLembaga(lembaga); // Set lembaga yang dipilih untuk ditampilkan di dialog detail
    setDetailDialogVisible(true);
  };

  const handleRowToggle = (event) => {
    setExpandedRows(event.data); // Menyimpan status baris yang diperluas
  };

  const [genderChartData, setGenderChartData] = useState(null);
  const [educationChartData, setEducationChartData] = useState(null);
  const [jobChartData, setJobChartData] = useState(null);
  const [religionChartData, setReligionChartData] = useState(null);
  const [maritalStatusChartData, setMaritalStatusChartData] = useState(null);

  const [chartOptions, setChartOptions] = useState({});

  // Fungsi untuk menghasilkan warna berdasarkan jumlah data
  function generateColors(count) {
    // Array warna standar
    const baseColors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#C9CBCF",
      "#FF8C00",
      "#2E8B57",
      "#4682B4",
      "#8A2BE2",
      "#FFD700",
    ];

    // Jika jumlah data lebih banyak dari jumlah warna yang tersedia, ulangi warna
    return Array.from(
      { length: count },
      (_, i) => baseColors[i % baseColors.length]
    );
  }

  useEffect(() => {
    if (demografiData) {
      // Safely handle gender data
      const genderLabels =
        demografiData.genderCounts?.map((item) => item?.gender) || [];
      const genderCounts =
        demografiData.genderCounts?.map((item) => item?._count?.id || 0) || [];

      // Safely handle education data
      const educationLabels =
        demografiData.educationCounts?.map((item) => item?.education?.level) ||
        [];
      const educationCounts =
        demografiData.educationCounts?.map((item) => item?.count || 0) || [];

      console.log("Education Labels: ", educationLabels);
      console.log("Education Counts: ", educationCounts);

      // Safely handle job data
      // const jobLabels = demografiData.jobCounts?.map((item) => item?.job) || [];
      const jobCounts =
        demografiData.jobCounts?.map((item) => item?._count?.id || 0) || [];

      // Generate the topJobs array based on jobCounts
      const topJobs = demografiData.jobCounts?.slice(0, 5) || []; // Misalnya, ambil 5 pekerjaan teratas
      const otherJobCount = jobCounts.slice(5).reduce((a, b) => a + b, 0); // Hitung jumlah pekerjaan lainnya

      // Create jobChartData
      const jobChartData = {
        labels: [...topJobs.map((job) => job.job), "Others"],
        datasets: [
          {
            data: [...topJobs.map((job) => job._count.id), otherJobCount],
            backgroundColor: generateColors(topJobs.length + 1), // Menghasilkan warna sesuai jumlah label
          },
        ],
      };

      // Safely handle religion data
      const religionLabels =
        demografiData.religionCounts?.map((item) => item?.religion?.name) || [];
      const religionCounts =
        demografiData.religionCounts?.map((item) => item?._count?.id || 0) ||
        [];

      // Safely handle marital status data
      const maritalStatusLabels =
        demografiData.maritalStatusCounts?.map(
          (item) => item?.marital_status
        ) || [];
      const maritalStatusCounts =
        demografiData.maritalStatusCounts?.map(
          (item) => item?._count?.id || 0
        ) || [];

      // Set chart data
      setGenderChartData({
        labels: genderLabels,
        datasets: [
          {
            data: genderCounts,
            backgroundColor: ["#42A5F5", "#66BB6A"],
            hoverBackgroundColor: ["#64B5F6", "#81C784"],
          },
        ],
      });

      setEducationChartData({
        labels: educationLabels,
        datasets: [
          {
            data: educationCounts,
            backgroundColor: ["#FFA726", "#FB8C00", "#F57C00"],
            hoverBackgroundColor: ["#FFB74D", "#FF9800", "#F57C00"],
          },
        ],
      });

      setJobChartData(jobChartData);

      // setJobChartData({
      //   labels: jobLabels,
      //   datasets: [
      //     {
      //       data: jobCounts,
      //       backgroundColor: ["#26A69A", "#66BB6A", "#FF7043"],
      //       hoverBackgroundColor: ["#4DB6AC", "#81C784", "#FF8A65"],
      //     },
      //   ],
      // });

      setReligionChartData({
        labels: religionLabels,
        datasets: [
          {
            data: religionCounts,
            backgroundColor: ["#AB47BC", "#5C6BC0", "#42A5F5"],
            hoverBackgroundColor: ["#BA68C8", "#7986CB", "#64B5F6"],
          },
        ],
      });

      setMaritalStatusChartData({
        labels: maritalStatusLabels,
        datasets: [
          {
            data: maritalStatusCounts,
            backgroundColor: ["#EF5350", "#FF7043", "#66BB6A"],
            hoverBackgroundColor: ["#E57373", "#FF8A65", "#81C784"],
          },
        ],
      });

      // Update chart options
      setChartOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "right", // Move labels to the right
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const dataValue = tooltipItem.raw;
                return `${tooltipItem.label}: ${dataValue}`;
              },
            },
          },
        },
      });
    }
  }, [demografiData]);

  const dialogFooterTemplate = (hideDialog) => (
    <Button label="Ok" icon="pi pi-check" onClick={hideDialog} />
  );

  const [animationTriggered, setAnimationTriggered] = useState(false);

  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
  const [iconPosition1, setIconPosition1] = useState({ x: 0, y: 0 });
  const [iconPosition2, setIconPosition2] = useState({ x: 0, y: 0 });
  const [iconPosition3, setIconPosition3] = useState({ x: 0, y: 0 });
  const [iconPosition4, setIconPosition4] = useState({ x: 0, y: 0 });
  const [iconPosition5, setIconPosition5] = useState({ x: 0, y: 0 });
  const [iconPosition6, setIconPosition6] = useState({ x: 0, y: 0 });

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
  };

  const handleMouseLeave = (setIconPosition) => {
    setIconPosition({ x: 0, y: 0 }); // Kembalikan posisi ikon ke tengah
  };

  // Memastikan animasi hanya terjadi sekali
  useEffect(() => {
    setAnimationTriggered(true);
  }, []);

  if (demografiError) return <div>Error loading data</div>;
  if (!demografiData) return <div>Loading...</div>;

  return (
    <>
      <style>
        {`
          .button-container {
            display: flex;
            justify-content: space-around;
          }

          .button {
            position: relative;
            padding: 10px;
            background-color: #ffffff;
            border: 2px solid #ddd;
            cursor: pointer;
            width: 90px !important;
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
            transition: transform 0.3s ease, color 0.3s ease;
            z-index: 1;
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
        `}
      </style>
      <h2 className="mt-sm mb-2">
        <span></span>
      </h2>
      <Row>
        <Col
          className="mt-1"
          md="3"
          xs="6"
          style={{ fontFamily: "Nautical, sans-serif" }}
        >
          <Button
            block
            className={`btn-white btn-icon mb-3 mb-sm-0 video-button ${
              animationTriggered ? "video-button" : "no-animation"
            }`}
            color="default"
            type="button"
            icon="pi pi-info-circle"
            onClick={() => setDialogVisiblettg(true)}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition)}
            onMouseLeave={() => handleMouseLeave(setIconPosition)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition.x}px, ${iconPosition.y}px)`,
              }}
            >
              📖
            </div>
            <div className="marquee">
              <span style={{ display: "inline-block" }}>Tentang</span>
            </div>
          </Button>
          <div className="card">
            <Dialog
              header="Tentang"
              visible={dialogVisiblettg}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={() => setDialogVisiblettg(false)}
              footer={dialogFooterTemplate(() => setDialogVisiblettg(false))}
            >
              <div className="modal-body col-lg">
                {loadingTentang ? (
                  <p>Loading...</p>
                ) : tentangError ? (
                  <p>{tentangError}</p>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: tentangData?.profile?.content,
                    }}
                  />
                )}
              </div>
            </Dialog>
          </div>
        </Col>

        <Col
          className="mt-1"
          md="3"
          xs="6"
          style={{ fontFamily: "Nautical, sans-serif" }}
        >
          <Button
            block
            className={`btn-white btn-icon mb-3 mb-sm-0 video-button ${
              animationTriggered ? "video-button" : "no-animation"
            }`}
            color="default"
            type="button"
            icon="pi pi-info-circle"
            onClick={() => setDialogVisiblettg(true)}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition1)}
            onMouseLeave={() => handleMouseLeave(setIconPosition1)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition1.x}px, ${iconPosition1.y}px)`,
              }}
            >
              ⏳
            </div>
            Sejarah
          </Button>
          <div className="card">
            <Dialog
              header="Sejarah"
              visible={dialogVisiblesd}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={() => setDialogVisiblesd(false)}
              footer={dialogFooterTemplate(() => setDialogVisiblesd(false))}
            >
              <div className="modal-body col-lg">
                {loadingSejarah ? (
                  <p>Loading...</p>
                ) : sejarahError ? (
                  <p>{sejarahError}</p>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sejarahData?.profile?.content,
                    }}
                  />
                )}
              </div>
            </Dialog>
          </div>
        </Col>

        <Col
          className="mt-1"
          md="3"
          xs="6"
          style={{ fontFamily: "Nautical, sans-serif" }}
        >
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0"
            color="default"
            type="button"
            icon="pi pi-eye"
            onClick={() => setDialogVisiblevm(true)}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition2)}
            onMouseLeave={() => handleMouseLeave(setIconPosition2)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition2.x}px, ${iconPosition2.y}px)`,
              }}
            >
              🧭
            </div>
            Visi dan Misi
          </Button>
          <div className="card">
            <Dialog
              header="Visi dan Misi"
              visible={dialogVisiblevm}
              style={{ width: "75vw" }}
              maximizable
              modal
              onHide={() => setDialogVisiblevm(false)}
              footer={dialogFooterTemplate(() => setDialogVisiblevm(false))}
            >
              <div className="modal-body col-lg">
                {loadingVision ? (
                  <p>Loading...</p>
                ) : visionError ? (
                  <p>{visionError}</p>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: visionData?.profile?.content,
                    }}
                  />
                )}
              </div>
            </Dialog>
          </div>
        </Col>

        <Col
          className="mt-1"
          md="3"
          xs="6"
          style={{ fontFamily: "Nautical, sans-serif" }}
        >
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={() => setDialogVisibleso(true)}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition3)}
            onMouseLeave={() => handleMouseLeave(setIconPosition3)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition3.x}px, ${iconPosition3.y}px)`,
              }}
            >
              🔗
            </div>
            Struktur Organisasi
          </Button>
          <div className="card">
            <Dialog
              header="Struktur Organisasi"
              visible={dialogVisibleso}
              style={{ width: "75vw", borderRadius: "16px" }}
              maximizable
              modal
              contentStyle={{ height: "calc(100% - 60px)" }}
              onHide={() => setDialogVisibleso(false)}
              footer={dialogFooterTemplate(() => setDialogVisibleso(false))}
            >
              <div className="modal-body col-lg">
                {loadingStrukturorganisasi ? (
                  <p>Loading...</p>
                ) : strukturorganisasiError ? (
                  <p>
                    {strukturorganisasiError.message || "Failed to load data"}
                  </p>
                ) : (
                  <div>
                    {imageURL ? (
                      <div>
                        <img
                          src={imageURL}
                          alt="Organizational Structure"
                          style={{
                            width: "100%",
                            height: "auto",
                            borderRadius: "20px",
                            maxHeight: "calc(89vh - 60px)",
                          }} // Adjust image size
                        />
                      </div>
                    ) : (
                      <p>No image available</p>
                    )}
                    {strukturorganisasiData?.profile?.content && (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: strukturorganisasiData.profile.content,
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
          style={{ fontFamily: "Nautical, sans-serif" }}
        >
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={() => setDialogVisiblele(true)}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition4)}
            onMouseLeave={() => handleMouseLeave(setIconPosition4)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition4.x}px, ${iconPosition4.y}px)`,
              }}
            >
              🏛️
            </div>
            Lembaga
          </Button>
          <div className="card">
            <Dialog
              header="Lembaga"
              visible={dialogVisiblele}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={() => setDialogVisiblele(false)}
              // footer={dialogFooterTemplate(() => setDialogVisiblele(false))}
            >
              <div className="modal-body col-lg">
                {loadingLembaga ? (
                  <p>Loading...</p>
                ) : lembagaError ? (
                  <p>Error loading data: {lembagaError.message}</p>
                ) : lembagaList.length === 0 ? (
                  <p>No data available.</p>
                ) : (
                  <DataTable
                    value={lembagaList}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    tableStyle={{ minWidth: "50rem" }}
                    expandedRows={expandedRows} // Status baris yang diperluas
                    onRowToggle={handleRowToggle} // Menangani perubahan status baris
                  >
                    <Column
                      field="file_url"
                      header="Lambang"
                      body={(rowData) => {
                        const imageLUrl = rowData.file_url
                          ? `${baseLURL}${rowData.file_url}`
                          : "https://via.placeholder.com/150";
                        console.log("Image URL:", imageLUrl);
                        return (
                          <img
                            src={imageLUrl}
                            alt={`Visual representation of ${rowData.nama}`} // Descriptive alt text without redundancy
                            style={{ width: "100px", height: "auto" }}
                          />
                        );
                      }}
                    />
                    <Column field="nama" header="Nama" />
                    <Column field="dasar_hukum" header="Dasar Hukum" />
                    <Column field="alamat_kantor" header="Alamat Kantor" />
                    <Column
                      header=""
                      body={(rowData) => (
                        <Button
                          label="Detail"
                          className="pi pi-search"
                          onClick={() => openDetailDialog(rowData)}
                        />
                      )}
                    />
                  </DataTable>
                )}
              </div>
            </Dialog>
            <style jsx>
              {`
                .custom-dialog-content table {
                  border: none;
                  border-color: transparent;
                }
                .custom-dialog-content table td,
                .custom-dialog-content table th {
                  border: none !important;
                  height: 20px; /* Pengaturan tinggi cell */
                  padding: 4px; /* Mengurangi padding agar cell lebih kecil */
                }
              `}
            </style>
            {selectedLembaga && (
              <Dialog
                header={`Detail Lembaga: ${selectedLembaga.nama}`}
                visible={detailDialogVisible}
                style={{ width: "70vw" }}
                maximizable
                modal
                onHide={() => setDetailDialogVisible(false)}
                footer={dialogFooterTemplate(() =>
                  setDetailDialogVisible(false)
                )}
                className="custom-dialog-content"
              >
                <div>
                  <h4>Profil Lembaga</h4>
                  {selectedLembaga.profil_lembaga?.map((profil, index) => (
                    <p
                      key={index}
                      dangerouslySetInnerHTML={{ __html: profil.content }}
                    ></p>
                  ))}

                  <h4>Tugas Pokok</h4>
                  {selectedLembaga.tugas_pokok?.map((tugas, index) => (
                    <p
                      key={index}
                      dangerouslySetInnerHTML={{ __html: tugas.content }}
                    ></p>
                  ))}

                  <h4>Visi Misi</h4>
                  {selectedLembaga.visi_misi?.map((visi, index) => (
                    <p
                      key={index}
                      dangerouslySetInnerHTML={{ __html: visi.content }}
                    ></p>
                  ))}

                  <h4>Anggota</h4>
                  {renderAnggota(selectedLembaga.Anggota)}
                </div>
              </Dialog>
            )}
          </div>
        </Col>

        <Col
          className="mt-1"
          md="3"
          xs="6"
          style={{ fontFamily: "Nautical, sans-serif" }}
        >
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={() => setDialogVisiblege(true)}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition5)}
            onMouseLeave={() => handleMouseLeave(setIconPosition5)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition5.x}px, ${iconPosition5.y}px)`,
              }}
            >
              🌍
            </div>
            Geografi
          </Button>
          <div className="card">
            <Dialog
              header="Geografi"
              visible={dialogVisiblege}
              style={{ width: "90vw" }}
              maximizable
              modal
              contentStyle={{ height: "500px" }}
              onHide={() => setDialogVisiblege(false)}
              footer={dialogFooterTemplate(() => setDialogVisiblege(false))}
            >
              <div className="modal-body col-lg">
                <Geografix />
              </div>
            </Dialog>
          </div>
        </Col>

        <Col
          className="mt-1"
          md="3"
          xs="6"
          style={{ fontFamily: "Nautical, sans-serif" }}
        >
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={() => setDialogVisible(true)}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition6)}
            onMouseLeave={() => handleMouseLeave(setIconPosition6)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition6.x}px, ${iconPosition6.y}px)`,
              }}
            >
              👨‍👩‍👧‍👦
            </div>
            Demografi
          </Button>
          <div className="card">
            <Dialog
              header="Demografi"
              visible={dialogVisible}
              style={{ width: "80vw" }}
              maximizable
              modal
              contentStyle={{ height: "auto" }}
              onHide={() => setDialogVisible(false)}
            >
              <div
                className="modal-body"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "20px",
                }}
              >
                {/* Gender Chart */}
                <div style={{ gridColumn: "span 1" }}>
                  <h3 style={{ textAlign: "left", marginBottom: "10px" }}>
                    Gender Distribution
                  </h3>
                  {genderChartData && (
                    <Chart
                      type="pie"
                      data={genderChartData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: {
                            ...chartOptions.plugins.legend,
                            position: "bottom", // Legend positioned below
                          },
                        },
                      }}
                      style={{ width: "100%", height: "250px" }} // Smaller chart size
                    />
                  )}
                </div>

                {/* Education Chart */}
                <div style={{ gridColumn: "span 1" }}>
                  <h3 style={{ textAlign: "left", marginBottom: "10px" }}>
                    Education Distribution
                  </h3>
                  {educationChartData && (
                    <Chart
                      type="pie"
                      data={educationChartData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: {
                            ...chartOptions.plugins.legend,
                            position: "bottom", // Legend positioned below
                          },
                        },
                      }}
                      style={{ width: "100%", height: "250px" }} // Smaller chart size
                    />
                  )}
                </div>

                {/* Job Chart */}
                <div style={{ gridColumn: "span 1" }}>
                  <h3 style={{ textAlign: "left", marginBottom: "10px" }}>
                    Job Distribution
                  </h3>
                  {jobChartData && (
                    <Chart
                      type="doughnut" // Using doughnut instead of pie
                      data={jobChartData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: {
                            ...chartOptions.plugins.legend,
                            position: "bottom", // Legend positioned below
                          },
                        },
                      }}
                      style={{ width: "100%", height: "250px" }} // Smaller chart size
                    />
                  )}
                </div>

                {/* Religion Chart */}
                <div style={{ gridColumn: "span 1" }}>
                  <h3 style={{ textAlign: "left", marginBottom: "10px" }}>
                    Religion Distribution
                  </h3>
                  {religionChartData && (
                    <Chart
                      type="pie"
                      data={religionChartData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: {
                            ...chartOptions.plugins.legend,
                            position: "bottom", // Legend positioned below
                          },
                        },
                      }}
                      style={{ width: "100%", height: "250px" }} // Smaller chart size
                    />
                  )}
                </div>

                {/* Marital Status Chart */}
                <div style={{ gridColumn: "span 1" }}>
                  <h3 style={{ textAlign: "left", marginBottom: "10px" }}>
                    Marital Status Distribution
                  </h3>
                  {maritalStatusChartData && (
                    <Chart
                      type="pie"
                      data={maritalStatusChartData}
                      options={{
                        ...chartOptions,
                        plugins: {
                          ...chartOptions.plugins,
                          legend: {
                            ...chartOptions.plugins.legend,
                            position: "bottom", // Legend positioned below
                          },
                        },
                      }}
                      style={{ width: "100%", height: "250px" }} // Smaller chart size
                    />
                  )}
                </div>
              </div>
            </Dialog>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Modals;
