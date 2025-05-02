import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export function recebeInsereNoticias() {

  const [tipoModal, setTipoModal] = useState({
    adicionar: false,
    deletar: false
  });
  const [imagemFile, setImagemFile] = useState(null);
  const fileInputRef = useRef(null);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [mensagemNoticia, setmensagemNoticia] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setisLoading] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemFile(file);
      const url = URL.createObjectURL(file);
      setImagemPreview(url);
    }
  };



  async function EnviarNoticia() {
    setisLoading(true);
    if (!imagemFile) {
      setError("Por favor, selecione uma imagem antes de enviar.");
      setisLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('mensagem', mensagemNoticia);
      formData.append('imagem', imagemFile);

      const response = await axios.post('https://web-production-7ea7.up.railway.app/enviafunc/usuario/noticia', formData, {
        withCredentials: true
      });

      if (response.status === 200) {
        setTipoModal({ ...tipoModal, adicionar: false });
        setTimeout(() => window.location.reload(), 1000);
        setError("");
      } else if (response.data && response.data.error) {
        setError(response.data.error);
      } else {
        setError("Erro ao enviar notícia.");
      }
    } catch (error) {

      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Erro inesperado ao enviar notícia.");
      }
    } finally {
      setisLoading(false);
    }
  }


  return {
    tipoModal, setTipoModal,
    imagemFile, setImagemFile,
    fileInputRef,
    imagemPreview,
    mensagemNoticia, setmensagemNoticia,
    error, setError,
    isLoading,
    handleButtonClick,
    handleFileChange,
    EnviarNoticia,
  };
}

