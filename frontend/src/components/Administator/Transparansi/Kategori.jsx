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

  const [budgetingFormData, setBudgetingFormData] = useState([
    { uuid: "", budget: "", realization: "", remaining: "", subkategoriId: "" },
  ]);
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
    { uuid: "", name: "", kategoriId: "" },
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

    try {
      // Kirim data ke backend
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

      // Mutasi data dan refresh state terkait
      await mutate(
        "https://randusanga-kulonbackend-production.up.railway.app/subkategori"
      );

      // Tutup dialog setelah sukses
      setSubkategoriDialogVisible(false);
    } catch (error) {
      // Tangani error dengan lebih informatif
      console.error("Error saat mengirim data:", error);
      handleError(error); // Pastikan `handleError` menangani berbagai jenis error dengan baik
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

  const handleSubkategoriChange = (index, e) => {
    const { name, value } = e.target;

    const updatedSubkategoriFormData = [...subkategoriFormData]; // Membuat salinan data form
    updatedSubkategoriFormData[index] = {
      ...updatedSubkategoriFormData[index],
      [name]: value, // Memperbarui nilai berdasarkan nama field (name, budget, realization)
    };

    setSubkategoriFormData(updatedSubkategoriFormData); // Memperbarui state form
  };

  const handlePageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  const fetchSubkategoriByKategoriId = async (kategoriId) => {
    try {
      const response = await axiosJWT.get(
        `https://randusanga-kulonbackend-production.up.railway.app/subkategoribykategori/${kategoriId}`
      );
      const data =
        response.data.length > 0
          ? response.data.map((subkategori) => ({
              name: subkategori.name || "",
              kategoriId: kategoriId,
              budget: subkategori.budget || 0, // Nilai default jika tidak ada
              realization: subkategori.realization || 0,
              remaining: subkategori.remaining || 0, // Nilai default jika tidak ada
            }))
          : [{ name: "", kategoriId, budget: 0, realization: 0, remaining: 0 }]; // Nilai default jika data kosong

      setSubkategoriFormData(data); // Memperbarui state form
    } catch (error) {
      handleError(error); // Menangani error
    }
  };

  // const fetchBudgetBySubkategori = async (subkategoriId) => {
  //   try {
  //     const response = await axiosJWT.get(
  //       `https://randusanga-kulonbackend-production.up.railway.app/budgetbysubkategori/${subkategoriId}`
  //     );
  //     const data =
  //       response.data.length > 0
  //         ? response.data.map((budget) => ({
  //             budget: budget.budget || "",
  //             realization: budget.realization || "",
  //             remaining: budget.remaining || "",
  //             subkategoriId: subkategoriId,
  //           }))
  //         : [{ budget: "", realization: "", remaining: "", subkategoriId }]; // Tambahkan satu form kosong jika data kosong
  //     setBudgetingFormData(data);
  //   } catch (error) {
  //     handleError(error);
  //   }
  // };

  const handleBudgetingChange = (index, event) => {
    const { name, value } = event.target;

    if (isNaN(value) || value === "") return; // Pastikan hanya nilai angka

    const updatedFormData = [...budgetingFormData];
    updatedFormData[index][name] = parseFloat(value); // Ubah ke angka asli untuk perhitungan
    updatedFormData[index].remaining = calculateRemaining(
      name === "budget" ? value : updatedFormData[index].budget,
      name === "realization" ? value : updatedFormData[index].realization
    );

    setBudgetingFormData(updatedFormData);
  };

  const calculateRemaining = (budget, realization) => {
    return (parseFloat(budget) || 0) - (parseFloat(realization) || 0);
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
                    onChange={(e) => handleBudgetingChange(index, e)}
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
                    onChange={(e) => handleBudgetingChange(index, e)}
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
              className="coastal-button submit-button p-button-rounded"
            />
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default Kategori;
