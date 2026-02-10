import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Sparkles, UploadCloud, AlertCircle, FileBadge, CheckCircle2, XCircle, Loader2, FileText, Building2 } from './Icons';
import { AnalyzerResult } from '../types';

export const AnalyzerView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState<string>('');
  const [result, setResult] = useState<AnalyzerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        } else {
          reject(new Error("Failed to convert file."));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Pre-processamento de imagens para melhorar OCR do GenAI
  const optimizeDocument = async (file: File): Promise<{ data: string, mimeType: string }> => {
    // Se for PDF, a engine do Google já extrai os vetores de texto perfeitamente, não convertemos para imagem.
    if (file.type === 'application/pdf') {
      const b64 = await fileToBase64(file);
      return { data: b64, mimeType: file.type };
    }

    // Se for imagem (foto do contracheque), aplicamos filtros de contraste e escala de cinza para forçar legibilidade
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          // Fallback se o navegador falhar com o canvas
          const b64 = await fileToBase64(file);
          return resolve({ data: b64, mimeType: file.type });
        }

        // Mantém as dimensões originais
        canvas.width = img.width;
        canvas.height = img.height;

        // Filtro agressivo de legibilidade documental (Cinza + Contraste Alto + Brilho)
        ctx.filter = 'grayscale(100%) contrast(160%) brightness(110%)';
        ctx.drawImage(img, 0, 0);

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve({ 
          data: optimizedDataUrl.split(',')[1], 
          mimeType: 'image/jpeg' 
        });
      };
      img.onerror = async () => {
        // Fallback em caso de erro no load
        const b64 = await fileToBase64(file);
        resolve({ data: b64, mimeType: file.type });
      }
      img.src = URL.createObjectURL(file);
    });
  };

  const analyzePaycheck = async () => {
    if (!file) return;

    try {
      setIsAnalyzing(true);
      setError(null);
      
      setAnalyzeStep('Otimizando legibilidade do documento...');
      const { data: base64Data, mimeType } = await optimizeDocument(file);

      // Ensure we're only sending supported types
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(mimeType)) {
        throw new Error("Formato não suportado. Por favor, envie um JPG, PNG ou PDF.");
      }

      setAnalyzeStep('Cruzando dados com as regras do Banco...');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const schema = {
        type: Type.OBJECT,
        properties: {
          legivel: { 
            type: Type.BOOLEAN, 
            description: "O documento é legível e parece ser um contracheque válido?" 
          },
          orgao: { 
            type: Type.STRING, 
            description: "Identifique o órgão: 'Exército', 'SIAPE' ou 'Desconhecido'" 
          },
          elegivel: { 
            type: Type.BOOLEAN, 
            description: "O cliente é elegível ESPECIFICAMENTE para a operação de Compra de Dívida (Transfer)?" 
          },
          alertaBancosBloqueados: {
            type: Type.BOOLEAN,
            description: "Verdadeiro se houver qualquer desconto referente aos bancos NÃO aceitos no transfer."
          },
          motivo: { 
            type: Type.STRING, 
            description: "Laudo completo com foco em COMPRA DE DÍVIDA: justificando a decisão baseado no Líquido Mínimo da tabela, status funcional (Temporários não passam, exceto SIAPE sem data fim), e bancos." 
          },
          dadosExtraidos: {
            type: Type.OBJECT,
            properties: {
              nome: { type: Type.STRING },
              cpf: { type: Type.STRING },
              precCatInd: { type: Type.STRING, description: "Se Exército, extraia o PREC, CAT e IND obrigatoriamente (ex: 34 / 1 / 2)." },
              matricula: { type: Type.STRING, description: "Se SIAPE, extraia a Matrícula." },
              liquido: { type: Type.NUMBER, description: "Valor líquido final recebido no mês." },
              faixaOperacao: { type: Type.STRING, description: "Baseado no líquido, informe qual faixa de operação ele suporta (ex: 'Operações até R$ 14.999,99')" },
              dividasIdentificadas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    banco: { type: Type.STRING },
                    valorParcela: { type: Type.NUMBER },
                    prazoRestante: { type: Type.STRING }
                  },
                  propertyOrdering: ["banco", "valorParcela", "prazoRestante"]
                }
              }
            },
            propertyOrdering: ["nome", "cpf", "precCatInd", "matricula", "liquido", "faixaOperacao", "dividasIdentificadas"]
          }
        },
        propertyOrdering: ["legivel", "orgao", "elegivel", "alertaBancosBloqueados", "motivo", "dadosExtraidos"],
        required: ["legivel", "orgao", "elegivel", "alertaBancosBloqueados", "motivo", "dadosExtraidos"]
      };

      const prompt = `
        Você é um Auditor Sênior Implacável de Crédito Consignado.
        Analise a imagem/PDF otimizado deste contracheque e valide ESTRITAMENTE contra as seguintes regras de TRANSFERÊNCIA (COMPRA DE DÍVIDA):
        
        [REGRA 1 - LÍQUIDO MÍNIMO OBRIGATÓRIO (Exército e SIAPE)]
        Verifique o líquido recebido pelo cliente e classifique sua capacidade:
        - Líquido >= R$ 1.000,00 -> "Liberado para operações de R$ 50.000,00 até R$ 195.000,00"
        - Líquido >= R$ 500,00 -> "Liberado para operações de R$ 15.000,00 a R$ 49.999,99"
        - Líquido >= R$ 250,00 -> "Liberado para operações de R$ 3.000,00 a R$ 14.999,99"
        - Líquido >= R$ 100,00 -> "Liberado apenas para operações até R$ 2.999,99"
        - Líquido < R$ 100,00 -> REPROVADO (Não atinge o mínimo de 100 reais).

        [REGRA 2 - EXÉRCITO: VALIDAÇÃO DE PREC, CAT E IND]
        Para Transferência, TEMPORÁRIOS DO EXÉRCITO SÃO SUMARIAMENTE RECUSADOS. Reintegrados por Justiça (PREC 37) SÃO RECUSADOS.
        - ATIVOS CARREIRA (ACEITOS): PRECs 2, 4, 10, 12, 14, 22, 23, 24, 25, 26, 33, 36, 40, 60. E PRECs 30 e 34 SOMENTE SE O 'IND' FOR 1.
        - INATIVOS/PENSIONISTAS (ACEITOS): PREC 96 e 98.
        - TEMPORÁRIOS DO EXÉRCITO (RECUSAR PARA TRANSFER): PRECs 35, 41, 43. E PRECs 30 e 34 SE O 'IND' FOR 2 OU 3.
        
        [REGRA 3 - SIAPE: UPAGs E SITUAÇÕES ATENDIDAS / NÃO ATENDIDAS]
        - ACEITOS: Servidores Ativos, Inativos, Aposentados e Pensionistas Vitalícios.
        - PENSIONISTAS TEMPORÁRIOS SIAPE: SÃO ACEITOS, DESDE QUE NÃO exista uma data de término/prazo limite impressa no contracheque. Se houver data de término = RECUSAR. Se não houver data de término = ACEITAR.
        - RECUSAR: Celetistas, Comissionados, Estagiários, Contratados sem vínculo.
        - RECUSAR UPAGS: AMAZÔNIA AZUL, CBTU, CONAB, EBSERH, EMBRAPA, DATAPREV, INB, VALEC, Hospitais Clínicas.
        
        [REGRA 4 - BANCOS BLOQUEADOS NO TRANSFER]
        Se NOME de qualquer dívida atual bater com esta lista, marque alertaBancosBloqueados = true:
        Capital Consig, Ciasprev, Eagle FHE MAT, Futuro Previdência, Hoje Previdência, Inbursa, Pecúlio União, Sabemi, Simpala.
        
        Gere o laudo sendo muito técnico, citando a regra que aprovou ou reprovou (ex: "Reprovado pois PREC 34 IND 2 é militar temporário", ou "Aprovado: SIAPE Pensionista Temporário sem data de término", ou "Líquido de R$85 não atinge o mínimo de R$100").
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.1,
        }
      });

      if (response.text) {
        let text = response.text.trim();
        if (text.startsWith('```json')) {
          text = text.substring(7, text.length - 3).trim();
        } else if (text.startsWith('```')) {
          text = text.substring(3, text.length - 3).trim();
        }
        
        const parsedResult = JSON.parse(text);
        setResult(parsedResult);
      } else {
        throw new Error("Não foi possível gerar a análise.");
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro ao processar o contracheque. Tente novamente.");
    } finally {
      setIsAnalyzing(false);
      setAnalyzeStep('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* Header Area */}
      <div className="bg-gradient-to-r from-[#0A192F] to-[#112240] p-8 rounded-2xl shadow-lg border border-[#1c355c] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="text-[#D4AF37]" size={32} />
            Auditoria de Compra de Dívida
          </h1>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
            Nossa IA aplica pré-processamento de imagem (alto contraste) para ler documentos difíceis e cruza os dados extraídos fielmente com a tabela de Líquido Mínimo, regras de PREC/IND e restrições bancárias do Corban.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg, image/png, application/pdf" 
            className="hidden" 
          />
          
          <div 
            onClick={() => !isAnalyzing && fileInputRef.current?.click()}
            className={`w-full max-w-sm border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4
              ${isAnalyzing ? 'border-slate-300 bg-slate-50 cursor-not-allowed' : 
                file ? 'border-[#D4AF37] bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10' : 
                'border-slate-300 hover:border-[#0A192F] hover:bg-slate-50'}`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin text-[#D4AF37]" size={48} />
                <p className="font-semibold text-slate-600 mt-2">Processando...</p>
                <p className="text-xs text-[#D4AF37] font-medium">{analyzeStep}</p>
              </>
            ) : file ? (
              <>
                <FileBadge className="text-[#D4AF37]" size={48} />
                <div>
                  <p className="font-semibold text-[#0A192F] truncate max-w-[200px]">{file.name}</p>
                  <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <p className="text-xs text-[#D4AF37] font-medium mt-2 underline">Clique para trocar o arquivo</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                  <UploadCloud className="text-slate-500" size={32} />
                </div>
                <p className="font-semibold text-[#0A192F]">Anexar Contracheque (PDF/IMG)</p>
                <p className="text-sm text-slate-500">Verificar viabilidade de Transfer</p>
              </>
            )}
          </div>

          <button
            onClick={analyzePaycheck}
            disabled={!file || isAnalyzing}
            className={`mt-8 w-full max-w-sm py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg
              ${!file || isAnalyzing 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                : 'bg-[#0A192F] text-[#D4AF37] hover:bg-[#112240] shadow-[#0A192F]/20 hover:shadow-[#0A192F]/40'}`}
          >
            <Sparkles size={20} />
            {isAnalyzing ? 'Auditando Regras...' : 'Iniciar Análise Restrita'}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm flex items-start gap-3 w-full text-left">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          {!result && !isAnalyzing && (
            <div className="h-full bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center p-8 text-slate-400 border-dashed">
              <Sparkles size={48} className="mb-4 opacity-50" />
              <p className="font-medium">O Laudo de Compra de Dívida aparecerá aqui.</p>
              <p className="text-sm mt-2">Aguardando upload do contracheque.</p>
            </div>
          )}

          {result && (
            <div className="animate-fade-in space-y-4">
              {/* Badges */}
              <div className="flex gap-4">
                <div className={`flex-1 p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2 font-semibold
                  ${result.legivel ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                  {result.legivel ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
                  <span className="text-sm">{result.legivel ? 'Doc. Legível' : 'Doc. Ilegível'}</span>
                </div>
                <div className={`flex-1 p-4 rounded-xl border flex flex-col items-center justify-center text-center gap-2 font-semibold
                  ${result.elegivel ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                  {result.elegivel ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
                  <span className="text-sm">{result.elegivel ? 'Transfer Liberado' : 'Transfer Recusado'}</span>
                </div>
              </div>

              {/* Data Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-[#0A192F] p-4 text-white flex justify-between items-center">
                  <h3 className="font-bold flex items-center gap-2">
                    <FileText className="text-[#D4AF37]" size={18} />
                    Auditoria de Dados
                  </h3>
                  <span className="bg-[#1c355c] text-xs px-3 py-1 rounded-full font-medium text-[#D4AF37] border border-[#2a4d85]">
                    {result.orgao}
                  </span>
                </div>
                
                <div className="p-5 grid grid-cols-2 gap-y-4 gap-x-6">
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nome</p>
                    <p className="font-medium text-slate-800">{result.dadosExtraidos.nome || 'Não identificado'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">CPF</p>
                    <p className="font-medium text-slate-800">{result.dadosExtraidos.cpf || 'Não identificado'}</p>
                  </div>
                  {result.orgao.toUpperCase().includes('EXERCITO') || result.orgao.toUpperCase().includes('EXÉRCITO') ? (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">PREC / CAT / IND</p>
                      <p className="font-medium text-slate-800">{result.dadosExtraidos.precCatInd || 'Não identificado'}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Matrícula</p>
                      <p className="font-medium text-slate-800">{result.dadosExtraidos.matricula || 'Não identificado'}</p>
                    </div>
                  )}
                  
                  <div className="col-span-2 border-t border-slate-100 pt-3 mt-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Líquido Atual</p>
                        <p className="font-bold text-xl text-[#0A192F]">
                          {result.dadosExtraidos.liquido !== undefined
                            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(result.dadosExtraidos.liquido) 
                            : 'Não identificado'}
                        </p>
                      </div>
                      {result.dadosExtraidos.faixaOperacao && (
                        <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 text-xs font-bold text-right max-w-[50%]">
                          {result.dadosExtraidos.faixaOperacao}
                        </div>
                      )}
                    </div>
                    {result.dadosExtraidos.liquido !== undefined && result.dadosExtraidos.liquido < 100 && (
                      <p className="text-xs text-rose-500 font-medium mt-2">⚠️ Líquido insuficiente para compra (Regra Mínima: R$ 100,00)</p>
                    )}
                  </div>
                  
                  <div className="col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                      <Building2 size={14} /> Dívidas Atuais (Carteira)
                    </p>
                    {result.dadosExtraidos.dividasIdentificadas && result.dadosExtraidos.dividasIdentificadas.length > 0 ? (
                      <div className="space-y-2">
                        {result.dadosExtraidos.dividasIdentificadas.map((divida, i) => (
                          <div key={i} className="flex justify-between items-center bg-white border border-slate-200 p-2.5 rounded-md shadow-sm">
                            <span className="font-semibold text-slate-700 text-sm truncate pr-2 max-w-[50%]">{divida.banco}</span>
                            <div className="text-right shrink-0">
                              <span className="block text-rose-600 font-bold text-sm">
                                {divida.valorParcela ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(divida.valorParcela) : 'Valor n/d'}
                              </span>
                              <span className="block text-[11px] text-slate-500 font-medium uppercase mt-0.5">
                                Prazo: {divida.prazoRestante || 'n/d'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">Nenhum desconto bancário identificado para portabilidade.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Restrictions Alert for Transfer */}
              {result.alertaBancosBloqueados && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex gap-3 animate-pulse-slow">
                  <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={24} />
                  <div>
                    <h4 className="font-bold text-rose-800 text-sm uppercase tracking-wider mb-1">Banco Restrito Encontrado</h4>
                    <p className="text-sm text-rose-700 leading-relaxed font-medium">
                      O cliente possui parcelas de bancos que <strong>NÃO são aceitos</strong> na nossa esteira de Compra de Dívida (ex: Sabemi, Capital Consig, Inbursa, Simpala, etc). Certifique-se de não tentar portar estas parcelas específicas.
                    </p>
                  </div>
                </div>
              )}

              {/* Reason Card */}
              <div className={`p-5 rounded-xl border shadow-sm ${result.elegivel && !result.alertaBancosBloqueados ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <h4 className={`font-bold text-sm uppercase tracking-wider mb-2 ${result.elegivel && !result.alertaBancosBloqueados ? 'text-emerald-800' : 'text-amber-800'}`}>
                  Parecer Técnico (Compra de Dívida)
                </h4>
                <p className={`text-sm leading-relaxed ${result.elegivel && !result.alertaBancosBloqueados ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {result.motivo}
                </p>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
