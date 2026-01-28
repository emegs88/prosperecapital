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
 * Simula OCR de documento (CNH/RG)
 * Em produção, integraria com serviço de OCR real (Google Vision, AWS Textract, etc)
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
  
  // Simulação de extração de dados
  // Em produção, aqui faria a chamada para API de OCR
  const extractedData = {
    // Dados simulados - em produção viriam do OCR
    cpf: '',
    name: '',
    birthDate: '',
    rg: '',
    cnh: '',
  };
  
  return {
    isValid: errors.length === 0,
    errors,
    extractedData: errors.length === 0 ? extractedData : undefined,
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
