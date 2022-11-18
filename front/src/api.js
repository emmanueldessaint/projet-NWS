export const getMaterielsApi = () => {
    return fetch("http://localhost:8000/api/getAllStudents").then((resp) => {
        if (resp.status == 200) return resp.json();
        else throw new Error('Invalid response');
    })
}