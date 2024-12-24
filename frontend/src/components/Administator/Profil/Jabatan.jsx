import React, { useState, useEffect, useCallback, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
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
    mulai: "",
    selesai: "",
  });

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
    "https://randusanga-kulonbackend-production.up.railway.app/lembaga",
    fetcher
  );

  useEffect(() => {
    if (data?.lembaga && data.lembaga.length > 0) {
      setDataList(data.lembaga);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.lembaga && data.lembaga.length > 0) {
      setDataList(data.lembaga);
      const lembagaData = data.lembaga[0]; // Ambil lembaga pertama jika ada
      setFormData({
        uuid: lembagaData.uuid,
        nama: lembagaData.nama,
        singkatan: lembagaData.singkatan,
        dasar_hukum: lembagaData.dasar_hukum,
        alamat_kantor: lembagaData.alamat_kantor,
        file_url: lembagaData.file_url,
        profil:
          lembagaData.profil_lembaga?.map((p) => p.content).join("") || "",
        visimisi: lembagaData.visi_misi?.map((v) => v.content).join("") || "",
        tugaspokok:
          lembagaData.tugas_pokok?.map((t) => t.content).join("") || "",
      });
    } else if (data && (!data.lembaga || data.lembaga.length === 0)) {
      console.error("Data lembaga tidak tersedia atau kosong");
    }
  }, [data]);

  const {
    data: demografiData,
    error: demografiError,
    isLoading: demografiLoading,
  } = useSWR(
    "https://randusanga-kulonbackend-production.up.railway.app/demografi", // Endpoint API demografi
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

  const handleQuillChange = useCallback((value, field) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Buat data payload untuk dikirim
    const data = new FormData();
    data.append("nama", formData.nama);
    data.append("singkatan", formData.singkatan);
    data.append("dasar_hukum", formData.dasar_hukum);
    data.append("alamat_kantor", formData.alamat_kantor);

    if (formData.file_url) {
      data.append("file", formData.file_url); // Upload file
    }

    data.append("profil", formData.profil);
    data.append("visimisi", formData.visimisi);
    data.append("tugaspokok", formData.tugaspokok);

    try {
      if (isEditMode) {
        console.log("currentData.uuid:", currentData.uuid);
        await axiosJWT.put(
          `https://randusanga-kulonbackend-production.up.railway.app/ulembaga/${currentData.uuid}`,
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
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
        await axiosJWT.post(
          "https://randusanga-kulonbackend-production.up.railway.app/clembaga",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data created successfully!",
          life: 3000,
        });
      }
      await mutate(
        "https://randusanga-kulonbackend-production.up.railway.app/lembaga"
      );
      resetForm();
      setDialogVisible(false);
    } catch (error) {
      handleError(error);
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
      singkatan: "",
      dasar_hukum: "",
      alamat_kantor: "",
      file_url: null,
      profil: "",
      visimisi: "",
      tugaspokok: "",
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
        await axiosJWT.delete(
          `https://randusanga-kulonbackend-production.up.railway.app/lembaga/${uuid}`
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate(
          "https://randusanga-kulonbackend-production.up.railway.app/lembaga"
        );
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
    setFormData({
      uuid: rowData.uuid,
      nama: rowData.nama,
      singkatan: rowData.singkatan,
      dasar_hukum: rowData.dasar_hukum,
      alamat_kantor: rowData.alamat_kantor,
      file_url: rowData.file_url,
      profil: rowData.profil_lembaga.map((p) => p.content).join(""),
      visimisi: rowData.visi_misi.map((v) => v.content).join(""),
      tugaspokok: rowData.tugas_pokok.map((t) => t.content).join(""),
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
        <Column field="singkatan" header="Periode" />
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
              <div className="form-group">
                <label>Ringkasan Tentang Jabatan</label>
                <ReactQuill
                  value={formData.profil}
                  onChange={(value) => handleQuillChange(value, "profil")}
                  className="quill-editor"
                />
              </div>
              <div className="form-group">
                <label>Fungsi</label>
                <ReactQuill
                  value={formData.visimisi}
                  onChange={(value) => handleQuillChange(value, "visimisi")}
                  className="quill-editor"
                />
              </div>

              <div className="form-group">
                <label>Tugas Pokok</label>
                <CKEditor
                  editor={DecoupledEditor}
                  data={formData.tugaspokok}
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
                    handleQuillChange(data, "tugaspokok");
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
              <h3 className="section-title">Tugas Pokok</h3>
              <Button
                type="submit"
                label={isEditMode ? "Simpan Data" : "Simpan Data"}
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
