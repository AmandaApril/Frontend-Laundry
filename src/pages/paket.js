import React from "react"
import Navbar from "../component/navbar"
import PaketList from "../component/PaketList"
import { base_url, paket_image_url } from "../config"
import { RiRedPacketLine } from "react-icons/ri";
 
// import axios
import axios from "axios"
 
// import jquery
import $ from "jquery"

export default class Paket extends React.Component{
    constructor(){
        super()
        this.state = {
            paket: [],
            token: "",
            action: "",
            jenis_paket: "",
            harga: 0,
            image: "",
            uploadFile: true,
            id_paket: ""
        }
 
        /* logika if-else --> untuk mengecek apakah user yg mengakses telah melakukan
           login sebagai admin atau belum
        */
           if (localStorage.getItem("token")) {
               this.state.token = localStorage.getItem("token")
               this.state.role = JSON.parse(localStorage.getItem("user")).role

        } else {
            window.location = "/login"
        }
        this.headerConfig.bind(this)

    }
    // header config -> untuk memberikan header berupa 'beare token' sebagai request API
    // sebelum mengakses data
    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}`}
        }
        if (this.state.role === "kasir")  this.props.history.push("/login")
        return header
    }
// getPaket -> untuk mengakses API get paket
getPaket = () => {
    let url = base_url + "/paket"
    axios.get(url, this.headerConfig())
    .then(response => {
        this.setState({paket: response.data})
    })
    .catch(error => {
        if (error.response) {
            if (error.response.status) {
                window.alert(error.response.data.message)
                this.props.history.push("/login")
            }
        } else {
            console.log(error);
        }
    })
}

componentDidMount() {
    this.getPaket()
}
// function add -> untuk memberikan inisialisasi data dan menampilkan modal untuk menambah data
    Add = () => {
        $("#modal_paket").modal("show")
        this.setState({
            action: "insert",
            id_paket: 0,
            jenis_paket: "",
            harga: 0,
            image: null,
            uploadFile: true
        })
    }

// function edit -> untuk memberikan inisialisasi data dan menampilkan modal untuk mengedit data
    Edit = selectedItem => {
        $("#modal_paket").modal("show")
        this.setState({
            action: "update",
            id_paket: selectedItem.id_paket,
            jenis_paket: selectedItem.jenis_paket,
            harga: selectedItem.harga,
            image: null,
            uploadFile: false
        })
    }
// function savePaket -> untuk menyimpan data pada db dengan mngakses API
    savePaket = event => {
        event.preventDefault()
        $("#modal_paket").modal("hide")
        let form = new FormData()
        form.append("id_paket", this.state.id_paket)
        form.append("jenis_paket", this.state.jenis_paket)
        form.append("harga", this.state.harga)

        if (this.state.uploadFile) {
            form.append("image", this.state.image)
        }

        let url = base_url + "/paket"
        if (this.state.action === "insert") {
            axios.post(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getPaket()
            })
            .catch(error => console.log(error))
        } else if(this.state.action === "update") {
            axios.put(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getPaket()
            })
            .catch(error => console.log(error))
        }
    }
    // dropPaket -> untuk menghapus data paket
        dropPaket = selectedItem => {
            if (window.confirm("Yakin mau dihapus ?")) {
                let url = base_url + "/paket/" + selectedItem.id_paket
                axios.delete(url, this.headerConfig())
                .then(response => {
                    window.alert(response.data.message)
                    this.getPaket()
                })
                .catch(error => console.log(error))
            }
        }


render(){
    return(
        <div>
            <Navbar role={ this.state.role}/>
            <div className="container">
                <h3 className="text-bold text-dark mt-2">
                    <RiRedPacketLine class="iconpaket"/>
                    Paket List
                </h3>
                <div className="row">
                    { this.state.paket.map( item => (
                        <PaketList
                        key = {item.id_paket} 
                        jenis_paket = {item.jenis_paket}
                        harga = {item.harga}
                        image = {paket_image_url + "/" + item.image}
                        onEdit = {() => this.Edit(item)}
                        onDrop = {() => this.dropPaket(item)}
                        />
                    )) }
                </div>
                <button className="btn btn-success" onClick={() => this.Add()}>
                    Add Paket
                </button>
            </div>

            {/* modal paket */}
            <div className="modal fade" id="modal_paket">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-info text-white">
                            <h4>Form Paket</h4>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={ev => this.savePaket(ev)}>
                                Jenis Paket
                                <input type="text" className="form-control mb-1"
                                 value={this.state.jenis_paket}
                                 onChange={ev => this.setState({jenis_paket: ev.target.value})}
                                 required
                                 />

                                Harga
                                <input type="number" className="form-control mb-1"
                                 value={this.state.harga}
                                 onChange={ev => this.setState({harga: ev.target.value})}
                                 required
                                 />

                                 {this.state.action === "update" && this.state.uploadFile === false ? (
                                     <button className="btn btn-sm btn-dark mb-1 btn-block"
                                     onClick={() => this.setState({uploadFile: true})}>
                                         Change Paket Image
                                     </button>
                                 ) : (
                                     <div>
                                         Paket Image
                                         <input type="file" className="form-control mb-1"
                                         onChange={ev => this.setState({image: ev.target.files[0]})}
                                         required
                                         />
                                     </div>
                                 )}

                                 <button type="submit" className="btn btn-block btn-success">
                                     Simpan
                                 </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
}