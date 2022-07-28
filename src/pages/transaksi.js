import React from "react";
import axios from "axios";
import moment from "moment";
import { base_url, formatNumber } from "../config";
import { Link } from "react-router-dom";
import Navbar from "../component/navbar";
import domToPdf from "dom-to-pdf";
import * as FaIcons from "react-icons/fa"
class Transaksi extends React.Component {
    constructor() {
        super();
        this.state = {
            transaksi: [],
            role: "",
            visible: true,
        };

        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token");
            this.state.role = JSON.parse(localStorage.getItem("user")).role;
        } else {
            window.location = "/login";
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getData() {
        let endpoint = base_url + "/transaksi";
        axios
            .get(endpoint, this.headerConfig())
            .then((response) => {
                let dataTransaksi = response.data;
                for (let i = 0; i < dataTransaksi.length; i++) {
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga;
                        let qty = dataTransaksi[i].detail_transaksi[j].qty;
                        total += harga * qty;
                    }
                    dataTransaksi[i].total = total;
                }
                this.setState({ transaksi: dataTransaksi });
            })
            .catch((error) => console.log(error));
    }

    hapusTransaksi(id_transaksi) {
        if (window.confirm("Apakah anda yakin menghapus data ini?")) {
            let endpoint = `${base_url}/transaksi/${id_transaksi}`;
            axios
                .delete(endpoint, this.headerConfig())
                .then((response) => {
                    window.alert(response.data.message);
                    this.getData();
                })
                .catch((error) => console.log(error));
        }
    }

    convertStatus(id_transaksi, status, dibayar) {
        if (status === "baru" && dibayar === "belum_dibayar") {
            return (
                <>
                    <div className="badge" style={{backgroundColor: '#F4BBBB'}}>
                        Transaksi Baru
                        <FaIcons.FaAngleDoubleRight onClick={() =>
                            this.changeStatus(id_transaksi, 2)} />
                    </div>
                    <div className="badge bg-danger">
                        Belum dibayar
                    </div>
                </>
            )
        } else if (status === "proses" && dibayar === "belum_dibayar") {
            return (
                <>
                    <div className="badge" style={{backgroundColor: '#F1E1A6'}}>
                        Sedang diproses
                        <FaIcons.FaAngleDoubleRight onClick={() =>
                            this.changeStatus(id_transaksi, 3)} />
                    </div>
                    <div className="badge bg-danger">
                        Belum dibayar
                    </div>
                </>
            )
        } else if (status === "selesai" && dibayar === "belum_dibayar") {
            return (
                <>
                    <div className="badge" style={{backgroundColor: '#C3E5AE'}}>
                        Siap diambil
                        <FaIcons.FaAngleDoubleRight onClick={() =>
                            this.changeStatus(id_transaksi, 4)} />
                    </div>
                    <div className="badge bg-danger">
                        Belum dibayar
                    </div>
                </>
            )
        } else if (status === "diambil" || dibayar === "dibayar") {
            return (
                <>
                    <div className="badge" style={{backgroundColor: '#97DBAE'}}>
                        Telah diambil
                    </div>
                    <div className="badge" style={{backgroundColor: '#97DBAE'}}>
                        Sudah Dibayar
                    </div>
                </>
            )
        }
    }

    changeStatus(id, status) {
        if (window.confirm(`Apakah anda yakin mengubah status data ini ?`)) {
            let endpoint = `${base_url}/transaksi/status/${id}`;
            let data = {
                status: status,
            };
            axios
                .post(endpoint, data, this.headerConfig())
                .then((response) => {
                    window.alert(`Status transaksi telah diubah`);
                    this.getData();
                })
                .catch((error) => console.log(error));
        }
    }

    convertPdf() {
        //ambil elemen yang akan di convert
        let element = document.getElementById(`topdf`);
        let options = {
            filename: "laporan.pdf",
        };
        domToPdf(element, options, () => {
            window.alert("File akan segera di Download");
        });
    }

    getRole = () =>{
        let role = localStorage.getItem('role');
        this.setState({role:role})
    }

    componentDidMount(){ 
        this.getData()
        // this.getRole()
    }

    render() {
        const target = React.createRef();
        return (
            <div>
                <Navbar role={this.state.role} />
                <div className="transaction-pages" style={{ width: '100%'}}>
                    <div className="main-content">
                        <div className="container">
                            <div className="title-section row">
                                <div className="col-lg-5">
                                    <h2 style={{marginLeft: '397px', width: '100%'}}>
                                        <strong>Halaman Transaksi</strong>
                                    </h2>
                                    <h6 className="mt-3" style={{marginLeft: '380px', width: '100%'}}>
                                        Gulir ke bawah untuk melihat data transaksi
                                    </h6>
                                    <div className="btn-add mt-4">
                                        <a href="/FormTransaksi">
                                            <button
                                                style={{ "textDecoration": "none" }}
                                                className="text-white btn btn-primary mx-3 "
                                                onClick={() => this.add()} disabled={this.state.role === 'owner'}>
                                                Add Transaksi
                                            </button>
                                        </a>

                                        <button
                                            className="btn btn-success"
                                            onClick={() => this.convertPdf()}
                                        >
                                            Generate PDF
                                        </button>
                                    </div>
                                </div>
                                <div className="col-lg-3"></div>
                            </div>
                        </div>
                        <div className="main-data">
                            <div ref={target} id="topdf" className="container">
                                <h3>
                                    Data Transaksi
                                </h3>
                                <ul className="list-group">
                                    {this.state.transaksi.map((trans) => (
                                        <li className="list-group-item mt-3 card">
                                            <div className="row"/>
                                                {/* Member Area */}
                                                <div className="col-lg-1 px-0">
                                                    <small>
                                                        <b>{moment(trans.tgl).format("L")}</b>
                                                    </small>
                                                </div>
                                                <div className="col-lg-3 px-4">
                                                    <small><strong>Nama : </strong>{trans.member.nama_member}</small> <br />
                                                    <small><strong>Alamat : </strong>{trans.member.alamat}</small>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h6 className="text-secondary">Batas Waktu</h6>
                                                    <small>{moment(trans.batas_waktu).format("L")}</small>
                                                </div>
                                                <div className="col-lg-2">
                                                    <h6 className="text-secondary">Tanggal Bayar</h6>
                                                    <small>{moment(trans.tgl_bayar).format("L")}</small>
                                                </div>
                                                <div className="col-lg-2">
                                                    {this.convertStatus(trans.id_transaksi, trans.status,
                                                        trans.dibayar)}
                                                    {" "}
                                                </div>
                                                <div className="col-lg-2">
                                                    <b className="text-secondary">Total : </b>
                                                    <small> Rp {formatNumber(trans.total)}</small> <br />
                                                    <button onClick={() =>
                                                        this.hapusTransaksi(trans.id_transaksi)} disabled={this.state.role === 'owner'} 
                                                        className="btn btn-danger mt-2 btn-sm mx-2 me-md-2">
                                                    <FaIcons.FaTrashAlt />
                                                    </button>
                                            </div>
                                            {/* Detail Transaksi */}
                                            <h6 className="text-primary mt-3">Detail Transaksi</h6>
                                            {trans.detail_transaksi.map((detail) => (
                                                <div className="row">
                                                    {/* Jenis Paket */}
                                                    <div className="col-lg-3">
                                                        <h6>Paket</h6>
                                                        {detail.paket.jenis_paket}
                                                    </div>
                                                    {/* Quantiti */}
                                                    <div className="col-lg-2">
                                                        <h6>Qty</h6>
                                                        {detail.qty}
                                                    </div>
                                                    {/* Harga Paket */}
                                                    <div className="col-lg-3">
                                                        <h6>Harga Paket</h6>
                                                        Rp {formatNumber(detail.paket.harga)}
                                                    </div>
                                                    {/* Total */}
                                                    <div className="col-lg-4">
                                                        <h6>Total</h6>
                                                        Rp {formatNumber(detail.paket.harga * detail.qty)}
                                                    </div>
                                                </div>
                                            ))}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Transaksi;