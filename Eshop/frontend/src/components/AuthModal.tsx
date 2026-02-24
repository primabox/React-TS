import { useState, useEffect } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const { login, register, isLoading } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [showPass, setShowPass] = useState(false);

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [regForm, setRegForm] = useState({ username: "", email: "", password: "" });

  useEffect(() => { if (isOpen) setTab(defaultTab); }, [isOpen, defaultTab]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await login(loginForm.username, loginForm.password);
    if (ok) onClose();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await register(regForm.username, regForm.email, regForm.password);
    if (ok) onClose();
  };

  const inputClass = "w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300 transition-colors";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mx-4 animate-fade-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800">
          {(["login", "register"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-4 text-xs tracking-[0.2em] uppercase font-medium transition-colors ${
                tab === t
                  ? "text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100 -mb-px"
                  : "text-zinc-400 dark:text-zinc-600 hover:text-zinc-600 dark:hover:text-zinc-400"
              }`}
            >
              {t === "login" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        <div className="p-8">
          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input
                  className={inputClass}
                  placeholder="Username"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className="relative">
                <input
                  className={inputClass}
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute right-0 bottom-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading && <Loader2 size={13} className="animate-spin" />}
                Sign In
              </button>
              <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
                No account?{" "}
                <button type="button" className="text-zinc-700 dark:text-zinc-300 hover:underline" onClick={() => setTab("register")}>
                  Create one
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <input className={inputClass} placeholder="Username" value={regForm.username}
                onChange={(e) => setRegForm({ ...regForm, username: e.target.value })} required autoFocus />
              <input className={inputClass} type="email" placeholder="Email" value={regForm.email}
                onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} required />
              <div className="relative">
                <input className={inputClass} type={showPass ? "text" : "password"}
                  placeholder="Password" value={regForm.password}
                  onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPass((v) => !v)}
                  className="absolute right-0 bottom-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading && <Loader2 size={13} className="animate-spin" />}
                Create Account
              </button>
              <p className="text-center text-xs text-zinc-400 dark:text-zinc-600">
                Already have one?{" "}
                <button type="button" className="text-zinc-700 dark:text-zinc-300 hover:underline" onClick={() => setTab("login")}>
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
