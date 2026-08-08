"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest, type SticeCall, type SticeMainTheme, type SticeSponsorship, type SticeThematicArea, type SticeVenue } from "../lib/stice";

type Tab = "dashboard" | "submissions" | "themes" | "venues" | "areas" | "sponsors";
type EditableRecord = Record<string, unknown> & { id?: number; title?: string; name?: string; published?: boolean };

const nav: { id: Tab; label: string; mark: string }[] = [
  { id: "dashboard", label: "Overview", mark: "⌂" },
  { id: "submissions", label: "Submissions", mark: "↥" },
  { id: "themes", label: "Main theme", mark: "T" },
  { id: "venues", label: "Venue", mark: "⌖" },
  { id: "areas", label: "Thematic areas", mark: "#" },
  { id: "sponsors", label: "Sponsorships", mark: "◇" },
];

const endpointMap: Record<Exclude<Tab, "dashboard">, string> = {
  submissions: "/api/stice-admin/call-for-submissions",
  themes: "/api/stice-admin/main-themes",
  venues: "/api/stice-admin/venue-sections",
  areas: "/api/stice-admin/thematic-areas",
  sponsors: "/api/stice-admin/sponsorship-packages",
};

const emptyMap: Record<Exclude<Tab, "dashboard" | "submissions">, EditableRecord> = {
  themes: { title: "", subtitle: "", description: "", published: false, sortOrder: 0 },
  venues: { title: "Venue", venueName: "", address: "", city: "Dar es Salaam", country: "Tanzania", description: "", imageUrl: "", mapUrl: "", published: false, sortOrder: 0 },
  areas: { title: "", summary: "", description: "", icon: "", published: false, sortOrder: 0 },
  sponsors: { name: "", headline: "", description: "", amount: 0, currency: "TZS", benefits: [], contactEmail: "costech40@costech.or.tz", featured: false, published: false, sortOrder: 0 },
};

export default function AdminPortal() {
  const [token, setToken] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const [submissions, setSubmissions] = useState<SticeCall[]>([]);
  const [themes, setThemes] = useState<SticeMainTheme[]>([]);
  const [venues, setVenues] = useState<SticeVenue[]>([]);
  const [areas, setAreas] = useState<SticeThematicArea[]>([]);
  const [sponsors, setSponsors] = useState<SticeSponsorship[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [editor, setEditor] = useState<EditableRecord | null>(null);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    setToken(sessionStorage.getItem("stice_admin_token") || "");
  }, []);

  const loadAll = useCallback(async (authToken: string) => {
    if (!authToken) return;
    setLoading(true);
    try {
      const [submissionData, themeData, venueData, areaData, sponsorData] = await Promise.all([
        apiRequest<SticeCall[]>(endpointMap.submissions, {}, authToken),
        apiRequest<SticeMainTheme[]>(endpointMap.themes, {}, authToken),
        apiRequest<SticeVenue[]>(endpointMap.venues, {}, authToken),
        apiRequest<SticeThematicArea[]>(endpointMap.areas, {}, authToken),
        apiRequest<SticeSponsorship[]>(endpointMap.sponsors, {}, authToken),
      ]);
      setSubmissions(submissionData);
      setThemes(themeData);
      setVenues(venueData);
      setAreas(areaData);
      setSponsors(sponsorData);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load admin content";
      setNotice(message);
      if (/401|unauthorized|credentials/i.test(message)) logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (token) loadAll(token); }, [token, loadAll]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await apiRequest<{ id_token: string }>("/api/authenticate", {
        method: "POST",
        body: JSON.stringify({ username: data.get("username"), password: data.get("password"), rememberMe: false }),
      });
      sessionStorage.setItem("stice_admin_token", response.id_token);
      setToken(response.id_token);
    } catch {
      setLoginError("Sign-in failed. Check your administrator credentials and try again.");
    }
  }

  function logout() {
    sessionStorage.removeItem("stice_admin_token");
    setToken("");
  }

  const currentRecords = useMemo((): EditableRecord[] => {
    if (tab === "submissions") return submissions as EditableRecord[];
    if (tab === "themes") return themes as EditableRecord[];
    if (tab === "venues") return venues as EditableRecord[];
    if (tab === "areas") return areas as EditableRecord[];
    if (tab === "sponsors") return sponsors as EditableRecord[];
    return [];
  }, [areas, sponsors, submissions, tab, themes, venues]);

  async function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor || tab === "dashboard" || tab === "submissions") return;
    const endpoint = endpointMap[tab];
    const body = { ...editor };
    if (tab === "sponsors" && typeof body.benefits === "string") {
      body.benefits = body.benefits.split("\n").map((item: string) => item.trim()).filter(Boolean);
    }
    try {
      await apiRequest(editor.id ? `${endpoint}/${editor.id}` : endpoint, {
        method: editor.id ? "PUT" : "POST",
        body: JSON.stringify(body),
      }, token);
      setEditor(null);
      setNotice("Changes saved and synchronized with marathond.");
      await loadAll(token);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Changes could not be saved.");
    }
  }

  async function removeRecord(record: EditableRecord) {
    if (tab === "dashboard" || !record.id || !window.confirm(`Delete “${record.title || record.name || "this item"}”?`)) return;
    try {
      await apiRequest(`${endpointMap[tab]}/${record.id}`, { method: "DELETE" }, token);
      setNotice("Item deleted.");
      await loadAll(token);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Item could not be deleted.");
    }
  }

  async function togglePublished(record: EditableRecord) {
    if (tab === "dashboard" || tab === "submissions" || !record.id) return;
    try {
      await apiRequest(`${endpointMap[tab]}/${record.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...record, published: !record.published }),
      }, token);
      await loadAll(token);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Publish status could not be changed.");
    }
  }

  if (!token) return <AdminLogin onLogin={login} error={loginError} />;

  const pageTitle = nav.find((item) => item.id === tab)?.label || "Overview";

  return (
    <main className="admin-shell">
      <aside className={mobileNav ? "admin-sidebar open" : "admin-sidebar"}>
        <div className="admin-brand">
          <img src="/costech-logo.png" alt="COSTECH logo" />
          <span><strong>STICE</strong><small>Content administration</small></span>
        </div>
        <nav>{nav.map((item) => <button key={item.id} className={tab === item.id ? "active" : ""} onClick={() => { setTab(item.id); setMobileNav(false); }}><span>{item.mark}</span>{item.label}{item.id === "submissions" && submissions.length > 0 && <b>{submissions.length}</b>}</button>)}</nav>
        <div className="sidebar-foot"><Link href="/" target="_blank">↗ View public site</Link><button onClick={logout}>⇥ Sign out</button></div>
      </aside>

      <section className="admin-main">
        <header className="admin-header">
          <button className="admin-menu" onClick={() => setMobileNav(!mobileNav)}>☰</button>
          <div><p>Summit administration</p><h1>{pageTitle}</h1></div>
          <div className="admin-user"><span>AD</span><p><strong>Administrator</strong><small>COSTECH</small></p></div>
        </header>

        {notice && <div className="admin-notice"><span>{notice}</span><button onClick={() => setNotice("")}>×</button></div>}
        {loading && <div className="admin-loading"><span /></div>}

        <div className="admin-content">
          {tab === "dashboard" ? (
            <Dashboard submissions={submissions} themes={themes} venues={venues} areas={areas} sponsors={sponsors} navigate={setTab} />
          ) : (
            <ContentTable
              tab={tab}
              records={currentRecords}
              onAdd={tab === "submissions" ? undefined : () => setEditor({ ...emptyMap[tab] })}
              onEdit={tab === "submissions" ? undefined : (record) => setEditor({ ...record, benefits: Array.isArray(record.benefits) ? record.benefits.join("\n") : record.benefits })}
              onRemove={removeRecord}
              onToggle={togglePublished}
              token={token}
            />
          )}
        </div>
      </section>

      {editor && tab !== "dashboard" && tab !== "submissions" && (
        <EditorModal tab={tab} record={editor} update={(key, value) => setEditor((current) => current ? { ...current, [key]: value } : current)} close={() => setEditor(null)} save={saveRecord} />
      )}
    </main>
  );
}

function AdminLogin({ onLogin, error }: { onLogin: (event: FormEvent<HTMLFormElement>) => void; error: string }) {
  return (
    <main className="admin-login">
      <section className="login-art">
        <div className="login-overlay" />
        <div className="login-copy">
          <img src="/costech-logo.png" alt="COSTECH logo" />
          <p className="eyebrow light"><span />Summit content system</p>
          <h1>Shape what the nation sees.</h1>
          <p>Manage the COSTECH@40 public experience, contributions, thematic focus and partnership opportunities.</p>
        </div>
      </section>
      <section className="login-form-wrap">
        <Link href="/" className="login-back">← Public website</Link>
        <form onSubmit={onLogin}>
          <p className="eyebrow"><span />Secure access</p>
          <h2>Welcome back</h2>
          <p>Use your marathond administrator account.</p>
          <label><span>Username</span><input name="username" autoComplete="username" required autoFocus /></label>
          <label><span>Password</span><input name="password" type="password" autoComplete="current-password" required /></label>
          {error && <div className="login-error">{error}</div>}
          <button className="button button-navy" type="submit">Sign in securely →</button>
          <small>Protected by COSTECH identity services</small>
        </form>
      </section>
    </main>
  );
}

function Dashboard({ submissions, themes, venues, areas, sponsors, navigate }: { submissions: SticeCall[]; themes: SticeMainTheme[]; venues: SticeVenue[]; areas: SticeThematicArea[]; sponsors: SticeSponsorship[]; navigate: (tab: Tab) => void }) {
  const pending = submissions.filter((item) => !item.submissionStatus || item.submissionStatus === "SUBMITTED").length;
  const published = themes.filter((item) => item.published).length + venues.filter((item) => item.published).length + areas.filter((item) => item.published).length + sponsors.filter((item) => item.published).length;
  const recent = [...submissions].sort((a, b) => String(b.submittedAt || "").localeCompare(String(a.submittedAt || ""))).slice(0, 5);
  return (
    <>
      <div className="dashboard-intro"><div><p className="admin-kicker">COSTECH@40 · 2026</p><h2>Good day, Administrator.</h2><p>Here is what is happening across the summit website.</p></div><button className="button button-navy" onClick={() => navigate("submissions")}>Review submissions →</button></div>
      <div className="stats-grid">
        <article><span>↥</span><p><small>Total submissions</small><strong>{submissions.length}</strong><em>{pending} awaiting review</em></p></article>
        <article><span>◉</span><p><small>Published content</small><strong>{published}</strong><em>Live on the website</em></p></article>
        <article><span>#</span><p><small>Thematic areas</small><strong>{areas.length}</strong><em>{areas.filter((item) => item.published).length} currently visible</em></p></article>
        <article><span>◇</span><p><small>Partner packages</small><strong>{sponsors.length}</strong><em>{sponsors.filter((item) => item.featured).length} featured package</em></p></article>
      </div>
      <div className="dashboard-grid">
        <section className="admin-panel recent-panel">
          <div className="panel-head"><div><p className="admin-kicker">Latest activity</p><h3>Recent submissions</h3></div><button onClick={() => navigate("submissions")}>View all →</button></div>
          {recent.length ? <div className="mini-table">{recent.map((item) => <div key={item.id}><span className="author-avatar">{`${item.firstName?.[0] || "?"}${item.lastName?.[0] || ""}`}</span><p><strong>{item.title}</strong><small>{item.firstName} {item.lastName} · {item.organizationName}</small></p><em>{item.submissionStatus || "SUBMITTED"}</em></div>)}</div> : <EmptyState text="No contributions have been submitted yet." />}
        </section>
        <section className="admin-panel readiness-panel">
          <div className="panel-head"><div><p className="admin-kicker">Website health</p><h3>Publishing readiness</h3></div></div>
          {[["Main theme", themes.some((i) => i.published)], ["Venue information", venues.some((i) => i.published)], ["Thematic areas", areas.some((i) => i.published)], ["Sponsorship packages", sponsors.some((i) => i.published)]].map(([label, ready]) => <div className="readiness-row" key={String(label)}><span className={ready ? "ready" : "pending"}>{ready ? "✓" : "!"}</span><strong>{String(label)}</strong><small>{ready ? "Published" : "Needs attention"}</small></div>)}
        </section>
      </div>
    </>
  );
}

function ContentTable({ tab, records, onAdd, onEdit, onRemove, onToggle, token }: { tab: Exclude<Tab, "dashboard">; records: EditableRecord[]; onAdd?: () => void; onEdit?: (record: EditableRecord) => void; onRemove: (record: EditableRecord) => void; onToggle: (record: EditableRecord) => void; token: string }) {
  return (
    <section className="admin-panel content-panel">
      <div className="panel-head"><div><p className="admin-kicker">{records.length} records</p><h3>{nav.find((item) => item.id === tab)?.label}</h3></div>{onAdd && <button className="button button-navy" onClick={onAdd}>+ Add new</button>}</div>
      {records.length ? <div className="content-table">
        <div className="content-table-head"><span>Content</span><span>Details</span><span>Status</span><span>Actions</span></div>
        {records.map((record) => (
          <div className="content-table-row" key={record.id}>
            <div className="record-title"><span>{tab === "submissions" ? `${String(record.firstName || "?")[0]}${String(record.lastName || "")[0] || ""}` : tab === "areas" ? String(record.icon || "#") : tab === "sponsors" ? "◇" : "T"}</span><p><strong>{String(record.title || record.name || "Untitled")}</strong><small>{tab === "submissions" ? `${record.firstName || ""} ${record.lastName || ""}` : String(record.subtitle || record.headline || record.summary || record.venueName || "")}</small></p></div>
            <div className="record-meta">{tab === "submissions" ? <><strong>{String(record.organizationName || "—")}</strong><small>{String(record.submissionType || "Contribution")}</small></> : tab === "sponsors" ? <><strong>{record.currency ? `${record.currency} ${Number(record.amount || 0).toLocaleString()}` : "—"}</strong><small>{record.featured ? "Featured package" : "Standard package"}</small></> : <><strong>Order {String(record.sortOrder ?? 0)}</strong><small>Last synchronized</small></>}</div>
            <div>{tab === "submissions" ? <span className="status-pill pending">{String(record.submissionStatus || "SUBMITTED")}</span> : <button className={`status-pill ${record.published ? "published" : "draft"}`} onClick={() => onToggle(record)}>{record.published ? "Published" : "Draft"}</button>}</div>
            <div className="row-actions">
              {tab === "submissions" ? <a href={`${process.env.NEXT_PUBLIC_MARATHOND_API_URL || "http://localhost:8080"}/api/stice-admin/call-for-submissions/${record.id}/abstract-file`} onClick={async (event) => { event.preventDefault(); const response = await fetch(event.currentTarget.href, { headers: { Authorization: `Bearer ${token}` } }); const blob = await response.blob(); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = String(record.abstractFileName || "abstract-paper"); anchor.click(); URL.revokeObjectURL(url); }} title="Download file">↓</a> : <button onClick={() => onEdit?.(record)} title="Edit">✎</button>}
              <button onClick={() => onRemove(record)} title="Delete">×</button>
            </div>
          </div>
        ))}
      </div> : <EmptyState text={`No ${nav.find((item) => item.id === tab)?.label.toLowerCase()} found.`} />}
    </section>
  );
}

function EditorModal({ tab, record, update, close, save }: { tab: Exclude<Tab, "dashboard" | "submissions">; record: EditableRecord; update: (key: string, value: unknown) => void; close: () => void; save: (event: FormEvent<HTMLFormElement>) => void }) {
  const fields: Record<typeof tab, { key: string; label: string; type?: string; required?: boolean }[]> = {
    themes: [{ key: "title", label: "Theme title", required: true }, { key: "subtitle", label: "Subtitle" }, { key: "description", label: "Description", type: "textarea" }, { key: "sortOrder", label: "Display order", type: "number" }],
    venues: [{ key: "title", label: "Section heading", required: true }, { key: "venueName", label: "Venue name", required: true }, { key: "address", label: "Address" }, { key: "city", label: "City" }, { key: "country", label: "Country" }, { key: "imageUrl", label: "Image URL" }, { key: "mapUrl", label: "Map URL" }, { key: "description", label: "Description", type: "textarea" }, { key: "sortOrder", label: "Display order", type: "number" }],
    areas: [{ key: "title", label: "Area title", required: true }, { key: "summary", label: "Short summary" }, { key: "icon", label: "Icon / number" }, { key: "description", label: "Full description", type: "textarea" }, { key: "sortOrder", label: "Display order", type: "number" }],
    sponsors: [{ key: "name", label: "Package name", required: true }, { key: "headline", label: "Headline" }, { key: "amount", label: "Amount", type: "number" }, { key: "currency", label: "Currency" }, { key: "contactEmail", label: "Contact email", type: "email" }, { key: "description", label: "Description", type: "textarea" }, { key: "benefits", label: "Benefits (one per line)", type: "textarea" }, { key: "sortOrder", label: "Display order", type: "number" }],
  };
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <form className="editor-modal" onSubmit={save}>
        <div className="editor-head"><div><p className="admin-kicker">{record.id ? "Edit content" : "Create content"}</p><h2>{record.title || record.name || `New ${tab}`}</h2></div><button type="button" onClick={close}>×</button></div>
        <div className="editor-fields">
          {fields[tab].map((field) => <label key={field.key}><span>{field.label}</span>{field.type === "textarea" ? <textarea rows={field.key === "benefits" ? 5 : 4} required={field.required} value={String(record[field.key] ?? "")} onChange={(e) => update(field.key, e.target.value)} /> : <input type={field.type || "text"} required={field.required} value={String(record[field.key] ?? "")} onChange={(e) => update(field.key, field.type === "number" ? Number(e.target.value) : e.target.value)} />}</label>)}
          {tab === "sponsors" && <label className="switch-label"><input type="checkbox" checked={Boolean(record.featured)} onChange={(e) => update("featured", e.target.checked)} /><span>Feature this package on the public site</span></label>}
          <label className="switch-label"><input type="checkbox" checked={Boolean(record.published)} onChange={(e) => update("published", e.target.checked)} /><span>Publish immediately</span></label>
        </div>
        <div className="editor-actions"><button type="button" className="button button-outline" onClick={close}>Cancel</button><button type="submit" className="button button-navy">Save changes →</button></div>
      </form>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="empty-state"><span>◇</span><strong>Nothing here yet</strong><p>{text}</p></div>;
}
