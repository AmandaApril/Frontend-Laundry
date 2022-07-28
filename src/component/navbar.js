import React from "react"
import { Link } from "react-router-dom"
import {MdLocalLaundryService} from "react-icons/md";
class Navbar extends React.Component{
    Logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location = "/login"
    }
    render(){
        return(
            <div className="navbar navbar-expand-lg bg-light navbar-light">
                <a className="navbar-brand">
                <MdLocalLaundryService class="iconlaundry"/>
                    Laundry
                </a>
 
                {/* show and hide menu */}
                <button className="navbar-toggler" data-toggle="collapse"
                data-target="#menu">
                    <span className="navbar-toggler-icon"></span>
                </button>
 
                {/* menu */}
                <div id="menu" className="navbar-collapse collpase">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                Beranda
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/member" className="nav-link">
                                Member
                            </Link>
                        </li>
                        {this.props.role === "admin"?(<li className="nav-item">
                            <Link to="/user" className="nav-link">
                                Petugas
                            </Link>
                        </li>) : null}
                        {this.props.role === "admin" ? (
                            <li className="nav-item">
                            <Link to="/paket" className="nav-link">
                                Paket
                            </Link>
                        </li>
                        ):null}
                        <li className="nav-item">
                            <Link to="/transaksi" className="nav-link">
                                Transaksi
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" onClick={() => this.Logout()}>
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
export default Navbar;