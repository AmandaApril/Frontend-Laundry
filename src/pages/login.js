import React from "react"
import axios from "axios" 
// import base_url dari file config.js
import { base_url } from "../config.js";
import bg_login  from "../images/bg_login.jpg"
import login_bg from "../images/login_bg1.jpg"

import "../css/pages.css"

export default class Login extends React.Component{
    constructor(){
        super()
        this.state = { 
            username: "",
            password: "",
            role: "admin",
            message: "",
            isLogged: false
        }
    }
    // arrow function -> untuk menjalankan fungsi login
    Login = event => {
        event.preventDefault()
        let sendData = {
            username: this.state.username,
            password: this.state.password,
            role: this.state.role
        }
 
        let url = base_url + "/auth"
 
        axios.post(url, sendData)
        .then(res => {
            this.setState({logged: res.data.logged})
            if (this.state.logged) {
                let user = res.data.data
                let token = res.data.token
                localStorage.setItem("user", JSON.stringify(user))
                localStorage.setItem("token", token)
                if (res.data.data.role !== this.state.role) window.alert(
                    "your option is not same with it account"
                )
                else this.props.history.push("/")
            } else {
                this.setState({message: res.data.message})
            }
        })
        .catch(error => console.log(error))
    } 

    
render(){
        return(
            <>
            <img src={login_bg} className="login_bg1" alt="login_bg1"/>
            <div className="dashboard container">
            <div className="row">
                <div className="col-lg-12 col-md-9">
                    <div className="hallo shadow-lg my-5">
                    <img src={bg_login} className="bg_login" alt="bg_login"/>
                            <div className="row">
                                <div className="col-lg-6 d-none d-lg-block bg-login-image">
                                </div>
                                <div className="col-lg-6 hello">
                                    <div className="p-5">
                                        <h4>Hello! Welcome back.</h4>
                                        <h6>Login to your account</h6>
                                        <br/><br/>
                                        <div className="text-center">
                                        </div>
                                        <form onSubmit={ev => this.Login(ev)}>
                                            <div className="form-group">
                                                <label>Username</label>
                                                <input type="text" className="form-control form-control-user" value={ this.state.username } onChange={ ev => this.setState({ username: ev.target.value }) } placeholder="Username"/>
                                            </div>
                                            <div className="form-group">
                                                <label>Password</label>
                                                <input type="password" className="form-control" value={ this.state.password } onChange={ ev => this.setState({ password: ev.target.value }) } placeholder="Password"/>
                                            </div>
                                            <div className="form-group">
                                                <label>Role</label>
                                                <select className="form-control" value={ this.state.role } onChange={ ev => this.setState({ role: ev.target.value }) }>
                                                    <option value="admin">Admin</option>
                                                    <option value="kasir">Kasir</option>
                                                    <option value="owner">Owner</option>
                                                </select>
                                            </div><br/>
                                            <button type="submit" className="btn btn-info btn-user btn-block"><h8>Login now</h8></button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
}

