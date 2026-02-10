import { AppData } from '../types';

export const initialData: AppData = {
  EXERCITO: {
    id: 'EXERCITO',
    name: 'Exército Brasileiro',
    lastUpdated: '07/10/2025',
    documents: [
      { id: 'doc-1', name: 'Regras_Operacionais_Exercito_07102025.pdf', date: '07/10/2025', size: '4.2 MB' },
      { id: 'doc-2', name: 'Exemplo_Contracheque_Pensionista.pdf', date: '20/12/2025', size: '1.5 MB' }
    ],
    sections: [
      {
        id: 'sec-ex-1',
        title: 'Público Alvo e Tipos de Operação',
        type: 'list',
        listStyle: 'check',
        items: [
          { id: 'pa1', text: 'Ativos, efetivos de carreira com mais de 10 anos de serviço' },
          { id: 'pa2', text: 'Temporários com mais de 12 meses de praça (possuem regras específicas)' },
          { id: 'pa3', text: 'Inativos (reformados ou da reserva)' },
          { id: 'pa4', text: 'Pensionistas acima de 25 anos' },
          { id: 'pa5', text: 'Tipos de operações liberadas: Margem Livre e Compra de Dívida (Transfer)' }
        ]
      },
      {
        id: 'sec-ex-2',
        title: 'Restrições e Público Não Atendido',
        type: 'list',
        listStyle: 'cross',
        items: [
          { id: 'pna1', text: 'Sem vínculo / Comissionados / Contratados / Estagiários' },
          { id: 'pna2', text: 'Tutelados / Curatelados / Analfabetos / Por procuração' },
          { id: 'pna3', text: 'Impossibilitados de assinar / Transferidos' },
          { id: 'pna4', text: 'Militares reintegrados por justiça (PREC 37) - impedidos de novas operações' },
          { id: 'pna5', text: 'Bancos NÃO aceitos no Transfer: Capital Consig, Ciasprev, Eagle FHE MAT, Futuro Previdência, Hoje Previdência, Inbursa, Pecúlio União, Sabemi, Simpala' }
        ]
      },
      {
        id: 'sec-ex-3',
        title: 'Regras Gerais e Limites de Operação',
        type: 'table',
        headers: ['Faixa Etária', 'Transferência (Valor / Prazo)', 'Margem Livre (Prazos)'],
        rows: [
          { id: 'lt1', cells: ['21 a 64 ANOS', 'R$ 195.000,00 até 72x', 'Permitido 48x, 60x e 72x'] },
          { id: 'lt2', cells: ['65 a 67 ANOS', 'R$ 150.000,00 até 72x', 'Permitido 48x, 60x e 72x'] },
          { id: 'lt3', cells: ['68 a 70 ANOS*', 'R$ 120.000,00 até 72x', 'Permitido 48x, 60x e 72x'] },
        ]
      },
      {
        id: 'sec-ex-liq',
        title: 'Valor Líquido Mínimo da Operação',
        type: 'table',
        headers: ['Faixa de Valores', 'Líquido Mínimo Exigido'],
        rows: [
          { id: 'lq1', cells: ['Até R$ 2.999,99', 'R$ 100,00'] },
          { id: 'lq2', cells: ['R$ 3.000,00 a R$ 14.999,99', 'R$ 250,00'] },
          { id: 'lq3', cells: ['R$ 15.000,00 a R$ 49.999,99', 'R$ 500,00'] },
          { id: 'lq4', cells: ['R$ 50.000,00 a R$ 195.000,00', 'R$ 1.000,00'] },
        ]
      },
      {
        id: 'sec-ex-temp',
        title: 'Regras Específicas: Militares Temporários',
        type: 'list',
        listStyle: 'bullet',
        items: [
          { id: 'tmp1', text: 'Operação: Apenas Margem Livre' },
          { id: 'tmp2', text: 'Idade Permitida: 21 a 48 anos completos (Limite de R$ 215.000,00 para 21 a 43 anos)' },
          { id: 'tmp3', text: 'Margem Consignável: 95% da margem livre multiplicada por 5% de margem de segurança' },
          { id: 'tmp4', text: 'Prazos Permitidos: De 3 a 11 meses' },
          { id: 'tmp5', text: 'Valor líquido mínimo: R$ 100,00' },
          { id: 'tmp6', text: 'Senha para averbação: NÃO é necessário' },
          { id: 'tmp7', text: 'PRECs Atendidos (CAT 1, IND 2): 30, 34, 35, 41, 43' },
          { id: 'tmp8', text: 'Documentação: Ficha "Informação de Pessoal" emitida pelo DGP obrigatória' },
          { id: 'tmp9', text: 'Doc. Identificação: Militar Azul (precisa constar "Cartão de Identificação Militar" em vermelho) + Documento civil complementar com fé pública.' }
        ]
      },
      {
        id: 'sec-ex-cpex',
        title: 'Estrutura do Contracheque CPEx',
        type: 'list',
        listStyle: 'bullet',
        items: [
          { id: 'cpex1', text: 'Órgão Emissor: CPEx (Centro de Pagamento do Exército) / CNPJ: 00.394.452/0533-04' },
          { id: 'cpex2', text: 'Identificadores Essenciais (Atenção Máxima): PREC-CP (Ex: 98 = Pensionista), CAT (Ex: 6), IND (Ex: 1)' },
          { id: 'cpex3', text: 'Posto/Graduação: Avaliar campos "P/G Real" (Ex: CB NB) e "P/G de Pagamento" (Ex: 3º SGT)' },
          { id: 'cpex4', text: 'Receitas Comuns: C01 (Soldo), C03 (Adicional Tempo de Serviço), C06 (Adicional Habitação), C08 (Adicional Militar)' },
          { id: 'cpex5', text: 'Descontos Comuns: Z02 (Pensão Militar), ZKA (Pensão Militar Extra), ZY7 (Desconto Bancário - Empréstimos)' }
        ]
      },
      {
        id: 'sec-ex-precs',
        title: 'PRECs Atendidos (Regulares)',
        type: 'table',
        headers: ['Categoria', 'PRECs', 'Indicadores (CAT / IND)'],
        rows: [
          { id: 'pr1', cells: ['Ativos de Carreira', '2, 4, 10, 12, 14, 22, 23, 24, 25, 26, 30, 33, 34, 36, 40, 60', 'CAT 1 / IND 1'] },
          { id: 'pr2', cells: ['Inativos (Reserva/Reformados)', '96', 'CAT 2 / IND 1 (Reserva), IND 2 (Reformado), IND 4 (Tempo Serv), IND 8 (Anistiado)'] },
          { id: 'pr3', cells: ['Pensionistas', '98', 'CAT 6 / IND 1 (Julgadas), IND 2 (Remetidas), IND 3 (Não Remetidas)'] },
          { id: 'pr4', cells: ['Nota PREC 39', 'Retorno à Ativa', 'Inativos que retornaram. Todos os descontos migram juntos quando voltarem ao 96.'] }
        ]
      },
      {
        id: 'sec-ex-partic',
        title: 'Particularidades Operacionais',
        type: 'list',
        listStyle: 'bullet',
        items: [
          { id: 'pt1', text: 'Valor mínimo de parcela: R$ 20,00' },
          { id: 'pt2', text: 'Mínimo de parcelas pagas no Transfer: Não há. Operação deve cobrir saldo devedor e ter parcela/líquido dentro da regra.' },
          { id: 'pt3', text: 'Agrega margem / Margem Zerada: Até 5 saldos por operação.' },
          { id: 'pt4', text: 'Limite de Refinanciamento: Parcela de até R$ 1.160,00.' },
          { id: 'pt5', text: 'Limite de Contratos: 10 contratos por matrícula.' },
          { id: 'pt6', text: 'Cálculo de Margem: Sistema realiza cálculo manual automaticamente para margens negativas.' },
          { id: 'pt7', text: 'Senha Averbação: Margem livre exige 1 código único. Transfer exige 3 códigos únicos.' },
          { id: 'pt8', text: 'Liberação do Crédito: Obrigatoriamente na conta mencionada no contracheque.' },
          { id: 'pt9', text: 'Pagamento Devolvido: Necessário enviar extrato comprovando recebimento de proventos para reapresentação.' }
        ]
      },
      {
        id: 'sec-ex-docs',
        title: 'Documentação Obrigatória e Formalização',
        type: 'list',
        listStyle: 'check',
        items: [
          { id: 'd1', text: 'Identificação (Ativos): Exclusivamente carteira militar no prazo de validade.' },
          { id: 'd2', text: 'Identificação (Inativos/Pens): RG, CNH (física/digital) ou Passaporte.' },
          { id: 'd3', text: 'CPF: Caso documento não apresente, anexar Situação Cadastral da Receita Federal.' },
          { id: 'd4', text: 'Contracheque do mês vigente e Extrato de Consignações atualizado.' },
          { id: 'd5', text: 'Para Transfer: Boleto (exige linha digitável) ou Carta Saldo + DED (Demonstrativo Evolução de Dívida).' },
          { id: 'd6', text: 'Formalização em Vídeo OBRIGATÓRIA: Operações > R$ 30.000,00 OU clientes com 60 anos ou mais.' },
          { id: 'd7', text: 'Script Vídeo: "Meu nome é [Nome], CPF [CPF], estou fazendo empréstimo com a Larca valor [Bruto], parcela [Valor], receberei [Líquido] na conta do contracheque. Não devo repassar a terceiros. Data: [Hoje]."' },
          { id: 'd8', text: 'Assinatura via QI Tech (Biometria Facial).' }
        ]
      }
    ]
  },
  SIAPE: {
    id: 'SIAPE',
    name: 'Governo Federal (SIAPE / SouGov)',
    lastUpdated: '07/10/2025',
    documents: [
      { id: 'doc-sp-1', name: 'Regras_Operacionais_SIAPE_07102025.pdf', date: '07/10/2025', size: '4.0 MB' },
      { id: 'doc-sp-2', name: 'Exemplo_Contracheque_Sigepe.pdf', date: '10/02/2026', size: '1.2 MB' }
    ],
    sections: [
      {
        id: 'sec-sp-1',
        title: 'Público Alvo e Tipos de Operação',
        type: 'list',
        listStyle: 'check',
        items: [
          { id: 'pa1', text: 'Servidores Ativos e Inativos' },
          { id: 'pa2', text: 'Aposentados e Pensionistas Vitalícios' },
          { id: 'pa3', text: 'Pensionistas Temporários: Apenas sem data de término no contracheque (Mulheres > 25 anos, Homens > 40 anos)' },
          { id: 'pa4', text: 'Tipos de operações liberadas: Margem Livre, Cartão Benefício e Compra de Dívida (Transfer)' }
        ]
      },
      {
        id: 'sec-sp-2',
        title: 'Restrições e Público Não Atendido',
        type: 'list',
        listStyle: 'cross',
        items: [
          { id: 'pna1', text: 'Celetistas / Sem vínculo / Comissionados / Contratados / Estagiários' },
          { id: 'pna2', text: 'Tutelados / Curatelados / Impossibilitados de assinar / Por procuração / Analfabetos' },
          { id: 'pna3', text: 'Bancos NÃO aceitos no Transfer: Capital Consig, Ciasprev, Eagle FHE MAT, Futuro Previdência, Hoje Previdência, Inbursa, Pecúlio União, Sabemi, Simpala' }
        ]
      },
      {
        id: 'sec-sp-limits',
        title: 'Regras Gerais e Limites de Operação',
        type: 'table',
        headers: ['Faixa Etária', 'Transferência (Valor / Prazo)', 'Margem Livre (Prazos)'],
        rows: [
          { id: 'lt1', cells: ['21 a 64 ANOS', 'R$ 195.000,00 até 96x', 'Permitido 84x e 96x'] },
          { id: 'lt2', cells: ['65 a 67 ANOS', 'R$ 150.000,00 até 96x', 'Permitido 84x e 96x'] },
          { id: 'lt3', cells: ['68 a 70 ANOS*', 'R$ 120.000,00 até 96x', 'Permitido 84x e 96x'] },
        ]
      },
      {
        id: 'sec-sp-liq',
        title: 'Valor Líquido Mínimo da Operação',
        type: 'table',
        headers: ['Faixa de Valores', 'Líquido Mínimo Exigido'],
        rows: [
          { id: 'lq1', cells: ['Até R$ 2.999,99', 'R$ 100,00'] },
          { id: 'lq2', cells: ['R$ 3.000,00 a R$ 14.999,99', 'R$ 250,00'] },
          { id: 'lq3', cells: ['R$ 15.000,00 a R$ 49.999,99', 'R$ 500,00'] },
          { id: 'lq4', cells: ['R$ 50.000,00 a R$ 195.000,00', 'R$ 1.000,00'] },
        ]
      },
      {
        id: 'sec-sp-sigepe',
        title: 'Estrutura do Contracheque Sigepe/SouGov',
        type: 'list',
        listStyle: 'bullet',
        items: [
          { id: 'sig1', text: 'Verificar a Matrícula SIAPE (Ex: 1160815) e Sigla da UPAG (Ex: CPEx - Comando do Exército via SIAPE)' },
          { id: 'sig2', text: 'Identificar a Natureza da Pensão: Vitalícia ou Temporária (atenção à data de término para temporárias)' },
          { id: 'sig3', text: 'Distribuição de Cotas: 1/1 significa cota integral. Pensão Complementar deve ser analisada.' },
          { id: 'sig4', text: 'Rubricas de Desconto Consignado: 061 (Banrisul), 028/047 (PAN), 088 (Daycoval), 051/060 (Safra), 043 (Santander)' },
          { id: 'sig5', text: 'Analisar Base de Cálculo da Pensão vs Valor Base Pensão I.R e o Valor Líquido final' }
        ]
      },
      {
        id: 'sec-sp-funcs',
        title: 'Situações Funcionais',
        type: 'list',
        listStyle: 'bullet',
        items: [
          { id: 'f1', text: 'ATENDIDAS: Anistiado, Aposentado, Ativo, Cedido SUS, Beneficiário Pensão, Reforma CBM-PM, etc.' },
          { id: 'f2', text: 'UPAGS NÃO ATENDIDAS (Exemplos): EBSERH, EMBRAPA, EBC, Conab, INB, Dataprev, CBTU, Valec (consultar lista completa no PDF).' },
          { id: 'f3', text: 'Situações NÃO Atendidas: CLT, Estagiários, Redistribuído, Requisitado, Sem Vínculo, Decisão Judicial, etc.' }
        ]
      },
      {
        id: 'sec-sp-partic',
        title: 'Particularidades Operacionais e Averbação (QI SCD)',
        type: 'list',
        listStyle: 'bullet',
        items: [
          { id: 'pt1', text: 'Valor mínimo de parcela: R$ 20,00' },
          { id: 'pt2', text: 'Mínimo de parcelas pagas no Transfer: Não há. Operação deve cobrir saldo devedor.' },
          { id: 'pt3', text: 'Agrega margem / Margem Zerada: Sim, 1 saldo por operação.' },
          { id: 'pt4', text: 'Limite de Refinanciamento: Parcela de até R$ 983,00.' },
          { id: 'pt5', text: 'Limite de Contratos: 08 contratos por matrícula.' },
          { id: 'pt6', text: 'Liberação do Crédito: Na conta do contracheque. Se houver portabilidade de salário, anexar comprovante de domicílio bancário.' },
          { id: 'pt7', text: 'Averbação Margem Livre: Autorizar QI SCD S.A (35% facultativos) no SouGov + Anuência pós-averbação.' },
          { id: 'pt8', text: 'Averbação Transfer: Autorizar QI SCD S.A (35%) E gerar autorização de portabilidade apontando a QI e o banco de origem.' }
        ]
      },
      {
        id: 'sec-sp-prazos',
        title: 'Horários Limite (QI Tech - Transfer)',
        type: 'list',
        listStyle: 'bullet',
        items: [
          { id: 'hz1', text: 'Inclusão de saldo vencendo NO DIA (Boleto): Até 16:30hs' },
          { id: 'hz2', text: 'Inclusão de saldo vencendo NO DIA (Carta Saldo): Até 14:30hs' },
          { id: 'hz3', text: 'ATENÇÃO: Se a Carta Saldo ou a CCB vencer no dia, a proposta PRECISA estar na QI antes das 17h, já com todas as análises aprovadas.' }
        ]
      },
      {
        id: 'sec-sp-docs',
        title: 'Documentação Obrigatória e Formalização',
        type: 'list',
        listStyle: 'check',
        items: [
          { id: 'd1', text: 'Doc Identificação com CPF (RG, CNH, Passaporte, Funcional com fé pública).' },
          { id: 'd2', text: 'Se sem CPF no doc: Comprovante de Situação Cadastral Receita Federal.' },
          { id: 'd3', text: 'Contracheque do mês vigente e Extrato de Consignações atualizado.' },
          { id: 'd4', text: 'Para Transfer: Boleto ou Carta Saldo + DED (Demonstrativo Evolução de Dívida).' },
          { id: 'd5', text: 'Formalização em Vídeo OBRIGATÓRIA: Operações > R$ 30.000,00 OU clientes com 60 anos ou mais.' },
          { id: 'd6', text: 'Assinatura via QI Tech (Biometria Facial).' }
        ]
      }
    ]
  }
};
