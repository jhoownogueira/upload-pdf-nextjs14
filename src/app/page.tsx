"use client";
import { api } from "@/services/api";
import {
  DownloadSimple,
  FilePdf,
  MagnifyingGlass,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

interface IFileList {
  id: string;
  nome_arquivo: string;
  autor_arquivo: string;
  url_arquivo: string;
  created_at: string;
}

export default function Home() {
  const [files, setFiles] = useState<IFileList[]>([]);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [],
    },
    maxFiles: 1,
  });

  useEffect(() => {
    getAllFiles();
  }, []);

  const getAllFiles = async () => {
    try {
      const response = await api.get("/tcc/archives");
      setFiles(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const saveFile = async () => {
    try {
      const data = new FormData();
      data.append("nome_arquivo", name);
      data.append("autor_arquivo", author);
      data.append("file", acceptedFiles[0]);

      if (!name || !author || !acceptedFiles[0]) {
        alert("Preencha todos os campos");
        return false;
      }

      await api.post("/tcc/archives", data);
      getAllFiles();
      setName("");
      setAuthor("");
      acceptedFiles.splice(0, 1);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadFile = async (filename: string) => {
    try {
      const response = await api.get(`/tcc/download/${filename}`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const searchFile = async () => {
      try {
        const response = await api.get(`/tcc/search/${pesquisa}`);
        setFiles(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (pesquisa.length > 0) {
      searchFile();
    } else {
      getAllFiles();
    }
  }, [pesquisa]);

  return (
    <>
      <main className="w-full flex flex-col p-8">
        <header className="w-full flex flex-col items-center justify-center mb-4">
          <Image src="logo.svg" alt="logotipo-tcc" width={100} height={100} />
          <h1 className="text-xl font-bold tracking-tighter">
            Repositório de TCC
          </h1>
        </header>
        <section className="flex flex-col p-4 bg-gray-300 rounded-md mb-4">
          <div className="flex max-sm:flex-col max-sm:gap-2">
            <input
              type="text"
              placeholder="Nome"
              className="w-full h-[48px] border-b border-b-gray-400 p-2 mr-2 text-gray-600 focus:outline-none focus:border-blue-900"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Autor"
              className="w-full h-[48px] border-b border-b-gray-400 p-2 mr-2 text-gray-600 focus:outline-none focus:border-blue-900"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <div {...getRootProps({ className: "dropzone" })}>
              <input className="w-full" {...getInputProps()} />
              <p className=" flex items-center justify-center border border-gray-400 border-dashed rounded-md p-2 mr-2 text-gray-600 cursor-pointer hover:bg-blue-50 transition-all">
                <FilePdf size={32} />
              </p>
            </div>
            <button
              onClick={saveFile}
              className="flex items-center justify-center gap-2 font-bold text-gray-100 bg-black py-2 px-4 rounded-md hover:bg-gray-900 transition-all"
            >
              Enviar <PaperPlaneTilt size={24} />
            </button>
          </div>
        </section>

        <fieldset className="relative w-full">
          <input
            type="text"
            placeholder="Pesquisar"
            className="w-full h-[32px] border border-gray-400 p-4 pr-9 text-sm text-gray-600 rounded-md focus:outline-none focus:border-gray-900"
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
          />
          <div className="absolute top-1 right-2">
            <MagnifyingGlass size={24} />
          </div>
        </fieldset>

        <table className="w-full border-collapse text-left overflow-clip rounded-lg mt-4">
          <thead className="bg-gray-900">
            <tr>
              <th className="p-4 text-white">Nome</th>
              <th className="p-4 text-white max-w-[200px] max-sm:hidden">
                Autor
              </th>
              <th className="p-4 text-white w-[32px]">Link</th>
              <th className="p-4 text-white w-[150px] max-sm:hidden">Data</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id}>
                <td className="p-4 text-gray-700 border-b border-gray-400 overflow-hidden whitespace-nowrap text-overflow-ellipsis">
                  {file.nome_arquivo}
                </td>
                <td className="p-4 text-gray-700 border-b border-b-gray-400 overflow-hidden whitespace-nowrap text-overflow-ellipsis max-w-[200px] max-sm:hidden">
                  {file.autor_arquivo}
                </td>
                <td className="p-4 text-gray-700 border-b border-b-gray-400 w-[32px]">
                  <button onClick={() => downloadFile(file.url_arquivo)}>
                    <DownloadSimple size={24} />
                  </button>
                </td>
                <td className="p-4 text-gray-700 border-b border-b-gray-400 w-[150px] max-sm:hidden">
                  {new Intl.DateTimeFormat("pt-BR").format(
                    new Date(file.created_at)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <footer className=" w-full bg-gray-300 px-8 py-12">
        <small className="text-xs font-bold">Desenvolvido por:</small>
        <p className="text-sm">
          jhowcodes <strong></strong>
        </p>
      </footer>
    </>
  );
}
