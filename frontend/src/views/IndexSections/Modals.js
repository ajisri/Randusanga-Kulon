import React, { useState, useEffect } from "react";
import useSWR from "swr"; // Import SWR
// import axios from "axios";
import { Chart } from "primereact/chart";
// import ChartDataLabels from "chartjs-plugin-datalabels";
import { Button, Row, Col } from "reactstrap";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import Geografix from "../../components/Administator/Profil/Geografix";
import "primeicons/primeicons.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Modals = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedLembaga, setSelectedLembaga] = useState(null);
  const [detailDialogVisible, setDetailDialogVisible] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [dialogVisiblettg, setDialogVisiblettg] = useState(false);
  const [dialogVisiblesd, setDialogVisiblesd] = useState(false);
  const [dialogVisiblevm, setDialogVisiblevm] = useState(false);
  const [dialogVisibleso, setDialogVisibleso] = useState(false);
  const [dialogVisiblele, setDialogVisiblele] = useState(false);
  const [dialogVisiblege, setDialogVisiblege] = useState(false);

  // const [customers, setCustomers] = useState([]);
  // const [chartData, setChartData] = useState({});
  // const [chartOptions, setChartOptions] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0); // State untuk mengatur slide yang aktif

  // Data untuk tabel
  const [genderTableData, setGenderTableData] = useState([]);
  const [educationTableData, setEducationTableData] = useState([]);
  const [jobTableData, setJobTableData] = useState([]);
  const [religionTableData, setReligionTableData] = useState([]);
  const [maritalStatusTableData, setMaritalStatusTableData] = useState([]);

  const baseURL = "https://randusangakulon.osc-fr1.scalingo.io";

  const { data: tentangData, error: tentangError } = useSWR(
    "https://randusangakulon.osc-fr1.scalingo.io/tentangpengunjung",
    fetcher
  );
  const loadingTentang = !tentangData && !tentangError;
  const imageURLT = tentangData?.profile.file_url
    ? `${baseURL}${tentangData.profile.file_url}`
    : null;

  const { data: sejarahData, error: sejarahError } = useSWR(
    "https://randusangakulon.osc-fr1.scalingo.io/sejarahpengunjung",
    fetcher
  );
  const loadingSejarah = !sejarahData && !sejarahError;
  const imageURLSejarah = sejarahData?.profile.file_url
    ? `${baseURL}${sejarahData.profile.file_url}`
    : null;

  const { data: visionData, error: visionError } = useSWR(
    "https://randusangakulon.osc-fr1.scalingo.io/visimisipengunjung",
    fetcher
  );
  const loadingVision = !visionData && !visionError;
  const imageURLVisi = visionData?.profile.file_url
    ? `${baseURL}${visionData.profile.file_url}`
    : null;

  const { data: strukturorganisasiData, error: strukturorganisasiError } =
    useSWR(
      "https://randusangakulon.osc-fr1.scalingo.io/strukturorganisasipengunjung",
      fetcher
    );

  const loadingStrukturorganisasi =
    !strukturorganisasiData && !strukturorganisasiError;

  // Construct full URL for the image
  const imageURL = strukturorganisasiData?.profile.file_url
    ? `${baseURL}${strukturorganisasiData.profile.file_url}`
    : null;

  const { data: demografiData, error: demografiError } = useSWR(
    "https://randusangakulon.osc-fr1.scalingo.io/demografipengunjung",
    fetcher
  );

  //lembaga
  const { data: lembagaData, error: lembagaError } = useSWR(
    "https://randusangakulon.osc-fr1.scalingo.io/lembagapengunjung",
    fetcher
  );
  const loadingLembaga = !lembagaData && !lembagaError;

  const lembagaList = lembagaData?.lembagap || [];
  const baseLURL = "https://randusangakulon.osc-fr1.scalingo.io/";

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
      setGenderTableData(
        genderLabels.map((label, index) => ({
          label,
          value: genderCounts[index],
        }))
      );

      // Safely handle education data
      const educationLabels =
        demografiData.educationCounts?.map((item) => item?.education?.level) ||
        [];
      const educationCounts =
        demografiData.educationCounts?.map((item) => item?.count || 0) || [];
      setEducationTableData(
        educationLabels.map((label, index) => ({
          label,
          value: educationCounts[index],
        }))
      );

      console.log("Education Labels: ", educationLabels);
      console.log("Education Counts: ", educationCounts);

      // Safely handle job data
      // const jobLabels = demografiData.jobCounts?.map((item) => item?.job) || [];
      const jobCounts =
        demografiData.jobCounts?.map((item) => item?._count?.id || 0) || [];

      // Generate the topJobs array based on jobCounts
      const topJobs = demografiData.jobCounts?.slice(0, 5) || []; // Misalnya, ambil 5 pekerjaan teratas
      const otherJobCount = jobCounts.slice(5).reduce((a, b) => a + b, 0); // Hitung jumlah pekerjaan lainnya
      setJobTableData([
        ...topJobs.map((job) => ({ label: job.job, value: job._count.id })),
        { label: "Others", value: otherJobCount },
      ]);

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
      setReligionTableData(
        religionLabels.map((label, index) => ({
          label,
          value: religionCounts[index],
        }))
      );

      // Safely handle marital status data
      const maritalStatusLabels =
        demografiData.maritalStatusCounts?.map(
          (item) => item?.marital_status
        ) || [];
      const maritalStatusCounts =
        demografiData.maritalStatusCounts?.map(
          (item) => item?._count?.id || 0
        ) || [];
      setMaritalStatusTableData(
        maritalStatusLabels.map((label, index) => ({
          label,
          value: maritalStatusCounts[index],
        }))
      );

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
          // datalabels: {
          //   // Konfigurasi untuk menampilkan nilai
          //   color: "#000", // Warna teks
          //   anchor: "center", // Posisi teks
          //   align: "center", // Align teks
          //   formatter: (value) => value, // Menampilkan nilai
          // },
        },
      });
    }
  }, [demografiData]);

  // Fungsi untuk menggeser slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < 4 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Efek untuk mengubah posisi legenda berdasarkan ukuran layar
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    setChartOptions({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: isMobile ? "bottom" : "right", // Legenda di bawah untuk mobile, di kanan untuk desktop
        },
        datalabels: {
          color: "#000",
          anchor: "center",
          align: "center",
          formatter: (value) => value,
        },
      },
    });
  }, []);

  // Data untuk slide
  const slides = [
    {
      title: "Gender Distribution",
      chartData: genderChartData,
      tableData: genderTableData,
    },
    {
      title: "Education Distribution",
      chartData: educationChartData,
      tableData: educationTableData,
    },
    {
      title: "Job Distribution",
      chartData: jobChartData,
      tableData: jobTableData,
    },
    {
      title: "Religion Distribution",
      chartData: religionChartData,
      tableData: religionTableData,
    },
    {
      title: "Marital Status Distribution",
      chartData: maritalStatusChartData,
      tableData: maritalStatusTableData,
    },
  ];

  const [animationTriggered, setAnimationTriggered] = useState(false);

  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
  const [iconPosition1, setIconPosition1] = useState({ x: 0, y: 0 });
  const [iconPosition3, setIconPosition3] = useState({ x: 0, y: 0 });
  const [iconPosition4, setIconPosition4] = useState({ x: 0, y: 0 });
  const [iconPosition5, setIconPosition5] = useState({ x: 0, y: 0 });
  const [iconPosition6, setIconPosition6] = useState({ x: 0, y: 0 });
  const [iconPosition7, setIconPosition7] = useState({ x: 0, y: 0 });

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
    }, 50); // Hapus ripple setelah animasi selesai
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
            width: 40%;
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
            .custom-button {
              max-width: 80vw; /* Hampir seluruh layar pada ponsel */
              height: clamp(60px, 8vh, 80px);
            }
            .button-icon {
              min-height: 55px;
            }
            .button-icon img {
              max-width: clamp(40px, 10vw, 60px) !important; /* Perbesar ukuran ikon */
              height: auto; /* Pastikan proporsi tetap */
            }
            .icon-button-text {
              font-size: clamp(7px, 1.8vw, 9px);
            }

            .dialog-text.modal-body {
              display: flex;
              overflow-x: auto;
              gap: 20px;
            }

          .chart-container {
            flex: 0 0 auto;
            width: 100%;
            gap: "20px",
            scroll-snap-align: start;
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
      <Row>
        <Col
          className="mt-1"
          md="4"
          xs="4"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          <Button
            block
            className="custom-button mb-3 mb-sm-0"
            type="button"
            icon="pi pi-info-circle"
            onClick={(e) => {
              setDialogVisiblettg(true);
            }}
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
                src={require("assets/img/theme/about-us.png")}
                alt=""
              />
            </div>
            <div>
              <span className="icon-button-text">TENTANG</span>
            </div>
          </Button>
          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">Tentang</h2>
                    <p className="dialog-subtitle">Informasi mengenai desa</p>
                  </div>
                </div>
              }
              visible={dialogVisiblettg}
              style={{ width: "55vw" }}
              maximizable
              modal
              className="custom-dialog bounce-in"
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
              }}
              onHide={() => setDialogVisiblettg(false)}
            >
              <div>
                {imageURLT ? (
                  <div style={{ marginBottom: "20px" }}>
                    <img
                      src={imageURLT}
                      alt="About"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "20px",
                        maxHeight: "calc(89vh - 60px)",
                      }}
                    />
                  </div>
                ) : (
                  <p>No image available</p>
                )}

                <div className="dialog-divider"></div>
                {loadingTentang ? (
                  <div className="loading-container">
                    <span className="loader"></span>
                  </div>
                ) : tentangError ? (
                  <p className="error-message">{tentangError}</p>
                ) : (
                  <div
                    className="dialog-text"
                    dangerouslySetInnerHTML={{
                      __html:
                        tentangData?.profile?.content ||
                        "<p>No content available</p>",
                    }}
                  />
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
            icon="pi pi-info-circle"
            onClick={() => setDialogVisiblesd(true)}
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
                src={require("assets/img/theme/book.png")}
                alt=""
              />
            </div>
            <div>
              <span className="icon-button-text">SEJARAH</span>
            </div>
          </Button>
          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">Sejarah</h2>
                    <p className="dialog-subtitle">
                      Informasi mengenai sejarah desa
                    </p>
                  </div>
                </div>
              }
              visible={dialogVisiblesd}
              style={{ width: "55vw" }}
              maximizable
              modal
              className="custom-dialog bounce-in"
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
              }}
              onHide={() => setDialogVisiblesd(false)}
            >
              <div>
                {imageURLSejarah ? (
                  <div style={{ marginBottom: "20px" }}>
                    <img
                      src={imageURLSejarah}
                      alt="About"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "20px",
                        maxHeight: "calc(89vh - 60px)",
                      }}
                    />
                  </div>
                ) : (
                  <p>No image available</p>
                )}

                <div className="dialog-divider"></div>
                {loadingSejarah ? (
                  <div className="loading-container">
                    <span className="loader"></span>
                  </div>
                ) : sejarahError ? (
                  <p className="error-message">{sejarahError}</p>
                ) : (
                  <div
                    className="dialog-text"
                    dangerouslySetInnerHTML={{
                      __html:
                        sejarahData?.profile?.content ||
                        "<p>No content available</p>",
                    }}
                  />
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
            className="mb-3 mb-sm-0 custom-button video-button"
            color="default"
            type="button"
            icon="pi pi-info-circle"
            onClick={() => setDialogVisiblevm(true)}
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
                src={require("assets/img/theme/target.png")}
                alt=""
              />
            </div>
            <div>
              <span className="icon-button-text">VISI MISI</span>
            </div>
          </Button>
          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">Visi dan Misi</h2>
                    <p className="dialog-subtitle">
                      Informasi mengenai visi dan misi desa
                    </p>
                  </div>
                </div>
              }
              visible={dialogVisiblevm}
              style={{ width: "55vw" }}
              className="custom-dialog bounce-in"
              maximizable
              modal
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
              }}
              onHide={() => setDialogVisiblevm(false)}
            >
              <div>
                {imageURLVisi ? (
                  <div style={{ marginBottom: "20px" }}>
                    <img
                      src={imageURLVisi}
                      alt="About"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "20px",
                        maxHeight: "calc(89vh - 60px)",
                      }}
                    />
                  </div>
                ) : (
                  <p>No image available</p>
                )}

                <div className="dialog-divider"></div>
                {loadingVision ? (
                  <div className="loading-container">
                    <span className="loader"></span>
                  </div>
                ) : visionError ? (
                  <p className="error-message">{visionError}</p>
                ) : (
                  <div
                    className="dialog-text"
                    dangerouslySetInnerHTML={{
                      __html:
                        visionData?.profile?.content ||
                        "<p>No content available</p>",
                    }}
                  />
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
            className={`custom-button mb-3 mb-sm-0 video-button ${
              animationTriggered ? "video-button" : "no-animation"
            }`}
            color="default"
            type="button"
            icon="pi pi-info-circle"
            onClick={() => setDialogVisibleso(true)}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition4)}
            onMouseLeave={() => handleMouseLeave(setIconPosition4)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition4.x}px, ${iconPosition4.y}px) translateY(-15px)`,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/management.png")}
                alt=""
              />
            </div>
            <div>
              <span className="icon-button-text">Struktur Organisasi</span>
            </div>
          </Button>

          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">Struktur Organisasi</h2>
                    <p className="dialog-subtitle">
                      Informasi mengenai struktur organisasi desa
                    </p>
                  </div>
                </div>
              }
              visible={dialogVisibleso}
              style={{ width: "55vw" }}
              className="custom-dialog bounce-in"
              maximizable
              modal
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
              }}
              onHide={() => setDialogVisibleso(false)}
            >
              <div>
                {imageURL ? (
                  <div style={{ marginBottom: "20px" }}>
                    <img
                      src={imageURL}
                      alt="About"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "20px",
                        maxHeight: "calc(89vh - 60px)",
                      }}
                    />
                  </div>
                ) : (
                  <p>No image available</p>
                )}

                <div className="dialog-divider"></div>
                {loadingStrukturorganisasi ? (
                  <div className="loading-container">
                    <span className="loader"></span>
                  </div>
                ) : strukturorganisasiError ? (
                  <p className="error-message">{strukturorganisasiError}</p>
                ) : (
                  <div
                    className="dialog-text"
                    dangerouslySetInnerHTML={{
                      __html:
                        strukturorganisasiData?.profile?.content ||
                        "<p>No content available</p>",
                    }}
                  />
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
            onClick={() => setDialogVisiblele(true)}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition5)}
            onMouseLeave={() => handleMouseLeave(setIconPosition5)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition5.x}px, ${iconPosition5.y}px) translateY(-19px)`,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/establishment.png")}
                alt=""
              />
            </div>
            <div>
              <span className="icon-button-text">LEMBAGA</span>
            </div>
          </Button>
          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">Lembaga Desa</h2>
                    <p className="dialog-subtitle">
                      Informasi mengenai lembaga desa
                    </p>
                  </div>
                </div>
              }
              visible={dialogVisiblele}
              style={{ width: "75vw" }}
              className="custom-dialog bounce-in"
              maximizable
              modal
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
              }}
              onHide={() => setDialogVisiblele(false)}
            >
              <div>
                <div className="dialog-divider"></div>
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
                    className="dialog-text"
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
                header={
                  <div className="dialog-header">
                    <div>
                      <h2 className="dialog-title">{`Detail Lembaga: ${selectedLembaga.nama}`}</h2>
                      <p className="dialog-subtitle">
                        Informasi mengenai lembaga desa
                      </p>
                    </div>
                  </div>
                }
                visible={detailDialogVisible}
                style={{ width: "70vw" }}
                maximizable
                modal
                onHide={() => setDetailDialogVisible(false)}
                className="custom-dialog-content dialog-text"
              >
                <div>
                  <h4>Profil Lembaga</h4>
                  {selectedLembaga.profil_lembaga?.map((profil, index) => (
                    <p
                      className="dialog-text"
                      key={index}
                      dangerouslySetInnerHTML={{ __html: profil.content }}
                    ></p>
                  ))}
                  <div className="dialog-divider"></div>
                  <h4>Tugas Pokok</h4>
                  {selectedLembaga.tugas_pokok?.map((tugas, index) => (
                    <p
                      className="dialog-text"
                      key={index}
                      dangerouslySetInnerHTML={{ __html: tugas.content }}
                    ></p>
                  ))}

                  <h4>Visi Misi</h4>
                  {selectedLembaga.visi_misi?.map((visi, index) => (
                    <p
                      className="dialog-text"
                      key={index}
                      dangerouslySetInnerHTML={{ __html: visi.content }}
                    ></p>
                  ))}

                  <h4 className="dialog-text">Anggota</h4>
                  {renderAnggota(selectedLembaga.Anggota)}
                </div>
              </Dialog>
            )}
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
            onClick={() => setDialogVisiblege(true)}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition6)}
            onMouseLeave={() => handleMouseLeave(setIconPosition6)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition6.x}px, ${iconPosition6.y}px) translateY(-15px)`,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/planet.png")}
                alt=""
              />
            </div>
            <div>
              <span className="icon-button-text">GEOGRAFI</span>
            </div>
          </Button>
          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">Geografi</h2>
                    <p className="dialog-subtitle">
                      Informasi mengenai geografi desa
                    </p>
                  </div>
                </div>
              }
              visible={dialogVisiblege}
              style={{ width: "90vw" }}
              maximizable
              modal
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
                height: "500px",
              }}
              className="custom-dialog bounce-in"
              onHide={() => setDialogVisiblege(false)}
            >
              <div className="modal-body col-lg">
                <Geografix />
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
            className="custom-button mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={() => setDialogVisible(true)}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition7)}
            onMouseLeave={() => handleMouseLeave(setIconPosition7)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition7.x}px, ${iconPosition7.y}px) translateY(-15px)`,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/demographic.png")}
                alt=""
              />
            </div>
            <div>
              <span className="icon-button-text">DEMOGRAFI</span>
            </div>
          </Button>
          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">Demografi</h2>
                    <p className="dialog-subtitle">
                      Informasi mengenai demografi desa
                    </p>
                  </div>
                </div>
              }
              visible={dialogVisible}
              style={{ width: "80vw" }}
              maximizable
              modal
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
                height: "auto",
              }}
              className="custom-dialog bounce-in"
              onHide={() => setDialogVisible(false)}
            >
              <div className="dialog-divider"></div>
              <div
                className="dialog-text modal-body"
                style={{
                  position: "relative",
                  // display: "grid",
                  // gridTemplateColumns: "repeat(2, 1fr)",
                  // gap: "20px",
                }}
              >
                {/* Container slide */}
                <div
                  style={{
                    display: "flex",
                    overflowX: "hidden",
                    scrollBehavior: "smooth",
                    width: "100%",
                    scrollSnapType: "x mandatory",
                    // gridColumn: "1 / -1", // Memastikan container slide mengambil seluruh lebar
                  }}
                >
                  {/* Slide Gender Distribution */}
                  <div
                    style={{
                      flex: "0 0 100%",
                      scrollSnapAlign: "start",
                      transform: `translateX(-${currentSlide * 100}%)`,
                      padding: "10px",
                      boxSizing: "border-box",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <div className="chart-container">
                      <h3>Gender Distribution</h3>
                      {genderChartData && (
                        <Chart
                          type="pie"
                          data={genderChartData}
                          options={chartOptions}
                          // plugins={[ChartDataLabels]}
                          style={{ width: "98%", height: "250px" }}
                        />
                      )}
                    </div>
                    {/* Tabel Gender Distribution */}
                    <DataTable value={genderTableData}>
                      <Column field="label" header="Label"></Column>
                      <Column field="value" header="Value"></Column>
                    </DataTable>
                  </div>

                  {/* Slide Education Distribution */}
                  <div
                    style={{
                      flex: "0 0 100%",
                      transform: `translateX(-${currentSlide * 100}%)`,
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <div className="chart-container">
                      <h3>Education Distribution</h3>
                      {educationChartData && (
                        <Chart
                          type="pie"
                          data={educationChartData}
                          options={chartOptions}
                          // plugins={[ChartDataLabels]}
                          style={{ width: "98%", height: "250px" }}
                        />
                      )}
                    </div>
                    {/* Tabel Education Distribution */}
                    <DataTable value={educationTableData}>
                      <Column field="label" header="Label"></Column>
                      <Column field="value" header="Value"></Column>
                    </DataTable>
                  </div>

                  {/* Slide Job Distribution */}
                  <div
                    style={{
                      flex: "0 0 100%",
                      transform: `translateX(-${currentSlide * 100}%)`,
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <div className="chart-container">
                      <h3>Job Distribution</h3>
                      {jobChartData && (
                        <Chart
                          type="doughnut"
                          data={jobChartData}
                          options={chartOptions}
                          // plugins={[ChartDataLabels]}
                          style={{ width: "98%", height: "250px" }}
                        />
                      )}
                    </div>
                    {/* Tabel Job Distribution */}
                    <DataTable value={jobTableData}>
                      <Column field="label" header="Label"></Column>
                      <Column field="value" header="Value"></Column>
                    </DataTable>
                  </div>

                  {/* Slide Religion Distribution */}
                  <div
                    style={{
                      flex: "0 0 100%",
                      transform: `translateX(-${currentSlide * 100}%)`,
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <div className="chart-container">
                      <h3>Religion Distribution</h3>
                      {religionChartData && (
                        <Chart
                          type="pie"
                          data={religionChartData}
                          options={chartOptions}
                          // plugins={[ChartDataLabels]}
                          style={{ width: "98%", height: "250px" }}
                        />
                      )}
                    </div>
                    {/* Tabel Religion Distribution */}
                    <DataTable value={religionTableData}>
                      <Column field="label" header="Label"></Column>
                      <Column field="value" header="Value"></Column>
                    </DataTable>
                  </div>

                  {/* Slide Marital Status Distribution */}
                  <div
                    style={{
                      flex: "0 0 100%",
                      transform: `translateX(-${currentSlide * 100}%)`,
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <div className="chart-container">
                      <h3>Marital Status Distribution</h3>
                      {maritalStatusChartData && (
                        <Chart
                          type="pie"
                          data={maritalStatusChartData}
                          options={chartOptions}
                          // plugins={[ChartDataLabels]}
                          style={{ width: "98%", height: "250px" }}
                        />
                      )}
                    </div>
                    {/* Tabel Marital Status Distribution */}
                    <DataTable value={maritalStatusTableData}>
                      <Column field="label" header="Label"></Column>
                      <Column field="value" header="Value"></Column>
                    </DataTable>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "20px",
                  marginTop: "20px",
                }}
              >
                {/* Tombol Panah Kiri */}
                <Button
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#ffffff",
                    border: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#007bff",
                    fontSize: "24px", // Ukuran ikon teks
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 8px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  ‹ {/* Ikon panah kiri */}
                </Button>

                {/* Tombol Panah Kanan */}
                <Button
                  onClick={nextSlide}
                  disabled={currentSlide === slides.length - 1}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#ffffff",
                    border: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#007bff",
                    fontSize: "24px", // Ukuran ikon teks
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 8px rgba(0, 0, 0, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  › {/* Ikon panah kanan */}
                </Button>
              </div>
            </Dialog>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Modals;
