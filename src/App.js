import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Download,
  Zap,
  Clock,
  ShieldCheck,
  Play,
  DollarSign,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";

// --- ROBUST AUDIO ENGINE ---
class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playTone(freq, type, duration, vol) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      this.ctx.currentTime + duration
    );
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playGreenButton() {
    // A satisfying "thock" sound
    this.playTone(300, "sine", 0.15, 0.1);
    setTimeout(() => this.playTone(600, "triangle", 0.1, 0.05), 50);
  }

  playCashRegister() {
    // Cha-ching!
    this.playTone(1200, "sine", 0.1, 0.1);
    setTimeout(() => this.playTone(2000, "sine", 0.3, 0.1), 80);
    setTimeout(() => this.playTone(1500, "square", 0.1, 0.05), 150);
  }

  playExpand() {
    this.playTone(400, "sine", 0.2, 0.05);
  }

  playTick() {
    // Subtle tick for slider
    this.playTone(800, "sine", 0.03, 0.02);
  }
}

const sfx = new AudioEngine();

// --- COMPONENTS ---

const Section = ({ children, className = "" }) => (
  <div className={`max-w-4xl mx-auto px-6 py-16 ${className}`}>{children}</div>
);

const GlassBox = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);

const ActionButton = ({ text, onClick, primary = true, href }) => {
  const baseClass =
    "w-full md:w-auto px-8 py-4 font-bold rounded-lg transition-all active:scale-95 uppercase tracking-wide flex items-center justify-center gap-2";
  const styles = primary
    ? "bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
    : "bg-white/5 text-white hover:bg-white/10 border border-white/10";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClass} ${styles}`}
        onClick={() => sfx.playGreenButton()}
      >
        {text}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClass} ${styles}`}>
      {text}
    </button>
  );
};

// --- MAIN APP ---

export default function App() {
  const [entered, setEntered] = useState(false);
  const [fans, setFans] = useState(500);
  const [expandedTitan, setExpandedTitan] = useState(null);
  const [whaleMode, setWhaleMode] = useState(false);
  const [claimText, setClaimText] = useState("CLAIM THIS INCOME");
  const [claimActive, setClaimActive] = useState(false);

  // Revenue Logic
  // Base: $15/sub. Whale Mode: Adds roughly $5 per sub in "tips" average across the board.
  const monthlyEarnings = Math.floor(fans * (whaleMode ? 20 : 15));

  const handleEnter = () => {
    sfx.init();
    sfx.playGreenButton();
    setEntered(true);
    window.scrollTo(0, 0);
  };

  const handleSliderChange = (e) => {
    setFans(Number(e.target.value));
    sfx.playTick();
  };

  const handleWhaleToggle = () => {
    setWhaleMode(!whaleMode);
    sfx.playGreenButton();
  };

  const handleCashClaim = () => {
    sfx.playCashRegister();
    setClaimText("⚠️ ONLY IF YOU TAKE ACTION!");
    setClaimActive(true);

    // Reset after 3 seconds
    setTimeout(() => {
      setClaimText("CLAIM THIS INCOME");
      setClaimActive(false);
    }, 3000);
  };

  const toggleTitan = (id) => {
    sfx.playExpand();
    setExpandedTitan(expandedTitan === id ? null : id);
  };

  if (!entered) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md animate-in fade-in zoom-in duration-700">
          <div className="text-6xl mb-6">👋</div>
          <h1 className="text-white text-3xl font-bold mb-4">Hi, I'm Max!</h1>
          <p className="text-gray-400 mb-8 text-lg leading-relaxed">
            I hope you're having a great day. I've put this community together
            to help people just like you start their own simple online business
            without the stress.
          </p>
          <button
            onClick={handleEnter}
            className="w-full bg-emerald-500 text-black font-bold text-xl py-5 rounded-xl hover:bg-emerald-400 transition-colors shadow-lg active:scale-95 uppercase tracking-wider"
          >
            Start My Simple Business
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-emerald-500 selection:text-black pb-20">
      {/* HEADER */}
      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-black text-white italic tracking-tighter">
            NEXT<span className="text-emerald-500">ZENY</span>
          </div>
          <a
            href="https://maxkael.gumroad.com/l/TheAiaudit"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 text-black font-bold px-6 py-2 rounded-md hover:bg-emerald-400 transition-colors uppercase text-sm shadow-lg hover:shadow-emerald-500/20"
          >
            Join Now
          </a>
        </div>
      </nav>

      {/* HERO & SLIDER SECTION */}
      <Section className="text-center pt-12 pb-8">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase leading-tight">
          Are You <span className="text-emerald-500">Ready?</span>
        </h1>

        <GlassBox className="bg-[#0a0a0a] max-w-2xl mx-auto mb-8 border-emerald-500/20">
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">
                Estimated Monthly Income
              </p>
              <div className="text-6xl font-black text-white font-mono tracking-tighter">
                ${monthlyEarnings.toLocaleString()}
              </div>
            </div>

            <div className="px-4">
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={fans}
                onChange={handleSliderChange}
                className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
              />
              <div className="flex justify-between text-xs text-gray-500 font-bold uppercase mt-3">
                <span>Beginner</span>
                <span>Pro</span>
                <span>God Mode</span>
              </div>
            </div>

            {/* Whale Mode Toggle */}
            <div
              onClick={handleWhaleToggle}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                whaleMode
                  ? "bg-emerald-900/20 border-emerald-500"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    whaleMode
                      ? "bg-emerald-500 text-black"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  <Zap size={20} />
                </div>
                <div className="text-left">
                  <p
                    className={`font-bold text-sm uppercase ${
                      whaleMode ? "text-white" : "text-gray-400"
                    }`}
                  >
                    Activate VIP Tips
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Add extra earnings from super fans
                  </p>
                </div>
              </div>
              <div
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  whaleMode ? "bg-emerald-500" : "bg-gray-700"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    whaleMode ? "right-1" : "left-1"
                  }`}
                ></div>
              </div>
            </div>

            <button
              onClick={handleCashClaim}
              className={`w-full font-black text-xl py-4 rounded-xl transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 ${
                claimActive
                  ? "bg-red-500 text-white"
                  : "bg-emerald-500 text-black hover:bg-emerald-400"
              }`}
            >
              {!claimActive && <DollarSign className="fill-black" size={24} />}
              {claimText}
            </button>
          </div>
        </GlassBox>

        <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-lg p-4 inline-block max-w-lg mx-auto">
          <p className="text-emerald-400 text-sm font-medium">
            💡 You can be the next person to make this amount. While others are
            just scrolling, smart people are setting up these digital characters
            to build a real future.
          </p>
        </div>
      </Section>

      {/* WHAT & HOW BOXES */}
      <Section className="grid md:grid-cols-2 gap-6">
        <GlassBox>
          <div className="bg-emerald-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Users className="text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">
            What is an AI Influencer?
          </h3>
          <p className="text-gray-400 leading-relaxed">
            An AI Influencer is a digital person made with smart computer tools.
            They look and act like real people on social media, but they never
            sleep and can work 24/7 without getting tired.
          </p>
        </GlassBox>

        <GlassBox>
          <div className="bg-emerald-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">
            How do I earn money?
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Owners make money when fans pay a small monthly fee to see special
            photos or talk to the character. It's like owning a digital TV star
            that works for you all day and night.
          </p>
        </GlassBox>
      </Section>

      {/* THE TITANS */}
      <Section>
        <h2 className="text-3xl font-black text-white text-center mb-10 uppercase italic">
          Real World Examples
        </h2>

        <div className="space-y-4">
          {/* TITAN 1 */}
          <GlassBox
            className="cursor-pointer hover:bg-white/5"
            onClick={() => toggleTitan(1)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white">Aitana Lopez</h3>
                <p className="text-emerald-500 font-bold text-sm uppercase mt-1">
                  Fitness Model • $11,000 / Month
                </p>
              </div>
              <div
                className={`bg-white/10 p-2 rounded-full transition-transform ${
                  expandedTitan === 1 ? "rotate-90" : ""
                }`}
              >
                <ArrowRight className="text-white" size={20} />
              </div>
            </div>

            {expandedTitan === 1 && (
              <div className="mt-6 pt-6 border-t border-white/10 animate-in fade-in slide-in-from-top-2">
                <p className="text-gray-300 leading-relaxed">
                  Aitana is a pink-haired fitness girl from Spain. She isn't
                  real, but she posts workout photos and talks to fans. She
                  makes more money than most doctors just by existing on the
                  internet.
                </p>
              </div>
            )}
          </GlassBox>

          {/* TITAN 2 */}
          <GlassBox
            className="cursor-pointer hover:bg-white/5"
            onClick={() => toggleTitan(2)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white">Lil Miquela</h3>
                <p className="text-emerald-500 font-bold text-sm uppercase mt-1">
                  Fashion Star • $10 Million+ Total
                </p>
              </div>
              <div
                className={`bg-white/10 p-2 rounded-full transition-transform ${
                  expandedTitan === 2 ? "rotate-90" : ""
                }`}
              >
                <ArrowRight className="text-white" size={20} />
              </div>
            </div>

            {expandedTitan === 2 && (
              <div className="mt-6 pt-6 border-t border-white/10 animate-in fade-in slide-in-from-top-2">
                <p className="text-gray-300 leading-relaxed">
                  She models for big brands like Prada and Samsung. Companies
                  love her because she is never late for a photoshoot and always
                  looks perfect. She proved this is a billion-dollar industry.
                </p>
              </div>
            )}
          </GlassBox>

          {/* TITAN 3 */}
          <GlassBox
            className="cursor-pointer hover:bg-white/5"
            onClick={() => toggleTitan(3)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white">Rozy</h3>
                <p className="text-emerald-500 font-bold text-sm uppercase mt-1">
                  Virtual Traveler • $1 Million+
                </p>
              </div>
              <div
                className={`bg-white/10 p-2 rounded-full transition-transform ${
                  expandedTitan === 3 ? "rotate-90" : ""
                }`}
              >
                <ArrowRight className="text-white" size={20} />
              </div>
            </div>

            {expandedTitan === 3 && (
              <div className="mt-6 pt-6 border-t border-white/10 animate-in fade-in slide-in-from-top-2">
                <p className="text-gray-300 leading-relaxed">
                  Rozy makes huge money because brands love that she can
                  "travel" anywhere in the world instantly without a plane
                  ticket. She never gets jet lag and is always ready to work.
                </p>
              </div>
            )}
          </GlassBox>
        </div>
      </Section>

      {/* THE PRODUCT - WHAT THEY GET */}
      <Section id="products">
        <div className="bg-gradient-to-br from-[#0f0f0f] to-black border-2 border-emerald-500 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-emerald-900/20">
          <div className="absolute top-0 right-0 bg-emerald-500 text-black font-black text-xs px-4 py-2 rounded-bl-xl uppercase tracking-widest">
            Instant Download
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 italic uppercase text-center md:text-left">
            What You Get Today
          </h2>

          <div className="space-y-6 mb-10">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-500/10 p-2 rounded-lg mt-1">
                <CheckCircle2 className="text-emerald-500" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">
                  1. The Masterclass PDF
                </h4>
                <p className="text-gray-400 text-sm mt-1">
                  A simple guide showing you exactly how to grow your business
                  to $10,000 a month.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-emerald-500/10 p-2 rounded-lg mt-1">
                <CheckCircle2 className="text-emerald-500" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">
                  2. The 7-Day Action Plan
                </h4>
                <p className="text-gray-400 text-sm mt-1">
                  A daily checklist. It tells you exactly what to do on Monday,
                  Tuesday, etc., so you never get lost.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-emerald-500/10 p-2 rounded-lg mt-1">
                <CheckCircle2 className="text-emerald-500" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white">
                  3. The Architecture Secrets
                </h4>
                <p className="text-gray-400 text-sm mt-1">
                  The special technical tricks the pros use to make their
                  characters look real. (No tech skills needed!)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-center">
            <p className="text-gray-300 font-medium">
              <span className="text-emerald-400 font-bold">
                ✨ No Tech Skills Needed:
              </span>{" "}
              If you can send an email and use Instagram, you can do this.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/10 pt-8">
            <div className="text-center md:text-left">
              <p className="text-gray-500 line-through font-bold text-xl">
                $147.00
              </p>
              <p className="text-emerald-500 font-black text-6xl tracking-tighter">
                $27
              </p>
            </div>
            <ActionButton
              text="Get Instant Access"
              primary={true}
              href="https://maxkael.gumroad.com/l/TheAiaudit"
            />
          </div>
        </div>
      </Section>

      {/* FAQ SECTION */}
      <Section>
        <h2 className="text-3xl font-black text-white text-center mb-10 uppercase italic">
          Common Questions
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {[
            {
              q: "Is this hard to do?",
              a: "No. If you can use a phone and send messages, you can do this. We show you every step.",
            },
            {
              q: "Do I need a fast computer?",
              a: "No. You can run this entire business from a normal laptop or even your phone.",
            },
            {
              q: "Is this legal?",
              a: "Yes, 100%. We teach you how to do everything the right way so you are safe.",
            },
            {
              q: "How fast do I get money?",
              a: "It depends on you, but many students see their first money within 30 days of starting.",
            },
            {
              q: "Can I stay secret?",
              a: "Yes! That is the best part. You are the owner, but nobody needs to see your face.",
            },
          ].map((faq, i) => (
            <GlassBox key={i} className="py-6">
              <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                <HelpCircle size={18} className="text-emerald-500" /> {faq.q}
              </h4>
              <p className="text-gray-400 text-sm pl-7">{faq.a}</p>
            </GlassBox>
          ))}
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="text-center text-gray-600 text-sm py-12 px-6">
        <p className="mb-2">NEXTZENY BUSINESS PROTOCOL © 2026</p>
        <p>Helping real people build digital assets.</p>
      </footer>
    </div>
  );
}
