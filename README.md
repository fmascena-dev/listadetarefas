# Gerenciador de Tarefas com Temporizador

*Este projeto é um* **Gerenciador de Tarefas com Temporizador**, *desenvolvido utilizando* **React** *e estilizado com* **SCSS**. *Ele permite que o usuário adicione tarefas com uma duração definida, visualize o tempo restante para cada tarefa e gerencie as tarefas de forma prática e intuitiva.*

## Funcionalidades

- **Adicionar Tarefas:** *Insira o título e a duração da tarefa no formato* `hh:mm:ss`;
- **Temporizador:** *Cada tarefa possui um temporizador que exibe o tempo restante e quando o temporizador chegar a "ZERO" uma mensagem será exibida e a tarefa será marcada como conluída;*
- **Marcar como Concluída:** *Use o checkbox para marcar uma tarefa como concluída, alterando sua aparência visual;*
- **Remover Tarefas:** *Remova tarefas da lista com um clique;*
- **Persistência Local:** *As tarefas são armazenadas no* `localStorage` *para que permaneçam disponíveis ao recarregar a página.*

## Tecnologias Utilizadas

- **Frontend:**
  - *React;*
  - *JavaScript;*
  - *SCSS.*
- **Armazenamento:** *localStorage*

## Estrutura do Projeto

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── Tarefas.jsx
│   │   ├── TarefasStyles.scss 
│   ├── App.jsx
│   ├── GlobalReset.scss
│   ├── main.jsx
├── package.json
```

## Instalação e Uso

*Siga os passos abaixo para executar o projeto localmente:*

#### Pré-requisitos:

- *Node.js instalado (versão 16 ou superior recomendada);*
- *Gerenciador de pacotes (npm ou yarn).*

#### Passo a Passo

1. **Clone o Repositório:**

   ```
   git clone https://github.com/fmascena-dev/listadetarefas.git
   cd listadetarefas
   ```

2. **Instale as Dependências:**

   ```
   npm install
   # ou
   yarn install
   ```

3. **Inicie o Servidor de Desenvolvimento:**

   ```
   npm start
   # ou
   yarn start
   ```

4. **Acesse o Projeto no Navegador:**

   *Abra* [http://localhost:3000](http://localhost:3000) *no seu navegador preferido.*

## Estilo e Design

*Os estilos foram criados utilizando* **SCSS** *com foco em responsividade e design moderno. Alguns detalhes importantes:*

- **Inputs e Botão:** *Estilizados com bordas arredondadas e mudanças de cor ao desabilitar ou hover;*
- **Temporizador:** *Exibição formatada no estilo* `hh:mm:ss`;
- **Linha Vermelha:** *Títulos de tarefas riscados em vermelho ao serem concluídos.*

## Código Principal

### Componente `Tarefas.jsx`
*Este é o componente principal do projeto, onde as tarefas são gerenciadas. Ele utiliza os estados **React** para controlar a lista de tarefas, o título e o tempo inserido pelo usuário.*

```
<div className="input-tarefa">
  <input
    className="checkbox"
    type="checkbox"
    checked={task.done}
    onChange={() => toggleTaskCompletion(index)}
  />
  <span
    style={{
      textDecoration: task.done ? 'line-through' : 'none',
      color: task.done ? '#ff0000' : '#000',
    }}
    className="task-title"
  >
    {task.title}
  </span>
</div>
```

## Melhorias Futuras

- **Login e Registro de Usuário:** *Permitir que diferentes usuários armazenem suas próprias tarefas;*
- **Sincronização na Nuvem:** *Integrar com um backend para armazenar tarefas online;*
- **Notificações:** *Alertar o usuário ao término de uma tarefa;*
- **Categorias de Tarefas:** *Adicionar categorias para melhor organização.*

## Contribuições

*Contribuições são bem-vindas! Siga os passos abaixo para contribuir com este projeto:*

1. **Faça um Fork do Repositório.**
2. **Crie uma Branch para sua Feature:**

   ```
   git checkout -b minha-feature
   ```
3. **Implemente sua Modificação.**
4. **Commit e Envie suas Alterações:**
   ```
   git commit -m "Minha nova feature"
   git push origin minha-feature
   ```
5. **Abra um Pull Request no Repositório Original.**