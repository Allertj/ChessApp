// import React, { useState, useEffect } from "react";

// function useFetch(uri: string, requestOptions: any) {
//     const [data, setData] = useState();
//     const [error, setError] = useState();
//     const [loading, setLoading] = useState(true);
//     useEffect(() => {
//         if (!uri) return;
//             fetch(uri, requestOptions)
//                 .then(data => data.json())
//                 .then(setData)
//                 .then(() => setLoading(false))
//                 .catch(setError);
//     }, [uri]);

//     return { loading, data, error };
// }

// function usePOSTFetch(uri: string, body: any, token = null) {
//     const requestOptions = {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json',
//                    "x-access-token": token},
//         body: JSON.stringify(body)
//       };
//     return useFetch(uri, requestOptions)  
// }

// function useGETFetch(uri: string, token = null) {
//     const requestOptions = {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json',
//                    "x-access-token": token}
//       };
//     return useFetch(uri, requestOptions) 
// } 

// export { useFetch, usePOSTFetch, useGETFetch }
export {}