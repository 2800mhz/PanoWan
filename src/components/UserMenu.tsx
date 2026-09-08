import { useEffect, useState } from 'react';
import { Check, Eye, EyeOff, KeyRound, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { getStoredGroqApiKey, setStoredGroqApiKey } from '@/lib/groq-key';

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    setApiKey(getStoredGroqApiKey());
  }, [open]);

  const hasKey = Boolean(apiKey.trim());

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();
    setStoredGroqApiKey(apiKey);
    toast.success(apiKey.trim() ? 'Groq key kaydedildi' : 'Groq key temizlendi');
    setOpen(false);
  };

  const handleClear = () => {
    setApiKey('');
    setStoredGroqApiKey('');
    toast.success('Groq key temizlendi');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <KeyRound className="h-4 w-4" />
        <span className="hidden sm:inline">Groq Key</span>
        {hasKey && <Check className="h-3.5 w-3.5 text-primary" />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <form
            onSubmit={handleSave}
            className="absolute right-0 top-full z-50 mt-1 w-80 rounded-lg border border-border bg-card p-4 shadow-lg"
          >
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Groq API Key
            </label>
            <div className="relative">
              <input
                value={apiKey}
                onChange={event => setApiKey(event.target.value)}
                type={showKey ? 'text' : 'password'}
                placeholder="gsk_..."
                className="w-full rounded-md border border-border bg-input py-2 pl-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowKey(prev => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Anahtar sadece bu tarayıcıdaki localStorage içinde saklanır.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Temizle
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Save className="h-3.5 w-3.5" />
                Kaydet
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
