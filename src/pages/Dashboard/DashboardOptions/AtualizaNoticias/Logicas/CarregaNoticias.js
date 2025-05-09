import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export function carregaNoticias()
{
    const [noticias, setNoticias] = useState(false);
    const [noticiasRecebidas, setNoticiasRecebidas] = useState([]);
    

    async function RecebeNoticias() {
        try {
          const response = await axios.get('https://web-production-7ea7.up.railway.app/coletaNoticias', {
            withCredentials: true
          });
    
          if (response.status === 200 && Array.isArray(response.data.noticias)) {
            setNoticiasRecebidas(response.data.noticias);
            setNoticias(true);
          } else {
            setNoticias(false);
          }
        } catch (error) {
          setNoticias(false);
        }
      }
    
      useEffect(() => {
        RecebeNoticias();
      }, []);

      return{
        noticias,
        noticiasRecebidas,
      }
}