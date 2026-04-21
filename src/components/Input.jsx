import axios from "axios";
import { useState } from "react";

export function Input() {
  const [cnpj, setCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    cnpj: "",
    razao_social: "",
    nome_fantasia: "",
    situacao_cadastral: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cep: "",
    uf: "",
    municipio: "",
  });

  const formatCNPJ = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 14);
    return digits
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  };

  const fetchCNPJ = async (cnpjDigits) => {
    setLoading(true);
    setError(null);
    setForm({
      cnpj: "",
      razao_social: "",
      nome_fantasia: "",
      situacao_cadastral: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cep: "",
      uf: "",
      municipio: "",
    });
    try {
      const { data } = await axios.get(
        `https://api.opencnpj.org/${cnpjDigits}`,
      );
      console.log("Resposta da API:", data);
      setForm({
        cnpj: data.cnpj || "",
        razao_social: data.razao_social || "",
        nome_fantasia: data.nome_fantasia || "",
        situacao_cadastral: data.situacao_cadastral || "",
        logradouro:
          `${data.tipo_logradouro || ""} ${data.logradouro || ""}`.trim(),
        numero: data.numero || "",
        complemento: data.complemento || "",
        bairro: data.bairro || "",
        cep: data.cep || "",
        uf: data.uf || "",
        municipio: data.municipio || "",
      });
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError(
        "Não foi possível buscar os dados. Verifique o CNPJ e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCnpjChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 14);
    setCnpj(formatCNPJ(e.target.value));
    setError(null);

    if (digits.length === 14) {
      fetchCNPJ(digits);
    } else {
      setForm({
        cnpj: "",
        razao_social: "",
        nome_fantasia: "",
        situacao_cadastral: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cep: "",
        uf: "",
        municipio: "",
      });
    }
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isValid = cnpj.replace(/\D/g, "").length === 14;
  const isEmpty = cnpj.length === 0;
  const showForm = isValid && !loading && !error;

  const fields = [
    { name: "cnpj", label: "CNPJ: ", colSpan: "col-span-2" },
    { name: "razao_social", label: "Razão Social: ", colSpan: "col-span-2" },
    { name: "nome_fantasia", label: "Nome Fantasia: ", colSpan: "col-span-2" },
    {
      name: "situacao_cadastral",
      label: "Situação Cadastral: ",
      colSpan: "col-span-2",
    },
    { name: "logradouro", label: "Logradouro: ", colSpan: "col-span-2" },
    { name: "numero", label: "Número: ", colSpan: "col-span-1" },
    { name: "complemento", label: "Complemento: ", colSpan: "col-span-1" },
    { name: "bairro", label: "Bairro: ", colSpan: "col-span-2" },
    { name: "cep", label: "CEP: ", colSpan: "col-span-1" },
    { name: "uf", label: "UF: ", colSpan: "col-span-1" },
    { name: "municipio", label: "Município: ", colSpan: "col-span-2" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-xl">
        <h2 className="text-xl font-bold text-gray-700 mb-1">
          Consulta de CNPJ
        </h2>
        <p className="text-sm text-gray-400 mb-5">
          Digite o CNPJ para preencher os dados automaticamente
        </p>

        {/* CNPJ Input */}
        <label className="block text-sm font-medium text-gray-600 mb-1">
          CNPJ
        </label>
        <input
          type="text"
          value={cnpj}
          onChange={handleCnpjChange}
          placeholder="00.000.000/0000-00"
          maxLength={18}
          className={`w-full px-4 py-3 rounded-lg border-2 text-gray-700 text-base tracking-widest outline-none transition-all duration-200
            ${
              isEmpty
                ? "border-gray-300 focus:border-blue-400"
                : isValid
                  ? "border-green-400 focus:border-green-500"
                  : "border-red-400 focus:border-red-500"
            }`}
        />
        <div className="mt-1 mb-4 h-4">
          {!isEmpty && (
            <p
              className={`text-xs font-medium ${isValid ? "text-green-500" : "text-red-400"}`}
            >
              {isValid ? "✅ CNPJ completo" : "⚠️ CNPJ incompleto"}
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2 text-blue-500 text-sm my-4">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Buscando dados do CNPJ...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-500 text-sm mb-4">
            ❌ {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gray-200" />
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                Dados da Empresa
              </p>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {fields.map(({ name, label, colSpan }) => (
                <div key={name} className={colSpan}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={name}
                    value={form[name]}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
