import {useState, useEffect} from 'react';



export const useFetch = (url, id, origin) => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                if(!id){
                    response = await fetch(url, {
                        headers: {'Origin': origin,}
                      });
                }else{
                    response = await fetch(`${url}/${id}`);   
                }
                const json = await response.json()
                
                console.log(json);
                setData(json);
            } catch (err) {
                console.error('Erro ao buscar livros:', err);
                setError(`Erro ao buscar livros:${err}`)
            }
            setLoading(false);
        };
        fetchData();
    

    }, [url, id, origin]);

    return { data, loading, error}
}


