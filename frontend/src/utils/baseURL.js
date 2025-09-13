const getBaseUrl = () => {
    return import.meta.env.backend_url || "http://localhost:5001"
}

export default getBaseUrl;