import React, { useState, useEffect, useCallback, useRef } from "react";
import useSWR, { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
// import { ToggleButton } from "primereact/togglebutton";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Dialog } from "primereact/dialog";
// import { Dropdown } from "primereact/dropdown";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";

import "./Jabatan.css"; // Custom CSS for styling

const Jabatan = () => {
  const [formData, setFormData] = useState({
    nama: "",
    ringkasan: "",
    fungsi: "",
    tugas: "",
    mulai: null,
    selesai: null,
  });

  const [isLoadingProcess, setIsLoadingProcess] = useState(false);
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
    "https://ds-randusanga-kulon.osc-fr1.scalingo.io/jabatan",
    fetcher
  );

  useEffect(() => {
    if (data?.jabatan && data.jabatan.length > 0) {
      setDataList(data.jabatan);
    }
  }, [data]);

  useEffect(() => {
    if (data && data.length > 0) {
      // Memastikan data ada dan bukan kosong
      setDataList(
        data.map((jabatan) => ({
          ...jabatan,
          kehadiran: jabatan.Kehadiran?.[0]?.statusHadir || "Belum Diketahui", // Set status kehadiran jika ada, atau default
        }))
      );

      const jabatanData = data[0]; // Ambil jabatan pertama jika ada
      setFormData({
        uuid: jabatanData.uuid,
        nama: jabatanData.nama,
        ringkasan: jabatanData.ringkasan,
        mulai: jabatanData.masaJabatan && jabatanData.masaJabatan[0]?.mulai, // Akses mulai dari masaJabatan pertama
        selesai: jabatanData.masaJabatan && jabatanData.masaJabatan[0]?.selesai, // Akses selesai dari masaJabatan pertama
        fungsi:
          (jabatanData.fungsi &&
            jabatanData.fungsi.map((f) => f.content).join(", ")) ||
          "", // Gabungkan fungsi menjadi string
        tugas:
          (jabatanData.tugas &&
            jabatanData.tugas.map((t) => t.content).join(", ")) ||
          "", // Gabungkan tugas menjadi string
        kehadiran: jabatanData.Kehadiran?.[0]?.statusHadir || "Belum Diketahui", // Ambil status kehadiran pertama
      });
    } else {
      console.error("Data jabatan tidak tersedia atau kosong");
    }
  }, [data]);

  const {
    data: demografiData,
    error: demografiError,
    isLoading: demografiLoading,
  } = useSWR(
    "https://ds-randusanga-kulon.osc-fr1.scalingo.io/demografi", // Endpoint API demografi
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

  const handleChangeDropdown = (value, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleNChange = (value, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  // const handleQuillChange = useCallback((value, field) => {
  //   setFormData((prevData) => ({ ...prevData, [field]: value }));
  // }, []);

  const handleCKEditorChange = (data, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: data,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Buat data payload untuk dikirim
    const data = {
      nama: formData.nama.trim(),
      ringkasan: formData.ringkasan.trim(), // Pastikan ini string HTML dari ReactQuill
      fungsi: formData.fungsi.trim(), // Pastikan ini string HTML dari ReactQuill
      tugas: formData.tugas.trim(), // Pastikan ini string HTML dari CKEditor
      mulai: formData.mulai,
      selesai: formData.selesai,
      pemegangId: formData.pemegang,
    };

    try {
      setIsLoadingProcess(true);
      if (isEditMode) {
        await axiosJWT.put(
          `https://ds-randusanga-kulon.osc-fr1.scalingo.io/ujabatan/${currentData.uuid}`,
          data,
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
          "https://ds-randusanga-kulon.osc-fr1.scalingo.io/cjabatan",
          data,
          {
            headers: {
              "Content-Type": "application/json",
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
      await mutate("https://ds-randusanga-kulon.osc-fr1.scalingo.io/jabatan");
      resetForm();
      setDialogVisible(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoadingProcess(false); // Nonaktifkan loading setelah proses selesai
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
      ringkasan: "",
      fungsi: "",
      tugas: "",
      mulai: "",
      selesai: "",
      pemegangId: "",
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
          `https://ds-randusanga-kulon.osc-fr1.scalingo.io/jabatan/${uuid}`
        );
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Data deleted successfully!",
          life: 3000,
        });
        await mutate("https://ds-randusanga-kulon.osc-fr1.scalingo.io/jabatan");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleKehadiranUpdate = async (rowData, statusBaru) => {
    try {
      // Kirim permintaan ke backend untuk memperbarui status kehadiran
      await axiosJWT.put(
        `https://ds-randusanga-kulon.osc-fr1.scalingo.io/ujabatanhadir/${rowData.uuid}`,
        {
          statusHadir: statusBaru,
        }
      );

      // Perbarui data lokal agar tampilan berubah
      setDataList((prevData) =>
        prevData.map((item) =>
          item.uuid === rowData.uuid ? { ...item, kehadiran: statusBaru } : item
        )
      );

      toast.current.show({
        severity: "success",
        summary: "Berhasil",
        detail: `Status kehadiran diubah menjadi "${statusBaru}"`,
        life: 3000,
      });
    } catch (error) {
      console.error(
        "Gagal memperbarui status kehadiran:",
        error.response.data.msg
      );
      toast.current.show({
        severity: "error",
        summary: "Gagal",
        detail: "Tidak dapat memperbarui status kehadiran.",
        life: 3000,
      });
    }
  };

  const openEditDialog = (rowData) => {
    if (!rowData) {
      console.error("rowData tidak terdefinisi");
      return;
    }
    const masajabatan = rowData.masaJabatan?.[0]; // Memastikan ada masajabatan yang pertama

    setFormData({
      uuid: rowData.uuid,
      nama: rowData.nama,
      ringkasan: rowData.ringkasan,
      mulai: masajabatan?.mulai || null, // Menggunakan optional chaining dan default value jika undefined
      selesai: masajabatan?.selesai || null, // Menggunakan optional chaining dan default value jika undefined
      fungsi: rowData.fungsi.length > 0 ? rowData.fungsi[0].content : "",
      tugas: rowData.tugas.length > 0 ? rowData.tugas[0].content : "",
      pemegang: rowData.pemegangId || null,
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

  function KehadiranColumn({ rowData, handleKehadiranUpdate }) {
    const [status, setStatus] = useState(rowData.kehadiran || "Pilih Status");

    // Fungsi untuk mengubah status kehadiran
    const handleStatusChange = (newStatus) => {
      setStatus(newStatus);
      handleKehadiranUpdate(rowData, newStatus);
    };

    return (
      <div>
        <Button
          label={status}
          icon={status === "Hadir" ? "pi pi-check" : "pi pi-times"}
          onClick={() =>
            handleStatusChange(status === "Hadir" ? "Tidak Hadir" : "Hadir")
          }
          className={`p-button-rounded p-button-sm ${
            status === "Hadir"
              ? "p-button-success"
              : status === "Tidak Hadir"
              ? "p-button-warning"
              : "p-button-secondary"
          }`}
          style={{
            width: "auto",
            minWidth: "100px",
            height: "30px",
            fontSize: "12px",
          }} // Ukuran tombol dan font lebih kecil
        />
      </div>
    );
  }

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
        <Column
          field="nama"
          header="Nama Jabatan"
          style={{ width: "35%", minWidth: "15%" }}
        />
        <Column
          header="Nama Pemegang Jabatan"
          style={{ width: "30%", minWidth: "15%" }}
          body={(rowData) => rowData.pemegang?.name || "Belum Ditentukan"} // Akses nama pemegang
        />
        <Column
          header="Kehadiran"
          style={{ width: "15%", minWidth: "8%" }}
          body={(rowData) => (
            <KehadiranColumn
              rowData={rowData}
              handleKehadiranUpdate={handleKehadiranUpdate}
            />
          )}
        />
        <Column
          header="Periode"
          body={(rowData) => {
            // Menampilkan periode berdasarkan data masaJabatan
            const masaJabatan = rowData.masaJabatan && rowData.masaJabatan[0];
            if (masaJabatan) {
              return `${masaJabatan.mulai} - ${masaJabatan.selesai}`;
            }
            return "-"; // Jika tidak ada data masaJabatan
          }}
          style={{ width: "20%", minWidth: "5%" }}
        />
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
                <label htmlFor="pemegang">Pemegang Jabatan</label>
                <Dropdown
                  id="pemegangId"
                  name="pemegangId"
                  value={formData.pemegang || null} // Bind dengan formData
                  options={demografiOptions} // Data dropdown
                  onChange={(e) => handleChangeDropdown(e.value, "pemegang")} // Tangani perubahan
                  placeholder="Pilih Pemegang Jabatan"
                  className="input-field"
                  required
                />
              </div>

              <div
                className="form-container"
                style={{ display: "flex", gap: "1rem" }}
              >
                <div className="form-group">
                  <label htmlFor="Tahun Mulai">Tahun Mulai</label>
                  <InputNumber
                    id="mulai"
                    name="mulai"
                    value={formData.mulai ?? null}
                    onValueChange={(e) => handleNChange(e.value, "mulai")}
                    className="input-field"
                    mode="decimal"
                    useGrouping={false}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Tahun Selesai">Tahun Selesai</label>
                  <InputNumber
                    id="selesai"
                    name="selesai"
                    value={formData.selesai ?? null}
                    onValueChange={(e) => handleNChange(e.value, "selesai")}
                    className="input-field"
                    mode="decimal"
                    useGrouping={false}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Ringkasan Tentang Jabatan</label>
                <CKEditor
                  editor={DecoupledEditor}
                  data={formData.ringkasan}
                  config={{
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "underline",
                      "strikethrough",
                      "fontFamily",
                      "fontSize",
                      "fontColor",
                      "fontBackgroundColor",
                      "|",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "|",
                      "alignment",
                      "outdent",
                      "indent",
                      "|",
                      "insertTable",
                      "blockQuote",
                      "undo",
                      "redo",
                    ],
                    table: {
                      contentToolbar: [
                        "tableColumn",
                        "tableRow",
                        "mergeTableCells",
                      ],
                    },
                  }}
                  onReady={(editor) => {
                    console.log("Editor is ready to use!", editor);

                    // Konfigurasi toolbar tanpa fitur gambar dan video

                    const toolbarContainer = document.querySelector(
                      ".toolbar-container-ringkasan"
                    );
                    toolbarContainer.appendChild(
                      editor.ui.view.toolbar.element
                    );
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    console.log("Editor data changed (Ringkasan):", data);
                    handleCKEditorChange(data, "ringkasan");
                  }}
                />
                <div className="toolbar-container-ringkasan" />
              </div>

              <div className="form-group">
                <label>Fungsi</label>
                <CKEditor
                  editor={DecoupledEditor}
                  data={formData.fungsi}
                  config={{
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "underline",
                      "strikethrough",
                      "fontFamily",
                      "fontSize",
                      "fontColor",
                      "fontBackgroundColor",
                      "|",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "|",
                      "alignment",
                      "outdent",
                      "indent",
                      "|",
                      "insertTable",
                      "blockQuote",
                      "undo",
                      "redo",
                    ],
                    table: {
                      contentToolbar: [
                        "tableColumn",
                        "tableRow",
                        "mergeTableCells",
                      ],
                    },
                  }}
                  onReady={(editor) => {
                    const toolbarContainer = document.querySelector(
                      ".toolbar-container-fungsi"
                    );
                    toolbarContainer.appendChild(
                      editor.ui.view.toolbar.element
                    );
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    console.log("Editor data changed (Fungsi):", data);
                    handleCKEditorChange(data, "fungsi");
                  }}
                />
                <div className="toolbar-container-fungsi" />
              </div>

              <div className="form-group">
                <label>Tugas</label>
                <CKEditor
                  editor={DecoupledEditor}
                  data={formData.tugas}
                  config={{
                    toolbar: [
                      "heading",
                      "|",
                      "bold",
                      "italic",
                      "underline",
                      "strikethrough",
                      "fontFamily",
                      "fontSize",
                      "fontColor",
                      "fontBackgroundColor",
                      "|",
                      "link",
                      "bulletedList",
                      "numberedList",
                      "|",
                      "alignment",
                      "outdent",
                      "indent",
                      "|",
                      "insertTable",
                      "blockQuote",
                      "undo",
                      "redo",
                    ],
                    table: {
                      contentToolbar: [
                        "tableColumn",
                        "tableRow",
                        "mergeTableCells",
                      ],
                    },
                  }}
                  onReady={(editor) => {
                    const toolbarContainer = document.querySelector(
                      ".toolbar-container-tugas"
                    );
                    toolbarContainer.appendChild(
                      editor.ui.view.toolbar.element
                    );
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    console.log("Editor data changed (Tugas):", data);
                    handleCKEditorChange(data, "tugas");
                  }}
                />
                <div className="toolbar-container-tugas" />
              </div>

              <style jsx>
                {`
                  .toolbar-container-ringkasan,
                  .toolbar-container-fungsi,
                  .toolbar-container-tugas {
                    margin-bottom: 10px;
                  }

                  .ck-editor__editable_inline {
                    border: 1px solid #ccc;
                    padding: 10px;
                    border-radius: 4px;
                    min-height: 150px;
                    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
                  }

                  .custom-dialog-content table {
                    margin-left: 20px;
                    border-collapse: collapse;
                  }

                  .custom-dialog-content table td,
                  .custom-dialog-content table th {
                    padding: 10px;
                    border: none;
                  }
                `}
              </style>
              <Button
                type="submit"
                label={isEditMode ? "Simpan Data" : "Simpan Data"}
                disabled={isLoadingProcess}
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
