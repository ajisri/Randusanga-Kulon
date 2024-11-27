import React, { useState, useEffect } from "react";
import useSWR from "swr"; // Import SWR
import { TabView, TabPanel } from "primereact/tabview";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// reactstrap components
import { Button, Row, Col } from "reactstrap";

import "primereact/resources/themes/saga-blue/theme.css"; // Import tema
import "primereact/resources/primereact.min.css"; // Import CSS utama PrimeReact

const fetcher = (url) => fetch(url).then((res) => res.json());

const Modalt = () => {
  const [apbdpList, setApbdpList] = useState([]);
  const [isDetailDialogVisible, setDetailDialogVisible] = useState(false);
  const [selectedKeuangan, setSelectedKeuangan] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogVisiblePH, setDialogVisiblePH] = useState(false);
  const [dialogVisibleAPB, setDialogVisibleAPB] = useState(false);
  const [dialogVisibleD, setDialogVisibleD] = useState(false);

  const { data: produkhukumData, error: produkhukumError } = useSWR(
    "https://randusanga-kulonbackend-production.up.railway.app/produk_hukump",
    fetcher
  );
  const loadingProdukhukum = !produkhukumData && !produkhukumError;

  const produkhukumList = produkhukumData?.produkHukump || [];

  // Fetch APBD data
  const { data: allapbdData, error: allapbdError } = useSWR(
    "https://randusanga-kulonbackend-production.up.railway.app/allapbdp",
    fetcher
  );
  const loadingApbd = !allapbdData && !allapbdError;

  // Ambil data APBD dari API dan simpan ke state
  useEffect(() => {
    if (allapbdData?.data) {
      setApbdpList(allapbdData.data);
    }
  }, [allapbdData]);

  // Debugging: log struktur data
  useEffect(() => {
    if (allapbdData) {
      console.log(
        "Struktur data dari API:",
        JSON.stringify(allapbdData, null, 2)
      );
    }
  }, [allapbdData]);

  const dialogFooterTemplate = () => {
    return (
      <Button
        label="Ok"
        icon="pi pi-check"
        onClick={() => setDialogVisible(false)}
      />
    );
  };

  const dialogFooterTemplatePH = () => {
    return (
      <Button
        label="Ok"
        icon="pi pi-check"
        onClick={() => setDialogVisiblePH(false)}
      />
    );
  };

  const showDialog = () => {
    setDialogVisible(true);
  };

  const showDialogPH = () => {
    setDialogVisiblePH(true);
  };

  const showDialogAPB = () => {
    setDialogVisibleAPB(true);
  };

  const showDialogD = () => {
    setDialogVisibleD(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
  };

  const hideDialogD = () => {
    setDialogVisibleD(false);
  };

  const hideDialogAPB = () => {
    setDialogVisibleAPB(false);
  };

  const hideDialogPH = () => {
    setDialogVisiblePH(false);
  };

  const tab1HeaderTemplate = (options) => (
    <div
      className="flex align-items-center gap-2 p-3"
      style={{ cursor: "pointer" }}
      onClick={options.onClick}
    >
      <i className="ni ni-paper-diploma"></i>
      <span className="font-bold white-space-nowrap">Tata Laksana</span>
    </div>
  );

  const tab2HeaderTemplate = (options) => (
    <div
      className="flex align-items-center gap-2 p-3"
      style={{ cursor: "pointer" }}
      onClick={options.onClick}
    >
      <i className="ni ni-tv-2"></i>
      <span className="font-bold white-space-nowrap">Pengawasan</span>
    </div>
  );

  const tab3HeaderTemplate = (options) => (
    <div
      className="flex align-items-center gap-2 p-3"
      style={{ cursor: "pointer" }}
      onClick={options.onClick}
    >
      <i className="ni ni-building"></i>
      <span className="font-bold white-space-nowrap">Kualitas Layanan</span>
      {/* <Badge value="2" /> */}
    </div>
  );

  const tab4HeaderTemplate = (options) => (
    <div
      className="flex align-items-center gap-2 p-3"
      style={{ cursor: "pointer" }}
      onClick={options.onClick}
    >
      <i className="ni ni-user-run"></i>
      <span className="font-bold white-space-nowrap">Partisipasi</span>
    </div>
  );

  const tab5HeaderTemplate = (options) => (
    <div
      className="flex align-items-center gap-2 p-3"
      style={{ cursor: "pointer" }}
      onClick={options.onClick}
    >
      <i className="ni ni-badge"></i>
      <span className="font-bold white-space-nowrap">Kearifan Lokal</span>
    </div>
  );

  const openDetailDialog = (rowData) => {
    console.log("Data yang dipilih:", rowData);

    if (Array.isArray(rowData.keuangan) && rowData.keuangan.length > 0) {
      setSelectedKeuangan(rowData.keuangan);
      setDetailDialogVisible(true);
    } else {
      console.error("Data keuangan kosong:", rowData);
    }
  };

  const closeDetailDialog = () => {
    setDetailDialogVisible(false);
    setSelectedKeuangan(null);
  };

  return (
    <>
      <h2 className="mt-sm mb-2">
        <span></span>
      </h2>
      <Row>
        <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialog}
          >
            Desa Ankor
          </Button>
          <div className="card">
            <Dialog
              header="Desa Ankor"
              visible={dialogVisible}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={hideDialog}
              footer={dialogFooterTemplate}
            >
              <TabView>
                <TabPanel header="Header I" headerTemplate={tab1HeaderTemplate}>
                  <Accordion activeIndex={0}>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Perdes Tentang Perencanaan, Pelaksanaan,
                            Penatausahaan, dan Pertanggungjawaban APBDes
                          </span>
                          {/* <Badge value="3" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan SOP Mengenai Mekanisme Pengawasan dan
                            Evaluasi Kinerja Perangkat Desa
                          </span>
                          {/* <Badge value="4" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, totam rem
                        aperiam, eaque ipsa quae ab illo inventore veritatis et
                        quasi architecto beatae vitae dicta sunt explicabo. Nemo
                        enim ipsam voluptatem quia voluptas sit aspernatur aut
                        odit aut fugit, sed quia consequuntur magni dolores eos
                        qui ratione voluptatem sequi nesciunt. Consectetur,
                        adipisci velit, sed quia non numquam eius modi.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Perdes/Keputusan Kepala Desa Tentang
                            Pengendalian Penerimaan Gratifikasi, Suap, dan
                            Konflik Kepentingan
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Perjanjian Kerjasama Antara Pelaksana
                            Kegiatan Anggaran dengan Pihak Penyedia dan Telah
                            Melalui Proses PBJ di Desa
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Perdes/Keputusan Kepala Desa/SOP Tentang
                            Pakta Integritas dan Sejenisnya
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                  </Accordion>
                </TabPanel>
                <TabPanel
                  headerTemplate={tab2HeaderTemplate}
                  headerClassName="flex align-items-center"
                >
                  <Accordion activeIndex={0}>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Kegiatan Pengawasan dan Evaluasi Kinerja
                            Perangkat Desa
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Tindak Lanjut Pembinaan, Petunjuk,
                            Arahan, Pengawasan, dan Pemeriksaan Dari Pemerintah
                            Pusat/Daerah
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Tidak adanya Aparatur Desa yang Terjerat Tindak
                            Kriminal Dalam 3 (Tiga) Tahun Terakhir
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                  </Accordion>
                </TabPanel>
                <TabPanel
                  headerTemplate={tab3HeaderTemplate}
                  headerClassName="flex align-items-center"
                >
                  <Accordion activeIndex={0}>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Layanan Pengaduan Bagi Masyarakat
                          </span>
                          {/* <Badge value="3" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Survei Kepuasan Masyarakat Terhadap
                            Layanan Pemerintah Desa
                          </span>
                          {/* <Badge value="4" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, totam rem
                        aperiam, eaque ipsa quae ab illo inventore veritatis et
                        quasi architecto beatae vitae dicta sunt explicabo. Nemo
                        enim ipsam voluptatem quia voluptas sit aspernatur aut
                        odit aut fugit, sed quia consequuntur magni dolores eos
                        qui ratione voluptatem sequi nesciunt. Consectetur,
                        adipisci velit, sed quia non numquam eius modi.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keterbukaan dan Akses Masyarakat Desa Terhadap
                            Informasi Standar Pelayanan Minimal
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Media Informasi Tentang Apbdes di Balai
                            Desa dan atau Tempat Lain yang Mudah di Akses Warga
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Maklumat Pelayanan
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                  </Accordion>
                </TabPanel>
                <TabPanel
                  headerTemplate={tab4HeaderTemplate}
                  headerClassName="flex align-items-center"
                >
                  <Accordion activeIndex={0}>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/onyamalimba.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Survei Kepuasan Masyarakat Terhadap
                            Layanan Pemerintah Desa
                          </span>
                          {/* <Badge value="4" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit
                        voluptatem accusantium doloremque laudantium, totam rem
                        aperiam, eaque ipsa quae ab illo inventore veritatis et
                        quasi architecto beatae vitae dicta sunt explicabo. Nemo
                        enim ipsam voluptatem quia voluptas sit aspernatur aut
                        odit aut fugit, sed quia consequuntur magni dolores eos
                        qui ratione voluptatem sequi nesciunt. Consectetur,
                        adipisci velit, sed quia non numquam eius modi.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Kesadaran Masyarakat Dalam Mencegah Terjadinya
                            Praktik Gratifikasi Suap dan Konflik Kepentingan
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keterlibatan Lembaga Kemasyarakatan Desa dan
                            Masyarakat Dalam Pelaksanaan Pembangunan Desa
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                  </Accordion>
                </TabPanel>
                <TabPanel
                  headerTemplate={tab5HeaderTemplate}
                  headerClassName="flex align-items-center"
                >
                  <Accordion activeIndex={0}>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Budaya Lokal/Hukum Adat Yang Mendorong
                            Upaya Pencegahan Tindak Pidana Korupsi\
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                    <AccordionTab
                      header={
                        <span className="flex align-items-center gap-2 w-full">
                          {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/ionibowcher.png" shape="circle" /> */}
                          <span className="font-bold white-space-nowrap">
                            Keberadaan Tokoh Masyarakat, Agama, Adat, Pemuda,
                            Kaum Perempuan yang Mendorong Upaya Pencegahan
                            Tindak Pidana Korupsi
                          </span>
                          {/* <Badge value="2" className="ml-auto" /> */}
                        </span>
                      }
                    >
                      <p className="m-0">
                        At vero eos et accusamus et iusto odio dignissimos
                        ducimus qui blanditiis praesentium voluptatum deleniti
                        atque corrupti quos dolores et quas molestias excepturi
                        sint occaecati cupiditate non provident, similique sunt
                        in culpa qui officia deserunt mollitia animi, id est
                        laborum et dolorum fuga. Et harum quidem rerum facilis
                        est et expedita distinctio. Nam libero tempore, cum
                        soluta nobis est eligendi optio cumque nihil impedit quo
                        minus.
                      </p>
                    </AccordionTab>
                  </Accordion>
                </TabPanel>
              </TabView>
            </Dialog>
          </div>
        </Col>
        <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogPH}
          >
            Produk Hukum
          </Button>
          <div className="card">
            <Dialog
              header="Produk Hukum"
              visible={dialogVisiblePH}
              style={{ width: "85vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={hideDialogPH}
              footer={dialogFooterTemplatePH}
            >
              {loadingProdukhukum ? (
                <p>Loading...</p>
              ) : produkhukumError ? (
                <p>Error loading data: {produkhukumError.message}</p>
              ) : produkhukumList.length === 0 ? (
                <p>No data available.</p>
              ) : (
                <DataTable
                  value={produkhukumList}
                  paginator
                  rows={5}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  tableStyle={{ minWidth: "50rem" }}
                >
                  <Column
                    field="name"
                    header="Name"
                    style={{ width: "25%", minWidth: "15%" }}
                  ></Column>
                  <Column
                    field="deskripsi"
                    header="Deskripsi"
                    style={{ width: "45%", minWidth: "15%" }}
                    headerStyle={{
                      textAlign: "center !important",
                    }}
                  />
                  <Column
                    field="waktu"
                    style={{ width: "20%", minWidth: "10%" }}
                    header="Tanggal SK"
                    body={(rowData) =>
                      new Date(rowData.waktu).toLocaleDateString()
                    } // Formatting the date
                  ></Column>
                  <Column
                    field="file_url"
                    style={{ width: "5%", minWidth: "5%" }}
                    header="Download"
                    body={(rowData) => {
                      const fileName = rowData.file_url.split("/").pop(); // Ambil nama file saja
                      return (
                        <a
                          href={`https://randusanga-kulonbackend-production.up.railway.app/download/${fileName}`} // Mengarahkan ke controller di backend
                          download
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            label="Download"
                            style={{
                              backgroundColor: "#008080", // Background teal
                              color: "white", // Warna teks
                              borderRadius: "8px", // Radius border
                              border: "none", // Tanpa border
                              padding: "10px 20px", // Padding
                              fontWeight: "bold", // Tebal teks
                              transition: "background-color 0.3s", // Efek transisi
                              cursor: "pointer", // Cursor pointer
                            }}
                          >
                            Download
                          </Button>
                        </a>
                      );
                    }}
                  ></Column>
                </DataTable>
              )}
            </Dialog>
          </div>
        </Col>
        <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogAPB}
          >
            APB Desa
          </Button>
          <div className="card">
            <Dialog
              header="APB Desa"
              visible={dialogVisibleAPB}
              style={{ width: "90vw", maxWidth: "none" }}
              maximizable
              modal
              contentStyle={{ height: "auto", padding: "1rem" }}
              onHide={hideDialogAPB}
              footer={dialogFooterTemplate}
            >
              {loadingApbd ? (
                <div className="loading-container">
                  <p>Loading...</p>
                </div>
              ) : allapbdError ? (
                <div className="error-container">
                  <p>Error loading data: {allapbdError.message}</p>
                </div>
              ) : apbdpList.length === 0 ? (
                <div className="no-data-container">
                  <p>No data available.</p>
                </div>
              ) : (
                <>
                  <DataTable
                    value={apbdpList}
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    style={{ marginBottom: "1rem" }}
                  >
                    <Column
                      field="name"
                      header="Name"
                      body={(rowData) => `${rowData.name} (${rowData.year})`}
                      style={{ width: "40%", minWidth: "30%" }}
                    ></Column>
                    <Column
                      header="Detail"
                      body={(rowData) => (
                        <Button
                          label="Lihat Detail"
                          onClick={() => openDetailDialog(rowData)}
                          className="p-button-rounded p-button-info"
                          style={{
                            backgroundColor: "#008080",
                            color: "white",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                        >
                          Detail
                        </Button>
                      )}
                      style={{ width: "20%", minWidth: "15%" }}
                    />
                    <Column
                      field="download"
                      header="Download"
                      body={(rowData) => (
                        <Button
                          label="Download"
                          style={{
                            backgroundColor: "#008080",
                            color: "white",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                          icon="pi pi-download"
                          onClick={() =>
                            console.log("Download data for:", rowData.name)
                          }
                        >
                          Download
                        </Button>
                      )}
                      style={{ width: "20%", minWidth: "15%" }}
                    />
                  </DataTable>

                  <Dialog
                    visible={isDetailDialogVisible}
                    onHide={closeDetailDialog}
                    style={{
                      width: "90vw",
                      height: "90vh",
                      margin: "0",
                      padding: "0",
                    }}
                    header="Detail Keuangan"
                    modal
                    dismissableMask
                    maximizable
                  >
                    <div style={{ height: "calc(100% - 50px)" }}>
                      <div
                        className="dialog-header"
                        style={{ padding: "1rem" }}
                      >
                        <Button
                          label="Close"
                          icon="pi pi-times"
                          onClick={closeDetailDialog}
                          className="p-button-danger"
                          style={{ marginBottom: "1rem" }}
                        />
                      </div>
                      {selectedKeuangan && (
                        <div
                          className="detail-content"
                          style={{
                            height: "calc(100% - 80px)",
                            width: "100%",
                            padding: "0",
                            margin: "0",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            className="table-responsive"
                            style={{
                              overflow: "auto",
                              height: "100%",
                              width: "100%",
                              border: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              padding: "1rem",
                            }}
                          >
                            <table
                              style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                backgroundColor: "#ffffff",
                              }}
                            >
                              <thead>
                                <tr
                                  style={{
                                    background:
                                      "linear-gradient(90deg, #3366cc, #5588ff)",
                                    color: "#ffffff",
                                  }}
                                >
                                  <th
                                    rowSpan="2"
                                    style={{
                                      padding: "0.8rem",
                                      border: "1px solid #dddddd",
                                      textAlign: "center",
                                    }}
                                  >
                                    No
                                  </th>
                                  <th
                                    rowSpan="2"
                                    style={{
                                      padding: "0.8rem",
                                      border: "1px solid #dddddd",
                                      textAlign: "center",
                                    }}
                                  >
                                    Keuangan
                                  </th>
                                  <th
                                    colSpan="2"
                                    style={{
                                      padding: "0.8rem",
                                      border: "1px solid #dddddd",
                                      textAlign: "center",
                                    }}
                                  >
                                    Kategori
                                  </th>
                                  <th
                                    colSpan="3"
                                    style={{
                                      padding: "0.8rem",
                                      border: "1px solid #dddddd",
                                      textAlign: "center",
                                    }}
                                  >
                                    Subkategori dan Anggaran
                                  </th>
                                </tr>
                                <tr
                                  style={{
                                    background: "#f1f1f1",
                                  }}
                                >
                                  <th
                                    style={{
                                      padding: "0.8rem",
                                      border: "1px solid #dddddd",
                                    }}
                                  >
                                    Nomor
                                  </th>
                                  <th
                                    style={{
                                      padding: "0.8rem",
                                      border: "1px solid #dddddd",
                                    }}
                                  >
                                    Nama Kategori
                                  </th>
                                  <th
                                    style={{
                                      padding: "0.8rem",
                                      border: "1px solid #dddddd",
                                      textAlign: "right",
                                    }}
                                  >
                                    Subkategori
                                  </th>
                                  <th
                                    style={{
                                      padding: "0.8rem",
                                      border: "1px solid #dddddd",
                                      textAlign: "right",
                                    }}
                                  >
                                    Total Budget
                                  </th>
                                  <th
                                    style={{
                                      padding: "0.8rem",
                                      border: "1px solid #dddddd",
                                      textAlign: "right",
                                    }}
                                  >
                                    Realisasi
                                  </th>
                                  <th
                                    style={{
                                      padding: "0.8rem",
                                      border: "1px solid #dddddd",
                                      textAlign: "right",
                                    }}
                                  >
                                    Sisa
                                  </th>
                                </tr>
                              </thead>

                              <tbody>
                                {selectedKeuangan?.length > 0 ? (
                                  selectedKeuangan.map(
                                    (keuangan, keuanganIndex) => (
                                      <React.Fragment
                                        key={keuangan.uuid || keuanganIndex}
                                      >
                                        {/* Header for Keuangan */}
                                        <tr>
                                          <td
                                            colSpan="6"
                                            style={{
                                              padding: "1rem",
                                              backgroundColor: "#f0f0f0",
                                            }}
                                          >
                                            <strong>{keuangan.name}</strong>{" "}
                                            <br />
                                            <span
                                              style={{
                                                fontSize: "0.9rem",
                                                color: "#666",
                                              }}
                                            ></span>
                                          </td>
                                        </tr>

                                        {/* Kategori Iteration */}
                                        {keuangan.kategori?.length > 0 ? (
                                          keuangan.kategori.map(
                                            (kategori, kategoriIndex) => (
                                              <React.Fragment
                                                key={
                                                  kategori.uuid || kategoriIndex
                                                }
                                              >
                                                <tr>
                                                  <td
                                                    colSpan="6"
                                                    style={{
                                                      backgroundColor:
                                                        "#e8f4fc",
                                                      padding: "0.8rem",
                                                    }}
                                                  >
                                                    <strong>
                                                      {kategori.number}.
                                                    </strong>{" "}
                                                    <strong>
                                                      {kategori.name}
                                                    </strong>
                                                  </td>
                                                </tr>

                                                {/* Subkategori Iteration */}
                                                {kategori.subkategori?.length >
                                                0 ? (
                                                  kategori.subkategori.map(
                                                    (sub, subIndex) => {
                                                      const formattedBudget =
                                                        new Intl.NumberFormat(
                                                          "id-ID",
                                                          {
                                                            style: "currency",
                                                            currency: "IDR",
                                                          }
                                                        ).format(
                                                          Number(
                                                            sub.totalBudget
                                                          ) || 0
                                                        );

                                                      const formattedRealization =
                                                        new Intl.NumberFormat(
                                                          "id-ID",
                                                          {
                                                            style: "currency",
                                                            currency: "IDR",
                                                          }
                                                        ).format(
                                                          Number(
                                                            sub.totalRealization
                                                          ) || 0
                                                        );

                                                      const formattedRemaining =
                                                        new Intl.NumberFormat(
                                                          "id-ID",
                                                          {
                                                            style: "currency",
                                                            currency: "IDR",
                                                          }
                                                        ).format(
                                                          Number(
                                                            sub.remaining
                                                          ) || 0
                                                        );

                                                      return (
                                                        <tr
                                                          key={
                                                            sub.uuid || subIndex
                                                          }
                                                        >
                                                          <td
                                                            style={{
                                                              padding: "0.8rem",
                                                            }}
                                                          ></td>
                                                          <td
                                                            colSpan="2"
                                                            style={{
                                                              padding: "0.8rem",
                                                              backgroundColor:
                                                                "#f8f8f8",
                                                            }}
                                                          >
                                                            {sub.name}
                                                          </td>
                                                          <td
                                                            style={{
                                                              textAlign:
                                                                "right",
                                                              padding: "0.8rem",
                                                            }}
                                                          >
                                                            {formattedBudget}
                                                          </td>
                                                          <td
                                                            style={{
                                                              textAlign:
                                                                "right",
                                                              padding: "0.8rem",
                                                            }}
                                                          >
                                                            {
                                                              formattedRealization
                                                            }
                                                          </td>
                                                          <td
                                                            style={{
                                                              textAlign:
                                                                "right",
                                                              padding: "0.8rem",
                                                            }}
                                                          >
                                                            {formattedRemaining}
                                                          </td>
                                                        </tr>
                                                      );
                                                    }
                                                  )
                                                ) : (
                                                  <tr>
                                                    <td
                                                      colSpan="6"
                                                      style={{
                                                        padding: "1rem",
                                                        textAlign: "center",
                                                      }}
                                                    >
                                                      Tidak ada subkategori
                                                    </td>
                                                  </tr>
                                                )}
                                              </React.Fragment>
                                            )
                                          )
                                        ) : (
                                          <tr>
                                            <td
                                              colSpan="6"
                                              style={{
                                                padding: "1rem",
                                                textAlign: "center",
                                              }}
                                            >
                                              Tidak ada kategori
                                            </td>
                                          </tr>
                                        )}
                                      </React.Fragment>
                                    )
                                  )
                                ) : (
                                  <tr>
                                    <td
                                      colSpan="6"
                                      style={{
                                        padding: "1rem",
                                        textAlign: "center",
                                      }}
                                    >
                                      Tidak ada data keuangan.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  </Dialog>
                </>
              )}
            </Dialog>
          </div>
        </Col>
        <Col className="mt-1" md="3" xs="6">
          <Button
            block
            className="btn-white btn-icon mb-3 mb-sm-0 video-button"
            color="default"
            type="button"
            icon="pi pi-external-link"
            onClick={showDialogD}
          >
            Download (menu informasi)
          </Button>
          <div className="card">
            <Dialog
              header="Download"
              visible={dialogVisibleD}
              style={{ width: "75vw" }}
              maximizable
              modal
              contentStyle={{ height: "300px" }}
              onHide={hideDialogD}
              footer={dialogFooterTemplate}
            >
              <DataTable
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25, 50]}
                tableStyle={{
                  width: "100%",
                  minWidth: "70rem",
                  maxWidth: "85rem",
                }}
                breakpoints={{
                  "960px": {
                    columns: [
                      { field: "name", header: "Name" },
                      { field: "deskripsi", header: "Deskripsi" },
                      // Add other columns you want to display for smaller screens
                    ],
                  },
                  "640px": {
                    columns: [
                      { field: "name", header: "Name" }, // You can hide columns based on screen size
                    ],
                  },
                }}
              >
                <Column field="name" header="Name"></Column>
                <Column field="description" header="description"></Column>
                <Column field="date" header="date"></Column>
                <Column
                  field="download"
                  header="download"
                  style={{ width: "5%" }}
                >
                  <Button label="Primary" text raised />
                </Column>
              </DataTable>
            </Dialog>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Modalt;
