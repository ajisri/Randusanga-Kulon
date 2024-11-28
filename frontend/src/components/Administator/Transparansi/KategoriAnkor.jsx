import React, { useState, useEffect, useCallback, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Dialog } from "primereact/dialog";
import "./ProdukHukum.css"; // Custom CSS for styling

const KategoriAnkor = () => {
  const [formData, setFormData] = useState({
    uuid: "",
    name: "",
    ankorId: "",
  });
  const [currentKategoriAnkorId, setCurrentKategoriAnkorId] = useState("");
  const [ankorOptions, setAnkorOptions] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [currentKategoriAnkor, setCurrentKategoriAnkor] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [kategoriankorList, setKategoriankorList] = useState([]);
  const [subkategoriankorFormData, setSubkategoriAnkorFormData] = useState([
    {
      uuid: "",
      name: "",
      kategoriId: "",
      url: "",
    },
  ]);
  const [isSubkategoriAnkorDialogVisible, setSubkategoriAnkorDialogVisible] =
    useState(false);

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

  const {
    data: kategoriankorData,
    error,
    isLoading,
  } = useSWR(
    "https://randusanga-kulonbackend-production.up.railway.app/kategoriankor",
    fetcher
  );

  useEffect(() => {
    if (kategoriankorData) {
      setKategoriankorList(kategoriankorData);
    }
  }, [kategoriankorData]);

  const {
    data: ankorData,
    error: ankorError,
    isLoading: isAnkorLoading,
  } = useSWR(
    "https://randusanga-kulonbackend-production.up.railway.app/ankor",
    fetcher
  );

  useEffect(() => {
    if (ankorData?.ankor && Array.isArray(ankorData.ankor)) {
      setAnkorOptions(ankorData.ankor);
    } else {
      setAnkorOptions([]);
    }
  }, [ankorData]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
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
        <div className="add-data-container">
          <Button
            label="Add Data"
            onClick={openDialog}
            className="add-data-button p-button-rounded p-button-success"
            icon="pi pi-plus"
            style={{ backgroundColor: "#00796B", color: "#ffffff" }}
          />
        </div>
      </div>
    );
  };

  const header = renderHeader();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axiosJWT.patch(
          `https://randusanga-kulonbackend-production.up.railway.app/kategoriankor/${currentKategoriAnkor.uuid}`,
          { name: formData.name, ankorId: formData.ankorId },
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
        await axiosJWT.post(
          "https://randusanga-kulonbackend-production.up.railway.app/ckategoriankor",
          { name: formData.name, ankorId: formData.ankorId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data saved successfully!",
          life: 3000,
        });
      }
      await mutate(
        "https://randusanga-kulonbackend-production.up.railway.app/kategoriankor"
      );
      resetForm();
      setDialogVisible(false);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengirim form:", error);
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      console.error("Response Error:", error.response.data);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.msg || "Something went wrong!",
        life: 3000,
      });
    } else if (error.request) {
      console.error("Request Error:", error.request);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No response received from server!",
        life: 3000,
      });
    } else {
      console.error("Unknown Error:", error.message);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    }
  };

  const showNotification = (message, severity = "info") => {
    toast.current.show({
      severity: severity, // Jenis notifikasi (info, success, warn, error)
      summary: severity.charAt(0).toUpperCase() + severity.slice(1), // Mengubah huruf pertama menjadi kapital
      detail: message, // Pesan notifikasi yang akan ditampilkan
      life: 3000, // Durasi notifikasi dalam milidetik (5 detik)
    });
  };

  const resetForm = () => {
    setFormData({
      uuid: "",
      name: "",
      ankorId: "",
    });
    setEditMode(false);
    setCurrentKategoriAnkor(null);
  };

  const editkategoriankor = (kategoriankor) => {
    setFormData(kategoriankor);
    setCurrentKategoriAnkor(kategoriankor);
    setEditMode(true);
    setDialogVisible(true);
  };

  const deletekategoriankor = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axiosJWT.delete(
          `https://randusanga-kulonbackend-production.up.railway.app/kategoriankor/${id}`
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate(
          "https://randusanga-kulonbackend-production.up.railway.app/kategoriankor"
        );
      } catch (error) {
        handleError(error);
      }
    }
  };

  const fetchSubkategoriByKategoriId = async (kategoriankorId) => {
    try {
      const response = await axiosJWT.get(
        `https://randusanga-kulonbackend-production.up.railway.app/subkategoribykategori/${kategoriankorId}`
      );

      // Cek apakah data ada atau kosong
      if (Array.isArray(response.data) && response.data.length === 0) {
        showNotification(
          "Data subkategori ankor kosong untuk kategori ini.",
          "warning"
        );

        // Isi dengan data default jika kosong
        setSubkategoriAnkorFormData([
          {
            uuid: null,
            name: "",
            kategoriankorId,
            url: "",
          },
        ]);
        return; // Keluar dari fungsi jika data kosong
      }

      // Jika data tidak kosong, map data seperti biasa
      const data = response.data.map((subkategoriankor) => ({
        uuid: subkategoriankor.uuid || null, // Pastikan UUID dikaitkan
        name: subkategoriankor.name || "",
        kategoriankorId: subkategoriankor.kategoriankorId || kategoriankorId,
        url: subkategoriankor.url || "",
      }));

      setSubkategoriAnkorFormData(data); // Memperbarui state form
    } catch (error) {
      console.error("Error saat memfetch subkategori:", error);

      // Tangani error spesifik jika 404
      if (error.response && error.response.status === 404) {
        showNotification(
          "Data subkategori tidak ditemukan untuk kategori ini.",
          "warning"
        );

        // Tetap tambahkan data default jika 404
        setSubkategoriAnkorFormData([
          {
            uuid: null,
            name: "",
            kategoriankorId,
            url: "",
          },
        ]);
      } else if (error.response) {
        // Tangani error lain dari API
        handleError(error); // Fungsi handleError untuk log error dari API
      } else {
        // Tangani error jaringan atau lainnya
        showNotification("Terjadi kesalahan pada jaringan", "error");
      }
    }
  };

  const handleSubkategoriAnkorDialogOpen = (kategoriankorId) => {
    setCurrentKategoriAnkorId(kategoriankorId);
    fetchSubkategoriByKategoriId(kategoriankorId);
    setSubkategoriAnkorDialogVisible(true);
  };

  const addSubkategoriAnkorField = () => {
    setSubkategoriAnkorFormData([
      ...subkategoriankorFormData,
      {
        uuid: null,
        name: "",
        kategoriId: currentKategoriAnkorId,
        url: "",
      },
    ]);
  };

  const removeSubkategoriField = (index) => {
    const updatedFormData = [...subkategoriankorFormData];
    updatedFormData.splice(index, 1);
    setSubkategoriAnkorFormData(updatedFormData);
  };

  const handleSubkategoriChange = (index, event) => {
    const { name, value } = event.target;

    // Buat salinan data
    const updatedFormData = [...subkategoriankorFormData];

    updatedFormData[index] = {
      ...updatedFormData[index],
      [name]: value,
    };

    setSubkategoriAnkorFormData(updatedFormData);
  };

  const handlePageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  const handleSubkategoriAnkorSubmit = async (e) => {
    e.preventDefault();

    // Validasi input data: Pastikan data tidak kosong
    if (
      !Array.isArray(subkategoriankorFormData) ||
      subkategoriankorFormData.length === 0
    ) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Subkategori tidak boleh kosong!",
        life: 5000,
      });
      return;
    }

    // Debug: Cek data sebelum pengiriman
    console.log("Subkategori Form Data:", subkategoriankorFormData);

    // Format data yang akan dikirim ke backend
    const formattedSubkategoriAnkorData = subkategoriankorFormData.map(
      (item, index) => {
        const formattedItem = {
          uuid: item.uuid || undefined, // Jangan kirim null, biarkan undefined jika UUID kosong
          name: item.name || "", // Default ke string kosong jika nama tidak ada
          url: item.url || "", // Default ke string kosong jika URL tidak ada
          kategoriankorId: currentKategoriAnkorId, // Pastikan kategoriankorId terisi
        };

        // Debug: Cek setiap item yang diformat
        console.log(
          `Formatted Subkategori Ankor Item ${index}:`,
          formattedItem
        );

        return formattedItem;
      }
    );

    // Debug: Cek data yang diformat sebelum pengiriman
    console.log(
      "Formatted Subkategori Ankor Data:",
      formattedSubkategoriAnkorData
    );

    // Pastikan bahwa subkategoriAnkorData tidak kosong
    if (formattedSubkategoriAnkorData.length === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          "Subkategori data tidak valid, pastikan ada minimal satu subkategori!",
        life: 5000,
      });
      return;
    }

    try {
      // Kirim data ke backend dengan nama field 'subkategoriAnkorData'
      const response = await axiosJWT.post(
        "https://randusanga-kulonbackend-production.up.railway.app/csubkategoriankor",
        { subkategoriAnkorData: formattedSubkategoriAnkorData } // Pastikan menggunakan subkategoriAnkorData
      );

      // Debug: Cek response dari API
      console.log("API Response:", response);

      // Tampilkan notifikasi sukses
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Subkategori berhasil disimpan!",
        life: 3000,
      });

      // Refresh data dan reset state
      await mutate(
        "https://randusanga-kulonbackend-production.up.railway.app/subkategori"
      );

      // Tutup dialog
      setSubkategoriAnkorDialogVisible(false);
    } catch (error) {
      // Debug: Tampilkan error untuk mendiagnosis masalah
      console.error("Error during submission:", error);

      // Tangani error secara spesifik
      handleError(error);
    }
  };

  if (isLoading || isAnkorLoading) return <p>Loading...</p>;
  if (error || ankorError) return <p>{error.message}</p>;

  return (
    <div>
      <h1 className="demografi-header">Kategori Parameter Ankor</h1>
      <Toast ref={toast} />
      <DataTable
        value={kategoriankorList}
        paginator
        rows={rows}
        first={first}
        onPage={handlePageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        filters={filters}
        globalFilterFields={["name"]}
        header={header}
        footer={`Total data: ${kategoriankorList.length}`}
      >
        <Column
          header="No"
          body={(rowData, options) => {
            const rowIndex = options.rowIndex % rows;
            const nomorUrut = first + rowIndex + 1;
            return nomorUrut;
          }}
          style={{ width: "5%", minWidth: "5%" }}
        />
        <Column
          field="name"
          header="Nama"
          style={{ width: "50%", minWidth: "15%" }}
        />
        <Column
          field="ankorId"
          header="Parameter Ankor"
          style={{ width: "40%", minWidth: "20%" }}
          body={(rowData) => {
            const ankor = ankorOptions.find((kw) => kw.id === rowData.ankorId);
            return ankor ? `${ankor.name}` : "N/A";
          }}
        />
        <Column
          header="Actions"
          style={{ width: "5%", minWidth: "5%" }}
          body={(rowData) => (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                icon="pi pi-pw pi-plus"
                label="Subkategori"
                onClick={() => {
                  handleSubkategoriAnkorDialogOpen(rowData.uuid);
                  setSubkategoriAnkorFormData([
                    { name: "", url: "", kategoriankorId: rowData.uuid },
                  ]);
                  setSubkategoriAnkorDialogVisible(true);
                }}
                className="add-subkategori-button coastal-button p-button-rounded"
              />
              <Button
                icon="pi pi-pencil"
                onClick={() => editkategoriankor(rowData)}
                className="edit-button coastal-button p-button-rounded"
                tooltip="Edit"
                tooltipOptions={{ position: "bottom" }}
                style={{
                  backgroundColor: "#4DB6AC",
                  border: "none",
                  color: "white",
                }}
              />
              <Button
                icon="pi pi-trash"
                onClick={() => deletekategoriankor(rowData.uuid)}
                className="delete-button coastal-button p-button-rounded"
                tooltip="Delete"
                tooltipOptions={{ position: "bottom" }}
                style={{
                  backgroundColor: "#009688",
                  border: "none",
                  color: "white",
                }}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header={isEditMode ? "Edit Data" : "Add Data"}
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
            height: "100%",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Card
              className="demografi-card"
              style={{
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                padding: "20px",
              }}
            >
              <h3 className="section-title" style={{ color: "#00796B" }}>
                Informasi Kategori Parameter Ankor
              </h3>

              <div className="form-group">
                <label htmlFor="name">
                  Kategori Parameter Ankor <span className="required">*</span>
                </label>
                <InputText
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="ankorId">Pilih Parameter Ankor:</label>
                <Dropdown
                  id="ankorId"
                  name="ankorId"
                  optionLabel={(option) => `${option.name})`}
                  optionValue="id"
                  value={formData.ankorId}
                  options={ankorOptions}
                  onChange={handleChange}
                  placeholder="Pilih Parameter Ankor"
                  required
                  className="input-field"
                />
              </div>
              <div className="button-sub">
                <Button
                  type="submit"
                  label={isEditMode ? "Update" : "Save"}
                  className="coastal-button submit-button p-button-rounded"
                  style={{ marginTop: "20px" }}
                />
              </div>
            </Card>
          </form>
        </div>
      </Dialog>
      <Dialog
        header="Tambah Subkategori Ankor"
        visible={isSubkategoriAnkorDialogVisible}
        onHide={() => setSubkategoriAnkorDialogVisible(false)}
        dismissableMask={true}
        modal={true}
        maximizable
        style={{ width: "70vw" }}
      >
        <form onSubmit={handleSubkategoriAnkorSubmit}>
          {subkategoriankorFormData.map((item, index) => (
            <div
              key={index}
              className="subkategori-budget-field-container"
              style={{
                marginBottom: "30px", // Jarak antar form dinamis
                borderBottom: "2px solid #ddd", // Garis pembatas
                paddingBottom: "20px", // Jarak antara isi form dan garis
              }}
            >
              {/* Field Subkategori Name */}
              <div className="subkategori-field">
                <label htmlFor={`subkategoriankorName_${index}`}>
                  Subkategori Ankor:
                </label>
                <InputText
                  id={`subkategoriankorName_${index}`}
                  name="name"
                  value={item.name}
                  onChange={(e) => handleSubkategoriChange(index, e)}
                  required
                  className="input-field"
                />
              </div>

              {/* Field URL */}
              <div className="url-field">
                <label htmlFor={`subkategoriankorUrl_${index}`}>URL:</label>
                <InputText
                  id={`subkategoriankorUrl_${index}`}
                  name="url"
                  value={item.url}
                  onChange={(e) => handleSubkategoriChange(index, e)}
                  required
                  placeholder="https://example.com"
                  pattern="https?://.+"
                  title="Masukkan URL yang valid (contoh: https://example.com)"
                  className="input-field"
                />
              </div>

              {/* Hapus Field */}
              <div
                className="remove-button-container"
                style={{ marginTop: "10px" }}
              >
                <Button
                  type="button"
                  label="Hapus"
                  className="remove-button"
                  disabled={subkategoriankorFormData.length === 1}
                  onClick={() => removeSubkategoriField(index)}
                />
              </div>
            </div>
          ))}

          {/* Tambah Field */}
          <div className="add-jabatan-container" style={{ marginTop: "20px" }}>
            <Button
              type="button"
              label="Tambah"
              className="add-button coastal-button p-button-rounded"
              raised
              rounded
              icon="pi pi-plus"
              onClick={addSubkategoriAnkorField}
            />
          </div>

          {/* Simpan Button */}
          <div className="button-sub" style={{ marginTop: "20px" }}>
            <Button
              type="submit"
              label="Simpan"
              className="coastal-button submit-button p-button-rounded"
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default KategoriAnkor;
