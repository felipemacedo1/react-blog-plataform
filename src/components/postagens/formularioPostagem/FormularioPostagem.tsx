import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { X } from "@phosphor-icons/react";
import { AuthContext } from "../../../contexts/AuthContext";
import Postagem from "../../../models/Postagem";
import Tema from "../../../models/Tema";
import { buscar, atualizar, cadastrar } from "../../../services/Service";
import { toastAlerta } from "../../../util/toastAlerta";

function FormularioPostagem() {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const { usuario, handleLogout } = useContext(AuthContext);
  const token = usuario.token;

  const [temas, setTemas] = useState<Tema[]>([]);

  const [tema, setTema] = useState<Tema>({
    id: 0,
    descricao: "",
    postagem: [],
  });

  const [postagem, setPostagem] = useState<Postagem>({
    id: 0,
    titulo: "",
    texto: "",
    data: "",
    tema: null,
    usuario: null,
  });

  async function buscarPostagemPorId(id: string) {
    await buscar(`/postagens/${id}`, setPostagem, {
      headers: {
        Authorization: token,
      },
    });
  }

  async function buscarTemaPorId(id: string) {
    await buscar(`/temas/${id}`, setTema, {
      headers: {
        Authorization: token,
      },
    });
  }

  async function buscarTemas() {
    await buscar("/temas", setTemas, {
      headers: {
        Authorization: token,
      },
    });
  }

  useEffect(() => {
    if (token === "") {
      toastAlerta("Você precisa estar logado", "info");
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    buscarTemas();
    if (id !== undefined) {
      buscarPostagemPorId(id);
    }
  }, [id]);

  useEffect(() => {
    setPostagem({
      ...postagem,
      tema: tema,
    });
  }, [tema]);

  function atualizarEstado(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setPostagem({
      ...postagem,
      [e.target.name]: e.target.value,
      tema: tema,
      usuario: usuario,
    });
  }

  function retornar() {
    navigate("/postagens");
  }

  async function gerarNovaPostagem(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    if (id != undefined) {
      try {
        await atualizar(`/postagens`, postagem, setPostagem, {
          headers: {
            Authorization: token,
          },
        });
        toastAlerta("Postagem atualizada com sucesso", "sucesso");
        retornar();
      } catch (error: any) {
        if (error.toString().includes("403")) {
          toastAlerta("O token expirou, favor logar novamente", "info");
          handleLogout();
        } else {
          toastAlerta("Erro ao atualizar a Postagem", "erro");
        }
      }
    } else {
      try {
        await cadastrar(`/postagens`, postagem, setPostagem, {
          headers: {
            Authorization: token,
          },
        });

        toastAlerta("Postagem cadastrada com sucesso", "sucesso");
        retornar();
      } catch (error: any) {
        if (error.toString().includes("403")) {
          toastAlerta("O token expirou, favor logar novamente", "info");
          handleLogout();
        } else {
          toastAlerta("Erro ao cadastrar a Postagem", "erro");
        }
      }
    }
  }

  const carregandoTema = tema.descricao === "";

  return (
    <div className="container flex flex-col mx-auto items-center relative">
      <button
        onClick={retornar}
        className="absolute top-4 right-4 text-gray-700 hover:text-red-600 transition-colors"
        title="Fechar Modal"
      >
        <X size={24} weight="bold" />
      </button>

      <h1 className="text-4xl text-center my-8">
        {id !== undefined ? "Editar Postagem" : "Cadastrar Postagem"}
      </h1>

      <form
        onSubmit={gerarNovaPostagem}
        className="flex flex-col w-1/2 gap-4 py-10"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="titulo">Titulo da postagem</label>
          <input
            value={postagem.titulo}
            onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            type="text"
            placeholder="Titulo"
            name="titulo"
            required
            className="border-2 border-slate-700 rounded p-2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="texto">Texto da postagem</label>
          <textarea
            value={postagem.texto}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              atualizarEstado(e)
            }
            placeholder="Escreva o texto da postagem aqui..."
            name="texto"
            required
            rows={4}
            className="border-2 border-slate-700 rounded p-2 resize-y"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p>Tema da postagem</p>
          <select
            name="tema"
            id="tema"
            className="border p-2 border-slate-800 rounded"
            onChange={(e) => buscarTemaPorId(e.currentTarget.value)}
          >
            <option value="" selected disabled>
              Selecione um tema
            </option>
            {temas.map((tema) => (
              <option value={tema.id} key={tema.id}>
                {tema.descricao}
              </option>
            ))}
          </select>
        </div>
        <button
          disabled={carregandoTema}
          type="submit"
          className="rounded disabled:bg-slate-200 bg-primary-dark hover:bg-primary-dark/90 text-white font-bold w-1/2 mx-auto block py-2"
        >
          {carregandoTema ? (
            <span>Carregando</span>
          ) : id !== undefined ? (
            "Editar"
          ) : (
            "Cadastrar"
          )}
        </button>
      </form>
    </div>
  );
}

export default FormularioPostagem;
