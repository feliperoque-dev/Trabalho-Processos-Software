// Mapa de telas: espelha a tabela "Telas e rotas" do DESIGN_HANDOFF.md.
export type ScreenGroup = 'acesso' | 'principal' | 'nova' | 'admin';

export type ScreenInfo = {
  num: string;
  id: string;
  title: string;
  path: string;
  file: string;
  group: ScreenGroup;
  leadsTo: string[];
  note?: string;
};

export const groups: { id: ScreenGroup; title: string; description: string }[] = [
  { id: 'acesso', title: 'Acesso', description: 'Boas-vindas, login e cadastro do cidadão' },
  { id: 'principal', title: 'Área logada', description: 'Abas principais: Início, Acompanhar e Perfil' },
  { id: 'nova', title: 'Nova reclamação', description: 'Fluxo de registro em 5 passos até o protocolo' },
  { id: 'admin', title: 'Prefeitura', description: 'Painel web separado para a fiscalização' },
];

export const screens: ScreenInfo[] = [
  { num: '01', id: 'welcome', title: 'Boas-vindas', path: '/welcome', file: 'Main.dc.html', group: 'acesso', leadsTo: ['login', 'signup'] },
  { num: '02', id: 'login', title: 'Login', path: '/login', file: 'Login.dc.html', group: 'acesso', leadsTo: ['home', 'signup'] },
  { num: '03', id: 'signup', title: 'Cadastro', path: '/signup', file: 'Cadastro.dc.html', group: 'acesso', leadsTo: ['home', 'login'] },
  { num: '04', id: 'home', title: 'Início', path: '/home', file: 'Home.dc.html', group: 'principal', leadsTo: ['new', 'details', 'complaints', 'profile'] },
  { num: '05', id: 'new', title: 'Nova reclamação', path: '/complaint/new', file: 'NovaReclamacao.dc.html', group: 'nova', leadsTo: ['category'] },
  { num: '06', id: 'category', title: 'Categoria', path: '/complaint/new/category', file: 'Categorias.dc.html', group: 'nova', leadsTo: ['details-form'], note: 'Passo 1/5' },
  { num: '07', id: 'details-form', title: 'Detalhes', path: '/complaint/new/details', file: 'Formulario.dc.html', group: 'nova', leadsTo: ['media'], note: 'Passo 2/5' },
  { num: '08', id: 'media', title: 'Fotos e vídeos', path: '/complaint/new/media', file: 'Foto.dc.html', group: 'nova', leadsTo: ['location'], note: 'Passo 3/5' },
  { num: '09', id: 'location', title: 'Localização', path: '/complaint/new/location', file: 'Localizacao.dc.html', group: 'nova', leadsTo: ['review'], note: 'Passo 4/5' },
  { num: '10', id: 'review', title: 'Revisão', path: '/complaint/new/review', file: 'Revisao.dc.html', group: 'nova', leadsTo: ['success'], note: 'Passo 5/5 · "Editar" volta ao passo' },
  { num: '11', id: 'success', title: 'Confirmação', path: '/complaint/success', file: 'Confirmacao.dc.html', group: 'nova', leadsTo: ['details', 'home'] },
  { num: '12', id: 'complaints', title: 'Minhas reclamações', path: '/complaints', file: 'MinhasReclamacoes.dc.html', group: 'principal', leadsTo: ['details'] },
  { num: '13', id: 'details', title: 'Detalhes da reclamação', path: '/complaint/2026-0847', file: 'Detalhes.dc.html', group: 'principal', leadsTo: [] },
  { num: '14', id: 'profile', title: 'Perfil', path: '/profile', file: 'Perfil.dc.html', group: 'principal', leadsTo: ['settings', 'complaints', 'welcome'] },
  { num: '15', id: 'settings', title: 'Configurações', path: '/settings', file: 'Configuracoes.dc.html', group: 'principal', leadsTo: [] },
  { num: '16', id: 'admin', title: 'Painel da prefeitura', path: '/admin', file: 'PainelAdmin.dc.html', group: 'admin', leadsTo: [] },
];

export const screenById = (id: string) => screens.find((s) => s.id === id)!;
