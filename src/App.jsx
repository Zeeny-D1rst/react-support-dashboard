import { useMemo, useState } from "react";

const initialTickets = [
  { id: 1042, title: "Acesso ao sistema indisponível", requester: "Marina Costa", department: "Financeiro", priority: "Alta", status: "Aberto", date: "Hoje, 09:42" },
  { id: 1041, title: "Atualização de cadastro de equipamento", requester: "Rafael Nunes", department: "Operações", priority: "Normal", status: "Em andamento", date: "Hoje, 08:18" },
  { id: 1040, title: "Solicitação de novo usuário", requester: "Camila Rocha", department: "Comercial", priority: "Baixa", status: "Resolvido", date: "Ontem, 16:30" },
  { id: 1039, title: "Falha na impressão de relatórios", requester: "João Pedro", department: "Logística", priority: "Alta", status: "Em andamento", date: "Ontem, 14:05" },
];
const statuses = ["Aberto", "Em andamento", "Resolvido"];

function StatCard({ label, value, tone, caption }) {
  return <article className="stat-card"><div className={`stat-icon ${tone}`} aria-hidden="true">{tone === "blue" ? "◷" : tone === "amber" ? "↻" : "✓"}</div><p>{label}</p><strong>{value}</strong><span>{caption}</span></article>;
}

function TicketRow({ ticket, onStatusChange }) {
  return <tr>
    <td><span className="ticket-id">#{ticket.id}</span></td>
    <td><strong className="ticket-title">{ticket.title}</strong><span className="ticket-subtitle">{ticket.requester} · {ticket.department}</span></td>
    <td><span className={`priority priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span></td>
    <td><select className={`status-select status-${ticket.status.toLowerCase().replaceAll(" ", "-")}`} aria-label={`Status do chamado ${ticket.id}`} value={ticket.status} onChange={(event) => onStatusChange(ticket.id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td>
    <td className="date-cell">{ticket.date}</td>
  </tr>;
}

export default function App() {
  const [tickets, setTickets] = useState(initialTickets);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", requester: "", department: "Operações", priority: "Normal" });

  const counts = useMemo(() => ({
    open: tickets.filter((ticket) => ticket.status === "Aberto").length,
    progress: tickets.filter((ticket) => ticket.status === "Em andamento").length,
    resolved: tickets.filter((ticket) => ticket.status === "Resolvido").length,
  }), [tickets]);

  const visibleTickets = useMemo(() => tickets.filter((ticket) => {
    const searchText = `${ticket.title} ${ticket.requester} ${ticket.department} ${ticket.id}`.toLowerCase();
    return searchText.includes(search.toLowerCase()) && (statusFilter === "Todos" || ticket.status === statusFilter);
  }), [tickets, search, statusFilter]);

  function changeStatus(id, status) {
    setTickets((current) => current.map((ticket) => ticket.id === id ? { ...ticket, status } : ticket));
  }

  function createTicket(event) {
    event.preventDefault();
    const title = form.title.trim();
    const requester = form.requester.trim();
    if (!title || !requester) return;
    setTickets((current) => [{ id: Math.max(0, ...current.map((ticket) => ticket.id)) + 1, ...form, title, requester, status: "Aberto", date: "Agora" }, ...current]);
    setForm({ title: "", requester: "", department: "Operações", priority: "Normal" });
    setShowForm(false);
  }

  return <div className="app-layout">
    <aside className="sidebar"><a className="logo" href="#inicio"><span>p</span> pulse<span className="logo-dot">.</span></a><p className="nav-label">WORKSPACE</p><a className="nav-item active" href="#chamados">▦ <span>Chamados</span></a><a className="nav-item" href="#indicadores">◫ <span>Indicadores</span></a><div className="sidebar-bottom"><div className="user-avatar">PC</div><div><strong>Piettro Cavalli</strong><small>Administrador</small></div></div></aside>
    <main className="main-content" id="inicio">
      <header className="page-header"><div><p className="breadcrumb">Workspace / <strong>Chamados</strong></p><h1>Visão geral</h1><p>Acompanhe e gerencie as solicitações da equipe.</p></div><button className="primary-button" onClick={() => setShowForm((value) => !value)}>＋ Novo chamado</button></header>
      <section className="stats-grid" id="indicadores"><StatCard label="Abertos" value={counts.open} tone="blue" caption="Aguardando atendimento"/><StatCard label="Em andamento" value={counts.progress} tone="amber" caption="Em atendimento pela equipe"/><StatCard label="Resolvidos" value={counts.resolved} tone="green" caption="Concluídos"/></section>
      {showForm && <form className="new-ticket-form" onSubmit={createTicket}><div className="form-heading"><strong>Novo chamado</strong><button type="button" className="close-button" onClick={() => setShowForm(false)} aria-label="Fechar formulário">×</button></div><label>Título<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} maxLength="100" required placeholder="Descreva a solicitação"/></label><div className="form-row"><label>Solicitante<input value={form.requester} onChange={(event) => setForm({ ...form, requester: event.target.value })} required placeholder="Nome do solicitante"/></label><label>Departamento<select value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })}>{["Operações", "Financeiro", "Comercial", "Logística", "TI"].map((department) => <option key={department}>{department}</option>)}</select></label><label>Prioridade<select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>{["Baixa", "Normal", "Alta"].map((priority) => <option key={priority}>{priority}</option>)}</select></label></div><button className="primary-button" type="submit">Salvar chamado</button></form>}
      <section className="table-card" id="chamados"><div className="table-heading"><div><h2>Solicitações recentes</h2><p>Gerencie os chamados registrados no sistema.</p></div><span className="total-pill">{visibleTickets.length} registros</span></div><div className="table-tools"><label className="search-box"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar chamado..." aria-label="Buscar chamados"/></label><select className="filter-select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filtrar por status">{["Todos", ...statuses].map((status) => <option key={status}>{status}</option>)}</select></div><div className="table-scroll"><table><thead><tr><th>ID</th><th>Solicitação</th><th>Prioridade</th><th>Status</th><th>Data</th></tr></thead><tbody>{visibleTickets.map((ticket) => <TicketRow key={ticket.id} ticket={ticket} onStatusChange={changeStatus}/>)}</tbody></table>{visibleTickets.length === 0 && <p className="empty-state">Nenhum chamado encontrado para esse filtro.</p>}</div></section>
      <footer className="page-footer">Pulse Support Dashboard <span>Projeto demonstrativo · Dados fictícios</span></footer>
    </main>
  </div>;
}
