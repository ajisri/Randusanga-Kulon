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
import "./Keuangan.css"; // Custom CSS for styling

const Keuangan = () => {
  const [formData, setFormData] = useState({
    uuid: "",
    name: "",
    apbdId: "",
  });
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [currentKeuangan, setCurrentKeuangan] = useState(null);
  const [apbdOptions, setApbdOptions] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [keuanganList, setKeuanganList] = useState([]);

  const navigate = useNavigate();
  const toast = useRef(null);
  const axiosJWT = useAuth(navigate);

  const fetcher = useCallback(
    async (url) => {
      const response = await axiosJWT.get(url);

      console.log(response.data); // Log data yang diterima
      return response.data;
    },
    [axiosJWT]
  );

  const {
    data: keuanganData,
    error,
    isLoading,
  } = useSWR("http://localhost:8080/keuangan", fetcher);

  useEffect(() => {
    if (keuanganData) {
      console.log("Data Keuangan yang diterima:", keuanganData);
      // Periksa jika keuanganData ada
      setKeuanganList(keuanganData); // Gunakan keuanganData langsung
    }
  }, [keuanganData]);

  const {
    data: apbdData,
    error: apbdError,
    isLoading: isApbdLoading,
  } = useSWR("http://localhost:8080/allapbd", fetcher);

  useEffect(() => {
    if (apbdData) {
      console.log("Data APBD yang diterima:", apbdData);
      setApbdOptions(apbdData); // Simpan apbdData untuk dropdown
    }
  }, [apbdData]);

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
          `http://localhost:8080/keuangan/${currentKeuangan.uuid}`,
          dataToSend
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data updated successfully!",
          life: 3000,
        });
      } else {
        await axiosJWT.post("http://localhost:8080/ckeuangan", dataToSend);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data saved successfully!",
          life: 3000,
        });
      }

      await mutate("http://localhost:8080/keuangan");
      resetForm();
      setDialogVisible(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoadingProcess(false); // Nonaktifkan loading setelah proses selesai
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
      apbdId: "",
    });
    setEditMode(false);
    setCurrentKeuangan(null);
  };

  const editKeuangan = (keuangan) => {
    setFormData(keuangan);
    setCurrentKeuangan(keuangan);
    setEditMode(true);
    setDialogVisible(true);
  };

  const [isLoadingg, setIsLoadingg] = useState(false);

  const deleteKeuangan = async (uuid) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setIsLoadingg(true);
      try {
        await axiosJWT.delete(`http://localhost:8080/keuangan/${uuid}`);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate("http://localhost:8080/keuangan");
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoadingg(false); // Selesai loading state
      }
    }
  };

  const handlePageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  if (isLoading || isApbdLoading) return <p>Loading...</p>;
  if (error || apbdError) return <p>{error.message}</p>;

  return (
    <div>
      <h1 className="keuangan-header">Kategori</h1>
      <Toast ref={toast} />
      <DataTable
        value={keuanganList}
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
        footer={`Total data: ${keuanganList.length}`}
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
          style={{ width: "70%", minWidth: "25%" }}
        />
        <Column
          field="apbdId"
          header="Tahun APBD"
          style={{ width: "25%", minWidth: "20%" }}
          body={(rowData) => {
            const apbd = apbdOptions.find((kw) => kw.id === rowData.apbdId);
            return apbd ? `${apbd.name} (${apbd.year})` : "N/A";
          }}
        />
        <Column
          header="Actions"
          body={(rowData) => (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                icon="pi pi-pencil"
                onClick={() => editKeuangan(rowData)}
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
                onClick={() => deleteKeuangan(rowData.uuid)}
                className="delete-button coastal-button p-button-rounded"
                tooltip="Delete"
                tooltipOptions={{ position: "bottom" }}
                style={{
                  backgroundColor: "#009688",
                  border: "none",
                  color: "white",
                }}
                disabled={isLoadingg}
              />
            </div>
          )}
        />
      </DataTable>

      <Dialog
        header={isEditMode ? "Edit Keuangan Data" : "Add Keuangan Data"}
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
                  id="apbdId"
                  name="apbdId"
                  optionLabel={(option) => `${option.name} (${option.year})`}
                  optionValue="id"
                  value={formData.apbdId}
                  options={apbdData}
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
    </div>
  );
};

export default Keuangan;
