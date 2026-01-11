export async function fetchTableData(page: number, limit: number) {
    const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${limit}`);
    
    if(!response.ok) {
        throw new Error('Failed to fetch table data');
    }
    const data = await response.json();
    return data;
}