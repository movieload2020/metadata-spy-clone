import { PlayCircle } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">RT</span>
            </div>
            <span className="font-semibold text-foreground">RT Metadata</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              OUR SERVICE
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              BUY AI
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              CONTACT US
            </a>
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium transition-colors">
              <PlayCircle className="w-4 h-4" />
              Tutorial
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
