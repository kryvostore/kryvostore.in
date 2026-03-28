import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useAuthStore } from "@/stores/authStore";
import { FavoritesDrawer } from "@/components/FavoritesDrawer";
import { AuthDialog } from "@/components/AuthDialog";
import { SearchDialog } from "@/components/SearchDialog";

const navLinks = [
  { to: "/collections", label: "All Product" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

interface HeaderProps {
  onCartOpen: () => void;
}

export const Header = ({ onCartOpen }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const totalItems = useCartStore(s => s.items.reduce((sum, item) => sum + item.quantity, 0));
  const totalFavorites = useFavoritesStore(s => s.items.length);
  const accessToken = useAuthStore(s => s.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Left logo */}
          <Link to="/" className="flex items-center gap-2 font-display text-xl lg:text-2xl font-bold tracking-tight">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-foreground">
              <path d="M4 4l8 8-8 8V4z" />
              <path d="M12 4l8 8-8 8V4z" />
            </svg>
            <span className="text-foreground">KRYVO STORE</span>
          </Link>

          {/* Center nav links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-150 ease-out hover:text-foreground/80 active:scale-[0.97] ${
                  location.pathname === link.to ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <Button 
                variant="ghost" 
                size="icon" 
                className="lg:flex h-10 w-10 min-w-10 rounded-full bg-secondary hover:bg-secondary/80 text-foreground relative"
                onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
                variant="ghost" 
                size="icon" 
                className="hidden lg:flex h-10 w-10 min-w-10 rounded-full bg-secondary hover:bg-secondary/80 text-foreground relative"
                onClick={() => setIsFavoritesOpen(true)}
            >
              <Heart className="h-5 w-5" />
              {totalFavorites > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] bg-foreground text-background border-none p-0 leading-none">
                  {totalFavorites}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 min-w-10 rounded-full bg-secondary hover:bg-secondary/80 text-foreground relative"
              onClick={onCartOpen}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] bg-foreground text-background border-none p-0 leading-none">
                  {totalItems}
                </Badge>
              )}
            </Button>
            <Button 
                variant="ghost" 
                size="icon" 
                className={`h-10 w-10 min-w-10 rounded-full transition-colors ${accessToken ? "bg-foreground text-background hover:bg-foreground/90" : "bg-secondary hover:bg-secondary/80 text-foreground"}`}
                onClick={() => accessToken ? navigate('/account') : setIsAuthOpen(true)}
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <FavoritesDrawer open={isFavoritesOpen} onOpenChange={setIsFavoritesOpen} />
      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-96 border-b border-border" : "max-h-0"
        }`}
      >
        <nav className="container mx-auto px-6 pb-6 flex flex-col gap-3 bg-background">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors py-2 ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/track-order" className="text-sm font-medium text-muted-foreground py-2">
            Track Order
          </Link>
        </nav>
      </div>
    </header>
  );
};
