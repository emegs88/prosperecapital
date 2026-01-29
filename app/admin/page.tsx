'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { MetricCard } from '@/components/ui/Card';
import { 
  Users, 
  DollarSign, 
  FileText, 
  TrendingUp,
  Package,
  ShoppingCart,
  BarChart3,
  Download,
  Plus,
  Search,
  Calendar,
  Percent,
  Upload,
  Camera,
  Eye,
  Trash2,
  XCircle,
  X,
  RotateCcw
} from 'lucide-react';
import Image from 'next/image';
import {
  validateFileSize,
  validateFileType,
  extractDocumentData,
  validateSelfie,
} from '@/lib/documentValidation';
import { formatCurrency, formatPercentage } from '@/lib/calculations';
import { 
  mockInvestors, 
  mockInvestments, 
  mockTransactions,
  mockPools,
  mockMonthlyReturns,
  calculateInvestmentCurrentValue,
  getInvestmentEvolution
} from '@/lib/mockData';
import { mockUsers, createUser, User, getCurrentUser, isAdmin } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Extended mock data for admin
const mockInvestorsExtended = mockInvestors.map((inv, idx) => ({
  ...inv,
  totalInvested: [100000, 75000, 50000][idx] || 0,
  status: 'active' as const,
}));

const mockCards = [
  { id: '1', type: 'contemplated', value: 50000, status: 'active' },
  { id: '2', type: 'non_contemplated', value: 30000, status: 'active' },
  { id: '3', type: 'contemplated', value: 45000, status: 'sold' },
];

const mockBidConSales = [
  { month: 'Jan', value: 120000 },
  { month: 'Fev', value: 150000 },
  { month: 'Mar', value: 180000 },
  { month: 'Abr', value: 200000 },
  { month: 'Mai', value: 220000 },
  { month: 'Jun', value: 250000 },
];

export default function AdminPage() {
  const router = useRouter();
  const currentUser = getCurrentUser();
  const userIsAdmin = isAdmin();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'investors' | 'investments' | 'cards' | 'sales' | 'dre' | 'users' | 'returns'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateInvestment, setShowCreateInvestment] = useState(false);
  const [showAddReturn, setShowAddReturn] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'investor' as 'admin' | 'investor',
  });
  const [newInvestment, setNewInvestment] = useState({
    investorId: '1',
    amount: '',
    type: 'single' as 'single' | 'recurring',
    pool: 'mixed' as 'base' | 'performance' | 'mixed',
    date: new Date().toISOString().split('T')[0],
  });
  const [newReturn, setNewReturn] = useState({
    investmentId: '',
    month: '',
    returnPercentage: '',
  });
  
  // Estados para cadastro de investidor com documentos
  const [showCreateInvestor, setShowCreateInvestor] = useState(false);
  const [newInvestor, setNewInvestor] = useState({
    name: '',
    email: '',
    cpf: '',
    phone: '',
    birthDate: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });
  const [investorDocuments, setInvestorDocuments] = useState<Array<{
    id: string;
    type: 'cnh' | 'rg' | 'comprovante' | 'selfie';
    file: File;
    preview?: string;
    name: string;
  }>>([]);
  const [validatingDocument, setValidatingDocument] = useState<string | null>(null);
  const [viewingDocument, setViewingDocument] = useState<{ file: File; name: string; type: string } | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Redirecionar se não for admin
  useEffect(() => {
    if (!currentUser || !userIsAdmin) {
      router.push('/');
    }
  }, [currentUser, userIsAdmin, router]);

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
            // Processar selfie
            setValidatingDocument(file.name);
            validateSelfie(file).then((result) => {
              if (result.errors.length > 0) {
                alert(`Erros encontrados:\n${result.errors.join('\n')}`);
              }
              const newDoc = {
                id: Date.now().toString(),
                type: 'selfie' as const,
                file,
                preview: URL.createObjectURL(file),
                name: file.name,
              };
              setInvestorDocuments([...investorDocuments.filter(d => d.type !== 'selfie'), newDoc]);
              setValidatingDocument(null);
            }).catch((error) => {
              alert('Erro ao processar selfie.');
              setValidatingDocument(null);
            });
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
  
  if (!currentUser || !userIsAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Negado</h2>
          <p className="text-prospere-gray-400">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }
  
  // Calculate admin metrics
  const totalInvestors = mockInvestorsExtended.length;
  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalTransactions = mockTransactions.length;
  const totalCards = mockCards.length;
  const totalBidConSales = mockBidConSales.reduce((sum, sale) => sum + sale.value, 0);
  
  // DRE data
  const dreData = {
    revenue: {
      baseReturns: 50000,
      performanceReturns: 75000,
      bidConSales: totalBidConSales,
      total: 50000 + 75000 + totalBidConSales,
    },
    expenses: {
      operations: 30000,
      management: 20000,
      total: 50000,
    },
    profit: (50000 + 75000 + totalBidConSales) - 50000,
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
        <p className="text-prospere-gray-400">Controle e gestão da Prospere Capital</p>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 border-b border-prospere-gray-800">
        {[
          { id: 'overview', label: 'Visão Geral' },
          { id: 'investors', label: 'Investidores' },
          { id: 'investments', label: 'Aportes' },
          { id: 'returns', label: 'Rentabilidades' },
          { id: 'cards', label: 'Cartas' },
          { id: 'sales', label: 'Vendas BidCon' },
          { id: 'dre', label: 'DRE' },
          { id: 'users', label: 'Usuários' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-prospere-red text-white'
                : 'border-transparent text-prospere-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total de Investidores"
              value={totalInvestors.toString()}
              icon={<Users className="w-10 h-10" />}
            />
            <MetricCard
              title="Capital Total Investido"
              value={formatCurrency(totalInvested)}
              icon={<DollarSign className="w-10 h-10" />}
            />
            <MetricCard
              title="Total de Transações"
              value={totalTransactions.toString()}
              icon={<FileText className="w-10 h-10" />}
            />
            <MetricCard
              title="Cartas em Estoque"
              value={totalCards.toString()}
              icon={<Package className="w-10 h-10" />}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-xl font-bold text-white mb-4">Evolução de Aportes</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockInvestments.map((inv, idx) => ({
                  month: `M${idx + 1}`,
                  value: inv.amount,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Line type="monotone" dataKey="value" stroke="#DC2626" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            
            <Card>
              <h3 className="text-xl font-bold text-white mb-4">Distribuição por Pool</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockPools.map(pool => ({
                  name: pool.name.replace('Pool ', ''),
                  volume: pool.allocatedVolume,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="volume" fill="#DC2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}
      
      {/* Investors Tab */}
      {activeTab === 'investors' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Investidores</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Buscar investidor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button onClick={() => setShowCreateInvestor(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Investidor
              </Button>
            </div>
          </div>
          
          {/* Formulário de Cadastro de Investidor */}
          {showCreateInvestor && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-6 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
            >
              <h3 className="text-lg font-bold text-white mb-4">Cadastrar Novo Investidor</h3>
              
              {/* Dados Pessoais */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-white mb-3">Dados Pessoais</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nome Completo *"
                    value={newInvestor.name}
                    onChange={(e) => setNewInvestor({ ...newInvestor, name: e.target.value })}
                    placeholder="Nome completo"
                  />
                  <Input
                    label="CPF *"
                    value={newInvestor.cpf}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                      const formatted = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                      setNewInvestor({ ...newInvestor, cpf: formatted });
                    }}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                  <Input
                    label="E-mail *"
                    type="email"
                    value={newInvestor.email}
                    onChange={(e) => setNewInvestor({ ...newInvestor, email: e.target.value })}
                    placeholder="email@exemplo.com"
                  />
                  <Input
                    label="Telefone *"
                    type="tel"
                    value={newInvestor.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      const formatted = value.length <= 11
                        ? value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
                        : newInvestor.phone;
                      setNewInvestor({ ...newInvestor, phone: formatted });
                    }}
                    placeholder="(00) 00000-0000"
                  />
                  <Input
                    label="Data de Nascimento *"
                    type="date"
                    value={newInvestor.birthDate}
                    onChange={(e) => setNewInvestor({ ...newInvestor, birthDate: e.target.value })}
                  />
                </div>
              </div>
              
              {/* Endereço */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-white mb-3">Endereço</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="CEP *"
                    value={newInvestor.cep}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                      const formatted = value.replace(/(\d{5})(\d{3})/, '$1-$2');
                      setNewInvestor({ ...newInvestor, cep: formatted });
                    }}
                    placeholder="00000-000"
                    maxLength={9}
                  />
                  <Input
                    label="Endereço (Rua/Avenida) *"
                    value={newInvestor.address}
                    onChange={(e) => setNewInvestor({ ...newInvestor, address: e.target.value })}
                    placeholder="Nome da rua"
                  />
                  <Input
                    label="Número *"
                    value={newInvestor.number}
                    onChange={(e) => setNewInvestor({ ...newInvestor, number: e.target.value })}
                    placeholder="Número"
                  />
                  <Input
                    label="Complemento"
                    value={newInvestor.complement}
                    onChange={(e) => setNewInvestor({ ...newInvestor, complement: e.target.value })}
                    placeholder="Apto, Bloco, etc (opcional)"
                  />
                  <Input
                    label="Bairro *"
                    value={newInvestor.neighborhood}
                    onChange={(e) => setNewInvestor({ ...newInvestor, neighborhood: e.target.value })}
                    placeholder="Bairro"
                  />
                  <Input
                    label="Cidade *"
                    value={newInvestor.city}
                    onChange={(e) => setNewInvestor({ ...newInvestor, city: e.target.value })}
                    placeholder="Cidade"
                  />
                  <Input
                    label="Estado *"
                    value={newInvestor.state}
                    onChange={(e) => setNewInvestor({ ...newInvestor, state: e.target.value.toUpperCase() })}
                    placeholder="UF"
                    maxLength={2}
                  />
                </div>
              </div>
              
              {/* Upload de Documentos */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-white mb-3">Documentos *</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-prospere-gray-300 mb-2">
                      CNH ou RG (Frente e Verso) *
                    </label>
                    <AdminDocumentUpload
                      type="cnh"
                      label="CNH/RG"
                      icon={<FileText className="w-6 h-6" />}
                      onUpload={async (type, file) => {
                        if (!validateFileSize(file, 5)) {
                          alert('Arquivo muito grande. Máximo 5MB permitido.');
                          return;
                        }
                        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
                        if (!validateFileType(file, allowedTypes)) {
                          alert('Formato inválido. Use JPG, PNG ou PDF (digital ou escaneado).');
                          return;
                        }
                        setValidatingDocument(file.name);
                        try {
                          const result = await extractDocumentData(file);
                          const newDoc = {
                            id: Date.now().toString(),
                            type: type as 'cnh' | 'rg',
                            file,
                            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
                            name: file.name,
                          };
                          setInvestorDocuments([...investorDocuments.filter(d => d.type !== type), newDoc]);
                          
                          // Separar erros críticos de avisos
                          const criticalErrors = result.errors.filter((err: string) => 
                            err.includes('muito grande') || err.includes('Formato inválido')
                          );
                          const warnings = result.errors.filter((err: string) => 
                            !err.includes('muito grande') && !err.includes('Formato inválido')
                          );
                          
                          // Preencher automaticamente os campos com dados extraídos do OCR
                          if (result.extractedData) {
                            const updates: any = { ...newInvestor };
                            
                            if (result.extractedData.cpf) {
                              updates.cpf = result.extractedData.cpf;
                            }
                            if (result.extractedData.name) {
                              // Converter nome para formato normal (primeira letra maiúscula)
                              const nameParts = result.extractedData.name.toLowerCase().split(' ');
                              updates.name = nameParts.map((part: string) => 
                                part.charAt(0).toUpperCase() + part.slice(1)
                              ).join(' ');
                            }
                            if (result.extractedData.birthDate) {
                              updates.birthDate = result.extractedData.birthDate;
                            }
                            
                            setNewInvestor(updates);
                            
                            // Mostrar mensagem de sucesso com dados extraídos
                            if (result.extractedData.name || result.extractedData.cpf || result.extractedData.birthDate) {
                              const extractedFields = [];
                              if (result.extractedData.name) extractedFields.push('Nome');
                              if (result.extractedData.cpf) extractedFields.push('CPF');
                              if (result.extractedData.birthDate) extractedFields.push('Data de Nascimento');
                              
                              let message = `✅ OCR concluído!\n\nDados extraídos automaticamente:\n${extractedFields.join(', ')}\n\n`;
                              if (warnings.length > 0) {
                                message += `⚠️ Atenção:\n${warnings.join('\n')}\n\n`;
                              }
                              message += 'Verifique se os dados estão corretos e ajuste se necessário.';
                              alert(message);
                            }
                          }
                          
                          // Mostrar apenas erros críticos como alerta bloqueante
                          if (criticalErrors.length > 0) {
                            alert(`❌ Erro:\n${criticalErrors.join('\n')}`);
                          }
                        } catch (error) {
                          alert('Erro ao processar documento. Tente novamente.');
                        } finally {
                          setValidatingDocument(null);
                        }
                      }}
                      document={investorDocuments.find(d => d.type === 'cnh' || d.type === 'rg')}
                      onRemove={(id) => setInvestorDocuments(investorDocuments.filter(d => d.id !== id))}
                      onView={(doc) => setViewingDocument({ file: doc.file, name: doc.name, type: doc.type })}
                      isValidating={validatingDocument !== null}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-prospere-gray-300 mb-2">
                      Comprovante de Residência *
                    </label>
                    <AdminDocumentUpload
                      type="comprovante"
                      label="Comprovante"
                      icon={<FileText className="w-6 h-6" />}
                      onUpload={async (type, file) => {
                        if (!validateFileSize(file, 5)) {
                          alert('Arquivo muito grande. Máximo 5MB permitido.');
                          return;
                        }
                        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
                        if (!validateFileType(file, allowedTypes)) {
                          alert('Formato inválido. Use JPG, PNG ou PDF (digital ou escaneado).');
                          return;
                        }
                        const newDoc = {
                          id: Date.now().toString(),
                          type: type as 'comprovante',
                          file,
                          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
                          name: file.name,
                        };
                        setInvestorDocuments([...investorDocuments.filter(d => d.type !== type), newDoc]);
                      }}
                      document={investorDocuments.find(d => d.type === 'comprovante')}
                      onRemove={(id) => setInvestorDocuments(investorDocuments.filter(d => d.id !== id))}
                      onView={(doc) => setViewingDocument({ file: doc.file, name: doc.name, type: doc.type })}
                      isValidating={validatingDocument !== null}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-prospere-gray-300 mb-2">
                      Selfie *
                    </label>
                    <AdminDocumentUpload
                      type="selfie"
                      label="Tire uma selfie"
                      icon={<Camera className="w-6 h-6" />}
                      isImage={true}
                      onUpload={async (type, file) => {
                        if (!validateFileSize(file, 5)) {
                          alert('Arquivo muito grande. Máximo 5MB permitido.');
                          return;
                        }
                        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                        if (!validateFileType(file, allowedTypes)) {
                          alert('Formato inválido. Use JPG ou PNG.');
                          return;
                        }
                        setValidatingDocument(file.name);
                        try {
                          const result = await validateSelfie(file);
                          if (result.errors.length > 0) {
                            alert(`Erros encontrados:\n${result.errors.join('\n')}`);
                          }
                          const newDoc = {
                            id: Date.now().toString(),
                            type: type as 'selfie',
                            file,
                            preview: URL.createObjectURL(file),
                            name: file.name,
                          };
                          setInvestorDocuments([...investorDocuments.filter(d => d.type !== type), newDoc]);
                        } catch (error) {
                          alert('Erro ao processar selfie.');
                        } finally {
                          setValidatingDocument(null);
                        }
                      }}
                      document={investorDocuments.find(d => d.type === 'selfie')}
                      onRemove={(id) => setInvestorDocuments(investorDocuments.filter(d => d.id !== id))}
                      onView={(doc) => setViewingDocument({ file: doc.file, name: doc.name, type: doc.type })}
                      isValidating={validatingDocument !== null}
                      onStartCamera={startCamera}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => {
                    if (!newInvestor.name || !newInvestor.email || !newInvestor.cpf) {
                      alert('Preencha pelo menos Nome, E-mail e CPF');
                      return;
                    }
                    if (!investorDocuments.find(d => d.type === 'cnh' || d.type === 'rg')) {
                      alert('É necessário fazer upload da CNH ou RG');
                      return;
                    }
                    if (!investorDocuments.find(d => d.type === 'selfie')) {
                      alert('É necessário fazer upload da selfie');
                      return;
                    }
                    // Em produção, salvaria no banco de dados
                    alert(`Investidor ${newInvestor.name} cadastrado com sucesso!\n\nDocumentos anexados: ${investorDocuments.length}`);
                    setNewInvestor({
                      name: '', email: '', cpf: '', phone: '', birthDate: '',
                      cep: '', address: '', number: '', complement: '', neighborhood: '', city: '', state: ''
                    });
                    setInvestorDocuments([]);
                    setShowCreateInvestor(false);
                  }}
                >
                  Cadastrar Investidor
                </Button>
                <Button variant="outline" onClick={() => {
                  setShowCreateInvestor(false);
                  setNewInvestor({
                    name: '', email: '', cpf: '', phone: '', birthDate: '',
                    cep: '', address: '', number: '', complement: '', neighborhood: '', city: '', state: ''
                  });
                  setInvestorDocuments([]);
                }}>
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}
          
          <div className="space-y-2">
            {mockInvestorsExtended
              .filter(inv => 
                inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                inv.email.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((investor) => (
                <div
                  key={investor.id}
                  className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-white">{investor.name}</p>
                      <p className="text-sm text-prospere-gray-400">{investor.email}</p>
                      <p className="text-xs text-prospere-gray-500 mt-1">CPF: {investor.cpf}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-prospere-gray-400">Total Investido</p>
                      <p className="text-lg font-bold text-white">
                        {formatCurrency(investor.totalInvested)}
                      </p>
                      <span className="inline-block mt-1 px-2 py-1 bg-green-900/30 border border-green-800 text-green-400 text-xs rounded">
                        {investor.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}
      
      {/* Investments Tab */}
      {activeTab === 'investments' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Aportes</h2>
            <Button onClick={() => setShowCreateInvestment(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Aporte Retroativo
            </Button>
          </div>
          
          {showCreateInvestment && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-6 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
            >
              <h3 className="text-lg font-bold text-white mb-4">Criar Aporte Retroativo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Investidor"
                  value={newInvestment.investorId}
                  onChange={(e) => setNewInvestment({ ...newInvestment, investorId: e.target.value })}
                  options={mockInvestors.map(inv => ({ value: inv.id, label: inv.name }))}
                />
                <Input
                  label="Valor do Aporte"
                  type="number"
                  value={newInvestment.amount}
                  onChange={(e) => setNewInvestment({ ...newInvestment, amount: e.target.value })}
                  placeholder="20000"
                />
                <Select
                  label="Tipo"
                  value={newInvestment.type}
                  onChange={(e) => setNewInvestment({ ...newInvestment, type: e.target.value as 'single' | 'recurring' })}
                  options={[
                    { value: 'single', label: 'Aporte Único' },
                    { value: 'recurring', label: 'Aporte Recorrente' },
                  ]}
                />
                <Select
                  label="Pool"
                  value={newInvestment.pool}
                  onChange={(e) => setNewInvestment({ ...newInvestment, pool: e.target.value as 'base' | 'performance' | 'mixed' })}
                  options={[
                    { value: 'base', label: 'Renda Base' },
                    { value: 'performance', label: 'Performance' },
                    { value: 'mixed', label: 'Misto' },
                  ]}
                />
                <Input
                  label="Data do Aporte"
                  type="date"
                  value={newInvestment.date}
                  onChange={(e) => setNewInvestment({ ...newInvestment, date: e.target.value })}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => {
                    if (newInvestment.amount && newInvestment.investorId) {
                      alert(`Aporte retroativo de ${formatCurrency(parseFloat(newInvestment.amount))} criado com sucesso!\n\nAgora você pode adicionar rentabilidades mensais na aba "Rentabilidades".`);
                      setNewInvestment({ investorId: '1', amount: '', type: 'single', pool: 'mixed', date: new Date().toISOString().split('T')[0] });
                      setShowCreateInvestment(false);
                    } else {
                      alert('Preencha todos os campos');
                    }
                  }}
                >
                  Criar Aporte
                </Button>
                <Button variant="outline" onClick={() => setShowCreateInvestment(false)}>
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}
          
          <div className="space-y-2">
            {mockInvestments.map((investment) => {
              const currentValue = calculateInvestmentCurrentValue(investment);
              const evolution = getInvestmentEvolution(investment);
              const totalReturn = ((currentValue - investment.amount) / investment.amount) * 100;
              
              return (
                <div
                  key={investment.id}
                  className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-semibold text-white">Aporte #{investment.id}</p>
                      <p className="text-sm text-prospere-gray-400">
                        {investment.type === 'single' ? 'Aporte Único' : 'Aporte Recorrente'} - {investment.pool}
                      </p>
                      <p className="text-xs text-prospere-gray-500 mt-1">
                        {investment.date.toLocaleDateString('pt-BR')}
                      </p>
                      {investment.monthlyReturns && investment.monthlyReturns.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {investment.monthlyReturns.map((ret) => (
                            <span
                              key={ret.id}
                              className="px-2 py-1 bg-prospere-red/20 border border-prospere-red text-prospere-red text-xs rounded"
                            >
                              {ret.month}: {ret.returnPercentage.toFixed(1)}%
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-prospere-gray-400">Valor Inicial</p>
                      <p className="text-sm font-medium text-prospere-gray-300">
                        {formatCurrency(investment.amount)}
                      </p>
                      <p className="text-xs text-prospere-gray-400 mt-2">Valor Atual</p>
                      <p className="text-lg font-bold text-white">
                        {formatCurrency(currentValue)}
                      </p>
                      <p className={`text-xs mt-1 ${totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
                      </p>
                      <span className={`inline-block mt-1 px-2 py-1 border text-xs rounded ${
                        investment.status === 'active'
                          ? 'bg-green-900/30 border-green-800 text-green-400'
                          : 'bg-gray-900/30 border-gray-800 text-gray-400'
                      }`}>
                        {investment.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
      
      {/* Returns Tab */}
      {activeTab === 'returns' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Rentabilidades Mensais por Cliente</h2>
            <div className="flex gap-2">
              <Select
                value={selectedInvestment || ''}
                onChange={(e) => {
                  setSelectedInvestment(e.target.value);
                  setShowAddReturn(false);
                }}
                options={[
                  { value: '', label: 'Selecione um investimento...' },
                  ...mockInvestments.map(inv => ({
                    value: inv.id,
                    label: `${mockInvestors.find(i => i.id === inv.investorId)?.name || 'Cliente'} - ${formatCurrency(inv.amount)} - ${inv.date.toLocaleDateString('pt-BR')}`
                  }))
                ]}
                className="w-80"
              />
              {selectedInvestment && (
                <Button onClick={() => setShowAddReturn(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Mês
                </Button>
              )}
            </div>
          </div>
          
          {selectedInvestment && (() => {
            const investment = mockInvestments.find(inv => inv.id === selectedInvestment);
            if (!investment) return null;
            
            const investor = mockInvestors.find(inv => inv.id === investment.investorId);
            const investmentDate = new Date(investment.date);
            const today = new Date();
            
            // Generate list of months from investment date to today
            const months: string[] = [];
            let currentDate = new Date(investmentDate.getFullYear(), investmentDate.getMonth(), 1);
            const endDate = new Date(today.getFullYear(), today.getMonth(), 1);
            
            while (currentDate <= endDate) {
              const year = currentDate.getFullYear();
              const month = String(currentDate.getMonth() + 1).padStart(2, '0');
              months.push(`${year}-${month}`);
              currentDate.setMonth(currentDate.getMonth() + 1);
            }
            
            return (
              <div className="space-y-4">
                <div className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-lg font-bold text-white">
                        {investor?.name || 'Cliente'} - Aporte #{investment.id}
                      </p>
                      <p className="text-sm text-prospere-gray-400">
                        Valor Inicial: {formatCurrency(investment.amount)} | 
                        Data: {investment.date.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-prospere-gray-400">Valor Atual</p>
                      <p className="text-2xl font-bold text-white">
                        {formatCurrency(calculateInvestmentCurrentValue(investment))}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {months.map((month) => {
                      const existingReturn = investment.monthlyReturns?.find(r => r.month === month);
                      const [year, monthNum] = month.split('-');
                      const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                      
                      return (
                        <div
                          key={month}
                          className={`p-3 rounded-lg border ${
                            existingReturn
                              ? 'bg-green-900/20 border-green-800'
                              : 'bg-prospere-gray-900 border-prospere-gray-700'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-white capitalize">
                              {monthName}
                            </span>
                            {existingReturn && (
                              <span className="px-2 py-1 bg-green-900/30 border border-green-800 text-green-400 text-xs rounded">
                                {existingReturn.returnPercentage.toFixed(1)}%
                              </span>
                            )}
                          </div>
                          {existingReturn ? (
                            <div className="space-y-2">
                              <Input
                                type="number"
                                step="0.1"
                                value={existingReturn.returnPercentage}
                                onChange={(e) => {
                                  const newValue = parseFloat(e.target.value) || 0;
                                  // In production, this would update the return in the database
                                  console.log(`Atualizar rentabilidade de ${month} para ${newValue}%`);
                                  // For now, show preview
                                  if (investment) {
                                    const currentValue = calculateInvestmentCurrentValue(investment);
                                    const updatedValue = currentValue * (1 + newValue / 100);
                                    // You could update state here to show preview
                                  }
                                }}
                                className="text-sm bg-prospere-gray-800"
                                placeholder="0.0"
                              />
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const input = document.querySelector(`input[value="${existingReturn.returnPercentage}"]`) as HTMLInputElement;
                                    if (input) {
                                      const newValue = parseFloat(input.value) || 0;
                                      alert(`Rentabilidade de ${monthName} atualizada para ${newValue.toFixed(1)}%!\n\nEm produção, isso salvaria no banco de dados.`);
                                    }
                                  }}
                                  className="flex-1 text-xs"
                                >
                                  Salvar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    if (confirm(`Remover rentabilidade de ${monthName}?`)) {
                                      alert(`Rentabilidade removida!\n\nEm produção, isso removeria do banco de dados.`);
                                    }
                                  }}
                                  className="text-xs px-2"
                                >
                                  ×
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="Ex: 15.0"
                                className="text-sm bg-prospere-gray-800"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const input = e.target as HTMLInputElement;
                                    const value = parseFloat(input.value);
                                    if (!isNaN(value) && value > 0) {
                                      setNewReturn({
                                        investmentId: selectedInvestment,
                                        month: month,
                                        returnPercentage: value.toString(),
                                      });
                                      setShowAddReturn(true);
                                    }
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const input = document.querySelector(`input[placeholder="Ex: 15.0"]`) as HTMLInputElement;
                                  if (input && input.value) {
                                    setNewReturn({
                                      investmentId: selectedInvestment,
                                      month: month,
                                      returnPercentage: input.value,
                                    });
                                    setShowAddReturn(true);
                                  } else {
                                    // Direct add with prompt
                                    const value = prompt(`Digite a rentabilidade para ${monthName} (%):`);
                                    if (value && !isNaN(parseFloat(value))) {
                                      setNewReturn({
                                        investmentId: selectedInvestment,
                                        month: month,
                                        returnPercentage: value,
                                      });
                                      setShowAddReturn(true);
                                    }
                                  }
                                }}
                                className="w-full text-xs"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Adicionar
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })()}
          
          {showAddReturn && selectedInvestment && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-6 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
            >
              <h3 className="text-lg font-bold text-white mb-4">Adicionar Rentabilidade Mensal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-prospere-gray-300 mb-2">
                    Mês/Ano
                  </label>
                  <Input
                    type="text"
                    value={newReturn.month}
                    onChange={(e) => setNewReturn({ ...newReturn, month: e.target.value })}
                    placeholder="2024-11"
                    disabled
                  />
                  <p className="text-xs text-prospere-gray-400 mt-1">
                    {newReturn.month && (() => {
                      const [year, month] = newReturn.month.split('-');
                      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                    })()}
                  </p>
                </div>
                <Input
                  label="Rentabilidade (%)"
                  type="number"
                  step="0.1"
                  value={newReturn.returnPercentage}
                  onChange={(e) => setNewReturn({ ...newReturn, returnPercentage: e.target.value })}
                  placeholder="15.0"
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => {
                    if (newReturn.month && newReturn.returnPercentage) {
                      const investment = mockInvestments.find(inv => inv.id === newReturn.investmentId);
                      if (investment) {
                        const currentValue = calculateInvestmentCurrentValue(investment);
                        const newValue = currentValue * (1 + parseFloat(newReturn.returnPercentage) / 100);
                        const [year, month] = newReturn.month.split('-');
                        const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
                        
                        alert(
                          `Rentabilidade de ${newReturn.returnPercentage}% adicionada para ${monthName}!\n\n` +
                          `Valor antes: ${formatCurrency(currentValue)}\n` +
                          `Valor após: ${formatCurrency(newValue)}\n` +
                          `Ganho: ${formatCurrency(newValue - currentValue)}`
                        );
                        setNewReturn({ investmentId: selectedInvestment, month: '', returnPercentage: '' });
                        setShowAddReturn(false);
                      }
                    } else {
                      alert('Preencha a rentabilidade');
                    }
                  }}
                >
                  Adicionar Rentabilidade
                </Button>
                <Button variant="outline" onClick={() => {
                  setNewReturn({ investmentId: selectedInvestment, month: '', returnPercentage: '' });
                  setShowAddReturn(false);
                }}>
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}
          
          <div className="space-y-4">
            {mockInvestments
              .filter(inv => inv.monthlyReturns && inv.monthlyReturns.length > 0)
              .map((investment) => {
                const evolution = getInvestmentEvolution(investment);
                const currentValue = calculateInvestmentCurrentValue(investment);
                
                return (
                  <div
                    key={investment.id}
                    className="p-6 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold text-white text-lg">Aporte #{investment.id}</p>
                        <p className="text-sm text-prospere-gray-400">
                          Investidor: {mockInvestors.find(inv => inv.id === investment.investorId)?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-prospere-gray-500 mt-1">
                          Data: {investment.date.toLocaleDateString('pt-BR')} | 
                          Valor Inicial: {formatCurrency(investment.amount)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-prospere-gray-400">Valor Atual</p>
                        <p className="text-2xl font-bold text-white">
                          {formatCurrency(currentValue)}
                        </p>
                        <p className="text-sm text-green-400 mt-1">
                          +{formatCurrency(currentValue - investment.amount)} (
                          +{(((currentValue - investment.amount) / investment.amount) * 100).toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-white mb-3">Evolução Mensal</h4>
                      <div className="space-y-2">
                        {evolution.map((evol, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-3 bg-prospere-gray-900 rounded border border-prospere-gray-700"
                          >
                            <div className="flex items-center gap-3">
                              <Calendar className="w-4 h-4 text-prospere-gray-400" />
                              <span className="text-sm text-white font-medium">{evol.month}</span>
                              {evol.returnPercentage > 0 && (
                                <span className="px-2 py-1 bg-green-900/30 border border-green-800 text-green-400 text-xs rounded flex items-center gap-1">
                                  <Percent className="w-3 h-3" />
                                  {evol.returnPercentage.toFixed(1)}%
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-bold text-white">
                              {formatCurrency(evol.value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {evolution.length > 1 && (
                      <div className="mt-4">
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart data={evolution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                            <YAxis stroke="#9CA3AF" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                              formatter={(value: number) => formatCurrency(value)}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#DC2626" 
                              strokeWidth={3}
                              dot={{ fill: '#DC2626', r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                );
              })}
            
            {mockInvestments.filter(inv => !inv.monthlyReturns || inv.monthlyReturns.length === 0).length > 0 && (
              <div className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700">
                <p className="text-sm text-prospere-gray-400 mb-2">
                  Investimentos sem rentabilidades definidas:
                </p>
                <div className="space-y-2">
                  {mockInvestments
                    .filter(inv => !inv.monthlyReturns || inv.monthlyReturns.length === 0)
                    .map((investment) => (
                      <div
                        key={investment.id}
                        className="p-3 bg-prospere-gray-900 rounded border border-prospere-gray-700 flex justify-between items-center"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">Aporte #{investment.id}</p>
                          <p className="text-xs text-prospere-gray-400">
                            {formatCurrency(investment.amount)} - {investment.date.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setNewReturn({ investmentId: investment.id, month: '', returnPercentage: '' });
                            setShowAddReturn(true);
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Adicionar Rentabilidade
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
      
      {/* Cards Tab */}
      {activeTab === 'cards' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Estoque de Cartas</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Cartas
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <p className="text-sm text-prospere-gray-400 mb-1">Cartas Contempladas</p>
              <p className="text-2xl font-bold text-white">
                {mockCards.filter(c => c.type === 'contemplated').length}
              </p>
            </div>
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <p className="text-sm text-prospere-gray-400 mb-1">Cartas Não Contempladas</p>
              <p className="text-2xl font-bold text-white">
                {mockCards.filter(c => c.type === 'non_contemplated').length}
              </p>
            </div>
            <div className="p-4 bg-prospere-gray-800 rounded-lg">
              <p className="text-sm text-prospere-gray-400 mb-1">Total em Estoque</p>
              <p className="text-2xl font-bold text-white">{mockCards.length}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {mockCards.map((card) => (
              <div
                key={card.id}
                className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">Carta #{card.id}</p>
                    <p className="text-sm text-prospere-gray-400">
                      {card.type === 'contemplated' ? 'Contemplada' : 'Não Contemplada'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">
                      {formatCurrency(card.value)}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-1 border text-xs rounded ${
                      card.status === 'active'
                        ? 'bg-green-900/30 border-green-800 text-green-400'
                        : 'bg-gray-900/30 border-gray-800 text-gray-400'
                    }`}>
                      {card.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* Sales Tab */}
      {activeTab === 'sales' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Vendas BidCon</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Venda
            </Button>
          </div>
          
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockBidConSales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Bar dataKey="value" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="p-4 bg-prospere-gray-800 rounded-lg">
            <p className="text-sm text-prospere-gray-400 mb-1">Total de Vendas</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(totalBidConSales)}
            </p>
          </div>
        </Card>
      )}
      
      {/* DRE Tab */}
      {activeTab === 'dre' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Demonstração de Resultados (DRE)</h2>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Relatório
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="p-6 bg-prospere-gray-800 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-4">Receitas</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-prospere-gray-400">Rendimentos Renda Base</span>
                  <span className="text-white font-medium">
                    {formatCurrency(dreData.revenue.baseReturns)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-prospere-gray-400">Rendimentos Performance</span>
                  <span className="text-white font-medium">
                    {formatCurrency(dreData.revenue.performanceReturns)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-prospere-gray-400">Vendas BidCon</span>
                  <span className="text-white font-medium">
                    {formatCurrency(dreData.revenue.bidConSales)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-prospere-gray-700">
                  <span className="text-white font-bold">Total de Receitas</span>
                  <span className="text-white font-bold text-lg">
                    {formatCurrency(dreData.revenue.total)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-prospere-gray-800 rounded-lg">
              <h3 className="text-lg font-bold text-white mb-4">Despesas</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-prospere-gray-400">Operacionais</span>
                  <span className="text-white font-medium">
                    {formatCurrency(dreData.expenses.operations)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-prospere-gray-400">Gestão</span>
                  <span className="text-white font-medium">
                    {formatCurrency(dreData.expenses.management)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-prospere-gray-700">
                  <span className="text-white font-bold">Total de Despesas</span>
                  <span className="text-white font-bold text-lg">
                    {formatCurrency(dreData.expenses.total)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-prospere-red/10 border-2 border-prospere-red rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold text-xl">Lucro Líquido</span>
                <span className="text-white font-bold text-2xl">
                  {formatCurrency(dreData.profit)}
                </span>
              </div>
              <p className="text-sm text-prospere-gray-400 mt-2">
                Margem: {formatPercentage((dreData.profit / dreData.revenue.total) * 100)}
              </p>
            </div>
          </div>
        </Card>
      )}
      
      {/* Users Tab */}
      {activeTab === 'users' && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Usuários do Sistema</h2>
            <Button onClick={() => setShowCreateUser(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Usuário
            </Button>
          </div>
          
          {showCreateUser && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-6 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
            >
              <h3 className="text-lg font-bold text-white mb-4">Criar Novo Usuário</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nome Completo"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nome do usuário"
                />
                <Input
                  label="E-mail"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="email@exemplo.com"
                />
                <Input
                  label="Senha"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Senha de acesso"
                />
                <Select
                  label="Tipo de Usuário"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'investor' })}
                  options={[
                    { value: 'investor', label: 'Investidor' },
                    { value: 'admin', label: 'Administrador' },
                  ]}
                />
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => {
                    if (newUser.name && newUser.email && newUser.password) {
                      createUser(newUser);
                      alert('Usuário criado com sucesso!');
                      setNewUser({ name: '', email: '', password: '', role: 'investor' });
                      setShowCreateUser(false);
                    } else {
                      alert('Preencha todos os campos');
                    }
                  }}
                >
                  Criar Usuário
                </Button>
                <Button variant="outline" onClick={() => setShowCreateUser(false)}>
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}
          
          <div className="space-y-2">
            {mockUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{user.name}</p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-prospere-red/20 border border-prospere-red text-prospere-red'
                          : 'bg-blue-900/30 border border-blue-800 text-blue-400'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Investidor'}
                      </span>
                    </div>
                    <p className="text-sm text-prospere-gray-400">{user.email}</p>
                    <p className="text-xs text-prospere-gray-500 mt-1">
                      Criado em: {user.createdAt.toLocaleDateString('pt-BR')}
                      {user.lastLogin && ` | Último acesso: ${user.lastLogin.toLocaleDateString('pt-BR')}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      Resetar Senha
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      
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
                  <p className="text-sm text-prospere-gray-400">{viewingDocument.type}</p>
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
                      src={URL.createObjectURL(viewingDocument.file)}
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
                    Segure sua CNH ou RG visível na foto
                  </p>
                  <p className="text-white/80 text-sm">
                    Posicione seu rosto e o documento no centro
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
                    Segure sua CNH ou RG visível na foto
                  </p>
                  <p className="text-white/80 text-sm">
                    Posicione seu rosto e o documento no centro
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

// Componente de Upload de Documentos para Admin
interface AdminDocumentUploadProps {
  type: 'cnh' | 'rg' | 'comprovante' | 'selfie';
  label: string;
  icon: React.ReactNode;
  onUpload: (type: string, file: File) => void;
  document?: {
    id: string;
    type: string;
    file: File;
    preview?: string;
    name: string;
  };
  onRemove: (id: string) => void;
  isImage?: boolean;
  onView?: (document: { file: File; name: string; type: string }) => void;
  isValidating?: boolean;
  onStartCamera?: () => void;
}

function AdminDocumentUpload({
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
}: AdminDocumentUploadProps) {
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
              <p className="text-xs text-green-400">✓ Enviado</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onView && (
              <button
                onClick={() => onView({ file: document.file, name: document.name, type: document.type })}
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
        border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
        ${isDragging
          ? 'border-prospere-red bg-prospere-red/10'
          : 'border-prospere-gray-700 hover:border-prospere-gray-600'
        }
      `}
    >
      <input
        type="file"
        id={`admin-upload-${type}`}
        className="hidden"
        accept={isImage ? 'image/*' : 'image/*,.pdf,application/pdf'}
        onChange={handleFileSelect}
      />
      <label htmlFor={`admin-upload-${type}`} className="cursor-pointer">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-prospere-gray-800 rounded-full flex items-center justify-center text-prospere-gray-400">
            {icon}
          </div>
          <div>
            <p className="text-white font-medium text-sm mb-1">{label}</p>
            <p className="text-xs text-prospere-gray-400">
              Clique ou arraste o arquivo
            </p>
            <p className="text-xs text-prospere-gray-500 mt-1">
              JPG, PNG ou PDF digital/escaneado (máx. 5MB)
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
                  Selecionar
                </>
              )}
            </Button>
          </div>
        </div>
      </label>
    </div>
  );
}
