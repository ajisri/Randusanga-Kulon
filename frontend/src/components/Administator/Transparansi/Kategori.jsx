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
import { ConfirmDialog } from "primereact/confirmdialog";

import "./Kategori.css"; // Custom CSS for styling

const Kategori = () => {
  const [formData, setFormData] = useState({
    uuid: "",
    name: "",
    keuanganId: "",
  });

  const [budgetingFormData, setBudgetingFormData] = useState([
    { uuid: "", budget: "", realization: "", remaining: "", subkategoriId: "" },
  ]);
  const [currentSubkategoriId, setCurrentSubkategoriId] = useState("");
  const [isBudgetingDialogVisible, setBudgetingDialogVisible] = useState(false);
  const [isConfirmVisible, setConfirmVisible] = useState(false);
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
      budgetItems: [{ budget: 0, realization: 0, remaining: 0 }],
      kategoriId: "",
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
  } = useSWR(
    "https://randusanga-kulonbackend-production.up.railway.app/kategori",
    fetcher
  );

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
  } = useSWR(
    "https://randusanga-kulonbackend-production.up.railway.app/keuangan",
    fetcher
  );

  useEffect(() => {
    if (keuanganData) {
      setKeuanganOptions(keuanganData); // Simpan keuanganData untuk dropdown
    }
  }, [keuanganData]);

  const fetchSubkategoriByKategoriId = async (kategoriId) => {
    try {
      const response = await axiosJWT.get(
        `https://randusanga-kulonbackend-production.up.railway.app/subkategoribykategori/${kategoriId}`
      );

      const data =
        response.data.length > 0
          ? response.data.map((subkategori) => ({
              uuid: subkategori.uuid || "",
              name: subkategori.name || "",
              kategoriId: kategoriId,
              budgetItems: subkategori.budgetItems.length
                ? subkategori.budgetItems.map((item) => ({
                    uuid: item.uuid || "",
                    budget: item.budget || 0,
                    realization: item.realization || 0,
                    remaining: item.remaining || 0,
                  }))
                : [{ budget: 0, realization: 0, remaining: 0 }],
            }))
          : [
              {
                uuid: "",
                name: "",
                budgetItems: [{ budget: 0, realization: 0, remaining: 0 }],
                kategoriId,
              },
            ];

      setSubkategoriFormData(data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubkategoriDialogOpen = (kategoriId) => {
    setCurrentKategoriId(kategoriId);
    fetchSubkategoriByKategoriId(kategoriId);
    setSubkategoriDialogVisible(true);
  };

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
      if (isEditMode) {
        await axiosJWT.patch(
          `https://randusanga-kulonbackend-production.up.railway.app/kategori/${currentKategori.uuid}`,
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
          "https://randusanga-kulonbackend-production.up.railway.app/ckategori",
          dataToSend
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data saved successfully!",
          life: 3000,
        });
      }

      await mutate(
        "https://randusanga-kulonbackend-production.up.railway.app/kategori"
      );
      resetForm();
      setDialogVisible(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.response.data.message || "An unexpected error occurred",
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

  const handleSubkategoriSubmit = async (e) => {
    e.preventDefault();

    // Validasi data form
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

    // Format data sebelum dikirim
    const formattedSubkategoriData = subkategoriFormData.map((item) => {
      const budgetItems = item.budgetItems || [];

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

    // Kirim data ke backend
    try {
      await axiosJWT.post(
        "https://randusanga-kulonbackend-production.up.railway.app/csubkategori",
        { subkategoriData: formattedSubkategoriData }
      );

      // Tampilkan notifikasi sukses
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Subkategori berhasil disimpan!",
        life: 3000,
      });

      // Refresh data setelah submit berhasil
      await mutate(
        "https://randusanga-kulonbackend-production.up.railway.app/subkategori"
      );

      // Tutup dialog setelah data berhasil disimpan
      setSubkategoriDialogVisible(false);
    } catch (error) {
      console.error("Error saat mengirim data:", error);
      handleError(error);
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
          `https://randusanga-kulonbackend-production.up.railway.app/kategori/${uuid}`
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate(
          "https://randusanga-kulonbackend-production.up.railway.app/kategori"
        );
      } catch (error) {
        handleError(error);
      }
    }
  };

  const addSubkategoriField = () => {
    setSubkategoriFormData((prev) => [
      ...prev,
      { name: "", kategoriId: currentKategoriId },
    ]);
  };

  const removeSubkategoriField = (index) => {
    const newFormData = subkategoriFormData.filter((_, i) => i !== index);
    setSubkategoriFormData(newFormData);
  };

  // const handleSubkategoriChange = (index, e) => {
  //   const { name, value } = e.target;
  //   const newFormData = [...subkategoriFormData];
  //   newFormData[index][name] = value;
  //   setSubkategoriFormData(newFormData);
  // };

  const handlePageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  const fetchBudgetBySubkategori = async (subkategoriId) => {
    try {
      const response = await axiosJWT.get(
        `https://randusanga-kulonbackend-production.up.railway.app/budgetbysubkategori/${subkategoriId}`
      );
      const data =
        response.data.length > 0
          ? response.data.map((budget) => ({
              budget: budget.budget || "",
              realization: budget.realization || "",
              remaining: budget.remaining || "",
              subkategoriId: subkategoriId,
            }))
          : [{ budget: "", realization: "", remaining: "", subkategoriId }]; // Tambahkan satu form kosong jika data kosong
      setBudgetingFormData(data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleBudgetDialogOpen = (subkategoriId) => {
    setCurrentSubkategoriId(subkategoriId);
    fetchBudgetBySubkategori(subkategoriId);
    setBudgetingDialogVisible(true);
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();

    // Memastikan bahwa budgetingFormData adalah array dan tidak kosong
    if (!Array.isArray(budgetingFormData) || budgetingFormData.length === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Data budgeting harus berupa array dan tidak boleh kosong!",
        life: 5000,
      });
      return;
    }

    console.log("Data budgeting yang dikirim ke server:", budgetingFormData); // Logging data yang akan dikirim

    try {
      // Mengirimkan budgetingFormData sebagai array ke server
      const response = await axiosJWT.post(
        "https://randusanga-kulonbackend-production.up.railway.app/cbudget-item",
        {
          budgetItemsData: budgetingFormData,
        }
      );

      console.log("Response dari server:", response.data); // Logging response dari server

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Data budgeting berhasil disimpan!",
        life: 3000,
      });

      // Update data budgeting setelah berhasil disimpan
      await mutate(
        "https://randusanga-kulonbackend-production.up.railway.app/budget-item"
      );
      setBudgetingDialogVisible(false); // Tutup dialog setelah penyimpanan berhasil
    } catch (error) {
      console.error("Error saat mengirim data:", error); // Logging error
      handleError(error);
    }
  };

  const confirmAddBudgeting = () => {
    setBudgetingDialogVisible(true); // Menampilkan dialog budgeting jika konfirmasi "Ya" dipilih
    setConfirmVisible(false);
  };

  const addBudgetingField = () => {
    setBudgetingFormData((prev) => [
      ...prev,
      {
        budget: 0,
        realization: 0,
        remaining: 0,
        subkategoriId: currentSubkategoriId,
      },
    ]);
  };

  const removeBudgetingField = (index) => {
    const newFormData = budgetingFormData.filter((_, i) => i !== index);
    setBudgetingFormData(newFormData);
  };

  const handleBudgetingChange = (index, field, value) => {
    // Salin data dari state
    const updatedFormData = [...budgetingFormData];

    // Validasi angka hanya pada budget dan realization
    if (field === "budget" || field === "realization") {
      const parsedValue = value === "" ? "" : parseFloat(value); // Pastikan nilai angka atau kosong
      if (isNaN(parsedValue) && value !== "") return; // Abaikan jika bukan angka valid
      updatedFormData[index][field] = parsedValue; // Perbarui nilai field
    } else {
      updatedFormData[index][field] = value; // Update field lain seperti name
    }

    // Hitung kembali nilai remaining
    updatedFormData[index].remaining = calculateRemaining(
      updatedFormData[index].budget || 0,
      updatedFormData[index].realization || 0
    );

    // Simpan ke state
    setBudgetingFormData(updatedFormData);
  };

  const calculateRemaining = (budget, realization) => {
    const validBudget = isNaN(budget) ? 0 : budget;
    const validRealization = isNaN(realization) ? 0 : realization;
    return validBudget - validRealization;
  };

  const formatRupiah = (angka) => {
    return isNaN(angka) || angka === ""
      ? ""
      : new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
        }).format(angka);
  };

  if (isLoading || isKeuanganLoading) return <p>Loading...</p>;
  if (error || keuanganError) return <p>Error fetching data</p>;

  return (
    <div>
      <h1 className="kategori-header">Kategori</h1>
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
          style={{ width: "30%", minWidth: "30%" }}
        />
        <Column
          field="keuanganId"
          header="Keuangan"
          style={{ width: "10%", minWidth: "10%" }}
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
                label="Add Budgeting"
                onClick={() => {
                  handleBudgetDialogOpen(rowData.uuid);
                  setBudgetingFormData([
                    {
                      budget: "",
                      realization: "",
                      remaining: "",
                      subkategoriId: rowData.uuid,
                    },
                  ]);
                  setBudgetingDialogVisible(true);
                }}
                className="add-budgeting-button p-button-rounded p-button-warning"
                icon="pi pi-wallet"
                style={{ backgroundColor: "#FFA726", color: "#ffffff" }}
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
      <ConfirmDialog
        visible={isConfirmVisible}
        onHide={() => setConfirmVisible(false)}
        message="Apakah Anda yakin ingin membuka dialog budgeting?"
        header="Konfirmasi"
        icon="pi pi-exclamation-triangle"
        accept={confirmAddBudgeting}
        reject={() => setConfirmVisible(false)}
      />
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
            <div key={index} className="subkategori-budget-field-container">
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
                    onChange={(e) =>
                      handleBudgetingChange(
                        index,
                        e.target.name,
                        e.target.value
                      )
                    }
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
                    value={item.budget || ""} // Pastikan nilai selalu string
                    onChange={(e) =>
                      handleBudgetingChange(
                        index,
                        e.target.name,
                        e.target.value
                      )
                    }
                    onBlur={(e) =>
                      handleBudgetingChange(
                        index,
                        e.target.name,
                        e.target.value
                      )
                    } // Validasi saat blur
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
                    value={item.realization || ""}
                    onChange={(e) =>
                      handleBudgetingChange(
                        index,
                        e.target.name,
                        e.target.value
                      )
                    }
                    onBlur={(e) =>
                      handleBudgetingChange(
                        index,
                        e.target.name,
                        e.target.value
                      )
                    } // Validasi saat blur
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
                    value={formatRupiah(item.remaining || 0)} // Format angka ke Rupiah
                    readOnly
                    style={{ width: "100%" }}
                    className="input-field"
                  />
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
              className="coastal-button submit-button p-button-rounded"
            />
          </div>
        </form>
      </Dialog>

      <Dialog
        header="Budgeting"
        visible={isBudgetingDialogVisible}
        onHide={() => setBudgetingDialogVisible(false)}
        modal
        maximizable
        style={{ width: "70vw" }} // Increase dialog width
      >
        <form onSubmit={handleBudgetSubmit}>
          {budgetingFormData.map((item, index) => (
            <div
              key={index}
              className="budgeting-field-container"
              style={{
                display: "flex",
                alignItems: "flex-start", // Mulai dari atas agar tombol sejajar dengan awal konten
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
                marginBottom: "10px",
              }}
            >
              <Button
                type="button"
                label="Hapus"
                onClick={() => removeBudgetingField(index)}
                className="remove-button p-button p-component"
                disabled={budgetingFormData.length === 1}
                style={{
                  marginRight: "10px",
                  alignSelf: "center", // Tempatkan di tengah vertikal
                  padding: "0.5rem 1rem",
                  marginTop: "12px", // Tambahkan sedikit jarak dari atas
                  width: "80px", // Sesuaikan lebar tombol
                }}
              />
              <div style={{ display: "flex", flex: 3, gap: "10px" }}>
                <div className="field" style={{ flex: 1, minHeight: "60px" }}>
                  {" "}
                  {/* Set minHeight */}
                  <label htmlFor={`budget_${index}`}>Anggaran:</label>
                  <InputText
                    id={`budget_${index}`}
                    name="budget"
                    value={item.budget}
                    onChange={(e) => handleBudgetingChange(index, e)}
                    required
                    style={{ width: "100%" }}
                    className="input-field"
                  />
                </div>
                <div className="field" style={{ flex: 1, minHeight: "60px" }}>
                  {" "}
                  {/* Set minHeight */}
                  <label htmlFor={`realization_${index}`}>Realisasi:</label>
                  <InputText
                    id={`realization_${index}`}
                    name="realization"
                    value={item.realization}
                    onChange={(e) => handleBudgetingChange(index, e)}
                    required
                    style={{ width: "100%" }}
                    className="input-field"
                  />
                </div>
                <div className="field" style={{ flex: 1, minHeight: "60px" }}>
                  <label htmlFor={`remaining_${index}`}>Sisa:</label>
                  <InputText
                    id={`remaining_${index}`}
                    name="remaining"
                    value={formatRupiah(item.remaining)}
                    readOnly // Set as readOnly
                    style={{ width: "100%" }}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            type="button"
            label="Tambah"
            className="delete-button coastal-button p-button-rounded"
            raised
            rounded
            onClick={addBudgetingField}
          />
          <div className="button-sub">
            <Button
              type="submit"
              label="Simpan"
              className="coastal-button submit-button p-button-rounded"
            />
          </div>
        </form>
      </Dialog>
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
                  label={isEditMode ? "Update" : "Save"}
                  className="coastal-button submit-button p-button-rounded"
                  style={{ marginTop: "20px" }}
                />
              </div>
            </Card>
          </form>
        </div>
      </Dialog>
    </div>
  );
};

export default Kategori;
