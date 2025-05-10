import React, { useState, useEffect } from "react";
import useSWR from "swr"; // Import SWR
// import axios from "axios";
import { Chart } from "primereact/chart";
// import ChartDataLabels from "chartjs-plugin-datalabels";
import { Button, Row, Col } from "reactstrap";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tooltip } from "primereact/tooltip";
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
  const [dialogVisibledecan, setDialogVisibledecan] = useState(false);

  // const [customers, setCustomers] = useState([]);
  // const [chartData, setChartData] = useState({});
  // const [chartOptions, setChartOptions] = useState({});

  const baseURL = "https://randusanga-kulon-ds.osc-fr1.scalingo.io/";

  const { data: desacantikData, error: desacantikError } = useSWR(
    "https://randusanga-kulon-ds.osc-fr1.scalingo.io//desacantikpengunjung",
    fetcher
  );

  const loadingDesacantik = !desacantikData && !desacantikError;
  const imageURLdc = desacantikData?.profile.file_url
    ? `${baseURL}${desacantikData.profile.file_url}`
    : null;

  const { data: tentangData, error: tentangError } = useSWR(
    "https://randusanga-kulon-ds.osc-fr1.scalingo.io//tentangpengunjung",
    fetcher
  );
  const loadingTentang = !tentangData && !tentangError;
  const imageURLT = tentangData?.profile.file_url
    ? `${baseURL}${tentangData.profile.file_url}`
    : null;

  const { data: sejarahData, error: sejarahError } = useSWR(
    "https://randusanga-kulon-ds.osc-fr1.scalingo.io//sejarahpengunjung",
    fetcher
  );
  const loadingSejarah = !sejarahData && !sejarahError;
  const imageURLSejarah = sejarahData?.profile.file_url
    ? `${baseURL}${sejarahData.profile.file_url}`
    : null;

  const { data: visionData, error: visionError } = useSWR(
    "https://randusanga-kulon-ds.osc-fr1.scalingo.io//visimisipengunjung",
    fetcher
  );
  const loadingVision = !visionData && !visionError;
  const imageURLVisi = visionData?.profile.file_url
    ? `${baseURL}${visionData.profile.file_url}`
    : null;

  const { data: strukturorganisasiData, error: strukturorganisasiError } =
    useSWR(
      "https://randusanga-kulon-ds.osc-fr1.scalingo.io//strukturorganisasipengunjung",
      fetcher
    );

  const loadingStrukturorganisasi =
    !strukturorganisasiData && !strukturorganisasiError;

  // Construct full URL for the image
  const imageURL = strukturorganisasiData?.profile.file_url
    ? `${baseURL}${strukturorganisasiData.profile.file_url}`
    : null;

  const { data: demografiData, error: demografiError } = useSWR(
    "https://randusanga-kulon-ds.osc-fr1.scalingo.io//demografipengunjung",
    fetcher
  );

  //lembaga
  const { data: lembagaData, error: lembagaError } = useSWR(
    "https://randusanga-kulon-ds.osc-fr1.scalingo.io//lembagapengunjung",
    fetcher
  );
  const loadingLembaga = !lembagaData && !lembagaError;

  const lembagaList = lembagaData?.lembagap || [];
  const baseLURL = "https://randusanga-kulon-ds.osc-fr1.scalingo.io//";

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

  const [currentSlide, setCurrentSlide] = useState(0); // State untuk mengatur slide yang aktif

  // Data untuk tabel chart
  const [genderTableData, setGenderTableData] = useState([]);
  const [educationTableData, setEducationTableData] = useState([]);
  const [jobTableData, setJobTableData] = useState([]);
  const [religionTableData, setReligionTableData] = useState([]);
  const [maritalStatusTableData, setMaritalStatusTableData] = useState([]);
  const [ageTableData, setAgeTableData] = useState([]);
  const [rtTableData, setRTTableData] = useState([]);
  const [rwTableData, setRWTableData] = useState([]);
  const [hamletTableData, setHamletTableData] = useState([]);

  const [genderChartData, setGenderChartData] = useState(null);
  const [educationChartData, setEducationChartData] = useState(null);
  const [jobChartData, setJobChartData] = useState(null);
  const [religionChartData, setReligionChartData] = useState(null);
  const [maritalStatusChartData, setMaritalStatusChartData] = useState(null);
  const [ageChartData, setAgeChartData] = useState(null);
  const [rtChartData, setRTChartData] = useState(null);
  const [rwChartData, setRWChartData] = useState(null);
  const [hamletChartData, setHamletChartData] = useState(null);

  const [chartOptions, setChartOptions] = useState({});

  // Fungsi untuk menghasilkan warna berdasarkan jumlah data
  function generateColors(count) {
    // Array warna standar
    const baseColors = [
      "#FF6F61", // Coral
      "#6B5B95", // Ultra Violet
      "#88B04B", // Meadow
      "#FFA500", // Bright Orange
      "#92A8D1", // Serenity
      "#F7CAC9", // Rose Quartz
      "#955251", // Marsala
      "#B565A7", // Radiant Orchid
      "#009B77", // Emerald
      "#DD4124", // Tangerine Tango
      "#D65076", // Honeysuckle
      "#45B8AC", // Turquoise
      "#EFC050", // Mimosa
      "#5B5EA6", // Blue Iris
      "#9B2335", // Chili Pepper
      "#DFCFBE", // Sand Dollar
      "#55B4B0", // Blue Turquoise
      "#E15D44", // Fiesta
      "#7FCDCD", // Aqua Sky
      "#BC243C", // Poppy Red
    ];

    // Jika jumlah data lebih banyak dari jumlah warna yang tersedia, ulangi warna
    return Array.from(
      { length: count },
      (_, i) => baseColors[i % baseColors.length]
    );
  }

  const calculateTotals = (data) => {
    const totals = data.reduce(
      (acc, row) => {
        acc.total += row.total || 0;
        acc.male += row.male || 0;
        acc.female += row.female || 0;
        return acc;
      },
      { label: "Total", total: 0, male: 0, female: 0 }
    );
    return totals;
  };

  useEffect(() => {
    if (demografiData) {
      // Handle data gender
      const genderLabels =
        demografiData.genderCounts?.map((item) => item?.gender || "Unknown") ||
        [];
      const genderCounts =
        demografiData.genderCounts?.map((item) => item?._count?.id || 0) || [];
      const genderMaleCounts =
        demografiData.genderCounts?.map((item) => item?.male || 0) || [];
      const genderFemaleCounts =
        demografiData.genderCounts?.map((item) => item?.female || 0) || [];

      const genderTableDataWithTotals = [
        ...genderLabels.map((label, index) => ({
          label,
          total: genderCounts[index],
          male: genderMaleCounts[index],
          female: genderFemaleCounts[index],
        })),
        calculateTotals(
          genderLabels.map((label, index) => ({
            label,
            total: genderCounts[index],
            male: genderMaleCounts[index],
            female: genderFemaleCounts[index],
          }))
        ),
      ];

      setGenderTableData(genderTableDataWithTotals);

      setGenderChartData({
        labels: genderLabels,
        datasets: [
          {
            data: genderCounts,
            backgroundColor: generateColors(genderLabels.length),
          },
        ],
      });

      // Handle data pendidikan
      const educationLabels =
        demografiData.educationCounts?.map(
          (item) => item?.level || "Unknown"
        ) || [];
      const educationCounts =
        demografiData.educationCounts?.map((item) => item?.total || 0) || [];
      const educationMaleCounts =
        demografiData.educationCounts?.map((item) => item?.male || 0) || [];
      const educationFemaleCounts =
        demografiData.educationCounts?.map((item) => item?.female || 0) || [];

      const educationTableDataWithTotals = [
        ...educationLabels.map((label, index) => ({
          label,
          total: educationCounts[index],
          male: educationMaleCounts[index],
          female: educationFemaleCounts[index],
        })),
        calculateTotals(
          educationLabels.map((label, index) => ({
            label,
            total: educationCounts[index],
            male: educationMaleCounts[index],
            female: educationFemaleCounts[index],
          }))
        ),
      ];

      setEducationTableData(educationTableDataWithTotals);

      setEducationChartData({
        labels: educationLabels,
        datasets: [
          {
            data: educationCounts,
            backgroundColor: generateColors(educationLabels.length),
          },
        ],
      });

      // Handle data pekerjaan
      const jobCounts =
        demografiData.jobCounts?.map((item) => item?.total || 0) || [];
      const jobMaleCounts =
        demografiData.jobCounts?.map((item) => item?.male || 0) || [];
      const jobFemaleCounts =
        demografiData.jobCounts?.map((item) => item?.female || 0) || [];
      const topJobs = demografiData.jobCounts?.slice(0, 5) || [];
      const otherJobCount = jobCounts.slice(5).reduce((a, b) => a + b, 0);

      const jobTableDataWithTotals = [
        ...topJobs.map((job, index) => ({
          label: job.job || "Unknown",
          total: jobCounts[index],
          male: jobMaleCounts[index],
          female: jobFemaleCounts[index],
        })),
        { label: "Others", total: otherJobCount, male: 0, female: 0 },
        calculateTotals(
          topJobs.map((job, index) => ({
            label: job.job || "Unknown",
            total: jobCounts[index],
            male: jobMaleCounts[index],
            female: jobFemaleCounts[index],
          }))
        ),
      ];

      setJobTableData(jobTableDataWithTotals);

      setJobChartData({
        labels: [...topJobs.map((job) => job.job || "Unknown"), "Others"],
        datasets: [
          {
            data: [...topJobs.map((job) => job.total || 0), otherJobCount],
            backgroundColor: generateColors(topJobs.length + 1),
          },
        ],
      });

      // Handle data agama
      const religionLabels =
        demografiData.religionCounts?.map((item) => item?.name || "Unknown") ||
        [];
      const religionCounts =
        demografiData.religionCounts?.map((item) => item?.total || 0) || [];
      const religionMaleCounts =
        demografiData.religionCounts?.map((item) => item?.male || 0) || [];
      const religionFemaleCounts =
        demografiData.religionCounts?.map((item) => item?.female || 0) || [];

      const religionTableDataWithTotals = [
        ...religionLabels.map((label, index) => ({
          label,
          total: religionCounts[index],
          male: religionMaleCounts[index],
          female: religionFemaleCounts[index],
        })),
        calculateTotals(
          religionLabels.map((label, index) => ({
            label,
            total: religionCounts[index],
            male: religionMaleCounts[index],
            female: religionFemaleCounts[index],
          }))
        ),
      ];

      setReligionTableData(religionTableDataWithTotals);

      setReligionChartData({
        labels: religionLabels,
        datasets: [
          {
            data: religionCounts,
            backgroundColor: generateColors(religionLabels.length),
          },
        ],
      });

      // Handle data status perkawinan
      const maritalStatusLabels =
        demografiData.maritalStatusCounts?.map(
          (item) => item?.marital_status || "Unknown"
        ) || [];
      const maritalStatusCounts =
        demografiData.maritalStatusCounts?.map((item) => item?.total || 0) ||
        [];
      const maritalStatusMaleCounts =
        demografiData.maritalStatusCounts?.map((item) => item?.male || 0) || [];
      const maritalStatusFemaleCounts =
        demografiData.maritalStatusCounts?.map((item) => item?.female || 0) ||
        [];

      const maritalStatusTableDataWithTotals = [
        ...maritalStatusLabels.map((label, index) => ({
          label,
          total: maritalStatusCounts[index],
          male: maritalStatusMaleCounts[index],
          female: maritalStatusFemaleCounts[index],
        })),
        calculateTotals(
          maritalStatusLabels.map((label, index) => ({
            label,
            total: maritalStatusCounts[index],
            male: maritalStatusMaleCounts[index],
            female: maritalStatusFemaleCounts[index],
          }))
        ),
      ];

      setMaritalStatusTableData(maritalStatusTableDataWithTotals);

      setMaritalStatusChartData({
        labels: maritalStatusLabels,
        datasets: [
          {
            data: maritalStatusCounts,
            backgroundColor: generateColors(maritalStatusLabels.length),
          },
        ],
      });

      // Handle data umur
      const ageRanges = [
        "0-17",
        "18-25",
        "26-35",
        "36-45",
        "46-55",
        "56-65",
        "65+",
      ];
      const ageCounts = ageRanges.map(
        (range) => demografiData.ageGroups?.[range]?.total || 0
      );
      const ageMaleCounts = ageRanges.map(
        (range) => demografiData.ageGroups?.[range]?.male || 0
      );
      const ageFemaleCounts = ageRanges.map(
        (range) => demografiData.ageGroups?.[range]?.female || 0
      );

      const ageTableDataWithTotals = [
        ...ageRanges.map((label, index) => ({
          label,
          total: ageCounts[index],
          male: ageMaleCounts[index],
          female: ageFemaleCounts[index],
        })),
        calculateTotals(
          ageRanges.map((label, index) => ({
            label,
            total: ageCounts[index],
            male: ageMaleCounts[index],
            female: ageFemaleCounts[index],
          }))
        ),
      ];

      setAgeTableData(ageTableDataWithTotals);

      setAgeChartData({
        labels: ageRanges,
        datasets: [
          {
            label: "Jumlah Penduduk per Kelompok Usia",
            data: ageCounts,
            backgroundColor: generateColors(ageRanges.length),
          },
        ],
      });

      // Handle data RT
      const rtLabels = Object.keys(demografiData.groupedByRT || {});
      const rtCounts = Object.values(demografiData.groupedByRT || {}).map(
        (group) => group?.total || 0
      );
      const rtMaleCounts = Object.values(demografiData.groupedByRT || {}).map(
        (group) => group?.male || 0
      );
      const rtFemaleCounts = Object.values(demografiData.groupedByRT || {}).map(
        (group) => group?.female || 0
      );

      const rtTableDataWithTotals = [
        ...rtLabels.map((label, index) => ({
          label: `RT ${label}`,
          total: rtCounts[index],
          male: rtMaleCounts[index],
          female: rtFemaleCounts[index],
        })),
        calculateTotals(
          rtLabels.map((label, index) => ({
            label: `RT ${label}`,
            total: rtCounts[index],
            male: rtMaleCounts[index],
            female: rtFemaleCounts[index],
          }))
        ),
      ];

      setRTTableData(rtTableDataWithTotals);

      setRTChartData({
        labels: rtLabels.map((label) => `RT ${label}`),
        datasets: [
          {
            data: rtCounts,
            backgroundColor: generateColors(rtLabels.length),
          },
        ],
      });

      // Handle data RW
      const rwLabels = Object.keys(demografiData.groupedByRW || {});
      const rwCounts = Object.values(demografiData.groupedByRW || {}).map(
        (group) => group?.total || 0
      );
      const rwMaleCounts = Object.values(demografiData.groupedByRW || {}).map(
        (group) => group?.male || 0
      );
      const rwFemaleCounts = Object.values(demografiData.groupedByRW || {}).map(
        (group) => group?.female || 0
      );

      const rwTableDataWithTotals = [
        ...rwLabels.map((label, index) => ({
          label: `RW ${label}`,
          total: rwCounts[index],
          male: rwMaleCounts[index],
          female: rwFemaleCounts[index],
        })),
        calculateTotals(
          rwLabels.map((label, index) => ({
            label: `RW ${label}`,
            total: rwCounts[index],
            male: rwMaleCounts[index],
            female: rwFemaleCounts[index],
          }))
        ),
      ];

      setRWTableData(rwTableDataWithTotals);

      setRWChartData({
        labels: rwLabels.map((label) => `RW ${label}`),
        datasets: [
          {
            data: rwCounts,
            backgroundColor: generateColors(rwLabels.length),
          },
        ],
      });

      // Handle data Dusun
      const hamletLabels = Object.keys(demografiData.groupedByHamlet || {});
      const hamletCounts = Object.values(
        demografiData.groupedByHamlet || {}
      ).map((group) => group?.total || 0);
      const hamletMaleCounts = Object.values(
        demografiData.groupedByHamlet || {}
      ).map((group) => group?.male || 0);
      const hamletFemaleCounts = Object.values(
        demografiData.groupedByHamlet || {}
      ).map((group) => group?.female || 0);

      const hamletTableDataWithTotals = [
        ...hamletLabels.map((label, index) => ({
          label: `Dusun ${label}`,
          total: hamletCounts[index],
          male: hamletMaleCounts[index],
          female: hamletFemaleCounts[index],
        })),
        calculateTotals(
          hamletLabels.map((label, index) => ({
            label: `Dusun ${label}`,
            total: hamletCounts[index],
            male: hamletMaleCounts[index],
            female: hamletFemaleCounts[index],
          }))
        ),
      ];

      setHamletTableData(hamletTableDataWithTotals);

      setHamletChartData({
        labels: hamletLabels.map((label) => `Dusun ${label}`),
        datasets: [
          {
            data: hamletCounts,
            backgroundColor: generateColors(hamletLabels.length),
          },
        ],
      });

      // Set chart options
      setChartOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "right",
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                return `${tooltipItem.label}: ${tooltipItem.raw}`;
              },
            },
          },
        },
      });
    }
  }, [demografiData]);

  // Data untuk slide
  const slides = [
    {
      title: "Distribusi Jenis Kelamin",
      chartData: genderChartData,
      tableData: genderTableData,
    },
    {
      title: "Distribusi Pendidikan",
      chartData: educationChartData,
      tableData: educationTableData,
    },
    {
      title: "Distribusi Pekerjaan",
      chartData: jobChartData,
      tableData: jobTableData,
    },
    {
      title: "Distribusi Agama",
      chartData: religionChartData,
      tableData: religionTableData,
    },
    {
      title: "Distribusi Status Perkawinan",
      chartData: maritalStatusChartData,
      tableData: maritalStatusTableData,
    },
    {
      title: "Distribusi Umur",
      chartData: ageChartData,
      tableData: ageTableData,
    },
    {
      title: "Distribusi RT",
      chartData: rtChartData,
      tableData: rtTableData,
    },
    {
      title: "Distribusi RW",
      chartData: rwChartData,
      tableData: rwTableData,
    },
    {
      title: "Distribusi Dusun",
      chartData: hamletChartData,
      tableData: hamletTableData,
    },
  ];

  // Fungsi untuk menggeser slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev)); // Bisa sampai slide terakhir
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

  const [animationTriggered, setAnimationTriggered] = useState(false);

  const [iconPosition, setIconPosition] = useState({ x: 0, y: 0 });
  const [iconPosition1, setIconPosition1] = useState({ x: 0, y: 0 });
  const [iconPosition3, setIconPosition3] = useState({ x: 0, y: 0 });
  const [iconPosition4, setIconPosition4] = useState({ x: 0, y: 0 });
  const [iconPosition5, setIconPosition5] = useState({ x: 0, y: 0 });
  const [iconPosition6, setIconPosition6] = useState({ x: 0, y: 0 });
  const [iconPosition7, setIconPosition7] = useState({ x: 0, y: 0 });
  const [iconPosition8, setIconPosition8] = useState({ x: 0, y: 0 });

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
            padding-bottom: 10px;
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

          .icon-button-textsd {
            display: block;
            text-align: center;
            font-size: clamp(10px, 2vw, 12px);
            font-weight: 600;
            transform: translateY(-15px);
            margin-top: auto;
            color: #fff;
          }

          .icon-button-text {
            display: block;
            text-align: center;
            font-size: clamp(10px, 2vw, 12px);
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

.chart-container {
  display: flex;
  align-items: center;
  gap: 10px; /* Mengurangi jarak antara chart dan legend */
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chart-animation {
  animation: fadeIn 1s ease-in-out;
}

/* Desktop: Tampilkan teks penuh */
@media (min-width: 768px) {
  .ellipsis-text {
    white-space: normal; /* Teks bisa wrap ke baris baru */
    overflow: visible; /* Tampilkan teks penuh */
    text-overflow: clip; /* Tidak perlu ellipsis */
  }
}

/* Mobile: Potong teks dengan ellipsis */
@media (max-width: 767px) {
  .ellipsis-text {
    white-space: nowrap; /* Teks tidak wrap ke baris baru */
    overflow: hidden; /* Sembunyikan teks yang melebihi lebar */
    text-overflow: ellipsis; /* Tambahkan ... di akhir teks */
  }
}

/* Styling umum */
.center-text {
  text-align: center !important;;
  vertical-align: middle !important;;
}

.responsive-table {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.responsive-table .p-datatable-wrapper {
  overflow-x: auto;
}

.responsive-table .p-datatable-table {
  min-width: 600px;
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
                transform: `translate(${iconPosition.x}px, ${iconPosition.y}px) translateY(-19px)`,
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
                transform: `translate(${iconPosition1.x}px, ${iconPosition1.y}px) translateY(-19px)`,
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
                transform: `translate(${iconPosition3.x}px, ${iconPosition3.y}px) translateY(-19px)`,
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
                marginBottom: "5px",
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/management.png")}
                alt=""
              />
            </div>
            <div>
              <span className="icon-button-text">Organisasi</span>
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
                transform: `translate(${iconPosition6.x}px, ${iconPosition6.y}px) translateY(-19px)`,
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
            className="custom-button mb-3 mb-sm-0"
            type="button"
            icon="pi pi-info-circle"
            onClick={(e) => {
              setDialogVisibledecan(true);
            }}
            onMouseMove={(e) => handleMouseMove(e, setIconPosition8)}
            onMouseLeave={() => handleMouseLeave(setIconPosition8)}
          >
            <div
              className="button-icon"
              style={{
                transform: `translate(${iconPosition8.x}px, ${iconPosition8.y}px) translateY(-19px)`,
              }}
            >
              <img
                className="img-fluid"
                src={require("assets/img/theme/learning.png")}
                alt=""
              />
            </div>
            <div>
              <span className="icon-button-text">DESA CANTIK</span>
            </div>
          </Button>
          <div>
            <Dialog
              header={
                <div className="dialog-header">
                  <div>
                    <h2 className="dialog-title">Desa Cantik</h2>
                    <p className="dialog-subtitle">
                      Informasi mengenai desa cantik
                    </p>
                  </div>
                </div>
              }
              visible={dialogVisibledecan}
              style={{ width: "55vw" }}
              maximizable
              modal
              className="custom-dialog bounce-in"
              contentStyle={{
                overflowY: "auto",
                padding: "24px 24px 10px 24px",
              }}
              onHide={() => setDialogVisibledecan(false)}
            >
              <div>
                {imageURLdc ? (
                  <div style={{ marginBottom: "20px" }}>
                    <img
                      src={imageURLdc}
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
                {loadingDesacantik ? (
                  <div className="loading-container">
                    <span className="loader"></span>
                  </div>
                ) : desacantikError ? (
                  <p className="error-message">{desacantikError}</p>
                ) : (
                  <div
                    className="dialog-text"
                    dangerouslySetInnerHTML={{
                      __html:
                        desacantikData?.profile?.content ||
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
                transform: `translate(${iconPosition7.x}px, ${iconPosition7.y}px) translateY(-19px)`,
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
              style={{ width: window.innerWidth <= 768 ? "90vw" : "80vw" }}
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
              <div className="dialog-text modal-body">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {/* Judul Chart */}
                  <h3
                    style={{
                      textAlign: "center",
                      fontSize: window.innerWidth <= 768 ? "20px" : "24px",
                      marginBottom: "10px",
                    }}
                  >
                    {slides[currentSlide].title}
                  </h3>

                  {/* Container untuk Chart dan Tabel */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection:
                        window.innerWidth <= 768 ? "column" : "row",
                      gap: window.innerWidth <= 768 ? "10px" : "15px", // Kurangi gap
                      alignItems: "center",
                    }}
                  >
                    {/* Chart */}
                    <div className="chart-container">
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                        className="chart-animation"
                        key={currentSlide}
                      >
                        {slides[currentSlide].chartData && (
                          <Chart
                            type="pie"
                            data={slides[currentSlide].chartData}
                            options={{
                              ...chartOptions,
                              plugins: {
                                legend: {
                                  display: true,
                                  position:
                                    window.innerWidth <= 768
                                      ? "bottom"
                                      : "right",
                                },
                              },
                            }}
                            style={{
                              width: "100%",
                              height:
                                window.innerWidth <= 768 ? "200px" : "250px",
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Tabel */}
                    <div
                      style={{
                        flex: 1,
                        maxWidth: window.innerWidth <= 768 ? "100%" : "70%",
                      }}
                    >
                      {" "}
                      {/* Kurangi lebar tabel */}
                      <Tooltip target=".ellipsis-text" />
                      {slides[currentSlide].tableData && (
                        <DataTable
                          value={slides[currentSlide].tableData}
                          style={{
                            width: "100%",
                            marginTop: window.innerWidth <= 768 ? "10px" : "0",
                          }}
                        >
                          {/* Kolom Legenda */}
                          <Column
                            field="label"
                            body={(rowData) => <div>{rowData.label}</div>}
                            header={() => (
                              <div className="center-text">Legenda</div>
                            )}
                            style={{
                              width:
                                slides[currentSlide].title ===
                                "Distribusi Jenis Kelamin"
                                  ? window.innerWidth <= 768
                                    ? "80px" // Lebar lebih kecil untuk mobile
                                    : "100px" // Lebar lebih kecil untuk desktop
                                  : window.innerWidth <= 768
                                  ? "100px"
                                  : "120px", // Lebar default untuk tabel lainnya
                            }}
                          />

                          {/* Kolom Jumlah */}
                          <Column
                            field="total"
                            body={(rowData) => (
                              <div className="center-text">{rowData.total}</div>
                            )}
                            header={() => (
                              <div className="center-text">Jumlah</div>
                            )}
                            style={{
                              minWidth:
                                slides[currentSlide].title ===
                                "Distribusi Jenis Kelamin"
                                  ? window.innerWidth <= 768
                                    ? "20px" // Lebar minimum lebih kecil untuk mobile
                                    : "30px" // Lebar minimum lebih kecil untuk desktop
                                  : window.innerWidth <= 768
                                  ? "30px"
                                  : "40px", // Lebar default untuk tabel lainnya
                              width:
                                slides[currentSlide].title ===
                                "Distribusi Jenis Kelamin"
                                  ? window.innerWidth <= 768
                                    ? "40px" // Lebar lebih kecil untuk mobile
                                    : "50px" // Lebar lebih kecil untuk desktop
                                  : window.innerWidth <= 768
                                  ? "50px"
                                  : "60px", // Lebar default untuk tabel lainnya
                            }}
                          />

                          {/* Kolom Laki-laki (Hanya ditampilkan jika bukan Distribusi Jenis Kelamin) */}
                          {slides[currentSlide].title !==
                            "Distribusi Jenis Kelamin" && (
                            <Column
                              field="male"
                              body={(rowData) => (
                                <div className="center-text">
                                  {rowData.male}
                                </div>
                              )}
                              header={() => (
                                <div className="center-text">Laki-laki</div>
                              )}
                              style={{
                                minWidth:
                                  window.innerWidth <= 768 ? "30px" : "40px",
                                width:
                                  window.innerWidth <= 768 ? "40px" : "50px",
                              }}
                            />
                          )}

                          {/* Kolom Perempuan (Hanya ditampilkan jika bukan Distribusi Jenis Kelamin) */}
                          {slides[currentSlide].title !==
                            "Distribusi Jenis Kelamin" && (
                            <Column
                              field="female"
                              body={(rowData) => (
                                <div
                                  className="center-text ellipsis-text"
                                  data-pr-tooltip={rowData.female}
                                  data-pr-position="top"
                                >
                                  {rowData.female}
                                </div>
                              )}
                              header={() => (
                                <div
                                  className="center-text ellipsis-text"
                                  data-pr-tooltip="Perempuan"
                                  data-pr-position="top"
                                >
                                  Perempuan
                                </div>
                              )}
                              style={{
                                minWidth:
                                  window.innerWidth <= 768 ? "40px" : "50px",
                                width:
                                  window.innerWidth <= 768 ? "50px" : "60px",
                              }}
                            />
                          )}
                        </DataTable>
                      )}
                    </div>
                  </div>

                  {/* Tombol Navigasi */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "20px",
                      marginTop: window.innerWidth <= 768 ? "10px" : "20px",
                    }}
                  >
                    <Button
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                      style={{
                        width: window.innerWidth <= 768 ? "40px" : "50px",
                        height: window.innerWidth <= 768 ? "40px" : "50px",
                        borderRadius: "50%",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#ffffff",
                        border: "1px solid #ddd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#007bff",
                        fontSize: window.innerWidth <= 768 ? "20px" : "24px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      ‹
                    </Button>
                    <Button
                      onClick={nextSlide}
                      disabled={currentSlide === slides.length - 1}
                      style={{
                        width: window.innerWidth <= 768 ? "40px" : "50px",
                        height: window.innerWidth <= 768 ? "40px" : "50px",
                        borderRadius: "50%",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        backgroundColor: "#ffffff",
                        border: "1px solid #ddd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#007bff",
                        fontSize: window.innerWidth <= 768 ? "20px" : "24px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      ›
                    </Button>
                  </div>
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
