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

const SubkategoriAnkor = () => {
  const [formData, setFormData] = useState({
    uuid: "",
    name: "",
    kategoriankorId: "",
    poinsubkategoriankor: [{ uuid: null, name: "" }],
  });
  const [kategoriankorOptions, setKategoriankorOptions] = useState([]);
  const [currentSubkategoriankor, setCurrentSubkategoriankor] = useState(null);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [subKategoriankorList, setSubkategoriankorList] = useState([]);
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
    data: subkategoriankorData,
    error,
    isLoading,
  } = useSWR(
    "https://randusanga-kulonbackend-production.up.railway.app/subkategoriankor",
    fetcher
  );

  useEffect(() => {
    if (subkategoriankorData) {
      if (
        Array.isArray(subkategoriankorData) &&
        subkategoriankorData.length > 0
      ) {
        setSubkategoriankorList(subkategoriankorData);
      } else {
        // Jika data kosong (array kosong)
        setSubkategoriankorList([]);
        console.log("No subkategoriankor data available");
      }
    } else if (error) {
      // Menangani error jika ada
      console.error("Error fetching subkategoriankor data:", error);
      setSubkategoriankorList([]); // Set ke array kosong pada error lainnya
    }
  }, [subkategoriankorData, error]);

  const {
    data: kategoriankorData,
    error: kategoriankorError,
    isLoading: isKategoriankorLoading,
  } = useSWR(
    "https://randusanga-kulonbackend-production.up.railway.app/kategoriankor",
    fetcher
  );

  useEffect(() => {
    if (Array.isArray(kategoriankorData)) {
      setKategoriankorOptions(kategoriankorData);
    } else {
      setKategoriankorOptions([]);
    }
  }, [kategoriankorData]);

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

  const addPoinsubkategoriankorField = () => {
    setFormData({
      ...formData,
      poinsubkategoriankor: [
        ...formData.poinsubkategoriankor,
        { uuid: null, name: "" },
      ],
    });
  };

  // Remove a dynamic field for Poinsubkategoriankor
  const removePoinsubkategoriankorField = (index) => {
    const updatedPoinsubkategoriankor = [...formData.poinsubkategoriankor];
    updatedPoinsubkategoriankor.splice(index, 1);
    setFormData({
      ...formData,
      poinsubkategoriankor: updatedPoinsubkategoriankor,
    });
  };

  // Handle input changes for each dynamic Poinsubkategoriankor field
  const handlePoinsubkategoriankorChange = (index, event) => {
    const updatedPoinsubkategoriankor = [...formData.poinsubkategoriankor];
    updatedPoinsubkategoriankor[index].name = event.target.value;
    setFormData({
      ...formData,
      poinsubkategoriankor: updatedPoinsubkategoriankor,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        // Update subkategori yang ada berdasarkan UUID
        const updateSubkategoriankorPayload = {
          uuid: currentSubkategoriankor.uuid,
          name: formData.name,
          kategoriankorId: formData.kategoriankorId,
        };

        const subkategoriResponse = await axiosJWT.patch(
          `https://randusanga-kulonbackend-production.up.railway.app/subkategoriankor/${currentSubkategoriankor.uuid}`,
          updateSubkategoriankorPayload
        );
        const subkategoriankorId = subkategoriResponse.data.data.uuid;
        console.log("🚀 ~ subkategoriResponse:", subkategoriResponse);

        // Menyiapkan payload untuk update atau tambah poin
        const poinsubkategoriankorPayload = formData.poinsubkategoriankor.map(
          (poin) => {
            // Jika poin sudah ada (memiliki UUID), lakukan update
            if (poin.uuid) {
              return {
                uuid: poin.uuid,
                name: poin.name,
                subkategoriankorId, // Pastikan subkategoriankorId sudah ada
              };
            } else {
              // Jika poin baru, kirim data tanpa UUID
              return {
                name: poin.name,
                subkategoriankorId, // Pastikan subkategoriankorId sudah ada
              };
            }
          }
        );
        console.log(
          "🚀 ~ handleSubmit ~ poinsubkategoriankorPayload:",
          poinsubkategoriankorPayload
        );
        await Promise.allSettled(
          poinsubkategoriankorPayload.map((poin) =>
            poin.uuid
              ? axiosJWT.patch(
                  `https://randusanga-kulonbackend-production.up.railway.app/poinsubkategoriankor/${poin.uuid}`,
                  {
                    name: poin.name,
                    subkategoriankorId: poin.subkategoriankorId,
                  }
                )
              : axiosJWT.post(
                  "https://randusanga-kulonbackend-production.up.railway.app/cpoinsubkategoriankor",
                  {
                    name: poin.name,
                    subkategoriankorId: poin.subkategoriankorId,
                  }
                )
          )
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data berhasil diperbarui!",
          life: 3000,
        });
      } else {
        // Jika mode tambah, simpan subkategori dan poinsubkategoriankor seperti sebelumnya
        const subkategoriPayload = {
          name: formData.name,
          kategoriankorId: formData.kategoriankorId,
        };

        // // Menyimpan subkategori terlebih dahulu
        const subkategoriResponse = await axiosJWT.post(
          "https://randusanga-kulonbackend-production.up.railway.app/csubkategoriankor",
          subkategoriPayload
        );
        //kalau subkategoriresponse error maka throw error.
        if (![200, 201].includes(subkategoriResponse.status)) {
          toast.current.show({
            severity: "warning",
            summary: "Warning",
            detail: subkategoriResponse.msg,
            life: 3000,
          });
        }
        // Mendapatkan subkategoriankorId dari response
        const subkategoriankorId = subkategoriResponse.data.ankor.uuid;
        await Promise.allSettled(
          formData.poinsubkategoriankor.map((element) =>
            axiosJWT.post(
              "https://randusanga-kulonbackend-production.up.railway.app/cpoinsubkategoriankor",
              {
                poinsubkategoriankor: element,
                subkategoriankorId: subkategoriankorId,
              }
            )
          )
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data berhasil disimpan!",
          life: 3000,
        });

        // // Menyimpan poinsubkategoriankor setelah subkategori berhasil disimpan
        // await axiosJWT.post(
        //   "https://randusanga-kulonbackend-production.up.railway.app/cpoinsubkategoriankor",
        //   { poinsubkategoriankor: poinsubkategoriankorPayload }
        // );
      }

      // Refresh data setelah sukses
      await mutate(
        "https://randusanga-kulonbackend-production.up.railway.app/subkategoriankor"
      );

      closeDialog(); // Menutup dialog setelah sukses
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Gagal mengupdate data poin. ${
          error.response?.data?.message || error.message
        }`,
        life: 5000,
      });
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
      uuid: "",
      name: "",
      kategoriankorId: "",
      poinsubkategoriankor: [{ uuid: null, name: "" }],
    });
    setEditMode(false);
    setCurrentSubkategoriankor(null);
  };

  const normalizeSubkategoriankor = (data) => ({
    uuid: data.uuid || "",
    name: data.name || "",
    kategoriankorId: data.kategoriankorId || "",
    poinsubkategoriankor: data.poinsubkategoriankor?.length
      ? data.poinsubkategoriankor.map((poin) => ({
          uuid: poin.uuid || "",
          name: poin.name,
        }))
      : [{ name: "" }],
  });

  const editsubkategoriankor = (subkategoriankor) => {
    const normalizedData = normalizeSubkategoriankor(subkategoriankor);
    console.log("🚀 ~ editsubkategoriankor ~ normalizedData:", normalizedData);
    console.log(
      "🚀 ~ editsubkategoriankor ~ subkategoriankor:",
      subkategoriankor
    );
    setFormData(normalizedData);
    setCurrentSubkategoriankor(subkategoriankor);
    setEditMode(true);
    setDialogVisible(true);
  };

  const deletesubkategoriankor = async (uuid) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await axiosJWT.delete(
          `https://randusanga-kulonbackend-production.up.railway.app/subkategoriankor/${uuid}`
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate(
          "https://randusanga-kulonbackend-production.up.railway.app/subkategoriankor"
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

  if (isLoading || isKategoriankorLoading) return <p>Loading...</p>;
  if (error || kategoriankorError) return <p>{error.message}</p>;

  return (
    <div>
      <h1 className="demografi-header">Sub Kategori Parameter Ankor</h1>
      <Toast ref={toast} />
      <DataTable
        value={subKategoriankorList}
        paginator
        rows={rows}
        first={first}
        onPage={handlePageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        filters={filters}
        globalFilterFields={["name"]}
        header={header}
        footer={`Total data: ${subKategoriankorList.length}`}
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
          style={{ width: "45%", minWidth: "15%" }}
        />
        <Column
          field="kategoriankorId"
          header="Kategori Parameter Ankor"
          style={{ width: "45%", minWidth: "20%" }}
          body={(rowData) => {
            const kategoriankor = kategoriankorOptions.find(
              (kw) => kw.uuid === rowData.kategoriankorId
            );
            return kategoriankor ? kategoriankor.name : "N/A";
          }}
        />
        <Column
          header="Actions"
          style={{ width: "5%", minWidth: "5%" }}
          body={(rowData) => (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                icon="pi pi-pencil"
                onClick={() => editsubkategoriankor(rowData)}
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
                onClick={() => deletesubkategoriankor(rowData.uuid)}
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
                Sub Kategori Parameter Ankor
              </h3>

              <div className="form-group">
                <label htmlFor="name">
                  Nama Sub Kategori Parameter Ankor{" "}
                  <span className="required">*</span>
                </label>
                <InputText
                  id="name"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="kategoriankorId">
                  Pilih Kategori Parameter Ankor:
                </label>
                <Dropdown
                  id="kategoriankorId"
                  name="kategoriankorId"
                  optionLabel="name" // Properti "name" akan ditampilkan sebagai label
                  optionValue="uuid" // Properti "uuid" digunakan sebagai nilai unik
                  value={formData.kategoriankorId || ""} // Nilai yang dipilih harus cocok dengan "uuid"
                  options={kategoriankorOptions} // Data opsi
                  onChange={handleChange} // Fungsi untuk menangani perubahan
                  placeholder="Pilih Kategori Parameter Ankor"
                  required
                  className="input-field"
                />
              </div>
              <div
                style={{
                  marginTop: "30px", // Jarak antar form dinamis
                  borderTop: "2px solid #ddd", // Garis pembatas
                  paddingTop: "20px", // Jarak antara isi form dan garis
                }}
              >
                <label htmlFor="poinsubkategoriankor">
                  Poin Sub Kategori Parameter Ankor{" "}
                  <span className="required">*</span>
                </label>
                {formData.poinsubkategoriankor.map((item, index) => (
                  <div
                    key={index}
                    className="subkategori-url-field"
                    style={{
                      marginBottom: "30px",
                      paddingBottom: "20px", // Jarak antara isi form dan garis
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <InputText
                        id={`poinsubkategoriankor_${index}`}
                        name={`poinsubkategoriankor_${index}`}
                        value={item.name}
                        onChange={(e) =>
                          handlePoinsubkategoriankorChange(index, e)
                        }
                        className="input-field"
                        required
                      />
                      <Button
                        type="button"
                        label="Hapus"
                        className="remove-button"
                        disabled={formData.poinsubkategoriankor.length === 1}
                        style={{ marginLeft: "10px" }}
                        onClick={() => removePoinsubkategoriankorField(index)}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  label="Tambah Poin"
                  className="coastal-button p-button-rounded"
                  onClick={addPoinsubkategoriankorField}
                />
              </div>

              <div className="button-sub">
                <Button
                  type="submit"
                  label="Simpan"
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

export default SubkategoriAnkor;
