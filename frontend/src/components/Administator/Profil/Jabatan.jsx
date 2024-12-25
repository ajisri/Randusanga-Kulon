import React, { useState, useEffect, useCallback, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Dialog } from "primereact/dialog";
// import { Dropdown } from "primereact/dropdown";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";

import "./Jabatan.css"; // Custom CSS for styling

const Jabatan = () => {
  const [formData, setFormData] = useState({
    nama: "",
    ringkasan: "",
    fungsi: "",
    tugas: "",
    mulai: null,
    selesai: null,
  });

  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  const [demografiOptions, setDemografiOptions] = useState([]); // State untuk menyimpan data demografi dari API
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [currentData, setCurrentData] = useState(null);
  const [dataList, setDataList] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const navigate = useNavigate();
  const toast = useRef(null);
  const axiosJWT = useAuth(navigate);

  const fetcher = useCallback(
    async (url) => {
      const response = await axiosJWT.get(url);
      return response.data;
    },
    [axiosJWT]
  );

  const { data, error, isLoading } = useSWR(
    "http://localhost:8080/jabatan",
    fetcher
  );

  console.log("Data yang diterima:", data);

  useEffect(() => {
    if (data?.jabatan && data.jabatan.length > 0) {
      setDataList(data.jabatan);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.length > 0) {
      // Memastikan data ada dan bukan kosong
      setDataList(data); // Set dataList dengan data yang diterima
      const jabatanData = data[0]; // Ambil jabatan pertama jika ada
      setFormData({
        uuid: jabatanData.uuid,
        nama: jabatanData.nama,
        ringkasan: jabatanData.ringkasan,
        mulai: jabatanData.masaJabatan && jabatanData.masaJabatan[0]?.mulai, // Akses mulai dari masaJabatan pertama
        selesai: jabatanData.masaJabatan && jabatanData.masaJabatan[0]?.selesai, // Akses selesai dari masaJabatan pertama
        fungsi:
          (jabatanData.fungsi &&
            jabatanData.fungsi.map((f) => f.content).join(", ")) ||
          "", // Gabungkan fungsi menjadi string
        tugas:
          (jabatanData.tugas &&
            jabatanData.tugas.map((t) => t.content).join(", ")) ||
          "", // Gabungkan tugas menjadi string
      });
    } else {
      console.error("Data jabatan tidak tersedia atau kosong");
    }
  }, [data]);

  const {
    data: demografiData,
    error: demografiError,
    isLoading: demografiLoading,
  } = useSWR(
    "http://localhost:8080/demografi", // Endpoint API demografi
    fetcher
  );

  useEffect(() => {
    if (demografiData && demografiData.demographics) {
      console.log("Data Demografi:", demografiData.demographics); // Logging untuk cek isi data

      const formattedDemografi = demografiData.demographics.map((item) => ({
        label: item.name, // Ubah ini sesuai properti yang benar, dalam kasus ini `name`
        value: item.uuid, // Gunakan `id` sebagai value
      }));
      setDemografiOptions(formattedDemografi); // Update dropdown options dengan data yang sudah di-format
    }
  }, [demografiData]);

  useEffect(() => {
    if (demografiLoading) {
      // Jika sedang loading, tampilkan teks atau spinner
      console.log("Sedang memuat data demografi...");
    }
  }, [demografiLoading]);

  useEffect(() => {
    if (demografiError) {
      console.error(
        "Terjadi kesalahan saat memuat data demografi:",
        demografiError
      );
    }
  }, [demografiError]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNChange = (value, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  const handleQuillChange = useCallback((value, field) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Buat data payload untuk dikirim
    const data = {
      nama: formData.nama,
      ringkasan: formData.ringkasan, // Pastikan ini string HTML dari ReactQuill
      fungsi: formData.fungsi, // Pastikan ini string HTML dari ReactQuill
      tugas: formData.tugas, // Pastikan ini string HTML dari CKEditor
      mulai: formData.mulai,
      selesai: formData.selesai,
    };
    console.log("Payload sebelum dikirim:", data);

    try {
      setIsLoadingProcess(true);
      if (isEditMode) {
        console.log("currentData.uuid:", currentData.uuid);
        await axiosJWT.put(
          `http://localhost:8080/ujabatan/${currentData.uuid}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data updated successfully!",
          life: 3000,
        });
      } else {
        await axiosJWT.post("http://localhost:8080/cjabatan", data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data created successfully!",
          life: 3000,
        });
      }
      await mutate("http://localhost:8080/jabatan");
      resetForm();
      setDialogVisible(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoadingProcess(false); // Nonaktifkan loading setelah proses selesai
    }
  };

  const handleError = (error) => {
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 5000,
    });
  };

  const resetForm = () => {
    setFormData({
      nama: "",
      ringkasan: "",
      fungsi: "",
      tugas: "",
      mulai: "",
      selesai: "",
    });
    setEditMode(false);
    setCurrentData(null);
  };

  // const editData = (data) => {
  //   setFormData(data);
  //   setCurrentData(data);
  //   setEditMode(true);
  //   setDialogVisible(true);
  // };

  const deleteData = async (uuid) => {
    if (window.confirm("Are you sure you want to delete this data?")) {
      try {
        await axiosJWT.delete(`http://localhost:8080/jabatan/${uuid}`);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate("http://localhost:8080/jabatan");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const openEditDialog = (rowData) => {
    console.log("Row Data yang diterima:", rowData);
    if (!rowData) {
      console.error("rowData tidak terdefinisi");
      return;
    }
    const masajabatan = rowData.masajabatan && rowData.masajabatan[0]; // Memastikan ada masajabatan yang pertama

    setFormData({
      uuid: rowData.uuid,
      nama: rowData.nama,
      ringkasan: rowData.ringkasan,
      mulai: masajabatan?.mulai || "", // Menggunakan optional chaining dan default value jika undefined
      selesai: masajabatan?.selesai || "", // Menggunakan optional chaining dan default value jika undefined
      fungsi: rowData.fungsi.map((f) => f.content).join(""),
      tugas: rowData.tugas.map((t) => t.content).join(""),
    });
    setCurrentData(rowData);

    console.log("Data Jabatan saat dibuka:", rowData.jabatans);
    setEditMode(true);
    setDialogVisible(true);
  };

  const openDialog = () => {
    resetForm();
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
  };

  const renderHeader = () => {
    return (
      <div className="table-header">
        <span className="p-input-icon-left search-container">
          <InputText
            type="search"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Pencarian"
            className="search-input"
            style={{ width: "300px" }}
          />
        </span>
        <Button
          label="Add Data"
          onClick={openDialog}
          className="add-data-button p-button-rounded p-button-success"
          icon="pi pi-plus"
        />
      </div>
    );
  };

  const header = renderHeader();

  const handlePageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <h1 className="demografi-header">Jabatan Kantor Desa</h1>
      <Toast ref={toast} />
      <DataTable
        value={dataList || []}
        paginator
        rows={rows} // Gunakan nilai rows dari state
        first={first}
        onPage={handlePageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        filters={filters}
        header={header}
        footer={`Total data: ${dataList ? dataList.length : 0} | Halaman ${
          Math.floor(first / rows) + 1
        } dari ${Math.ceil((dataList ? dataList.length : 0) / rows)}`}
        filterDisplay="menu"
      >
        <Column
          header="No"
          body={(rowData, options) => {
            const rowIndex = options.rowIndex % rows; // Reset rowIndex setiap halaman
            const nomorUrut = first + rowIndex + 1; // Hitung nomor urut berdasarkan halaman
            console.log("Row Index:", rowIndex, "Nomor Urut:", nomorUrut); // Log nomor urut pada setiap baris

            return nomorUrut;
          }}
          style={{ width: "5%", minWidth: "5%" }}
        />
        <Column field="nama" header="Nama Jabatan" />
        <Column
          header="Periode"
          body={(rowData) => {
            // Menampilkan periode berdasarkan data masaJabatan
            const masaJabatan = rowData.masaJabatan && rowData.masaJabatan[0];
            if (masaJabatan) {
              return `${masaJabatan.mulai} - ${masaJabatan.selesai}`;
            }
            return "-"; // Jika tidak ada data masaJabatan
          }}
        />
        <Column
          body={(rowData) => (
            <div
              className="edit-delete-buttons"
              style={{ display: "flex", gap: "0.5rem" }}
            >
              <Button
                icon="pi pi-pencil"
                className="edit-button coastal-button p-button-rounded"
                onClick={() => openEditDialog(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="delete-button coastal-button p-button-rounded"
                onClick={() => deleteData(rowData.uuid)}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header={isEditMode ? "Edit Jabatan" : "Add Jabatan"}
        visible={isDialogVisible}
        onHide={closeDialog}
        dismissableMask={true}
        modal={true}
        style={{ width: "70vw" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Card className="demografi-card" style={{ padding: "20px" }}>
              <h3 className="section-title">Informasi Jabatan</h3>
              <div className="form-group">
                <label htmlFor="nama">Nama Jabatan</label>
                <InputText
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div
                className="form-container"
                style={{ display: "flex", gap: "1rem" }}
              >
                <div className="form-group">
                  <label htmlFor="Tahun Mulai">Tahun Mulai</label>
                  <InputNumber
                    id="mulai"
                    name="mulai"
                    value={formData.mulai}
                    onValueChange={(e) => handleNChange(e.value, "mulai")}
                    className="input-field"
                    mode="decimal"
                    useGrouping={false}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Tahun Selesai">Tahun Selesai</label>
                  <InputNumber
                    id="selesai"
                    name="selesai"
                    value={formData.selesai}
                    onValueChange={(e) => handleNChange(e.value, "selesai")}
                    className="input-field"
                    mode="decimal"
                    useGrouping={false}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Ringkasan Tentang Jabatan</label>
                <ReactQuill
                  value={formData.ringkasan}
                  onChange={(value) => handleQuillChange(value, "ringkasan")}
                  className="quill-editor"
                />
              </div>
              <div className="form-group">
                <label>Fungsi</label>
                <ReactQuill
                  value={formData.fungsi}
                  onChange={(value) => handleQuillChange(value, "fungsi")}
                  className="quill-editor"
                />
              </div>

              <div className="form-group">
                <label>Tugas</label>
                <CKEditor
                  editor={DecoupledEditor}
                  data={formData.tugas}
                  onReady={(editor) => {
                    console.log("Editor is ready to use!", editor);
                    const toolbarContainer =
                      document.querySelector(".toolbar-container");
                    toolbarContainer.appendChild(
                      editor.ui.view.toolbar.element
                    );
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    console.log("Editor data changed:", data);
                    handleQuillChange(data, "tugas");
                  }}
                />

                <div className="toolbar-container" />
                <style jsx>
                  {`
                    .custom-dialog-content table {
                      margin-left: 20px; /* Mengatur margin kiri tabel */
                      border-collapse: collapse; /* Menghindari jarak antar sel */
                    }

                    .custom-dialog-content table td,
                    .custom-dialog-content table th {
                      padding: 10px; /* Menambahkan padding di dalam sel */
                      border: none; /* Menghilangkan border */
                    }
                  `}
                </style>
              </div>
              <Button
                type="submit"
                label={isEditMode ? "Simpan Data" : "Simpan Data"}
                disabled={isLoadingProcess}
                icon="pi pi-check"
                className="p-button-rounded p-button-success submit-button"
                style={{ width: "100%" }}
              />
            </Card>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default Jabatan;
