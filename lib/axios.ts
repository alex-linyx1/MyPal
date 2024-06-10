import axios from "axios";

const instance = axios.create({
    proxy: {
        protocol: 'https',
        host: '189.240.60.169',
        port: 9090
    },
        headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`
        }
  });
  
  export default instance;