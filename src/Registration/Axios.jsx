import axios from "axios"
{/*Author: Pranav Singh"*/}

const BaseURL = "http://127.0.0.1:8000/api"

const Axios = axios.create({
    baseurl: BaseURL,
    timeout:5000,
    headers:{
        "Content-Type":"application/json",
        accept: "application/json"
    }
})

export default Axios