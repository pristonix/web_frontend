const API_URL = process.env.REACT_APP_API_URL || 'https://web-backend-8rdu.onrender.com';

export async function fetcher(endpoint: string) {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
}

export async function postData(endpoint: string, data: any) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to post data');
    return res.json();
}
export async function patchData(endpoint: string, data: any) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to patch data');
    return res.json();
}
