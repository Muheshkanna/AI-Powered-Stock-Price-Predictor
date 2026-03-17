import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, TrendingUp, Activity, Shield } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Heatmap visualization */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="relative z-10 p-12">
          <HeatmapVisualization />
        </div>
        <div className="absolute bottom-8 left-8 right-8">
          <p className="text-meta font-mono text-muted-foreground">
            AETHELGARD QUANT ENGINE v3.2.1 — Real-time market intelligence across 12,847 instruments
          </p>
        </div>
      </div>

      {/* Right: Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary/20 border border-primary/30 rounded-sm flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <span className="font-mono text-ui font-semibold tracking-wider text-foreground">AETHELGARD</span>
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome back</h1>
            <p className="text-ui text-muted-foreground">Access your quantitative trading dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-destructive/10 border border-destructive/20 rounded-sm text-meta text-destructive"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-meta font-mono uppercase tracking-wider text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-10 px-3 bg-secondary border border-border rounded-sm text-ui text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                placeholder="analyst@fund.com"
                autoComplete="email"
                maxLength={254}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-meta font-mono uppercase tracking-wider text-muted-foreground">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-10 px-3 pr-10 bg-secondary border border-border rounded-sm text-ui text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  maxLength={128}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 rounded-sm border-border bg-secondary accent-primary"
                />
                <span className="text-meta text-muted-foreground">Remember session</span>
              </label>
              <button type="button" className="text-meta text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-primary text-primary-foreground rounded-sm text-ui font-medium hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-meta text-muted-foreground">
              No account?{' '}
              <Link to="/signup" className="text-primary hover:text-primary/80 transition-colors">
                Request access
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-between text-meta text-muted-foreground font-mono">
              <span>TLS 1.3 Encrypted</span>
              <span>SOC 2 Compliant</span>
              <span>v3.2.1</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const HeatmapVisualization: React.FC = () => {
  const cells = Array.from({ length: 64 }, (_, i) => {
    const val = Math.random() * 2 - 1;
    return { val, size: 40 + Math.random() * 20 };
  });

  return (
    <div className="grid grid-cols-8 gap-1 opacity-60">
      {cells.map((cell, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.02, duration: 0.3 }}
          className="rounded-sm flex items-center justify-center font-mono text-meta"
          style={{
            width: 56,
            height: 56,
            backgroundColor: cell.val > 0
              ? `hsl(150 50% ${25 + cell.val * 20}% / ${0.3 + Math.abs(cell.val) * 0.4})`
              : `hsl(0 65% ${25 + Math.abs(cell.val) * 20}% / ${0.3 + Math.abs(cell.val) * 0.4})`,
            color: cell.val > 0 ? 'hsl(150 50% 65%)' : 'hsl(0 65% 65%)',
          }}
        >
          {cell.val > 0 ? '+' : ''}{(cell.val * 5).toFixed(1)}%
        </motion.div>
      ))}
    </div>
  );
};

export default LoginPage;
