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
 * Em produção, integraria com serviço de OCR real (Google Vision, AWS Textract, Tesseract.js, etc)
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
  }
  
  if (!validateFileType(file, ['image', 'pdf'])) {
    errors.push('Formato inválido. Use JPG, PNG ou PDF.');
  }
  
  // Simulação de processamento OCR com delay realista
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulação de extração de dados via OCR
  // Em produção, aqui faria:
  // 1. Upload da imagem para API de OCR (Google Vision, AWS Textract, Tesseract.js)
  // 2. Processamento do texto extraído
  // 3. Extração de campos específicos usando regex e validações
  
  // Dados simulados extraídos do OCR
  // Em produção, esses dados viriam do processamento real do documento
  const mockExtractedData = {
    // Exemplo de dados que seriam extraídos de uma CNH/RG brasileira
    name: 'JOÃO SILVA SANTOS', // Nome completo em maiúsculas (padrão CNH)
    cpf: '12345678901', // CPF sem formatação
    birthDate: '1985-03-15', // Data de nascimento no formato YYYY-MM-DD
    rg: '123456789', // RG (se disponível)
    cnh: '12345678901', // Número da CNH (se for CNH)
  };
  
  // Validação dos dados extraídos
  if (mockExtractedData.cpf && !validateCPF(mockExtractedData.cpf)) {
    errors.push('CPF extraído do documento é inválido. Verifique o documento.');
  }
  
  // Validação da data de nascimento
  if (mockExtractedData.birthDate) {
    const birthDate = new Date(mockExtractedData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 18 || age > 120) {
      errors.push('Data de nascimento extraída parece inválida. Verifique o documento.');
    }
  }
  
  // Se houver erros críticos, não retorna dados extraídos
  const extractedData = errors.length === 0 ? {
    cpf: formatCPF(mockExtractedData.cpf),
    name: mockExtractedData.name,
    birthDate: mockExtractedData.birthDate,
    rg: mockExtractedData.rg,
    cnh: mockExtractedData.cnh,
  } : undefined;
  
  return {
    isValid: errors.length === 0,
    errors,
    extractedData,
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
  
  // Simulação de verificação se há documento na selfie
  const hasDocument = documentFile !== undefined;
  
  if (!faceDetected) {
    errors.push('Rosto não detectado na imagem. Certifique-se de que seu rosto está visível.');
  }
  
  if (!hasDocument) {
    errors.push('Documento não detectado na selfie. Segure sua CNH visível na foto.');
  }
  
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
