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
import { Dropdown } from "primereact/dropdown";

import "./Kategori.css"; // Custom CSS for styling

const Kategori = () => {
  const [formData, setFormData] = useState({
    uuid: "",
    name: "",
    keuanganId: "",
  });
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  const [currentKategoriId, setCurrentKategoriId] = useState("");
  const [keuanganOptions, setKeuanganOptions] = useState([]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [currentKategori, setCurrentKategori] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [kategoriList, setKategoriList] = useState([]);
  const [subkategoriFormData, setSubkategoriFormData] = useState([
    {
      uuid: "",
      name: "",
      kategoriId: "",
      budget: 0,
      realization: 0,
      remaining: 0,
    },
  ]);
  const [isSubkategoriDialogVisible, setSubkategoriDialogVisible] =
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
    data: kategoriData,
    error,
    isLoading,
  } = useSWR("https://randusanga-kulon.osc-fr1.scalingo.io/kategori", fetcher);

  useEffect(() => {
    if (kategoriData) {
      setKategoriList(kategoriData);
    }
  }, [kategoriData]);

  // Fetch keuangan options
  const {
    data: keuanganData,
    error: keuanganError,
    isLoading: isKeuanganLoading,
  } = useSWR("https://randusanga-kulon.osc-fr1.scalingo.io/keuangan", fetcher);

  useEffect(() => {
    if (keuanganData) {
      setKeuanganOptions(keuanganData); // Simpan keuanganData untuk dropdown
    }
  }, [keuanganData]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
    };
    try {
      setIsLoadingProcess(true);
      if (isEditMode) {
        await axiosJWT.patch(
          `https://randusanga-kulon.osc-fr1.scalingo.io/kategori/${currentKategori.uuid}`,
          dataToSend
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data updated successfully!",
          life: 3000,
        });
      } else {
        await axiosJWT.post(
          "https://randusanga-kulon.osc-fr1.scalingo.io/ckategori",
          dataToSend
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data saved successfully!",
          life: 3000,
        });
      }

      await mutate("https://randusanga-kulon.osc-fr1.scalingo.io/kategori");
      resetForm();
      setDialogVisible(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      handleError(error);
    } finally {
      setIsLoadingProcess(false); // Nonaktifkan loading setelah proses selesai
    }
  };

  const resetForm = () => {
    setFormData({
      uuid: "",
      name: "",
      keuanganId: "",
    });
    setEditMode(false);
    setCurrentKategori(null);
  };

  const editKategori = (kategori) => {
    setFormData(kategori);
    setCurrentKategori(kategori);
    setEditMode(true);
    setDialogVisible(true);
  };

  const deleteKategori = async (uuid) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axiosJWT.delete(
          `https://randusanga-kulon.osc-fr1.scalingo.io/kategori/${uuid}`
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate("https://randusanga-kulon.osc-fr1.scalingo.io/kategori");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleSubkategoriDialogOpen = (kategoriId) => {
    setCurrentKategoriId(kategoriId);
    fetchSubkategoriByKategoriId(kategoriId);
    setSubkategoriDialogVisible(true);
  };

  const handleSubkategoriSubmit = async (e) => {
    e.preventDefault();

    // Validasi input data
    if (
      !Array.isArray(subkategoriFormData) ||
      subkategoriFormData.length === 0
    ) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Subkategori harus berupa array dan tidak boleh kosong!",
        life: 5000,
      });
      return;
    }
    // Format data yang akan dikirim
    const formattedSubkategoriData = subkategoriFormData.map((item, index) => {
      const budgetItems = [
        {
          budget: item.budget || 0,
          realization: item.realization || 0,
          remaining: item.remaining || 0,
        },
      ];

      const totalBudget = budgetItems.reduce(
        (sum, budgetItem) => sum + parseFloat(budgetItem.budget || 0),
        0
      );
      const totalRealization = budgetItems.reduce(
        (sum, budgetItem) => sum + parseFloat(budgetItem.realization || 0),
        0
      );
      const remaining = budgetItems.reduce(
        (sum, budgetItem) => sum + parseFloat(budgetItem.remaining || 0),
        0
      );
      return {
        uuid: item.uuid || null,
        kategoriId: item.kategoriId,
        name: item.name,
        budgetItems: budgetItems,
        totalBudget: totalBudget,
        totalRealization: totalRealization,
        remaining: remaining,
      };
    });

    try {
      setIsLoadingProcess(true);
      // Kirim data ke backend
      await axiosJWT.post(
        "https://randusanga-kulon.osc-fr1.scalingo.io/csubkategori",
        {
          subkategoriData: formattedSubkategoriData,
        }
      );

      // Tampilkan notifikasi sukses
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Subkategori berhasil disimpan!",
        life: 3000,
      });

      // Mutasi data dan refresh state terkait
      await mutate("https://randusanga-kulon.osc-fr1.scalingo.io/subkategori");

      // Tutup dialog setelah sukses
      setSubkategoriDialogVisible(false);
    } catch (error) {
      // Tangani error dengan lebih informatif
      console.error("DEBUG: Error saat mengirim data:", error);
      handleError(error);
    } finally {
      setIsLoadingProcess(false); // Nonaktifkan loading setelah proses selesai
    }
  };

  const addSubkategoriField = () => {
    setSubkategoriFormData([
      ...subkategoriFormData,
      {
        uuid: null,
        name: "",
        kategoriId: currentKategoriId,
        budget: 0,
        realization: 0,
        remaining: 0,
      },
    ]);
  };

  const removeSubkategoriField = (index) => {
    const updatedFormData = [...subkategoriFormData];
    updatedFormData.splice(index, 1);
    setSubkategoriFormData(updatedFormData);
  };

  const handleSubkategoriChange = (index, event) => {
    const { name, value } = event.target;

    // Buat salinan data
    const updatedFormData = [...subkategoriFormData];

    // Tentukan apakah field yang diubah adalah angka atau teks
    if (name === "budget" || name === "realization") {
      // Pastikan nilai hanya angka untuk 'budget' dan 'realization'
      const numericValue = isNaN(value) ? 0 : parseFloat(value);
      updatedFormData[index] = {
        ...updatedFormData[index],
        [name]: numericValue,
      };

      // Kalkulasi otomatis 'remaining'
      const updatedItem = updatedFormData[index];
      if (updatedItem.budget && updatedItem.realization !== undefined) {
        updatedItem.remaining = updatedItem.budget - updatedItem.realization;
      }
    } else {
      // Izinkan teks untuk field lainnya (misalnya 'name')
      updatedFormData[index] = {
        ...updatedFormData[index],
        [name]: value,
      };
    }

    // Perbarui state
    setSubkategoriFormData(updatedFormData);
  };

  const handlePageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  const fetchSubkategoriByKategoriId = async (kategoriId) => {
    try {
      const response = await axiosJWT.get(
        `https://randusanga-kulon.osc-fr1.scalingo.io/subkategoribykategori/${kategoriId}`
      );

      // Cek apakah data ada atau kosong
      if (Array.isArray(response.data) && response.data.length === 0) {
        showNotification(
          "Data subkategori kosong untuk kategori ini.",
          "warning"
        );

        // Isi dengan data default jika kosong
        setSubkategoriFormData([
          {
            uuid: null,
            name: "",
            kategoriId,
            budget: 0,
            realization: 0,
            remaining: 0,
          },
        ]);
        return; // Keluar dari fungsi jika data kosong
      }

      // Jika data tidak kosong, map data seperti biasa
      const data = response.data.map((subkategori) => ({
        uuid: subkategori.uuid || null, // Pastikan UUID dikaitkan
        name: subkategori.name || "",
        kategoriId: subkategori.kategoriId || kategoriId,
        budget: subkategori.totalBudget || 0, // Mapping ke totalBudget
        realization: subkategori.totalRealization || 0, // Mapping ke totalRealization
        remaining: subkategori.remaining || 0, // Mapping ke remaining
      }));

      setSubkategoriFormData(data); // Memperbarui state form
    } catch (error) {
      console.error("Error saat memfetch subkategori:", error);

      // Tangani error spesifik jika 404
      if (error.response && error.response.status === 404) {
        showNotification(
          "Data subkategori tidak ditemukan untuk kategori ini.",
          "warning"
        );

        // Tetap tambahkan data default jika 404
        setSubkategoriFormData([
          {
            uuid: null,
            name: "",
            kategoriId,
            budget: 0,
            realization: 0,
            remaining: 0,
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

  const formatRupiah = (angka) => {
    return isNaN(angka) || angka === ""
      ? ""
      : new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(angka);
  };

  const showNotification = (message, severity = "info") => {
    toast.current.show({
      severity: severity, // Jenis notifikasi (info, success, warn, error)
      summary: severity.charAt(0).toUpperCase() + severity.slice(1), // Mengubah huruf pertama menjadi kapital
      detail: message, // Pesan notifikasi yang akan ditampilkan
      life: 3000, // Durasi notifikasi dalam milidetik (5 detik)
    });
  };

  const handleError = (error) => {
    if (error.response) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message || "expected error occurred",
        life: 5000,
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "An unexpected error occurred",
        life: 5000,
      });
    }
  };

  if (isLoading || isKeuanganLoading) return <p>Loading...</p>;
  if (error || keuanganError) return <p>Error fetching data</p>;

  return (
    <div>
      <h1 className="kategori-header">Sub Kategori</h1>
      <Toast ref={toast} />
      <DataTable
        value={kategoriList}
        paginator
        rows={rows}
        first={first}
        onPage={handlePageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        filters={filters}
        globalFilterFields={["name"]}
        header={
          <div className="table-header">
            <InputText
              type="search"
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Pencarian"
              className="search-input"
              style={{ width: "300px" }}
            />
            <Button
              label="Add Data"
              onClick={openDialog}
              className="add-data-button p-button-rounded p-button-success"
              icon="pi pi-plus"
              style={{ backgroundColor: "#00796B", color: "#ffffff" }}
            />
          </div>
        }
        footer={`Total data: ${kategoriList.length}`}
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
          header="Name"
          style={{ width: "40%", minWidth: "30%" }}
        />
        <Column
          field="keuanganId"
          header="Keuangan"
          style={{ width: "20%", minWidth: "10%" }}
          body={(rowData) => {
            const keuangan = keuanganOptions.find(
              (kw) => kw.uuid === rowData.keuanganId
            );
            return keuangan ? keuangan.name : "N/A";
          }}
        />
        <Column
          field="number"
          header="Number"
          style={{ width: "10%", minWidth: "10%" }}
        />
        <Column
          header="Actions"
          style={{ width: "25%", minWidth: "15%" }}
          body={(rowData) => (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                icon="pi pi-pw pi-plus"
                label="Subkategori"
                onClick={() => {
                  handleSubkategoriDialogOpen(rowData.uuid);
                  setSubkategoriFormData([
                    { name: "", kategoriId: rowData.uuid },
                  ]);
                  setSubkategoriDialogVisible(true);
                }}
                className="add-subkategori-button coastal-button p-button-rounded"
              />
              <Button
                icon="pi pi-pencil"
                onClick={() => editKategori(rowData)}
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
                onClick={() => deleteKategori(rowData.uuid)}
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
        header={isEditMode ? "Edit Kategori Data" : "Add Kategori Data"}
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
            <Card className="demografi-card">
              <div className="field">
                <label htmlFor="name">Nama:</label>
                <InputText
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div className="field">
                <label htmlFor="keuanganId">Keuangan:</label>
                <Dropdown
                  id="keuanganId"
                  name="keuanganId"
                  optionLabel="name"
                  optionValue="uuid"
                  value={formData.keuanganId}
                  options={keuanganData}
                  onChange={handleChange}
                  placeholder="Select Keuangan"
                  required
                  className="input-field"
                />
              </div>
              <div className="button-sub">
                <Button
                  type="submit"
                  label={isEditMode ? "Simpan Data" : "Simpan Data"}
                  disabled={isLoadingProcess}
                  className="coastal-button submit-button p-button-rounded"
                  style={{ marginTop: "20px" }}
                />
              </div>
            </Card>
          </form>
        </div>
      </Dialog>
      <Dialog
        header="Tambah Subkategori dan Budget"
        visible={isSubkategoriDialogVisible}
        onHide={() => setSubkategoriDialogVisible(false)}
        dismissableMask={true}
        modal={true}
        maximizable
        style={{ width: "70vw" }}
      >
        <form onSubmit={handleSubkategoriSubmit}>
          {subkategoriFormData.map((item, index) => (
            <div
              key={index}
              className="subkategori-budget-field-container"
              style={{
                marginBottom: "30px", // Jarak antar form dinamis
                borderBottom: "2px solid #ddd", // Garis pembatas
                paddingBottom: "20px", // Jarak antara isi form dan garis
              }}
            >
              {/* Subkategori Field */}
              <div className="subkategori-field">
                <label htmlFor={`subkategoriName_${index}`}>Subkategori:</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button
                    type="button"
                    label="Hapus"
                    className="remove-button"
                    disabled={subkategoriFormData.length === 1}
                    style={{ alignItems: "center" }}
                    onClick={() => removeSubkategoriField(index)}
                  />
                  <InputText
                    id={`subkategoriName_${index}`}
                    name="name"
                    value={item.name}
                    onChange={(e) => handleSubkategoriChange(index, e)}
                    required
                    className="input-field"
                  />
                </div>
              </div>
              {/* Budgeting Fields */}
              <div
                className="budgeting-fields"
                style={{ display: "flex", gap: "20px" }}
              >
                <div className="field" style={{ flex: 1 }}>
                  <label htmlFor={`budget_${index}`}>Anggaran:</label>
                  <InputText
                    id={`budget_${index}`}
                    name="budget"
                    value={item.budget}
                    onChange={(e) => handleSubkategoriChange(index, e)}
                    required
                    style={{ width: "100%" }}
                    className="input-field"
                  />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label htmlFor={`realization_${index}`}>Realisasi:</label>
                  <InputText
                    id={`realization_${index}`}
                    name="realization"
                    value={item.realization}
                    onChange={(e) => handleSubkategoriChange(index, e)}
                    required
                    style={{ width: "100%" }}
                    className="input-field"
                  />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label htmlFor={`remaining_${index}`}>Sisa:</label>
                  <InputText
                    id={`remaining_${index}`}
                    name="remaining"
                    value={item.remaining}
                    readOnly
                    style={{ width: "100%" }}
                    className="input-field"
                  />
                  <div className="formatted-remaining">
                    {formatRupiah(item.remaining)}{" "}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Button */}
          <div className="add-jabatan-container">
            <Button
              type="button"
              label="Tambah"
              className="delete-button coastal-button p-button-rounded"
              raised
              rounded
              icon="pi pi-plus"
              onClick={addSubkategoriField}
            />
          </div>

          <div className="button-sub">
            <Button
              type="submit"
              label="Simpan"
              disabled={isLoadingProcess}
              className="coastal-button submit-button p-button-rounded"
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Kategori;
