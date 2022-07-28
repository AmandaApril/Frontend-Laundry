const base_url = "http://localhost:8000/laundry/api"
const paket_image_url = "http://localhost:8000/paket_image"

//tambahan script
const formatNumber = (num) => {
    return parseFloat(num).toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

export {
    base_url,
    paket_image_url,
    formatNumber
}