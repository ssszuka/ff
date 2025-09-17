interface FooterProps {
  isConnected: boolean;
}

export function Footer({ isConnected }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 bg-dark-900 border-t border-dark-700">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-dark-400 text-sm" data-testid="text-footer-copyright">
                © {currentYear} Janvi Dreamer. Made with ❤️ for dreamers worldwide.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-dark-500 text-xs font-mono" data-testid="text-footer-status">
                Status: <span className={isConnected ? 'text-neon-emerald' : 'text-neon-orange'}>{isConnected ? 'Connected' : 'Offline'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
