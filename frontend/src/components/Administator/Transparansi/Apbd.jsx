import React, { useState, useEffect, useCallback, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Dialog } from "primereact/dialog";
import "./ProdukHukum.css"; // Custom CSS for styling

const Apbd = () => {
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    file_url: "",
  });
  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [currentApbd, setCurrentApbd] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }, // Use FilterMatchMode
  });
  const [apbdList, setApbdList] = useState([]);
  const [fileDialogVisible, setFileDialogVisible] = useState(false);

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
    data: apbdData,
    error,
    isLoading,
  } = useSWR(
    "https://randusanga-kulonbackend-production-fa8c.up.railway.app/apbd",
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
    // console.log("Opening file URL:", fileUrl);
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
        style={{ width: "70vw" }} // Set width sesuai kebutuhan
      >
        {selectedFile ? (
          <>
            <iframe
              src={selectedFile}
              width="100%"
              height="400px"
              title="File Viewer"
            />
          </>
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

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 10 }, // Membatasi hingga 10 tahun
    (_, i) => currentYear - i // Mengurangi indeks untuk mendapatkan tahun mundur
  );

  const yearOptions = years.map((year) => ({
    label: year.toString(),
    value: year,
  }));

  const handleDateChange = (e) => {
    const selectedYear = e.value; // Nilai yang dipilih dari dropdown
    if (selectedYear) {
      setFormData({
        ...formData,
        year: parseInt(selectedYear, 10), // Simpan tahun sebagai integer
      });
    } else {
      setFormData({ ...formData, year: null });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Simpan file yang dipilih dalam state
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result); // Buat preview jika diperlukan
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi nilai year dan konversi jika diperlukan
    if (typeof formData.year === "string") {
      formData.year = parseInt(formData.year, 10); // Konversi year ke integer
    }
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("year", formData.year);

    // Tambahkan file jika ada
    if (selectedFile) {
      formDataToSend.append("file", selectedFile);
    }

    try {
      setIsLoadingProcess(true);
      if (isEditMode) {
        await axiosJWT.patch(
          `https://randusanga-kulonbackend-production-fa8c.up.railway.app/apbd/${currentApbd.id}`,
          formDataToSend,
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
        console.log("Mengirim data baru...");
        await axiosJWT.post(
          "https://randusanga-kulonbackend-production-fa8c.up.railway.app/capbd",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
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
        "https://randusanga-kulonbackend-production-fa8c.up.railway.app/apbd"
      );

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
      year: null,
      file_url: "",
    });
    setSelectedFile(null);
    setPreview(null);
    setEditMode(false);
    setCurrentApbd(null);
  };

  const editapbd = (apbd) => {
    setFormData(apbd);
    setSelectedFile(null);
    const fileUrl = apbd.file_url
      ? `https://randusanga-kulonbackend-production-fa8c.up.railway.app${apbd.file_url}`
      : null;
    // console.log("File URL:", fileUrl);
    setPreview(fileUrl); // Set preview to the existing file URL
    setCurrentApbd(apbd);
    setEditMode(true);
    setDialogVisible(true);
  };

  const deleteapbd = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axiosJWT.delete(
          `https://randusanga-kulonbackend-production-fa8c.up.railway.app/apbd/${id}`
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate(
          "https://randusanga-kulonbackend-production-fa8c.up.railway.app/apbd"
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <div>
      <h1 className="demografi-header">APBD</h1>
      <Toast ref={toast} />
      <DataTable
        value={apbdList}
        paginator
        rows={rows} // Gunakan nilai rows dari state
        first={first}
        onPage={handlePageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        filters={filters}
        globalFilterFields={["name", "year"]}
        header={header}
        footer={`Total data: ${apbdList.length}`}
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
          style={{ width: "55%", minWidth: "15%" }}
        />
        <Column
          field="year"
          header="Tahun"
          style={{ width: "30%", minWidth: "5%" }}
        />
        <Column
          field="file_url"
          header="File"
          style={{ width: "5%", minWidth: "5%" }}
          body={(rowData) => {
            const fileUrl = `https://randusanga-kulonbackend-production-fa8c.up.railway.app${rowData.file_url}`;
            return (
              <Button
                label="Lihat"
                onClick={() => showFileInModal(fileUrl)} // Gunakan URL lengkap
                className="coastal-button p-button-rounded"
                tooltip="Lihat File"
                tooltipOptions={{ position: "bottom" }}
              />
            );
          }}
        />
        <Column
          header="Actions"
          style={{ width: "5%", minWidth: "5%" }}
          body={(rowData) => (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                icon="pi pi-pencil"
                onClick={() => editapbd(rowData)}
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
                onClick={() => deleteapbd(rowData.id)}
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
      {renderFileDialog()}

      <Dialog
        header={isEditMode ? "Edit APBD Data" : "Add APBD Data"}
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
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Card
              className="demografi-card"
              style={{
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                padding: "20px",
              }}
            >
              <h3 className="section-title" style={{ color: "#00796B" }}>
                APBD Information
              </h3>

              <div className="form-group">
                <label htmlFor="name">
                  Nama APBD <span className="required">*</span>
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
              <div className="form-group">
                <label htmlFor="year">
                  Tahun <span className="required">*</span>
                </label>
                <Dropdown
                  id="year"
                  name="year"
                  value={formData.year}
                  options={yearOptions}
                  onChange={handleDateChange}
                  showIcon
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
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

export default Apbd;
