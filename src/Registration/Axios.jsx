import axios from "axios"
{/*Author: Pranav Singh"*/}
const API_BASE = import.meta.env.VITE_API_BASE_URL
const BaseURL = `${API_BASE}/api`

const Axios = axios.create({
    baseurl: BaseURL,
    timeout:5000,
    headers:{
        "Content-Type":"application/json",
        accept: "application/json"
    }
})

export default Axios