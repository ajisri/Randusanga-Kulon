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
import "./ProdukHukum.css"; // Custom CSS for styling

const Apbd = () => {
  const [formData, setFormData] = useState({
    uuid: "",
    name: "",
    year: null,
    waktu: null,
    file_url: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [apbdList, setApbdList] = useState([]);
  const [fileDialogVisible, setFileDialogVisible] = useState(false);
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

  const {
    data: apbdData,
    error,
    isLoading,
  } = useSWR(
    "https://randusanga-kulonbackend-production.up.railway.app/apbd",
    fetcher
  );

  useEffect(() => {
    if (apbdData?.apbd) {
      setApbdList(apbdData.apbd);
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

  const showFileInModal = (fileUrl) => {
    if (fileUrl) {
      setSelectedFile(fileUrl);
      setFileDialogVisible(true);
    } else {
      console.error("File is not valid");
    }
  };

  const renderFileDialog = () => {
    return (
      <Dialog
        header="File Preview"
        visible={fileDialogVisible}
        onHide={() => setFileDialogVisible(false)}
        modal
        style={{ width: "70vw" }}
      >
        {selectedFile ? (
          <iframe
            src={selectedFile}
            width="100%"
            height="400px"
            title="File Viewer"
          />
        ) : (
          <p>No file selected.</p>
        )}
        <Button label="Close" onClick={() => setFileDialogVisible(false)} />
      </Dialog>
    );
  };

  const renderHeader = () => {
    return (
      <div className="table-header">
        <span className="p-input-icon-left search-container">
          <InputText
            type="search"
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search"
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      dataToSend.append(key, formData[key]);
    });
    if (selectedFile) {
      dataToSend.append("file", selectedFile);
    }

    try {
      if (isEditMode) {
        await axiosJWT.patch(
          `https://randusanga-kulonbackend-production.up.railway.app/apbd/${formData.uuid}`,
          dataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
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
          "https://randusanga-kulonbackend-production.up.railway.app/apbd",
          dataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
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
        "https://randusanga-kulonbackend-production.up.railway.app/apbd"
      );
      resetForm();
      setDialogVisible(false);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      if (error.response.data.errors) {
        const messages = error.response.data.errors.map((err) => err.msg) || [];
        messages.forEach((msg) => {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: msg,
            life: 5000,
          });
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.response.data.message || "An unexpected error occurred",
          life: 5000,
        });
      }
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
      year: null,
      file_url: "",
    });
    setSelectedFile(null);
    setPreview(null);
    setEditMode(false);
  };

  const editApbd = (apbd) => {
    setFormData(apbd);
    setSelectedFile(null);
    const fileUrl = apbd.file_url
      ? `https://randusanga-kulonbackend-production.up.railway.app${apbd.file_url}`
      : null;
    setPreview(fileUrl);
    setEditMode(true);
    setDialogVisible(true);
  };

  const deleteApbd = async (uuid) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axiosJWT.delete(
          `https://randusanga-kulonbackend-production.up.railway.app/apbd/${uuid}`
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate(
          "https://randusanga-kulonbackend-production.up.railway.app/apbd"
        );
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handlePageChange = (e) => {
    setFirst(e.first);
    setRows(e.rows);
  };

  const years = Array.from({ length: 100 }, (_, i) => 2024 - i);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data!</p>;

  return (
    <>
      <Toast ref={toast} />
      {renderFileDialog()}
      <Card>
        <h2>APBD Data</h2>
        <DataTable
          value={apbdList}
          paginator
          rows={rows}
          first={first}
          onPage={handlePageChange}
          globalFilter={globalFilterValue}
          header={renderHeader()}
          filters={filters}
        >
          <Column field="name" header="Name" filter />
          <Column field="year" header="Year" filter />
          <Column
            body={(rowData) => (
              <Button
                label="View File"
                icon="pi pi-eye"
                onClick={() => showFileInModal(rowData.file_url)}
              />
            )}
            header="Dokumen"
            bodyClassName="text-center"
          />
          <Column
            body={(rowData) => (
              <div>
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-info"
                  onClick={() => editApbd(rowData)}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-rounded p-button-danger"
                  onClick={() => deleteApbd(rowData.uuid)}
                />
              </div>
            )}
            header="Actions"
            bodyClassName="text-center"
          />
        </DataTable>
      </Card>

      <Dialog
        header={isEditMode ? "Edit Data" : "Add Data"}
        visible={isDialogVisible}
        onHide={closeDialog}
        modal
        style={{ width: "50vw" }}
      >
        <form onSubmit={handleSubmit}>
          <Card className="demografi-card">
            <div className="field">
              <label htmlFor="name">Name</label>
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
              <label htmlFor="year">Year</label>
              <Dropdown
                id="year"
                name="year"
                value={formData.year}
                options={years}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className="field">
              <label htmlFor="file_url">Upload File</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="file-input"
              />
              {preview && (
                <div className="file-preview">
                  <iframe
                    src={preview}
                    title="File Preview"
                    className="preview-file"
                    style={{ width: "100%", height: "400px" }}
                  />
                </div>
              )}
            </div>

            <div className="p-d-flex p-jc-between">
              <Button
                label="Save"
                icon="pi pi-check"
                type="submit"
                className="p-button-success"
              />
              <Button
                label="Cancel"
                icon="pi pi-times"
                onClick={closeDialog}
                className="p-button-danger"
              />
            </div>
          </Card>
        </form>
      </Dialog>
    </>
  );
};

export default Apbd;
