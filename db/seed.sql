-- Dados de referência. Reclamações NÃO são semeadas: nascem pela aplicação.
INSERT INTO categoria (id_categoria, nome) VALUES
 ('ruido','Ruído'),('poeira','Poeira'),('entulho','Entulho'),('vibracao','Vibração'),
 ('risco','Risco de acidente'),('caminhoes','Caminhões'),('calcada','Calçada bloqueada'),('outros','Outros');

INSERT INTO status (id_status, nome, ordem) VALUES
 ('pendente','Pendente',1),('em_analise','Em análise',2),('em_andamento','Em andamento',3),
 ('resolvida','Resolvida',4),('improcedente','Improcedente',5);

INSERT INTO usuario (nome, email, perfil) VALUES
 ('Atendente Ouvidoria','ouvidoria@prefeitura.test','atendente'),
 ('Maria Moradora','maria@exemplo.test','morador');

INSERT INTO obra (nome, construtora, endereco) VALUES
 ('Edifício Aurora','Construtora Exemplo','Rua das Flores, 123');
