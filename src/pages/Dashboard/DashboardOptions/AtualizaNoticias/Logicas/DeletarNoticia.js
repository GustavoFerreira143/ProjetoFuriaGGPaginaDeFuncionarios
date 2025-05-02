import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export function deletarNoticia() {

  const [isDelete, setIsDelete] = useState(false);
  const [erroDeletar, setErroDeletar] = useState('');
  const [noticiaSelecionada, setNoticiaSelecionada] = useState(
    {id: '', imagem: '', texto: ''}
  )

  function Deletar() {
    setIsDelete(true);
    setErroDeletar(''); // Limpa mensagens anteriores
  
    axios.post('https://web-production-7ea7.up.railway.app/notic/func/encia/delet', {
      id: noticiaSelecionada.id,
      imagem: noticiaSelecionada.imagem,
      texto: noticiaSelecionada.texto
    }, {
      withCredentials: true
    })
    .then(response => {
      if (response.status === 200) {
          window.location.reload();
      } else {
        setErroDeletar("Erro ao deletar notícia.");
      }
    })
    .catch(error => {
      if (error.response && error.response.data && error.response.data.error) {
        setErroDeletar(error.response.data.error);
      } else {
        setErroDeletar("Erro inesperado ao tentar deletar a notícia.");
      }
    })
    .finally(() => {
      setIsDelete(false);
    });
  }
  return {
    noticiaSelecionada, setNoticiaSelecionada, Deletar, isDelete, erroDeletar
  }

}
