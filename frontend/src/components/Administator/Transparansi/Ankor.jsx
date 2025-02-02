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
import "./ProdukHukum.css"; // Custom CSS for styling

const Ankor = () => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [currentAnkor, setCurrentAnkor] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }, // Use FilterMatchMode
  });
  const [ankorList, setAnkorList] = useState([]);

  const navigate = useNavigate();
  const toast = useRef(null);
  const axiosJWT = useAuth(navigate);

  const fetcher = useCallback(
    async (url) => {
      const response = await axiosJWT.get(url);
      console.log(response.data);
      return response.data;
    },
    [axiosJWT]
  );

  const {
    data: ankorData,
    error,
    isLoading,
  } = useSWR("http://localhost:8080/ankor", fetcher);

  useEffect(() => {
    if (ankorData?.ankor) {
      setAnkorList(ankorData.ankor);
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
            style={{ width: "300px" }} // Increased width for search input
          />
        </span>
        <div className="add-data-container">
          <Button
            label="Add Data"
            onClick={openDialog}
            className="add-data-button p-button-rounded p-button-success"
            icon="pi pi-plus"
            style={{ backgroundColor: "#00796B", color: "#ffffff" }} // Elegant teal color
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
      setIsLoadingProcess(true);
      if (isEditMode) {
        await axiosJWT.patch(
          `http://localhost:8080/ankor/${currentAnkor.id}`,
          { name: formData.name },
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
          "http://localhost:8080/cankor",
          { name: formData.name },
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

      console.log("Data berhasil dikirim, merefresh data...");
      await mutate("http://localhost:8080/ankor");

      resetForm();
      setDialogVisible(false);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengirim form:", error);
      handleError(error);
    } finally {
      setIsLoadingProcess(false); // Nonaktifkan loading setelah proses selesai
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

  const resetForm = () => {
    setFormData({
      name: "",
    });
    setEditMode(false);
    setCurrentAnkor(null);
  };

  const editankor = (ankor) => {
    setFormData(ankor);
    setCurrentAnkor(ankor);
    setEditMode(true);
    setDialogVisible(true);
  };

  const deleteankor = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axiosJWT.delete(`http://localhost:8080/ankor/${id}`);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate("http://localhost:8080/ankor");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handlePageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <h1 className="demografi-header">Parameter Ankor</h1>
      <Toast ref={toast} />
      <DataTable
        value={ankorList}
        paginator
        rows={rows} // Gunakan nilai rows dari state
        first={first}
        onPage={handlePageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        filters={filters}
        globalFilterFields={["name"]}
        header={header}
        footer={`Total data: ${ankorList.length}`}
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
        <Column
          field="name"
          header="Nama"
          style={{ width: "90%", minWidth: "15%" }}
        />
        <Column
          header="Actions"
          style={{ width: "5%", minWidth: "5%" }}
          body={(rowData) => (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                icon="pi pi-pencil"
                onClick={() => editankor(rowData)}
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
                onClick={() => deleteankor(rowData.id)}
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
                Informasi Parameter Ankor
              </h3>

              <div className="form-group">
                <label htmlFor="name">
                  Parameter Ankor <span className="required">*</span>
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

export default Ankor;
