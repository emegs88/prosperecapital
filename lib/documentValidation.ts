/**
 * Document Validation Utilities
 * Validação de documentos, selfie e endereços
 */

export interface DocumentValidationResult {
  isValid: boolean;
  errors: string[];
  extractedData?: {
    cpf?: string;
    name?: string;
    birthDate?: string;
    rg?: string;
    cnh?: string;
  };
}

export interface SelfieValidationResult {
  isValid: boolean;
  errors: string[];
  hasDocument?: boolean;
  faceDetected?: boolean;
}

/**
 * Valida tamanho do arquivo (máx 5MB)
 */
export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Valida formato do arquivo
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => file.type.includes(type));
}

/**
 * Valida CPF
 */
export function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
}

/**
 * Valida CEP e busca endereço
 */
export async function validateCEP(cep: string): Promise<{
  isValid: boolean;
  address?: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  error?: string;
}> {
  const cleanCEP = cep.replace(/\D/g, '');
  
  if (cleanCEP.length !== 8) {
    return { isValid: false, error: 'CEP deve ter 8 dígitos' };
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return { isValid: false, error: 'CEP não encontrado' };
    }
    
    return {
      isValid: true,
      address: {
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
      },
    };
  } catch (error) {
    return { isValid: false, error: 'Erro ao buscar CEP' };
  }
}

/**
 * Simula OCR de documento (CNH/RG) com extração de dados
 * Em produção, integraria com serviço de OCR real (Google Vision, AWS Textract, Tesseract.js, pdf-parse, etc)
 * 
 * Esta função simula a extração de:
 * - Nome completo
 * - CPF
 * - Data de nascimento
 * - RG (se disponível)
 * - CNH (se disponível)
 */
export async function extractDocumentData(file: File): Promise<DocumentValidationResult> {
  // Validações básicas
  const errors: string[] = [];
  
  if (!validateFileSize(file, 5)) {
    errors.push('Arquivo muito grande. Máximo 5MB.');
    return {
      isValid: false,
      errors,
      extractedData: undefined,
    };
  }
  
  // Aceita imagens (JPG, PNG) e PDFs (digitais ou escaneados)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (!validateFileType(file, allowedTypes)) {
    errors.push('Formato inválido. Use JPG, PNG ou PDF (digital ou escaneado).');
    return {
      isValid: false,
      errors,
      extractedData: undefined,
    };
  }
  
  // Detectar tipo de arquivo
  const isPDF = file.type === 'application/pdf';
  const isImage = file.type.startsWith('image/');
  
  // Simulação de processamento OCR com delay realista
  // PDFs podem levar mais tempo para processar
  const processingTime = isPDF ? 2000 : 1500;
  await new Promise(resolve => setTimeout(resolve, processingTime));
  
  // Simulação de extração de dados via OCR
  // Em produção, aqui faria:
  // Para PDFs:
  //   - Usar pdf-parse ou pdf.js para extrair texto
  //   - Processar o texto extraído com regex
  // Para Imagens:
  //   - Upload para API de OCR (Google Vision, AWS Textract, Tesseract.js)
  //   - Processar o texto extraído
  //   - Extração de campos específicos usando regex e validações
  
  // Simular extração de texto do documento
  // Em produção, isso viria do processamento real
  let extractedText = '';
  if (isPDF) {
    // Simular texto extraído de PDF digital ou escaneado
    extractedText = `
      BRASIL
      CNH - CARTEIRA NACIONAL DE HABILITAÇÃO
      NOME: JOÃO SILVA SANTOS
      CPF: 123.456.789-09
      DATA DE NASCIMENTO: 15/03/1985
      RG: 12.345.678-9
      CNH: 12345678901
      CATEGORIA: B
    `;
  } else {
    // Simular texto extraído de imagem (OCR)
    extractedText = `
      BRASIL
      CNH - CARTEIRA NACIONAL DE HABILITAÇÃO
      NOME: JOÃO SILVA SANTOS
      CPF: 123.456.789-09
      DATA DE NASCIMENTO: 15/03/1985
      RG: 12.345.678-9
      CNH: 12345678901
    `;
  }
  
  // Extrair dados usando regex (simulação do que seria feito em produção)
  const extractCPF = (text: string): string | null => {
    // Procura CPF no formato XXX.XXX.XXX-XX ou apenas números
    const cpfRegex = /(\d{3}\.?\d{3}\.?\d{3}-?\d{2})/g;
    const matches = text.match(cpfRegex);
    if (matches && matches.length > 0) {
      return matches[0].replace(/\D/g, ''); // Remove formatação
    }
    return null;
  };
  
  const extractName = (text: string): string | null => {
    // Procura nome após "NOME:" ou padrões similares
    const nameRegex = /NOME[:\s]+([A-ZÁÉÍÓÚÇ\s]+)/i;
    const match = text.match(nameRegex);
    if (match && match[1]) {
      return match[1].trim().toUpperCase();
    }
    return null;
  };
  
  const extractBirthDate = (text: string): string | null => {
    // Procura data no formato DD/MM/YYYY
    const dateRegex = /(\d{2}\/\d{2}\/\d{4})/g;
    const matches = text.match(dateRegex);
    if (matches && matches.length > 0) {
      const [day, month, year] = matches[0].split('/');
      return `${year}-${month}-${day}`; // Converter para YYYY-MM-DD
    }
    return null;
  };
  
  const extractRG = (text: string): string | null => {
    const rgRegex = /RG[:\s]+([\d\.\-]+)/i;
    const match = text.match(rgRegex);
    if (match && match[1]) {
      return match[1].replace(/\D/g, '');
    }
    return null;
  };
  
  const extractCNH = (text: string): string | null => {
    const cnhRegex = /CNH[:\s]+(\d+)/i;
    const match = text.match(cnhRegex);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  };
  
  // Extrair dados do texto simulado
  const extractedCPF = extractCPF(extractedText) || '12345678909'; // CPF válido como fallback
  const extractedName = extractName(extractedText) || 'JOÃO SILVA SANTOS';
  const extractedBirthDate = extractBirthDate(extractedText) || '1985-03-15';
  const extractedRG = extractRG(extractedText) || '123456789';
  const extractedCNH = extractCNH(extractedText) || '12345678901';
  
  // Dados extraídos
  const mockExtractedData = {
    name: extractedName,
    cpf: extractedCPF,
    birthDate: extractedBirthDate,
    rg: extractedRG,
    cnh: extractedCNH,
  };
  
  // Validação dos dados extraídos (aviso, mas não bloqueia)
  const warnings: string[] = [];
  if (mockExtractedData.cpf && !validateCPF(mockExtractedData.cpf)) {
    warnings.push('CPF extraído do documento pode estar incorreto. Verifique o documento.');
    // Não adiciona como erro crítico, apenas aviso
  }
  
  // Validação da data de nascimento
  if (mockExtractedData.birthDate) {
    const birthDate = new Date(mockExtractedData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 18 || age > 120) {
      warnings.push('Data de nascimento extraída pode estar incorreta. Verifique o documento.');
    }
  }
  
  // Retorna dados extraídos mesmo com avisos (usuário pode corrigir manualmente)
  const extractedData = {
    cpf: formatCPF(mockExtractedData.cpf),
    name: mockExtractedData.name,
    birthDate: mockExtractedData.birthDate,
    rg: mockExtractedData.rg,
    cnh: mockExtractedData.cnh,
  };
  
  return {
    isValid: errors.length === 0, // Válido se não houver erros críticos
    errors: [...errors, ...warnings], // Inclui avisos para o usuário verificar
    extractedData, // Sempre retorna dados extraídos (mesmo que com avisos)
  };
}

/**
 * Simula validação biométrica da selfie
 * Em produção, integraria com serviço de reconhecimento facial
 */
export async function validateSelfie(
  selfieFile: File,
  documentFile?: File
): Promise<SelfieValidationResult> {
  const errors: string[] = [];
  
  // Validações básicas
  if (!validateFileSize(selfieFile, 5)) {
    errors.push('Arquivo muito grande. Máximo 5MB.');
  }
  
  if (!validateFileType(selfieFile, ['image'])) {
    errors.push('Formato inválido. Use JPG ou PNG.');
  }
  
  // Simulação de detecção facial
  // Em produção, usaria biblioteca como face-api.js ou API de reconhecimento facial
  const faceDetected = true; // Simulado
  
  // Selfie normal - não precisa segurar documento
  const hasDocument = false; // Não é mais obrigatório
  
  if (!faceDetected) {
    errors.push('Rosto não detectado na imagem. Certifique-se de que seu rosto está visível.');
  }
  
  // Removida a validação que exigia documento na selfie
  
  return {
    isValid: errors.length === 0,
    errors,
    hasDocument,
    faceDetected,
  };
}

/**
 * Formata CPF
 */
export function formatCPF(cpf: string): string {
  const clean = cpf.replace(/\D/g, '');
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata CEP
 */
export function formatCEP(cep: string): string {
  const clean = cep.replace(/\D/g, '');
  return clean.replace(/(\d{5})(\d{3})/, '$1-$2');
}
