import React,{Component} from "react";

export default class MemberList extends Component{

    render() {
        return(
            <div className="col-lg-4 col-sm-12 p-2">
                <div className="card">
                    <div className="card-body row">

                        {/* menampilkan deskripsi */}
                        <div className="col-7">
                            <h5 className="text-dark">
                                Name: {this.props.nama_member}
                            </h5>
                            <h6>Phone: {this.props.tlp}</h6>
                            <h6>Address: {this.props.alamat}</h6>
                        </div>

                        {/* action */}
                        <div className="col-5 mt-4">
                            {/* button untuk mengedit */}
                            <button className="btn btn-sm btn-primary m-1"
                            onClick={this.props.onEdit}>
                                Edit
                            </button>

                            {/* button untuk menghapus */}
                            <button className="btn btn-sm btn-danger m-1"
                            onClick={this.props.onDrop}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}