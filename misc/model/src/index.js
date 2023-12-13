import axios from "axios";

const url = "http://localhost:3000/api/advice/keywords?prefix=a&count=0";

async function main() {
    const response = await axios.get(url, {
        method: "GET",
        headers: {
            "Accept": "application/json; charset=utf-8"
        },
        validateStatus: null
    });
    console.log(response.status);
    console.log(JSON.stringify(response.data, null, 2));
}

main();
