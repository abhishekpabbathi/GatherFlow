import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { registerUser } from "../../services/userService";
import "./index.css";

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────

// Indian mobile: 10 digits, starts with 6-9, no text
function isValidIndianPhone(v) {
  return /^[6-9]\d{9}$/.test(v.trim());
}

// Basic email format check
function isValidEmail(v) {
  if (!v || v.trim() === "") return true; // optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

// Location: at least 3 real chars, no numbers only, no special chars only
function isValidLocation(v) {
  const t = v.trim();
  if (t.length < 3) return false;
  if (/^\d+$/.test(t)) return false;         // digits only = fake
  if (/^[^a-zA-Z\u0900-\u097F]+$/.test(t)) return false; // no letters at all
  return true;
}

// Channel SVG logos (real brand colours)
function ChannelLogo({ type }) {
  if (type === "whatsapp") return (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
      <circle cx="16" cy="16" r="16" fill="#25D366"/>
      <path d="M22.9 9.1A9.6 9.6 0 0 0 16 6.4C10.7 6.4 6.4 10.7 6.4 16c0 1.7.4 3.3 1.2 4.7L6.3 25.6l5.1-1.3a9.6 9.6 0 0 0 4.6 1.1c5.3 0 9.6-4.3 9.6-9.6 0-2.6-1-5-2.7-6.8zm-6.9 14.8a8 8 0 0 1-4-1.1l-.3-.2-3 .8.8-3-.2-.3a8 8 0 1 1 6.7 3.8zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.3.1-.2 0-.4 0-.5l-1.1-2.7c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.4 5.4 4.7.8.3 1.4.5 1.8.6.8.3 1.5.2 2 .2.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.1-.3-.2-.5-.3z" fill="#fff"/>
    </svg>
  );
  if (type === "email") return (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
      <circle cx="16" cy="16" r="16" fill="#EA4335"/>
      <path d="M24 11H8c-.6 0-1 .4-1 1v8c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-8c0-.6-.4-1-1-1zm-1.5 1L16 16.5 9.5 12h13zm.5 8H9v-6.8l6.6 4.4c.1.1.3.1.4.1s.3 0 .4-.1L23 13.2V20z" fill="#fff"/>
    </svg>
  );
  if (type === "sms") return (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
      <circle cx="16" cy="16" r="16" fill="#2563EB"/>
      <path d="M22 8H10a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3l3 4 3-4h3a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-5 9h-4v-2h4v2zm3-4H12v-2h8v2z" fill="#fff"/>
    </svg>
  );
  // "all" - bell icon
  return (
    <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
      <circle cx="16" cy="16" r="16" fill="url(#allGrad)"/>
      <defs><linearGradient id="allGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#8b5cf6"/>
      </linearGradient></defs>
      <path d="M16 25a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-4a6 6 0 0 0-5-5.9V8a1 1 0 1 0-2 0v1.1A6 6 0 0 0 10 15v4l-2 2v1h16v-1l-2-2z" fill="#fff"/>
    </svg>
  );
}

// ─────────────────────────────────────────
// BACKGROUND ORBS & ANIMATED PARTICLES
// ─────────────────────────────────────────
function Orbs() {
  return (
    <div className="reg-bg">
      <div className="orb orb1" />
      <div className="orb orb2" />
      <div className="orb orb3" />
      
      {/* Animated dots and stars */}
      <div className="animated-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle star"></div>
        <div className="particle star"></div>
        <div className="particle star"></div>
        <div className="particle star"></div>
        <div className="particle star"></div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN COMPONENT — React Router v5 safe
// (no useHistory — no navigation needed,
//  success shown inline on same page)
// ─────────────────────────────────────────
export default function Register() {
  // Steps: 0=Greeting 1=Name+Gender 2=Phone 3=Email 4=Channel 5=Location 6=Visit 7=Interest 8=Preview
  var TOTAL = 8;

  var history = useHistory();
  var [step,    setStep]    = useState(0);
  var [loading, setLoading] = useState(false);
  var [errors,  setErrors]  = useState({});

  var [form, setForm] = useState({
    name: "", gender: "", phone: "", email: "",
    updateChannel: "", location: "", visitType: "",
    interestLevel: ""
  });

  function setField(key, val) {
    setForm(function(f) { return Object.assign({}, f, { [key]: val }); });
    setErrors(function(e) { return Object.assign({}, e, { [key]: "" }); });
  }

  var progress = Math.round((step / TOTAL) * 100);

  function next() { setStep(function(s) { return Math.min(s + 1, TOTAL); }); }
  function back() {
    setErrors({});
    setStep(function(s) { return Math.max(s - 1, 0); });
  }

  // ── per-step validation before moving forward
  function validateAndNext() {
    var errs = {};

    if (step === 1) {
      if (!form.name.trim() || form.name.trim().length < 2)
        errs.name = "Please enter your full name (at least 2 characters).";
      if (!form.gender)
        errs.gender = "Please select your gender.";
    }

    if (step === 2) {
      var phone = form.phone.trim();
      if (!phone)
        errs.phone = "Phone number is required.";
      else if (!/^\d+$/.test(phone))
        errs.phone = "Phone number must contain digits only — no spaces or letters.";
      else if (!isValidIndianPhone(phone))
        errs.phone = "Please enter a valid Indian mobile number (10 digits, starting with 6, 7, 8 or 9).";
    }

    if (step === 3) {
      if (form.email.trim() && !isValidEmail(form.email))
        errs.email = "Please enter a valid email address (e.g. you@gmail.com).";
    }

    if (step === 4) {
      if (!form.updateChannel)
        errs.updateChannel = "Please choose how we should reach you.";
    }

    if (step === 5) {
      if (!isValidLocation(form.location))
        errs.location = "Please enter a real location name (e.g. Hyderabad, Secunderabad).";
    }

    if (step === 6) {
      if (!form.visitType)
        errs.visitType = "Please tell us how often you've visited.";
    }

    if (step === 7) {
      if (!form.interestLevel)
        errs.interestLevel = "Please select your excitement level.";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    next();
  }

  // ── submit with duplicate prevention
  async function handleSubmit() {
    if (loading) return; // prevent double submit
    setLoading(true);
    try {
      var payload = {
        name:          form.name.trim(),
        gender:        form.gender,
        phone:         form.phone.trim(),
        email:         form.email.trim() || undefined,
        updateChannel: form.updateChannel,
        location:      form.location.trim(),
        visitType:     form.visitType,
        interestLevel: form.interestLevel
      };
      var res = await registerUser(payload);
      history.push('/success', { regId: res.registrationId || "GF-XXXX", name: form.name.trim() });
    } catch (e) {
      var msg = "Registration failed. Please try again.";
      if (e.response && e.response.data && e.response.data.error) {
        msg = e.response.data.error;
      }
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  }

  function ErrorMsg(props) {
    if (!props.msg) return null;
    return (
      <div className="field-error">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {props.msg}
      </div>
    );
  }

  return (
    <>
      <Orbs />
      <div className="register-wrapper">
        <div className="reg-card">

          {/* ── LOGO — hide on success */}
          {step < TOTAL && (
            <div className="reg-logo">
              <span className="reg-logo-icon">⛪</span>
              <h1>GatherFlow</h1>
              <p>Church Event Registration</p>
            </div>
          )}

          {/* ── PROGRESS — show steps 1-8 */}
          {step > 0 && step < TOTAL && (
            <>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: progress + "%" }} />
              </div>
              <div className="step-dots">
                {[1,2,3,4,5,6,7,8].map(function(n) {
                  return (
                    <div key={n} className={
                      "step-dot" +
                      (n < step ? " complete" : "") +
                      (n === step ? " active" : "")
                    } />
                  );
                })}
              </div>
            </>
          )}

          <div className="slides-container">

            {/* ── STEP 0: GREETING ── */}
            {step === 0 && (
              <div className="slide active">
                <span className="slide-emoji">🙌</span>
                <div className="greeting-big">Welcome to<br />GatherFlow!</div>
                <p className="greeting-tagline">
                  We&apos;re so glad you&apos;re here.<br />
                  Let&apos;s get you registered in under 2 minutes!
                </p>
                <div className="feature-pills">
                  <span className="pill">✨ Quick &amp; Easy</span>
                  <span className="pill">🔒 Secure</span>
                  <span className="pill">📱 Updates</span>
                  <span className="pill">⛪ Church Family</span>
                </div>
                <button className="btn-primary btn-gold" onClick={next}>
                  Let&apos;s Begin →
                </button>
              </div>
            )}

            {/* ── STEP 1: NAME + GENDER ── */}
            {step === 1 && (
              <div className="slide active">
                <span className="slide-emoji">👋</span>
                <h2 className="slide-title">What&apos;s your name?</h2>
                <p className="slide-sub">We&apos;d love to greet you personally.</p>

                <input
                  className="reg-input"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={function(e) { setField("name", e.target.value); }}
                  autoFocus
                />
                <ErrorMsg msg={errors.name} />

                <p className="loc-hint" style={{ marginBottom: 8 }}>Gender</p>
                <div className="gender-row">
                  {[
                    { val: "Male",   icon: "👨", label: "Male"   },
                    { val: "Female", icon: "👩", label: "Female" },
                    { val: "Other",  icon: "🌈", label: "Other"  }
                  ].map(function(g) {
                    return (
                      <button
                        key={g.val}
                        type="button"
                        className={"gender-btn" + (form.gender === g.val ? " sel" : "")}
                        onClick={function() { setField("gender", g.val); }}
                      >
                        <span className="gender-icon">{g.icon}</span>
                        {g.label}
                      </button>
                    );
                  })}
                </div>
                <ErrorMsg msg={errors.gender} />

                <button className="btn-primary" onClick={validateAndNext}>
                  Continue →
                </button>
                <button className="btn-back" onClick={back}><span>⬅️</span> Back</button>
              </div>
            )}

            {/* ── STEP 2: PHONE ── */}
            {step === 2 && (
              <div className="slide active">
                <span className="slide-emoji">📱</span>
                <h2 className="slide-title">Your Phone Number</h2>
                <p className="slide-sub">Indian mobile number only. We&apos;ll send your confirmation here.</p>

                <div className="phone-row">
                  <div className="phone-prefix">🇮🇳 +91</div>
                  <input
                    className="reg-input"
                    placeholder="98765 43210"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onInput={function(e) {
                      // allow digits only
                      var val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setField("phone", val);
                    }}
                    autoFocus
                  />
                </div>
                <ErrorMsg msg={errors.phone} />

                <button className="btn-primary" onClick={validateAndNext}
                  disabled={form.phone.trim().length === 0}>
                  Continue →
                </button>
                <button className="btn-back" onClick={back}><span>⬅️</span> Back</button>
              </div>
            )}

            {/* ── STEP 3: EMAIL ── */}
            {step === 3 && (
              <div className="slide active">
                <span className="slide-emoji">✉️</span>
                <h2 className="slide-title">Email Address</h2>
                <p className="slide-sub">For your confirmation receipt. Totally optional — skip if you prefer.</p>

                <input
                  className="reg-input"
                  placeholder="you@example.com"
                  type="email"
                  inputMode="email"
                  value={form.email}
                  onChange={function(e) { setField("email", e.target.value); }}
                  autoFocus
                />
                <ErrorMsg msg={errors.email} />

                <button className="btn-primary" onClick={validateAndNext}>
                  {form.email.trim() ? "Continue →" : "Skip →"}
                </button>
                <button className="btn-back" onClick={back}><span>⬅️</span> Back</button>
              </div>
            )}

            {/* ── STEP 4: UPDATE CHANNEL ── */}
            {step === 4 && (
              <div className="slide active">
                <span className="slide-emoji">📣</span>
                <h2 className="slide-title">How should we reach you?</h2>
                <p className="slide-sub">Pick how you&apos;d like to receive event updates &amp; reminders.</p>

                <div className="channel-grid">
                  {[
                    { val: "WhatsApp", type: "whatsapp", label: "WhatsApp", sub: "Most popular" },
                    { val: "Email",    type: "email",    label: "Email",     sub: "Inbox updates" },
                    { val: "SMS",      type: "sms",      label: "SMS",       sub: "Text messages" },
                    { val: "All",      type: "all",      label: "All!",      sub: "Catch everything" }
                  ].map(function(c) {
                    return (
                      <div
                        key={c.val}
                        className={"channel-card" + (form.updateChannel === c.val ? " selected" : "")}
                        onClick={function() { setField("updateChannel", c.val); }}
                      >
                        <div className={"channel-logo " + c.type}>
                          <ChannelLogo type={c.type} />
                        </div>
                        <div className="channel-label">{c.label}</div>
                        <div className="channel-sub">{c.sub}</div>
                      </div>
                    );
                  })}
                </div>
                <ErrorMsg msg={errors.updateChannel} />

                <button className="btn-primary" onClick={validateAndNext}
                  disabled={!form.updateChannel} style={{ marginTop: 16 }}>
                  Continue →
                </button>
                <button className="btn-back" onClick={back}><span>⬅️</span> Back</button>
              </div>
            )}

            {/* ── STEP 5: LOCATION ── */}
            {step === 5 && (
              <div className="slide active">
                <span className="slide-emoji">📍</span>
                <h2 className="slide-title">Where are you coming from?</h2>
                <p className="slide-sub">City, area or neighbourhood — real names only, please.</p>

                <input
                  className="reg-input"
                  placeholder="e.g. Hyderabad, Secunderabad..."
                  value={form.location}
                  onChange={function(e) { setField("location", e.target.value); }}
                  autoFocus
                />
                <ErrorMsg msg={errors.location} />

                <button className="btn-primary" onClick={validateAndNext}>
                  Continue →
                </button>
                <button className="btn-back" onClick={back}><span>⬅️</span> Back</button>
              </div>
            )}

            {/* ── STEP 6: HOW MANY TIMES VISITED ── */}
            {step === 6 && (
              <div className="slide active">
                <span className="slide-emoji">🔄</span>
                <h2 className="slide-title">How many times have you visited us?</h2>
                <p className="slide-sub">Tell us how familiar you are with our community.</p>

                <div className="visit-grid">
                  {[
                    { val: "First-time",        icon: "🌟", title: "First Time",      desc: "Brand new here!" },
                    { val: "Less than 10 times", icon: "🔄", title: "A Few Times",     desc: "Still getting to know us" },
                    { val: "Many times",         icon: "🏠", title: "Many Times",      desc: "Part of the family!" }
                  ].map(function(v) {
                    return (
                      <div
                        key={v.val}
                        className={"visit-card" + (form.visitType === v.val ? " selected" : "")}
                        onClick={function() { setField("visitType", v.val); }}
                      >
                        <span className="visit-icon">{v.icon}</span>
                        <h4>{v.title}</h4>
                        <p>{v.desc}</p>
                      </div>
                    );
                  })}
                </div>
                <ErrorMsg msg={errors.visitType} />

                <button className="btn-primary" onClick={validateAndNext} style={{ marginTop: 14 }}>
                  Continue →
                </button>
                <button className="btn-back" onClick={back}><span>⬅️</span> Back</button>
              </div>
            )}

            {/* ── STEP 7: INTEREST LEVEL ── */}
            {step === 7 && (
              <div className="slide active">
                <span className="slide-emoji">💫</span>
                <h2 className="slide-title">How excited are you?</h2>
                <p className="slide-sub">Tell us your energy level for this event!</p>

                <div className="option-grid">
                  {[
                    { val: "Very Excited",   icon: "🔥", title: "Very Excited!",  desc: "I can't wait — I'm all in!" },
                    { val: "Interested",     icon: "😊", title: "Interested",      desc: "Sounds great, I'm in." },
                    { val: "Just Exploring", icon: "👀", title: "Just Exploring",  desc: "Checking things out first." }
                  ].map(function(opt) {
                    return (
                      <div
                        key={opt.val}
                        className={"option-card" + (form.interestLevel === opt.val ? " selected" : "")}
                        onClick={function() { setField("interestLevel", opt.val); }}
                      >
                        <span className="option-icon">{opt.icon}</span>
                        <div className="option-text">
                          <h4>{opt.title}</h4>
                          <p>{opt.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <ErrorMsg msg={errors.interestLevel} />

                <button className="btn-primary" onClick={validateAndNext}
                  disabled={!form.interestLevel} style={{ marginTop: 16 }}>
                  Continue →
                </button>
                <button className="btn-back" onClick={back}><span>⬅️</span> Back</button>
              </div>
            )}

            {/* ── STEP 8: PREVIEW + SUBMIT ── */}
            {step === 8 && (
              <div className="slide active">
                <span className="slide-emoji">✅</span>
                <h2 className="slide-title">Looks great!</h2>
                <p className="slide-sub">Review your details before we confirm your spot.</p>

                <div className="summary-list">
                  {[
                    { icon: "👤", label: "Name",         val: form.name },
                    { icon: "🧬", label: "Gender",        val: form.gender },
                    { icon: "📱", label: "Phone",         val: "+91 " + form.phone },
                    { icon: "✉️", label: "Email",         val: form.email || "—" },
                    { icon: "🔔", label: "Updates via",   val: form.updateChannel },
                    { icon: "📍", label: "Location",      val: form.location },
                    { icon: "🌟", label: "Visit Type",    val: form.visitType },
                    { icon: "💫", label: "Excitement",    val: form.interestLevel }
                  ].map(function(r) {
                    return (
                      <div key={r.label} className="summary-item">
                        <span className="si-icon">{r.icon}</span>
                        <div>
                          <span className="si-label">{r.label}</span>
                          <span>{r.val}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <ErrorMsg msg={errors.submit} />

                <button
                  className="btn-primary btn-gold"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "⏳ Confirming your spot..." : "🎉 Confirm Registration"}
                </button>
                <button className="btn-back" onClick={back}><span>⬅️</span> Edit details</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}