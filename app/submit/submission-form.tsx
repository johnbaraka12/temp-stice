"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { apiRequest, fallbackContent } from "../lib/stice";

type FormState = Record<string, string | boolean>;

const initialForm: FormState = {
  prefix: "",
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  phone: "",
  email: "",
  alternativeEmail: "",
  nationality: "Tanzanian",
  orcidId: "",
  correspondingAuthor: true,
  country: "Tanzania",
  city: "",
  streetAddress: "",
  jobTitle: "",
  departmentUnit: "",
  organizationName: "",
  organizationType: "",
  coreBusiness: "",
  operationalScope: "",
  submissionType: "",
  preferredPresentationMode: "",
  sectorCategory: "",
  title: "",
  theme: "",
  originalityConfirmed: false,
  conflictOfInterest: false,
  shareContactDetailsConsent: false,
  publishAbstractConsent: false,
  mediaCoverageConsent: false,
};

const themes = fallbackContent.thematicAreas.map((area, index) => `T${index + 1}: ${area.title}`);

export default function SubmissionForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  function update(name: string, value: string | boolean) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setMessage("Please attach your abstract or full paper.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const submission = {
        ...form,
        published: false,
        sortOrder: 0,
        contactEmail: String(form.email),
      };
      const body = new FormData();
      body.append("submission", new Blob([JSON.stringify(submission)], { type: "application/json" }));
      body.append("abstractFile", file);
      await apiRequest("/api/stice/call-for-submissions", { method: "POST", body });
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The submission could not be completed. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <main className="form-page form-success">
        <div className="success-card">
          <div className="success-mark">✓</div>
          <p className="eyebrow"><span />Submission received</p>
          <h1>Thank you, {String(form.firstName)}.</h1>
          <p>Your contribution has been sent to the COSTECH@40 review team. A confirmation and next steps will be shared through <strong>{String(form.email)}</strong>.</p>
          <div className="success-actions"><Link href="/" className="button button-navy">Return to summit site →</Link></div>
        </div>
      </main>
    );
  }

  return (
    <main className="form-page">
      <header className="form-header">
        <Link href="/" className="form-brand">
          <img src="https://40yrs.costech.or.tz/wp-content/uploads/2026/07/Logo_COSTECH_40.JPG-removebg-preview.png" alt="COSTECH at 40" />
          <span><strong>COSTECH@40</strong><small>Contribution portal</small></span>
        </Link>
        <Link href="/" className="back-link">← Back to summit website</Link>
      </header>

      <section className="form-hero">
        <div className="form-hero-copy">
          <p className="eyebrow light"><span />Call for contributions</p>
          <h1>Bring your work to the national stage.</h1>
          <p>Submit a policy brief, strategic paper, evidence synthesis, innovation showcase or applied research contribution for COSTECH@40.</p>
        </div>
        <div className="form-deadline"><small>Initial call closes</small><strong>15</strong><span>August 2026</span></div>
      </section>

      <div className="form-layout">
        <aside className="form-aside">
          <div className="step-list">
            {([[1, "Personal information"], [2, "Affiliation"], [3, "Contribution details"]] as const).map(([number, label]) => (
              <button key={number} type="button" onClick={() => setStep(Number(number))} className={step === number ? "active" : step > number ? "complete" : ""}>
                <span>{step > number ? "✓" : `0${number}`}</span><p><small>Step {number}</small><strong>{label}</strong></p>
              </button>
            ))}
          </div>
          <div className="form-help"><small>Need help?</small><a href="mailto:costech40@costech.or.tz">costech40@costech.or.tz</a><a href="tel:+255765991133">+255 765 991 133</a></div>
        </aside>

        <form className="submission-form" onSubmit={submit}>
          <div className="form-progress"><span style={{ width: `${(step / 3) * 100}%` }} /></div>

          <section className={step === 1 ? "form-step active" : "form-step"}>
            <div className="form-title"><span>01</span><div><h2>Personal information</h2><p>Tell us how to identify and contact the presenting author.</p></div></div>
            <div className="field-grid three">
              <label><span>Prefix</span><select value={String(form.prefix)} onChange={(e) => update("prefix", e.target.value)}><option value="">Select</option><option>Mr.</option><option>Ms.</option><option>Dr.</option><option>Prof.</option></select></label>
              <label><span>First name *</span><input required value={String(form.firstName)} onChange={(e) => update("firstName", e.target.value)} /></label>
              <label><span>Middle name</span><input value={String(form.middleName)} onChange={(e) => update("middleName", e.target.value)} /></label>
            </div>
            <div className="field-grid two">
              <label><span>Last name *</span><input required value={String(form.lastName)} onChange={(e) => update("lastName", e.target.value)} /></label>
              <label><span>Gender *</span><select required value={String(form.gender)} onChange={(e) => update("gender", e.target.value)}><option value="">Select</option><option>Female</option><option>Male</option><option>Prefer not to say</option></select></label>
            </div>
            <div className="field-grid two">
              <label><span>Phone *</span><input required type="tel" placeholder="+255" value={String(form.phone)} onChange={(e) => update("phone", e.target.value)} /></label>
              <label><span>Email address *</span><input required type="email" value={String(form.email)} onChange={(e) => update("email", e.target.value)} /></label>
            </div>
            <div className="field-grid two">
              <label><span>Alternative email</span><input type="email" value={String(form.alternativeEmail)} onChange={(e) => update("alternativeEmail", e.target.value)} /></label>
              <label><span>ORCID iD</span><input placeholder="0000-0000-0000-0000" value={String(form.orcidId)} onChange={(e) => update("orcidId", e.target.value)} /></label>
            </div>
            <div className="field-grid two">
              <label><span>Nationality *</span><input required value={String(form.nationality)} onChange={(e) => update("nationality", e.target.value)} /></label>
              <label><span>Country *</span><input required value={String(form.country)} onChange={(e) => update("country", e.target.value)} /></label>
            </div>
            <div className="field-grid two">
              <label><span>City *</span><input required value={String(form.city)} onChange={(e) => update("city", e.target.value)} /></label>
              <label><span>Street address</span><input value={String(form.streetAddress)} onChange={(e) => update("streetAddress", e.target.value)} /></label>
            </div>
          </section>

          <section className={step === 2 ? "form-step active" : "form-step"}>
            <div className="form-title"><span>02</span><div><h2>Professional affiliation</h2><p>Help reviewers understand the organization and role behind the contribution.</p></div></div>
            <div className="field-grid two">
              <label><span>Job title *</span><input required value={String(form.jobTitle)} onChange={(e) => update("jobTitle", e.target.value)} /></label>
              <label><span>Department / Unit *</span><input required value={String(form.departmentUnit)} onChange={(e) => update("departmentUnit", e.target.value)} /></label>
            </div>
            <label><span>Organization name *</span><input required value={String(form.organizationName)} onChange={(e) => update("organizationName", e.target.value)} /></label>
            <div className="field-grid two">
              <label><span>Organization type *</span><select required value={String(form.organizationType)} onChange={(e) => update("organizationType", e.target.value)}><option value="">Select</option><option>Public</option><option>Private</option><option>Academic / Research</option><option>NGO</option><option>Other</option></select></label>
              <label><span>Operational scope *</span><select required value={String(form.operationalScope)} onChange={(e) => update("operationalScope", e.target.value)}><option value="">Select</option><option>National</option><option>Regional</option><option>International</option></select></label>
            </div>
            <label><span>Core business *</span><select required value={String(form.coreBusiness)} onChange={(e) => update("coreBusiness", e.target.value)}><option value="">Select</option><option>Teaching</option><option>Research</option><option>Consultancy</option><option>STI Promotion</option><option>Innovation Development</option><option>Manufacturing</option><option>Agro-processing</option><option>Policy</option><option>Other</option></select></label>
            <label className="check-row"><input type="checkbox" checked={Boolean(form.correspondingAuthor)} onChange={(e) => update("correspondingAuthor", e.target.checked)} /><span><strong>I am the corresponding author</strong><small>Summit communication will be directed to the email provided.</small></span></label>
          </section>

          <section className={step === 3 ? "form-step active" : "form-step"}>
            <div className="form-title"><span>03</span><div><h2>Contribution details</h2><p>Describe your work and attach the document for review.</p></div></div>
            <label><span>Title of contribution *</span><input required value={String(form.title)} onChange={(e) => update("title", e.target.value)} /></label>
            <div className="field-grid two">
              <label><span>Submission type *</span><select required value={String(form.submissionType)} onChange={(e) => update("submissionType", e.target.value)}><option value="">Select</option>{["Policy Brief", "Strategic Paper", "Position Paper", "Analytical Review", "Evidence Synthesis", "Best-Practice Case Study", "Implementation Experience", "Innovation Showcase Paper", "Technology Demonstration", "Applied Research Contribution"].map((v) => <option key={v}>{v}</option>)}</select></label>
              <label><span>Presentation mode *</span><select required value={String(form.preferredPresentationMode)} onChange={(e) => update("preferredPresentationMode", e.target.value)}><option value="">Select</option><option>Oral presentation</option><option>Poster presentation</option><option>Panel discussion</option><option>Exhibition pitch</option></select></label>
            </div>
            <div className="field-grid two">
              <label><span>Sector *</span><select required value={String(form.sectorCategory)} onChange={(e) => update("sectorCategory", e.target.value)}><option value="">Select</option>{["Agriculture", "Health", "Mining", "Industry", "Energy", "ICT", "Blue Economy", "Other"].map((v) => <option key={v}>{v}</option>)}</select></label>
              <label><span>Thematic area *</span><select required value={String(form.theme)} onChange={(e) => update("theme", e.target.value)}><option value="">Select</option>{themes.map((v) => <option key={v}>{v}</option>)}</select></label>
            </div>
            <label className="upload-field"><span>Abstract / full paper *</span><div><strong>{file ? file.name : "Choose a PDF, DOC or DOCX file"}</strong><small>Maximum file size: 5 MB</small><input required type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} /></div></label>
            <div className="declaration-box">
              <h3>Declarations & consent</h3>
              <label className="check-row"><input required type="checkbox" checked={Boolean(form.originalityConfirmed)} onChange={(e) => update("originalityConfirmed", e.target.checked)} /><span><strong>I confirm this work is original *</strong><small>It is not currently under review elsewhere.</small></span></label>
              <label className="check-row"><input type="checkbox" checked={Boolean(form.conflictOfInterest)} onChange={(e) => update("conflictOfInterest", e.target.checked)} /><span><strong>I have a conflict of interest to declare</strong><small>Leave unchecked when there is no conflict.</small></span></label>
              <label className="check-row"><input required type="checkbox" checked={Boolean(form.shareContactDetailsConsent)} onChange={(e) => update("shareContactDetailsConsent", e.target.checked)} /><span><strong>I consent to sharing my contact details in the participants directory *</strong></span></label>
              <label className="check-row"><input required type="checkbox" checked={Boolean(form.publishAbstractConsent)} onChange={(e) => update("publishAbstractConsent", e.target.checked)} /><span><strong>I consent to publication in the summit proceedings *</strong></span></label>
              <label className="check-row"><input required type="checkbox" checked={Boolean(form.mediaCoverageConsent)} onChange={(e) => update("mediaCoverageConsent", e.target.checked)} /><span><strong>I consent to photography and media coverage *</strong></span></label>
            </div>
          </section>

          {status === "error" && <div className="form-error">{message}</div>}
          <div className="form-actions">
            {step > 1 ? <button type="button" className="button button-outline" onClick={() => setStep(step - 1)}>← Previous</button> : <span />}
            {step < 3 ? <button type="button" className="button button-navy" onClick={() => setStep(step + 1)}>Continue →</button> : <button type="submit" className="button button-gold" disabled={status === "sending"}>{status === "sending" ? "Submitting…" : "Submit contribution →"}</button>}
          </div>
        </form>
      </div>
    </main>
  );
}
