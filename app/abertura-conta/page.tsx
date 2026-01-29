'use client';

import { useState, useRef, useEffect } from 'react';
import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Upload, 
  FileText, 
  Camera, 
  User, 
  Mail, 
  Phone,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  AlertCircle,
  X,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  validateFileSize,
  validateFileType,
  validateCPF,
  validateCEP,
  extractDocumentData,
  validateSelfie,
  formatCPF,
  formatCEP,
} from '@/lib/documentValidation';

interface DocumentFile {
  id: string;
  name: string;
  type: 'cnh' | 'rg' | 'comprovante' | 'selfie';
  file: File;
  preview?: string;
  status: 'pending' | 'uploaded' | 'approved' | 'rejected';
  validationErrors?: string[];
  extractedData?: any;
}

export default function AberturaContaPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [addressData, setAddressData] = useState<any>(null);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [validatingDocument, setValidatingDocument] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<DocumentFile | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const handleFileUpload = async (type: DocumentFile['type'], file: File) => {
    if (!validateFileSize(file, 5)) {
      alert('Arquivo muito grande. Máximo 5MB permitido.');
      return;
    }

    // Para selfie, aceita qualquer tipo de imagem
    if (type === 'selfie') {
      if (!file.type.startsWith('image/')) {
        alert('Formato inválido. Use uma imagem (JPG, PNG, WEBP, etc.).');
        return;
      }
    } else {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validateFileType(file, allowedTypes)) {
        alert('Formato inválido. Use JPG, PNG ou PDF (digital ou escaneado).');
        return;
      }
    }

    setValidatingDocument(file.name);

    try {
      let validationErrors: string[] = [];
      let extractedData: any = undefined;

      if (type === 'cnh' || type === 'rg') {
        const result = await extractDocumentData(file);
        validationErrors = result.errors;
        extractedData = result.extractedData;
        
        // Preencher automaticamente os campos com dados extraídos do OCR
        if (extractedData) {
          if (extractedData.cpf) {
            setCpf(formatCPF(extractedData.cpf));
          }
          if (extractedData.name) {
            // Converter nome para formato normal (primeira letra maiúscula)
            const nameParts = extractedData.name.toLowerCase().split(' ');
            const formattedName = nameParts.map((part: string) => 
              part.charAt(0).toUpperCase() + part.slice(1)
            ).join(' ');
            setName(formattedName);
          }
          if (extractedData.birthDate) {
            setBirthDate(extractedData.birthDate);
          }
          
          // Mostrar mensagem de sucesso com dados extraídos
          const extractedFields = [];
          if (extractedData.name) extractedFields.push('Nome');
          if (extractedData.cpf) extractedFields.push('CPF');
          if (extractedData.birthDate) extractedFields.push('Data de Nascimento');
          
          // Separar erros críticos de avisos
          const criticalErrors = validationErrors.filter(err => 
            err.includes('muito grande') || err.includes('Formato inválido')
          );
          const warnings = validationErrors.filter(err => 
            !err.includes('muito grande') && !err.includes('Formato inválido')
          );
          
          if (extractedFields.length > 0) {
            let message = `✅ OCR concluído!\n\nDados extraídos automaticamente:\n${extractedFields.join(', ')}\n\n`;
            if (warnings.length > 0) {
              message += `⚠️ Atenção:\n${warnings.join('\n')}\n\n`;
            }
            message += 'Verifique se os dados estão corretos e ajuste se necessário.';
            alert(message);
          }
        }
      } else if (type === 'selfie') {
        const result = await validateSelfie(file);
        validationErrors = result.errors;
      }

      // Separar erros críticos de avisos
      const criticalErrors = validationErrors.filter(err => 
        err.includes('muito grande') || err.includes('Formato inválido')
      );
      const warnings = validationErrors.filter(err => 
        !err.includes('muito grande') && !err.includes('Formato inválido')
      );
      
      // Documento é considerado válido se não houver erros críticos
      const isValid = criticalErrors.length === 0;
      
      const newDoc: DocumentFile = {
        id: Date.now().toString(),
        name: file.name,
        type,
        file,
        preview: type === 'selfie' || file.type.startsWith('image/') 
          ? URL.createObjectURL(file) 
          : undefined,
        status: isValid ? 'uploaded' : 'rejected',
        validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
        extractedData,
      };
      
      setDocuments([...documents.filter(d => d.type !== type), newDoc]);
      
      // Mostrar apenas erros críticos como alerta bloqueante
      if (criticalErrors.length > 0) {
        alert(`❌ Erro:\n${criticalErrors.join('\n')}`);
      }
    } catch (error) {
      alert('Erro ao processar documento. Tente novamente.');
    } finally {
      setValidatingDocument(null);
    }
  };

  const handleRemoveDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  // Função para iniciar a câmera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user', // Câmera frontal no celular
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setCameraStream(stream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Erro ao acessar câmera:', error);
      alert('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
    }
  };

  // Função para parar a câmera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  // Função para capturar foto
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' });
            handleFileUpload('selfie', file);
            stopCamera();
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  // Limpar stream quando componente desmontar
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const canProceed = () => {
    if (step === 1) {
      return name && email && phone && cpf && birthDate && cep && street && number && neighborhood && city && state;
    }
    if (step === 2) {
      return documents.some(d => d.type === 'cnh' || d.type === 'rg') && documents.some(d => d.type === 'selfie');
    }
    return true;
  };

  const totalSteps = 3;

  return (
    <div className="min-h-screen bg-prospere-black py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Abertura de Conta</h1>
          <p className="text-prospere-gray-400">Complete seu cadastro em poucos passos</p>
        </div>

        {/* Progress Steps */}
        <Card>
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors
                      ${step >= s
                        ? 'bg-prospere-red text-white'
                        : 'bg-prospere-gray-800 text-prospere-gray-400'
                      }
                    `}
                  >
                    {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
                  </div>
                  <p className={`text-xs mt-2 ${step >= s ? 'text-white' : 'text-prospere-gray-500'}`}>
                    {s === 1 && 'Dados Pessoais'}
                    {s === 2 && 'Documentos'}
                    {s === 3 && 'Confirmação'}
                  </p>
                </div>
                {s < totalSteps && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      step > s ? 'bg-prospere-red' : 'bg-prospere-gray-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Personal Data */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Dados Pessoais</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo *"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome completo"
                />
                <Input
                  label="CPF *"
                  type="text"
                  value={cpf}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                    setCpf(formatCPF(value));
                  }}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
                {cpf && !validateCPF(cpf) && cpf.replace(/\D/g, '').length === 11 && (
                  <p className="text-sm text-red-400 mt-1">CPF inválido</p>
                )}
                {cpf && validateCPF(cpf) && (
                  <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    CPF válido
                  </p>
                )}
                <Input
                  label="Data de Nascimento *"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
                <Input
                  label="E-mail *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
                <Input
                  label="Celular *"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    const formatted = value.length <= 11 
                      ? value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
                      : phone;
                    setPhone(formatted);
                  }}
                  placeholder="(00) 00000-0000"
                />
                <div className="md:col-span-2">
                  <Input
                    label="CEP *"
                    type="text"
                    value={cep}
                    onChange={async (e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                      const formatted = formatCEP(value);
                      setCep(formatted);
                      
                      if (value.length === 8) {
                        const result = await validateCEP(value);
                        if (result.isValid && result.address) {
                          setAddressData(result.address);
                          setStreet(result.address.street || '');
                          setNeighborhood(result.address.neighborhood || '');
                          setCity(result.address.city || '');
                          setState(result.address.state || '');
                        } else {
                          setAddressData(null);
                          if (result.error) {
                            alert(result.error);
                          }
                        }
                      } else {
                        setAddressData(null);
                      }
                    }}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                  {addressData && (
                    <div className="mt-2 p-3 bg-green-900/20 border border-green-800 rounded-lg">
                      <p className="text-sm text-green-400 font-medium mb-2 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Endereço encontrado
                      </p>
                    </div>
                  )}
                </div>
                {addressData && (
                  <>
                    <Input
                      label="Endereço (Rua/Avenida) *"
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Preenchido automaticamente"
                    />
                    <Input
                      label="Número *"
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Número do endereço"
                    />
                    <Input
                      label="Complemento"
                      type="text"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Apto, Bloco, etc (opcional)"
                    />
                    <Input
                      label="Bairro *"
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Preenchido automaticamente"
                    />
                    <Input
                      label="Cidade *"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Preenchido automaticamente"
                    />
                    <Input
                      label="Estado *"
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value.toUpperCase())}
                      placeholder="Preenchido automaticamente"
                      maxLength={2}
                    />
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Documents */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Documentos</h2>
              
              <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-400 font-medium mb-1">Importante</p>
                    <p className="text-xs text-prospere-gray-400">
                      Envie documentos legíveis e válidos. Formatos aceitos: JPG, PNG, PDF digital ou escaneado (máx. 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-prospere-gray-300 mb-2">
                    CNH ou RG (Documento de Identidade) *
                  </label>
                  <DocumentUpload
                    type="cnh"
                    label="Frente e Verso da CNH ou RG"
                    icon={<FileText className="w-6 h-6" />}
                    onUpload={handleFileUpload}
                    document={documents.find(d => d.type === 'cnh' || d.type === 'rg')}
                    onRemove={handleRemoveDocument}
                    onView={setViewingDocument}
                    isValidating={validatingDocument !== null}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-prospere-gray-300 mb-2">
                    Comprovante de Residência *
                  </label>
                  <DocumentUpload
                    type="comprovante"
                    label="Comprovante de Residência"
                    icon={<FileText className="w-6 h-6" />}
                    onUpload={handleFileUpload}
                    document={documents.find(d => d.type === 'comprovante')}
                    onRemove={handleRemoveDocument}
                    onView={setViewingDocument}
                    isValidating={validatingDocument !== null}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-prospere-gray-300 mb-2">
                    Selfie *
                  </label>
                  <DocumentUpload
                    type="selfie"
                    label="Tire uma selfie"
                    icon={<Camera className="w-6 h-6" />}
                    onUpload={handleFileUpload}
                    document={documents.find(d => d.type === 'selfie')}
                    onRemove={handleRemoveDocument}
                    isImage={true}
                    onView={setViewingDocument}
                    isValidating={validatingDocument !== null}
                    onStartCamera={startCamera}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-center"
            >
              <div className="py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="w-20 h-20 bg-green-900/30 border-2 border-green-400 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">Solicitação Enviada!</h2>
                <p className="text-prospere-gray-400 mb-6">
                  Sua solicitação de abertura de conta foi enviada e está em análise.
                </p>
                <div className="space-y-2 text-sm text-prospere-gray-400">
                  <p>Você receberá um e-mail de confirmação em breve.</p>
                  <p>O prazo de análise é de até 2 dias úteis.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-prospere-gray-800 mt-8">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Voltar
            </Button>
            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
              >
                Continuar
              </Button>
            ) : (
              <Button onClick={() => window.location.href = '/'}>
                Ir para Dashboard
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {viewingDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setViewingDocument(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-prospere-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
            >
              <div className="sticky top-0 bg-prospere-gray-900 border-b border-prospere-gray-800 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold">{viewingDocument.name}</h3>
                  <p className="text-sm text-prospere-gray-400">
                    {viewingDocument.type === 'cnh' && 'CNH/RG'}
                    {viewingDocument.type === 'comprovante' && 'Comprovante de Residência'}
                    {viewingDocument.type === 'selfie' && 'Selfie'}
                  </p>
                </div>
                <button
                  onClick={() => setViewingDocument(null)}
                  className="p-2 hover:bg-prospere-gray-800 rounded-lg transition-colors"
                >
                  <XCircle className="w-6 h-6 text-prospere-gray-400" />
                </button>
              </div>
              <div className="p-6">
                {viewingDocument.file.type === 'application/pdf' ? (
                  <iframe
                    src={URL.createObjectURL(viewingDocument.file)}
                    className="w-full h-[70vh] rounded-lg"
                    title={viewingDocument.name}
                  />
                ) : (
                  <div className="relative w-full h-[70vh]">
                    <Image
                      src={viewingDocument.preview || URL.createObjectURL(viewingDocument.file)}
                      alt={viewingDocument.name}
                      fill
                      className="object-contain rounded-lg"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            <div className="relative w-full h-full max-w-4xl max-h-screen flex flex-col">
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 p-4 flex items-center justify-between">
                <h3 className="text-white font-bold text-lg">Tire sua selfie</h3>
                <button
                  onClick={stopCamera}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Video Preview */}
              <div className="flex-1 flex items-center justify-center relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Overlay com instruções */}
                <div className="absolute bottom-20 left-0 right-0 text-center">
                  <p className="text-white text-lg font-medium mb-2">
                    Tire uma selfie
                  </p>
                  <p className="text-white/80 text-sm">
                    Posicione seu rosto no centro da tela
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-6 flex items-center justify-center gap-4">
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-prospere-gray-700 hover:bg-prospere-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </button>
                <button
                  onClick={capturePhoto}
                  className="w-20 h-20 bg-prospere-red hover:bg-red-700 rounded-full border-4 border-white flex items-center justify-center transition-colors shadow-lg"
                >
                  <Camera className="w-10 h-10 text-white" />
                </button>
                <button
                  onClick={() => {
                    // Trocar entre câmera frontal e traseira (se disponível)
                    stopCamera();
                    setTimeout(() => startCamera(), 100);
                  }}
                  className="px-6 py-3 bg-prospere-gray-700 hover:bg-prospere-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Trocar Câmera
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DocumentUploadProps {
  type: DocumentFile['type'];
  label: string;
  icon: React.ReactNode;
  onUpload: (type: DocumentFile['type'], file: File) => void;
  document?: DocumentFile;
  onRemove: (id: string) => void;
  isImage?: boolean;
  onView?: (document: DocumentFile) => void;
  isValidating?: boolean;
  onStartCamera?: () => void;
}

function DocumentUpload({
  type,
  label,
  icon,
  onUpload,
  document,
  onRemove,
  isImage = false,
  onView,
  isValidating = false,
  onStartCamera,
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(type, file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onUpload(type, file);
    }
  };

  if (document) {
    return (
      <div className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {isImage && document.preview ? (
              <div className="relative w-16 h-16">
                <Image
                  src={document.preview}
                  alt={document.name}
                  fill
                  className="object-cover rounded-lg"
                  unoptimized
                />
              </div>
            ) : document.file.type === 'application/pdf' ? (
              <div className="w-16 h-16 bg-red-900/30 rounded-lg flex items-center justify-center border border-red-800">
                <FileText className="w-8 h-8 text-red-400" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-prospere-gray-700 rounded-lg flex items-center justify-center">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{document.name}</p>
              <p className={`text-xs ${
                document.status === 'uploaded' ? 'text-green-400' :
                document.status === 'approved' ? 'text-green-400' :
                document.status === 'rejected' ? 'text-red-400' :
                'text-prospere-gray-400'
              }`}>
                {document.status === 'uploaded' && '✓ Enviado e validado'}
                {document.status === 'approved' && '✓ Aprovado'}
                {document.status === 'rejected' && '✗ Rejeitado'}
                {document.status === 'pending' && 'Pendente'}
              </p>
              {document.validationErrors && document.validationErrors.length > 0 && (
                <div className="mt-1">
                  {document.validationErrors.map((error, idx) => (
                    <p key={idx} className="text-xs text-red-400">• {error}</p>
                  ))}
                </div>
              )}
              {document.extractedData && (
                <p className="text-xs text-green-400 mt-1">
                  Dados extraídos automaticamente
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onView && (
              <button
                onClick={() => onView(document)}
                className="p-2 hover:bg-prospere-gray-700 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4 text-prospere-gray-400" />
              </button>
            )}
            <button
              onClick={() => onRemove(document.id)}
              className="p-2 hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
        ${isDragging
          ? 'border-prospere-red bg-prospere-red/10'
          : 'border-prospere-gray-700 hover:border-prospere-gray-600'
        }
      `}
    >
      <input
        type="file"
        id={`upload-${type}`}
        className="hidden"
        accept={type === 'selfie' ? 'image/*' : isImage ? 'image/*' : 'image/*,.pdf,application/pdf'}
        onChange={handleFileSelect}
      />
      <label htmlFor={`upload-${type}`} className="cursor-pointer">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-prospere-gray-800 rounded-full flex items-center justify-center text-prospere-gray-400">
            {icon}
          </div>
          <div>
            <p className="text-white font-medium mb-1">{label}</p>
            <p className="text-sm text-prospere-gray-400">
              Clique para selecionar ou arraste o arquivo aqui
            </p>
            <p className="text-xs text-prospere-gray-500 mt-1">
              {type === 'selfie' 
                ? 'JPG ou PNG (máx. 5MB) - Tire uma foto ou envie uma imagem'
                : 'JPG, PNG ou PDF digital/escaneado (máx. 5MB)'}
            </p>
          </div>
          <div className="flex gap-2">
            {type === 'selfie' && onStartCamera && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onStartCamera();
                }}
                disabled={isValidating}
                className="px-4 py-2 bg-prospere-red hover:bg-red-700 disabled:bg-prospere-gray-700 disabled:cursor-not-allowed text-white border border-prospere-red rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Camera className="w-4 h-4" />
                Tirar Foto
              </button>
            )}
            <Button variant="outline" size="sm" disabled={isValidating}>
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-prospere-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                  Validando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar Arquivo
                </>
              )}
            </Button>
          </div>
        </div>
      </label>
    </div>
  );
}
