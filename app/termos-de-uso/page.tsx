'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, FileText, Shield, AlertTriangle } from 'lucide-react';
import { companyData } from '@/lib/companyData';
import { motion } from 'framer-motion';

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-prospere-black py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-prospere-red" />
            <h1 className="text-4xl font-bold text-white">Termos de Uso</h1>
          </div>
          <p className="text-prospere-gray-400">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Important Notice */}
        <Card>
          <div className="p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-yellow-400 font-semibold mb-2">Leia com Atenção</p>
                <p className="text-sm text-prospere-gray-300">
                  Ao acessar, cadastrar-se ou utilizar a plataforma Prospere Capital, você declara que leu, 
                  compreendeu e concorda integralmente com estes Termos de Uso, bem como com a Política de Privacidade.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Terms Content */}
        <Card>
          <div className="prose prose-invert max-w-none space-y-8">
            
            {/* Section 1 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-prospere-red">1.</span>
                Aceitação dos Termos
              </h2>
              <p className="text-prospere-gray-300 leading-relaxed">
                Ao acessar, cadastrar-se ou utilizar a plataforma <strong className="text-white">Prospere Capital</strong>, 
                o usuário declara que leu, compreendeu e concorda integralmente com estes Termos de Uso, bem como com a 
                Política de Privacidade.
              </p>
              <p className="text-prospere-gray-300 leading-relaxed">
                Se o usuário não concordar com qualquer cláusula, não deverá utilizar a plataforma.
              </p>
            </motion.section>

            <div className="border-t border-prospere-gray-800 my-8" />

            {/* Section 2 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-prospere-red">2.</span>
                Definições
              </h2>
              <p className="text-prospere-gray-300 mb-4">Para fins destes Termos:</p>
              <ul className="space-y-2 text-prospere-gray-300 list-disc list-inside ml-4">
                <li><strong className="text-white">Plataforma:</strong> ambiente digital operado por {companyData.razaoSocial}.</li>
                <li><strong className="text-white">Usuário:</strong> pessoa física ou jurídica cadastrada na plataforma.</li>
                <li><strong className="text-white">Cartas de Consórcio:</strong> títulos de consórcio contemplados ou não contemplados lastreados pela plataforma.</li>
                <li><strong className="text-white">Operações:</strong> depósitos, saques, compra e venda de cartas, financiamento de lances e demais transações disponíveis.</li>
                <li><strong className="text-white">Serviços:</strong> funcionalidades oferecidas, incluindo intermediação, tecnologia, acesso a informações, simulações e gestão de operações de consórcio.</li>
              </ul>
            </motion.section>

            <div className="border-t border-prospere-gray-800 my-8" />

            {/* Section 3 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-prospere-red">3.</span>
                Objeto
              </h2>
              <p className="text-prospere-gray-300 leading-relaxed">
                A plataforma Prospere Capital tem como objetivo disponibilizar um ambiente tecnológico que permite aos usuários:
              </p>
              <ul className="space-y-2 text-prospere-gray-300 list-disc list-inside ml-4">
                <li>Acesso a operações com cartas de consórcio lastreadas;</li>
                <li>Compra e venda de cartas de consórcio contempladas e não contempladas;</li>
                <li>Financiamento de lances de consórcio;</li>
                <li>Entrada em cartas contempladas;</li>
                <li>Depósitos e saques lastreados em cartas de consórcio;</li>
                <li>Simulações de investimentos e projeções de rentabilidade;</li>
                <li>Ferramentas digitais para gestão de operações de consórcio;</li>
                <li>Conteúdos educacionais e informativos sobre consórcios.</li>
              </ul>
              <div className="p-4 bg-prospere-gray-800 rounded-lg mt-4">
                <p className="text-sm text-prospere-gray-300">
                  <strong className="text-white">Importante:</strong> A plataforma atua como intermediadora de operações 
                  lastreadas em cartas de consórcio. Todas as operações são garantidas por cartas contempladas em nosso portfólio, 
                  proporcionando segurança e lastreamento aos investimentos.
                </p>
              </div>
            </motion.section>

            <div className="border-t border-prospere-gray-800 my-8" />

            {/* Section 4 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-prospere-red">4.</span>
                Elegibilidade
              </h2>
              <p className="text-prospere-gray-300 leading-relaxed mb-4">
                Para utilizar a plataforma, o usuário declara que:
              </p>
              <ul className="space-y-2 text-prospere-gray-300 list-disc list-inside ml-4">
                <li>Possui capacidade civil para contratar (maior de 18 anos ou emancipado);</li>
                <li>Fornecerá informações verdadeiras, completas e atualizadas;</li>
                <li>Utilizará a plataforma para fins lícitos;</li>
                <li>Está ciente dos riscos inerentes às operações de consórcio.</li>
              </ul>
              <p className="text-prospere-gray-300 leading-relaxed mt-4">
                A plataforma pode recusar, suspender ou cancelar cadastros a qualquer tempo, sem necessidade de justificativa, 
                quando identificar indícios de irregularidade, fraude ou descumprimento destes Termos.
              </p>
            </motion.section>

            <div className="border-t border-prospere-gray-800 my-8" />

            {/* Section 5 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-prospere-red">5.</span>
                Cadastro e Conta
              </h2>
              <p className="text-prospere-gray-300 leading-relaxed mb-4">
                O usuário é responsável por:
              </p>
              <ul className="space-y-2 text-prospere-gray-300 list-disc list-inside ml-4">
                <li>Manter a confidencialidade de seus dados de acesso (login e senha);</li>
                <li>Todas as atividades realizadas em sua conta;</li>
                <li>Atualizar seus dados sempre que necessário;</li>
                <li>Fornecer documentos válidos e atualizados durante o processo de abertura de conta;</li>
                <li>Notificar imediatamente a plataforma em caso de acesso não autorizado.</li>
              </ul>
              <p className="text-prospere-gray-300 leading-relaxed mt-4">
                A plataforma não se responsabiliza por acessos indevidos decorrentes de negligência do usuário na guarda 
                de suas credenciais de acesso.
              </p>
            </motion.section>

            <div className="border-t border-prospere-gray-800 my-8" />

            {/* Section 6 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-prospere-red">6.</span>
                Natureza dos Serviços e Riscos
              </h2>
              <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg mb-4">
                <p className="text-red-400 font-semibold mb-2">⚠️ Aviso de Risco</p>
                <p className="text-sm text-prospere-gray-300">
                  O usuário declara estar ciente de que operações com consórcios envolvem riscos e que:
                </p>
              </div>
              <ul className="space-y-2 text-prospere-gray-300 list-disc list-inside ml-4">
                <li>Não há garantia de rentabilidade ou resultados específicos;</li>
                <li>O valor das cartas pode oscilar conforme condições de mercado;</li>
                <li>Perdas podem ocorrer, inclusive de forma parcial ou integral;</li>
                <li>O prazo de resgate segue regra D+30 (30 dias corridos);</li>
                <li>As operações são lastreadas em cartas de consórcio, mas sujeitas a riscos de mercado.</li>
              </ul>
              <p className="text-prospere-gray-300 leading-relaxed mt-4">
                A plataforma não presta consultoria financeira, jurídica ou contábil, nem recomenda investimentos específicos. 
                Todas as decisões são de responsabilidade exclusiva do usuário.
              </p>
            </motion.section>

            <div className="border-t border-prospere-gray-800 my-8" />

            {/* Section 7 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-prospere-red">7.</span>
                Obrigações do Usuário
              </h2>
              <p className="text-prospere-gray-300 leading-relaxed mb-4">
                É vedado ao usuário:
              </p>
              <ul className="space-y-2 text-prospere-gray-300 list-disc list-inside ml-4">
                <li>Utilizar a plataforma para fins ilegais ou não autorizados;</li>
                <li>Fraudar sistemas, dados ou terceiros;</li>
                <li>Praticar lavagem de dinheiro, financiamento ao terrorismo ou ocultação de bens;</li>
                <li>Tentar burlar mecanismos de segurança da plataforma;</li>
                <li>Inserir informações falsas ou de terceiros sem autorização;</li>
                <li>Realizar operações simuladas ou fraudulentas;</li>
                <li>Compartilhar credenciais de acesso com terceiros.</li>
              </ul>
              <p className="text-prospere-gray-300 leading-relaxed mt-4">
                O descumprimento poderá resultar em bloqueio imediato, cancelamento da conta, perda de valores e 
                comunicação às autoridades competentes.
              </p>
            </motion.section>

            <div className="border-t border-prospere-gray-800 my-8" />

            {/* Section 8 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-prospere-red">8.</span>
                Compliance, PLD e Cooperação Legal
              </h2>
              <p className="text-prospere-gray-300 leading-relaxed mb-4">
                O usuário autoriza que a plataforma:
              </p>
              <ul className="space-y-2 text-prospere-gray-300 list-disc list-inside ml-4">
                <li>Realize validações cadastrais (KYC - Know Your Customer);</li>
                <li>Monitore transações para prevenção de lavagem de dinheiro (PLD);</li>
                <li>Compartilhe informações com autoridades quando legalmente exigido;</li>
                <li>Suspenda movimentações suspeitas ou não autorizadas;</li>
                <li>Solicite documentação adicional quando necessário para compliance.</li>
              </ul>
              <p className="text-prospere-gray-300 leading-relaxed mt-4">
                A plataforma está em conformidade com as normas do Banco Central e demais reguladores, 
                aplicando rigorosamente os procedimentos de prevenção à lavagem de dinheiro e financiamento do terrorismo.
              </p>
            </motion.section>

            <div className="border-t border-prospere-gray-800 my-8" />

            {/* Section 9 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-prospere-red">9.</span>
                Propriedade Intelectual
              </h2>
              <p className="text-prospere-gray-300 leading-relaxed">
                Todo o conteúdo da plataforma (marca, software, layout, textos, imagens, sistemas, fluxos e identidade visual) 
                pertence à <strong className="text-white">{companyData.razaoSocial}</strong>, CNPJ {companyData.cnpj}, 
                sendo proibida cópia, reprodução, engenharia reversa, exploração comercial ou qualquer uso não autorizado 
                sem prévia autorização por escrito.
              </p>
            </motion.section>

            <div className="border-t border-prospere-gray-800 my-8" />

            {/* Section 10 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-prospere-red">10.</span>
                Limitação de Responsabilidade
              </h2>
              <p className="text-prospere-gray-300 leading-relaxed mb-4">
                A plataforma não se responsabiliza por:
              </p>
              <ul className="space-y-2 text-prospere-gray-300 list-disc list-inside ml-4">
                <li>Oscilações de mercado que afetem o valor das cartas de consórcio;</li>
                <li>Decisões financeiras do usuário;</li>
                <li>Atos de terceiros ou parceiros;</li>
                <li>Falhas externas de internet, sistemas bancários ou parceiros;</li>
                <li>Ataques cibernéticos inevitáveis apesar das medidas de segurança adotadas;</li>
                <li>Contemplações ou não contemplações de consórcios que não sejam de responsabilidade da plataforma.</li>
              </ul>
              <p className="text-prospere-gray-300 leading-relaxed mt-4">
                Em qualquer hipótese, eventual responsabilidade se limitará ao valor efetivamente depositado pelo usuário 
                na plataforma, respeitando o lastreamento em cartas de consórcio.
              </p>
            </motion.section>

            <div className="border-t border-prospere-gray-800 my-8" />

            {/* Section 11 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-prospere-red">11.</span>
                Interrupções e Modificações
              </h2>
              <p className="text-prospere-gray-300 leading-relaxed mb-4">
                A plataforma poderá:
              </p>
              <ul className="space-y-2 text-prospere-gray-300 list-disc list-inside ml-4">
                <li>Alterar funcionalidades e características dos serviços;</li>
                <li>Atualizar sistemas e tecnologias;</li>
                <li>Suspender temporariamente serviços para manutenção, mediante aviso prévio quando possível;</li>
                <li>Encerrar atividades, mediante aviso prévio de 30 dias, garantindo o resgate dos valores dos usuários.</li>
              </ul>
            </motion.section>

            <div className="border-t border-prospere-gray-800 my-8" />

            {/* Section 12 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-prospere-red">12.</span>
                Privacidade e Dados
              </h2>
              <p className="text-prospere-gray-300 leading-relaxed">
                O tratamento de dados pessoais ocorrerá conforme a Política de Privacidade, em conformidade com a 
                Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). A plataforma adota medidas técnicas e 
                administrativas para proteger os dados dos usuários.
              </p>
            </motion.section>

            <div className="border-t border-prospere-gray-800 my-8" />

            {/* Section 13 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-prospere-red">13.</span>
                Alterações dos Termos
              </h2>
              <p className="text-prospere-gray-300 leading-relaxed">
                Estes Termos poderão ser atualizados a qualquer momento. A plataforma notificará os usuários sobre 
                alterações significativas através dos canais de comunicação disponíveis. A continuidade de uso após 
                alterações representa concordância automática com os novos termos.
              </p>
            </motion.section>

            <div className="border-t border-prospere-gray-800 my-8" />

            {/* Section 14 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-prospere-red">14.</span>
                Vigência e Rescisão
              </h2>
              <p className="text-prospere-gray-300 leading-relaxed mb-4">
                O presente Termo vigora por prazo indeterminado e poderá ser rescindido:
              </p>
              <ul className="space-y-2 text-prospere-gray-300 list-disc list-inside ml-4">
                <li>Pelo usuário, a qualquer tempo, mediante solicitação através da plataforma;</li>
                <li>Pela plataforma, mediante descumprimento contratual, violação destes Termos ou por critério de segurança e compliance.</li>
              </ul>
              <p className="text-prospere-gray-300 leading-relaxed mt-4">
                Em caso de rescisão, os valores do usuário serão liquidados conforme as regras de resgate D+30, 
                respeitando o lastreamento em cartas de consórcio.
              </p>
            </motion.section>

            <div className="border-t border-prospere-gray-800 my-8" />

            {/* Section 15 */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-prospere-red">15.</span>
                Foro
              </h2>
              <p className="text-prospere-gray-300 leading-relaxed">
                Fica eleito o foro da comarca de <strong className="text-white">São Paulo/SP</strong>, 
                para dirimir quaisquer controvérsias oriundas destes Termos de Uso, renunciando as partes a qualquer outro, 
                por mais privilegiado que seja.
              </p>
            </motion.section>

            <div className="border-t border-prospere-gray-800 my-8" />

            {/* Company Info */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
              className="p-6 bg-prospere-gray-800 rounded-lg border border-prospere-gray-700"
            >
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-prospere-red" />
                Informações da Empresa
              </h3>
              <div className="space-y-2 text-sm text-prospere-gray-300">
                <p><strong className="text-white">Razão Social:</strong> {companyData.razaoSocial}</p>
                <p><strong className="text-white">Nome Fantasia:</strong> {companyData.nomeFantasia}</p>
                <p><strong className="text-white">CNPJ:</strong> {companyData.cnpj}</p>
                <p><strong className="text-white">Endereço:</strong> {companyData.endereco.logradouro}, {companyData.endereco.numero} - {companyData.endereco.complemento}</p>
                <p><strong className="text-white">Bairro:</strong> {companyData.endereco.bairro} - {companyData.endereco.cidade}/{companyData.endereco.uf}</p>
                <p><strong className="text-white">CEP:</strong> {companyData.endereco.cep}</p>
                <p><strong className="text-white">E-mail:</strong> {companyData.email}</p>
                <p><strong className="text-white">Telefone:</strong> {companyData.telefone}</p>
              </div>
            </motion.section>

            {/* Acceptance */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-prospere-gray-800">
              <Button 
                size="lg" 
                className="flex-1"
                onClick={() => window.location.href = '/abertura-conta'}
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Aceito os Termos e Quero Criar Conta
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="flex-1"
                onClick={() => window.location.href = '/'}
              >
                Voltar ao Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
